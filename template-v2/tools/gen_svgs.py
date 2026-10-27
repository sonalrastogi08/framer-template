# Generates Cerise (v2) illustrations: glossy, dark-luxury pâtisserie cut-outs on transparent backgrounds.
import math, pathlib

DEFS = '''<defs>
<linearGradient id="cherryGlaze" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5E0716"/><stop offset=".35" stop-color="#C2213F"/><stop offset=".55" stop-color="#E0465F"/><stop offset="1" stop-color="#4A0412"/></linearGradient>
<radialGradient id="cherryDome" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#F06A80"/><stop offset=".35" stop-color="#C2213F"/><stop offset="1" stop-color="#4A0412"/></radialGradient>
<linearGradient id="noirGlaze" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#120605"/><stop offset=".4" stop-color="#3B1A12"/><stop offset=".55" stop-color="#5A2B1E"/><stop offset="1" stop-color="#0E0403"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7E3AE"/><stop offset=".45" stop-color="#C99A45"/><stop offset=".7" stop-color="#F3D58E"/><stop offset="1" stop-color="#9C7330"/></linearGradient>
<linearGradient id="goldH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E672A"/><stop offset=".5" stop-color="#F3D58E"/><stop offset="1" stop-color="#8E672A"/></linearGradient>
<linearGradient id="ivory" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D9CBB8"/><stop offset=".45" stop-color="#FBF5EC"/><stop offset="1" stop-color="#C9B8A2"/></linearGradient>
<linearGradient id="black" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#050303"/><stop offset=".5" stop-color="#2A2020"/><stop offset="1" stop-color="#050303"/></linearGradient>
<linearGradient id="velvet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A3172C"/><stop offset="1" stop-color="#5C0A17"/></linearGradient>
<linearGradient id="pistachio" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6D7A3A"/><stop offset=".5" stop-color="#B7C47F"/><stop offset="1" stop-color="#5C6830"/></linearGradient>
<linearGradient id="shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="truffle" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7A4330"/><stop offset=".5" stop-color="#3A1A10"/><stop offset="1" stop-color="#120604"/></radialGradient>
<radialGradient id="truffleW" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF8EA"/><stop offset=".6" stop-color="#EADCC2"/><stop offset="1" stop-color="#A8957A"/></radialGradient>
</defs>'''

