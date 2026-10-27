# Velvet — Cake Studio Framer Template

A Framer Marketplace template for cake and pastry shops. It's built here first as an HTML prototype, then rebuilt
in Framer.

There are two independent designs:

| | Folder | Demo brand | Direction | Docs |
|---|---|---|---|---|
| **Version 1** | `template/` | Velvet Crumb Cake Studio | Light, sunny neighbourhood cake studio: cream, pistachio, strawberry, Fraunces | `docs/` |
| **Version 2** | `template-v2/` | Cerise Pâtisserie de Nuit | Dark luxury night pâtisserie: black cherry, cherry red, champagne gold, Bodoni Moda | `docs/v2/` |
| **Version 3** (hero only) | `template-v3/` | Sugarstack | Light candy-pop: pastels, ink outlines, a build-your-cake hero that explodes into layers | `docs/v3/` |
| **Version 4** (hero only) | `template-v4/` | Rotunda Slice Bar | Butter-yellow food poster: a top-down sampler cake you spin to pick slices for a box of four | `docs/v4/` |
| **Version 5** (hero only) | `template-v5/` | Blåbär Bakery | Porcelain and Delft cobalt: a live canvas mirror-glaze pour with switchable berry glazes and a morning timeline | `docs/v5/` |

All five follow the same rulebook and research. Versions 1 and 2 have 7 pages; versions 3–5 are hero sections only.
Framer code components for versions 2–5 are in `framer/code-components-v2/` to `-v5/`.

The rest of this README describes version 1. Version 2 has the same structure (`src/`, `build.py`, `assets/`,
`tools/gen_svgs.py`).

- **Demo brand:** Velvet Crumb Cake Studio (fictional)
- **Style:** cream, cocoa, pistachio and strawberry; oversized Fraunces wordmark; script accents; rich scroll
  motion

## What's in the repo

```
research/                  Market + real-bakery research (inputs)
template/                  HTML prototype — open template/index.html in a browser
  index.html … 404.html    Built pages (generated, don't edit directly)
  src/pages/*.html         Page sources (edit these)
  src/partials/            Shared <head>, header, footer
  build.py                 python3 template/build.py → regenerates the pages
  assets/css/styles.css    Design tokens + all components
  assets/js/main.js        GSAP (scroll effects) + Motion (micro-interactions)
  assets/vendor/           GSAP 3.13 (+ScrollTrigger, SplitText) and Motion 11, vendored
  assets/img/              Original SVG cake illustrations (placeholders for photography)
  tools/gen_svgs.py        Regenerates the illustrations
framer/code-components/    Drop-in Framer code components for the GSAP effects
docs/
  DESIGN-SYSTEM.md         Color/Text Styles, components, reference mapping
  ANIMATION-SPEC.md        Every effect → how to build it in Framer
  FRAMER-BUILD-GUIDE.md    Pages, CMS schema, ordering, SEO, submission checklist
  IMAGE-PROMPTS.md         Prompts for the replacement photography
```

## Run it

Open `template/index.html` directly, or serve it:

```bash
cd template && python3 -m http.server 8000   # http://localhost:8000
```

Edit a page in `template/src/pages/` or `template/src/partials/`, then run `python3 template/build.py`.

## Pages

Home · Shop (filters by category / occasion / dietary) · Product · Custom & Wedding (5-step enquiry) ·
Our story · Visit & FAQ · 404

## Rulebook compliance

| Rule | How |
|---|---|
| 1. Free Framer fonts only | Fraunces, Manrope, Caveat (Google Fonts, in Framer's picker) |
| 2. Framer Motion + GSAP | GSAP ScrollTrigger/SplitText for scroll effects; Motion (Framer Motion's vanilla build) for UI. Framer code components use GSAP + `framer-motion` |
| 3. Horizontal scroll, zoom, stagger | 4 pinned horizontal shelves, hero zoom, signature zoom reveal, gallery zoom-out, staggered reveals throughout |
| 4. Trendy, catchy, modern palette | Warm cream + cocoa with a pistachio/strawberry duo, butter and olive supports |
| 5. motionsites.ai inspiration | Masked split-text, velocity marquee, scroll-highlight statement, pinned zoom storytelling |

## Licences

GSAP is free for commercial use under its standard licence (since 3.13). Motion is MIT. All illustrations,
copy and brand names are original.
