# Blåbär (Velvet v5) — Hero Spec

Version 5 is a **hero section only**, for a fictional Scandinavian bakery called **Blåbär** that makes exactly one
cake. The hero is that cake's daily moment: the 7am mirror-glaze pour, drawn live on a canvas in front of a wall
of Delft tiles.

| | v1 | v2 | v3 | v4 | **v5 Blåbär** |
|---|---|---|---|---|---|
| Theme | Light editorial cream | Dark luxury | Light candy-pop | Butter-yellow poster | **Porcelain + Delft cobalt** |
| Type | Fraunces | Bodoni Moda | Bagel Fat One | Big Shoulders | **Archivo Expanded + DM Mono** |
| Hero idea | Wordmark behind cake | Split words, crumbs | Build a cake, explode it | Spin a slice wheel | **Watch the glaze pour; pick the glaze** |
| Motion medium | DOM/SVG | DOM/SVG + canvas particles | SVG | SVG | **Canvas, every frame** |

## References and research

- **Mirror glaze:** the glossy entremets in 07 SR.Cake and 03 red velvet. Here the glaze itself is the product.
- **One signature product carries the brand:** research §2.5 (Levain, Lady M, the Cronut).
- **Daily rhythm, cut-offs and sold-out:** research §2.2 and the "what's baked today" gap. This became the morning
  timeline and the "14 of 40 left" counter.
- **Blue:** used by no other version. Delft blue-and-white is a Northern European bakery classic.

## Color styles

| Name | Hex | Contrast on Porcelain | Use |
|---|---|---|---|
| Base / Porcelain | `#F5F3EE` | — | Page |
| Base / Glaze White | `#FFFFFF` | — | Tile wall, chips |
| Ink / Navy | `#14205A` | 13.7:1 | Headline, text |
| Ink / Delft Cobalt | `#1F3FBF` | 7.5:1 | Logo, buttons (white text 8.3:1), tile motif |
| Ink / Steel | `#4A5683` | 6.4:1 | Lead, notes |
| Tint / Tile Blue | `#DCE3F7` | — | Timeline band (cobalt on it 6.5:1) |
| Pop / Saffron | `#F2B33D` | — | Stock dot, "Now" marker, tag |
| Glaze inks | `#43308F` / `#B3123A` / `#A55B0E` | 9.2 / 6.2 / 4.6:1 | "7AM." and the 07:00 step follow the chosen glaze |

Each glaze also has three canvas tones (shadow, body, highlight). The page uses a separate text-safe "ink" shade so
the headline stays readable whichever glaze is picked.

## Type (free in Framer, from Google Fonts)

- **Archivo**, width axis 125 (expanded), 900: headline, logo, price. 106 → 48px, uppercase, line height 0.9.
- **Archivo** 400–700 at normal width: body and UI.
- **DM Mono:** labels, times, tags. The bakery's "logbook" voice.

## How it moves

| Effect | What happens | Built with |
|---|---|---|
| Intro | The stage wipes up from the bottom, the tiles settle (scale 1.15 → 1), headline lines rise from masks, copy staggers, tags drop in, the timeline slides up; then **the pour starts** | GSAP timeline + SplitText |
| The pour | A wobbling stream falls onto the centre, the glaze spreads across the top, flows over the edge as a curtain, forms 22 drips, then pools on the plate. Berries, a gold flake and an "N°1" disc pop on; a shine sweeps across the top | Canvas 2D, drawn every frame (GSAP ticker) |
| Pointer | Moving over the cake tugs the drips under the cursor longer | Canvas, spring-smoothed |
| Scroll (desktop) | The hero pins for 130% of the viewport height. The intro pours the top (50%); scrolling finishes the pour, zooms the cake 12%, and slides the morning timeline sideways | ScrollTrigger |
| Glaze switch | Blueberry / Lingonberry / Cloudberry: the new colour re-pours over the old one, and the headline time, 07:00 step and copy change to match | Canvas + CSS variable + Motion |
| Pour again | Replays the pour from a bare cake | — |
| Morning timeline | 05:00 → 18:00 with a live **Now** marker placed at the current time | JS, every 30s |
| Reserve | Counts down "14 of 40 left today" and shows a toast | Motion |
| Phones | The stage moves above the copy; no pin; the pour plays fully on its own; the timeline swipes | CSS + JS |
| Reduced motion | The finished glazed cake is drawn once; switching glaze redraws it instantly | — |

## Rulebook

| Rule | How |
|---|---|
| 1 Free fonts | Archivo (variable width) + DM Mono |
| 2 Framer Motion + GSAP | GSAP for the intro, pin, pour tweens and ticker; Motion for UI. The Framer component uses `framer-motion` |
| 3 Horizontal / zoom / stagger | Morning timeline (horizontal), cake zoom on scroll + tile settle (zoom), line and copy staggers |
| 4 Trendy palette | Delft cobalt + porcelain with saffron |
| 5 motionsites.ai | A live, physical, scroll-driven hero visual (glaze simulation) |

## In Framer

`framer/code-components-v5/GlazePour.tsx` contains the canvas pour with:
- a glaze array (name + shadow, body and highlight colours)
- an optional built-in picker
- pour on scroll or automatic (with a duration)
- plate, rim and cake-side colours

Build the headline, chips, buy row and timeline natively. For the tile wall, use the SVG tile from `styles.css` as
a repeating image fill.