def svg(body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">{DEFS}{body}</svg>'

def cherry(x, y, r=16, stem=True):
    s = f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#cherryDome)"/><ellipse cx="{x-r*.35}" cy="{y-r*.4}" rx="{r*.3}" ry="{r*.18}" fill="#fff" opacity=".7"/>'
    if stem: s += f'<path d="M{x} {y-r+2} Q{x+6} {y-r-22} {x+20} {y-r-34}" stroke="#4B3A1A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    return s

def gold_leaf(x, y, s=1, rot=0):
    return f'<path transform="translate({x} {y}) rotate({rot}) scale({s})" d="M0 0 L14 -10 L22 2 L30 -6 L26 12 L10 16 L4 8Z" fill="url(#gold)"/>'

def disc(cx, y, w): return (f'<ellipse cx="{cx}" cy="{y+14}" rx="{w*1.2}" ry="16" fill="url(#shadow)"/>'
                            f'<ellipse cx="{cx}" cy="{y+4}" rx="{w+14}" ry="13" fill="#7A5A26"/><ellipse cx="{cx}" cy="{y}" rx="{w+14}" ry="13" fill="url(#goldH)"/>')

files = {}
# 1 Cherry mirror-glaze dome entremet
b = disc(200, 320, 130)
b += '<path d="M70 318 Q70 150 200 140 Q330 150 330 318Z" fill="url(#cherryDome)"/>'
b += '<path d="M110 200 Q150 150 210 148" stroke="#fff" stroke-opacity=".55" stroke-width="10" fill="none" stroke-linecap="round"/>'
b += '<ellipse cx="200" cy="318" rx="130" ry="10" fill="#3A0410"/>' + cherry(206, 126, 20) + gold_leaf(160, 140, 1.1, -20) + gold_leaf(232, 150, .8, 30)
files["entremet-cherry.svg"] = svg(b)
# 2 Noir cylinder entremet
b = disc(200, 322, 130)
b += '<rect x="70" y="170" width="260" height="150" fill="url(#noirGlaze)"/><ellipse cx="200" cy="320" rx="130" ry="14" fill="#0E0403"/><ellipse cx="200" cy="170" rx="130" ry="26" fill="#2C130C"/>'
b += '<ellipse cx="200" cy="168" rx="118" ry="20" fill="#3E1E14"/><rect x="70" y="214" width="260" height="6" fill="url(#goldH)"/>'
b += '<rect x="140" y="178" width="120" height="140" fill="url(#shine)" opacity=".35"/>'
b += "".join(f'<path d="M{x} {y} l{w} -46 l10 4 l-{w-4} 46Z" fill="#1A0805" stroke="#4A2418" stroke-width="1"/>' for x,y,w in [(150,172,18),(176,170,8),(214,172,-6)])
b += '<circle cx="250" cy="160" r="15" fill="url(#gold)"/>' + gold_leaf(126, 160, .9, -10)
files["entremet-noir.svg"] = svg(b)
# 3 Floating red velvet slice with crumbs
b = '<g transform="rotate(-10 200 200)">'
b += '<path d="M100 170 L300 130 L300 280 L100 300Z" fill="url(#velvet)"/><path d="M100 215 L300 180 L300 194 L100 229Z" fill="#FFF1E2"/><path d="M100 262 L300 230 L300 244 L100 276Z" fill="#FFF1E2"/>'
b += '<path d="M300 130 L330 148 L330 292 L300 280Z" fill="#4A0612"/>'
b += '<path d="M90 168 Q120 120 170 140 Q200 100 240 128 Q280 100 312 132 L300 132 L100 172Z" fill="#FFF4E6"/><path d="M110 160 Q150 140 190 146" stroke="#E9D8C0" stroke-width="6" fill="none"/>'
b += "".join(f'<circle cx="{110+(i*37)%190}" cy="{190+(i*53)%100}" r="2" fill="#3A0610" opacity=".6"/>' for i in range(26))
b += '</g>' + "".join(f'<rect x="{(i*71+40)%360+20}" y="{(i*37)%110+10}" width="{3+i%4}" height="{3+i%3}" fill="#B21E36" opacity="{.4+(i%5)/10}" transform="rotate({i*23} {(i*71+40)%360+20} {(i*37)%110+10})"/>' for i in range(34))
files["slice-velvet.svg"] = svg(b)
# 4 Pistachio éclair
b = '<ellipse cx="200" cy="300" rx="170" ry="16" fill="url(#shadow)"/>'
b += '<rect x="40" y="200" width="320" height="90" rx="45" fill="#C98A45"/><rect x="40" y="190" width="320" height="64" rx="32" fill="url(#pistachio)"/>'
b += '<rect x="80" y="196" width="220" height="10" rx="5" fill="#fff" opacity=".35"/>'
b += "".join(f'<ellipse cx="{x}" cy="190" rx="9" ry="5" fill="#7E8C45"/>' for x in range(80, 330, 34))
b += gold_leaf(170, 178, 1) + cherry(250, 178, 13, False) + '<circle cx="120" cy="184" r="6" fill="#E8DFC9"/>'
files["eclair.svg"] = svg(b)
# 5 Truffles trio
b = '<ellipse cx="200" cy="320" rx="160" ry="16" fill="url(#shadow)"/>'
for cx, cy, r, g in [(130, 260, 64, "truffle"), (270, 262, 62, "truffleW"), (200, 180, 70, "truffle")]:
    b += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{g})"/><ellipse cx="{cx-r*.35}" cy="{cy-r*.45}" rx="{r*.28}" ry="{r*.14}" fill="#fff" opacity=".35"/>'
