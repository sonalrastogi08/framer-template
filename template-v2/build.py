"""Assemble template pages: src/partials + src/pages/*.html -> ./*.html

Each page starts with a meta comment:
<!--meta title="..." desc="..." nav="shop" page="shop"-->
"""
import pathlib, re

ROOT = pathlib.Path(__file__).parent
PARTIALS = ROOT / "src" / "partials"
head, header, footer = ((PARTIALS / f"{n}.html").read_text() for n in ("head", "header", "footer"))

for src in sorted((ROOT / "src" / "pages").glob("*.html")):
    text = src.read_text()
    m = re.match(r"<!--meta (.*?)-->\n", text)
    meta = dict(re.findall(r'(\w+)="(.*?)"', m.group(1))) if m else {}
    body = text[m.end():] if m else text
    page = head.replace("{{title}}", meta.get("title", "Cerise")) \
               .replace("{{desc}}", meta.get("desc", "")) \
               .replace("{{page}}", meta.get("page", src.stem))
    nav = meta.get("nav")
    hdr = header.replace(f'data-nav="{nav}"', f'data-nav="{nav}" aria-current="page"') if nav else header
    (ROOT / src.name).write_text(page + hdr + body + footer)
    print("built", src.name)
