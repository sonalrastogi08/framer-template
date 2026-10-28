# Velvet v6 — The combined design

Version 6 is the **client-picked combination**. It's a single home page that uses Velvet Crumb's (v1) theme,
colours and typography, plus sections chosen from versions 1, 2 and 4. Versions 1–5 stay unchanged.

**Workflow (option C):** this HTML prototype is approved first, then the design is built natively in Framer.

## Picks

| Choice | Pick | Source |
|---|---|---|
| Theme / mood | Light cream editorial | v1 Velvet Crumb |
| Colours | Velvet Crumb palette (cream, cocoa, pistachio, olive, strawberry, butter, gold) | v1 — `docs/DESIGN-SYSTEM.md` |
| Typography | Fraunces (display) + Manrope (body) + Caveat (script) | v1 |

## Page, top to bottom

| # | Section | Source | Notes |
|---|---|---|---|
| — | Announcement ticker + header | v1 | Nav links jump to sections on this page |
| 1 | **Hero:** giant "Velvet" wordmark behind the cake, "Fresh today" badge, order-mode selector | v1 | Unchanged |
| 2 | **Why Velvet Crumb:** scroll-highlighted statement + 4 count-up stats | v1 | Unchanged |
| 3 | **Bestsellers:** pinned horizontal card shelf | v1 | The end card now points to the slice wheel |
| 4 | **Slice wheel:** 8 flavours, spin to choose, box of four | v4 → restyled | Cream plate, Fraunces names with letter roll, Caveat taglines, Velvet flavours (Pistachio Rose, Midnight Ganache, Raspberry Silk, Strawberry Shortcake, Classic Red Velvet, Lemon Meringue, Salted Caramel, Black Forest). Pinned on desktop with one snap per slice; drag, arrows, tap, keys. Adding a slice also bumps the header basket |
| 5 | **Flavour words:** two giant rows sliding in opposite directions on scroll | v2 → option A | Cocoa band; cream Fraunces italic row with strawberry ✦, gold outline row. Uses Fraunces (not v2's Bodoni) to keep one type family |
| 6 | **Kind words:** two drifting review rows + press names | v1 | Unchanged |
| 7 | **Visit us:** three location cards with map, live open/closed, hours, services | v1 | Unchanged |
| 8 | **Instagram gallery:** zoom-out from the centre tile | v1 | Unchanged |
| — | Footer with the giant "Velvet" wordmark | v1 | Links point to sections on this page |

## Files

- `template-v6/`: the same structure as v1 (`src/pages`, `src/partials`, `build.py`, `assets/`).
- Additions are at the end of `assets/css/styles.css` and `assets/js/main.js`, under "VERSION 6 additions".

## Framer build plan (next step)

1. Color and Text Styles from `docs/DESIGN-SYSTEM.md` (v1).
2. Native sections: header, hero, statement + stats, reviews, visit, footer.
3. Code components:
   - `HorizontalScroll` (bestsellers)
   - `ScrollHighlightText` (statement)
   - `VelocityMarquee` or two Scroll Transform rows (flavour words)
   - `GalleryZoom` (gallery)
   - `SliceWheel` from `framer/code-components-v4/`, with Velvet colours and Fraunces passed as props
4. CMS: Products (bestsellers and wheel slices), Reviews, Locations.