b += '<path d="M150 170 q50 -30 100 0" stroke="url(#gold)" stroke-width="5" fill="none"/>' + gold_leaf(255, 220, .8, 10)
b += "".join(f'<circle cx="{100+i*12}" cy="{238+(i%3)*8}" r="3" fill="#B7C47F"/>' for i in range(5)) + cherry(280, 210, 10, False)
files["truffles.svg"] = svg(b)
# 6 Cherry tart
b = '<ellipse cx="200" cy="320" rx="175" ry="22" fill="url(#shadow)"/><path d="M40 250 L62 300 Q200 330 338 300 L360 250Z" fill="#B97A3A"/>'
b += "".join(f'<path d="M{52+i*14} 255 l4 42" stroke="#8C5520" stroke-width="3"/>' for i in range(22))
b += '<ellipse cx="200" cy="250" rx="160" ry="44" fill="#CC8F4C"/><ellipse cx="200" cy="246" rx="142" ry="36" fill="#5E0716"/><ellipse cx="200" cy="244" rx="138" ry="32" fill="url(#cherryGlaze)" opacity=".7"/>'
b += "".join(cherry(x, y, 15, False) for x, y in [(120,244),(160,232),(200,252),(240,232),(282,244),(180,224),(222,262),(150,258),(258,256)])
b += gold_leaf(190, 210, 1)
files["tart-cherry.svg"] = svg(b)
# 7 Noir wedding cake
b = disc(200, 362, 110)
for w, y, h, fill in [(100, 270, 92, "url(#black)"), (76, 186, 84, "url(#ivory)"), (52, 118, 68, "url(#black)")]:
    b += f'<rect x="{200-w}" y="{y}" width="{2*w}" height="{h}" fill="{fill}"/><ellipse cx="200" cy="{y+h}" rx="{w}" ry="10" fill="{fill}"/><ellipse cx="200" cy="{y}" rx="{w}" ry="10" fill="{"#3A3030" if "black" in fill else "#FFFBF4"}"/>'
    b += f'<rect x="{200-w}" y="{y+h-14}" width="{2*w}" height="5" fill="url(#goldH)"/>'
b += cherry(170, 110, 13) + cherry(230, 112, 13) + gold_leaf(120, 260, 1.2, -20) + gold_leaf(240, 176, 1, 15)
b += "".join(f'<path d="M{x} {y} q12 -18 24 0 q-12 10 -24 0z" fill="#E7A3A8"/>' for x, y in [(110, 200), (130, 210), (262, 290), (240, 300)])
files["cake-wedding-noir.svg"] = svg(b)
# 8 Coffret gift box
b = '<ellipse cx="200" cy="350" rx="160" ry="16" fill="url(#shadow)"/>'
b += '<path d="M70 180 L330 180 L330 340 L70 340Z" fill="url(#black)"/><rect x="60" y="150" width="280" height="44" rx="3" fill="#1A1414"/>'
b += '<rect x="186" y="150" width="28" height="190" fill="url(#gold)"/><rect x="60" y="164" width="280" height="16" fill="url(#goldH)" opacity=".85"/>'
b += '<path d="M200 150 Q140 90 128 130 Q130 156 200 150 Q270 156 272 130 Q260 90 200 150Z" fill="url(#gold)"/><circle cx="200" cy="150" r="12" fill="#9C7330"/>'
b += '<rect x="112" y="236" width="176" height="76" rx="4" fill="#120D0D" stroke="url(#gold)" stroke-width="2"/>'
b += '<text x="200" y="272" font-family="Georgia" font-style="italic" font-size="36" text-anchor="middle" fill="#D8B46A">Cerise</text>'
b += '<text x="200" y="296" font-family="Arial" font-size="9" letter-spacing="5" text-anchor="middle" fill="#D8B46A">PÂTISSERIE DE NUIT</text>'
files["coffret.svg"] = svg(b)
# 9 Single cherry pair (decor)
files["cherries.svg"] = svg('<path d="M150 260 Q170 140 230 90 M260 250 Q240 150 230 90" stroke="#4B3A1A" stroke-width="5" fill="none" stroke-linecap="round"/>'
    '<path d="M230 90 q40 -30 70 -10 q-30 26 -70 10z" fill="#5C6830"/>' + cherry(150, 280, 52, False) + cherry(262, 268, 50, False))
# 10 Macaron rouge stack
def mac(x, y, c, f):
    return (f'<ellipse cx="{x}" cy="{y+30}" rx="62" ry="18" fill="{c}"/><rect x="{x-62}" y="{y+6}" width="124" height="24" fill="{c}"/>'
            f'<rect x="{x-56}" y="{y-8}" width="112" height="16" rx="6" fill="{f}"/><rect x="{x-62}" y="{y-36}" width="124" height="26" rx="4" fill="{c}"/>'
            f'<ellipse cx="{x}" cy="{y-36}" rx="62" ry="22" fill="{c}"/><ellipse cx="{x-18}" cy="{y-42}" rx="22" ry="6" fill="#fff" opacity=".3"/>')
files["macarons-rouge.svg"] = svg('<ellipse cx="200" cy="350" rx="140" ry="14" fill="url(#shadow)"/>' + mac(200, 310, "#7A0C1F", "#F4E9E1") + mac(200, 220, "#C2213F", "#3A1A10") + mac(200, 130, "#E7A3A8", "#D8B46A"))

out = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"
for n, c in files.items(): (out / n).write_text(c)
print(sorted(files))
