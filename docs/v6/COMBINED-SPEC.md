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

## Changes after review

| Change | What it does |
|---|---|
| **Rolling digit counter** (stats) | Each digit in 12,400 · 4.9 · 48h · 3 spins like an odometer reel and lands left to right when the row scrolls into view. It replays each time the row comes back into view. The final numbers are in the HTML, so screen readers and reduced motion get them directly |
| **Bestsellers shelf** | Smooth pinned horizontal scroll from 700px up (was 861px). Below that it's a native swipe with **no visible scrollbar**, snap points, mouse drag-to-glide and a progress line. Fixed a bug where a preview opened narrow and then widened kept the swipe mode's scrollbar and clipped the cards |
| **Shelf polish** | Sold-out card gets a "Notify me" button (confirms with a toast) instead of a dead grey "+", with muted size chips. The heavy full-width progress rule is now a short strawberry pill. Less empty space under the shelf, and the whole pinned shelf fits one screen, including short laptop screens (≤ 820px tall). The end card has tighter type, a "8 flavours · from $8" line, a slice illustration and a right-sized button |
| **Gallery zoom fix** | Pins are measured before the gallery, so its zoom-out still runs when the preview opens narrow and then widens |
| **Moving tickers** (flavour words + review rows) | Both run continuously in a seamless loop, alternating direction. Scrolling briefly speeds them up. Hovering or focusing a review row eases it to a stop so it can be read. Duplicated items are hidden from screen readers. Static with reduced motion |

## Files

- `template-v6/`: the same structure as v1 (`src/pages`, `src/partials`, `build.py`, `assets/`).
- Additions are at the end of `assets/css/styles.css` and `assets/js/main.js`, under "VERSION 6 additions".

## Framer build (done: landing page)

Project: https://framer.com/projects/iGJyGdQv1tjKMmGOBOmV (workspace "Personal templates"). Only the
landing page (`/`) is built; there are no sub-pages.

**Styles.** 14 colour styles (`Base/*`, `Ink/*`, `Accent/*`) and 16 text styles (`Heading/*`, `Body/*`,
`Script/Accent`) from the v1 tokens, with tablet/phone sizes on the heading styles. Two link styles
(Nav Link, Footer Link).

**Layout template "Main".** Announcement ticker, sticky glass header, page slot, cocoa footer with the
big "Velvet" wordmark. Desktop 1200 / Tablet 810 / Phone 390.

**Canvas components.**
| Component | Variants | Notes |
|---|---|---|
| Button | Dark, Ghost, Light (+ hover each) | Label, Link, Arrow controls |
| Order Modes | Delivery, Pickup, Nationwide, Apps | tabs switch variant on tap, note text changes |
| Product Card | Default, Sold out (+ hover) | Image, Tint, Title, Meta, Price, Badge colours, sizes |

**Sections on the page (in order).**
| Section | Built with |
|---|---|
| Hero | native layers; word reveal (text effect), cake/badge/copy appear effects, floating treats (loop effect), rotating badge ring |
| Why Velvet Crumb + stats | native text with word-by-word in-view text effect; `Odometer` code component for the numbers |
| Bestsellers | `HorizontalScroll` code component (pinned sideways scroll from 700px, swipe row on phone); cards are Product Card instances in its Items slot |
| Slice bar | `SliceWheel` code component (v6 rewrite, framer-motion only) |
| Flavour words | two native tickers on the cocoa band (solid + gold outline, opposite directions) |
| Kind words | two native review tickers, opposite directions, pause on hover |
| Visit us | native grid of three location cards with SVG maps |
| Instagram gallery | `GalleryZoom` code component |

**Code components** live in `framer/code-components-v6/` (same source as in the Framer project):
`Odometer.tsx`, `HorizontalScroll.tsx`, `SliceWheel.tsx`, `GalleryZoom.tsx`. They import only from
`react`, `framer` and `framer-motion`.

**Not done yet.** CMS collections (Products, Reviews, Locations), a mobile menu drawer (the nav links
are hidden on tablet/phone), the inline cake image inside the statement, and the shelf's size chips
are static (no price switch).

## Framer: Shop cakes page (`/shop`)

Built from `template/src/pages/shop.html` (v1) in the Velvet style. Uses the same layout template as the landing page.

- **CMS:** `Products` collection (12 items): Title, Slug, Category, Occasions, Dietary, Image, Tint, Meta, Price, Badge + colours, three size labels, Third Size, Sold Out.
- **Filters:** Category, Occasion and Dietary chips (Filter Chip component, Default/Active). Each chip sets a page variable (string, optional); the collection list filters with `contains` on the matching product field, so unset means no filter. Empty state shows "No bakes match… yet."
- **Sections:** page hero (Display heading style, cake image), free-delivery bar, sticky filter sidebar plus 3-column product grid (Product Card bound to CMS fields; sold-out variant from the Sold Out field), custom-cake CTA band.
- **Responsive:** tablet 2 columns with filters on top, phone single column.
- **Not built:** sort dropdown, product detail pages, working price switch on size chips, the "Start a custom order" button links to email.

## Framer: Custom & wedding page (`/custom-cakes`)

Built from `template/src/pages/custom-cakes.html` (v1) in the Velvet style, same layout template.

- **Hero:** "Made for your day." (Display style), two buttons that scroll to the enquiry form and the tasting box, wedding cake image (hidden on phone).
- **Portfolio:** "Recent commissions", a sideways-scrolling row bound to the `Cake Gallery` CMS collection (Title, Slug, Details, Image, Tint; 6 items).
- **How it works:** olive band with the price guide ($8, $10, $350) and five steps with staggered appear effects.
- **Enquiry:** one Framer form (native inputs) with five numbered groups: occasion, date/servings/handoff, flavour and dietary, design and budget, contact. Submit uses the `Submit Button` component.
- **Tasting box:** butter band, "Six flavours, $45."
- **Differences from v1:** the form is one scrolling form instead of a 5-step stepper; the photo upload field is not included (Framer has no file input node); the tasting-box button opens an email.
- **To do in Framer:** set the form's destination (Form settings, Send to email or webhook).

### Custom & wedding page: animations (from v1 ANIMATION-SPEC)

| v1 effect | In Framer |
|---|---|
| Hero headline chars rise (SplitText) | Text effect, per character, on mount |
| Section headings masked rise | Text effect, per line, on view |
| Page-hero image float-in plus scroll drift | Appear effect (y 120, rotate -10, 1.4s) plus Scroll transform (y 140, rotate 8) |
| Process line draw plus steps stagger | Line frame inside a clipped track, slides in on scroll; steps appear with 0.1s stagger. Desktop only (tablet and phone keep per-step lines) |
| `data-reveal` blocks | Appear on view (how-it-works band, form card, tasting band) |
| Portfolio cards rise, hover lift | Appear on view, hover y -8 |
| Hero lead and buttons fade-up | Appear on mount with delays |

Not carried over: pinned horizontal scroll for the portfolio (the row is CMS-driven and scrolls natively), magnetic buttons, form stepper transitions.

### Custom page: pinned scrolling (v1 behaviour)

- **Portfolio:** the CMS gallery row sits inside the `HorizontalScroll` component, so vertical scroll moves it sideways while the section is pinned, with a progress bar. Below 700px it becomes a native swipe row.
- **How it works:** `PinnedProcess.tsx` pins the section; the line fills from step 1 to 5 as you scroll and each step lights up when the line reaches it. The page only continues once the line is full. Below 700px it is a plain stack. "Scroll Length" controls how long it stays pinned.
