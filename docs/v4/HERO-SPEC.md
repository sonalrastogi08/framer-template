# Rotunda (Velvet v4) — Hero Spec

Version 4 is a **hero section only**, for a fictional cake-by-the-slice bar called **Rotunda**.

**Concept:** a food poster you can play with. A sampler cake seen from above holds eight flavours. You turn it
like a dial. The slice at the pointer slides out, and its name takes over the page in giant condensed type.

| | v1 Velvet Crumb | v2 Cerise | v3 Sugarstack | **v4 Rotunda** |
|---|---|---|---|---|
| Theme | Light editorial | Dark luxury | Light candy-pop | **Butter-yellow food poster** |
| Type | Fraunces + Manrope | Bodoni Moda + Jost | Bagel Fat One + Bricolage | **Big Shoulders Display + Instrument Sans + Instrument Serif** |
| Shapes | Soft cards | Hairlines, arches | Ink outlines, stickers | **Rules, ticker bands, halftone dots, a round dial** |
| Hero idea | Wordmark behind a cake | Words split around a slice | Build a cake, see its layers | **Spin a sampler cake, pick slices for a box of four** |
| Product view | Side | Side | Side (exploded) | **Top-down** |

## References and research

- **Selling by the slice and boxes of four:** from the research's "build-a-box" pattern (Sprinkles, Ladurée) and
  the daily-bake idea ("Eight cakes daily").
- **Top-down product shots and dense menu info:** from 09 Brewed and 05 Matcha (name, notes, allergens and price
  together).
- **Poster type, ticker and halftone:** from 06 "Flavored" (exhibition poster typography) and 08 Rustico (giant
  type as the main visual).
- **Mocha Mousse:** Pantone's 2025 colour of the year, used as the secondary tone. Butter yellow as the base.

## Color styles

| Name | Hex | Contrast on Butter | Use |
|---|---|---|---|
| Base / Butter | `#F9EDB3` | — | Page |
| Base / Plate | `#FFFDF6` | — | Cake plate, buttons |
| Ink / Espresso | `#2A1A12` | 14.2:1 | Text, rules, ticker, pointer |
| Ink / Mocha | `#7A5240` | 5.7:1 | Tagline, labels |
| Pop / Tomato | `#E2462B` | 3.5:1 | Add button (cream text at ≥19px bold, 4.0:1), box count |
| Pop / Tomato Deep | `#B4301A` | 5.3:1 | Index number, small accents |
| Pop / Mocha Mousse | `#A47764` | — | Halftone dots and outline words (decorative) |
| Slice colours | per flavour | — | 8 tops + 8 crusts, set in the flavour list |

## Type (free in Framer, from Google Fonts)

- **Big Shoulders Display 900:** slice name (150 → 64px, line height 0.84, uppercase), logo, prices and the
  ticker (700).
- **Instrument Serif Italic:** the one-line tagline under each name.
- **Instrument Sans:** UI and body.

## How it moves

| Effect | What happens | Built with |
|---|---|---|
| Intro | The plate zooms in, the eight wedges fly in one by one (back-ease) while the wheel spins 120° into place; pointer, copy, nav and controls stagger in | GSAP timeline |
| Scroll spin (desktop) | The hero pins for 7 × 55% of the viewport height; scrolling turns the wheel one slice per stop and snaps to each slice | ScrollTrigger pin + snap |
| Drag | Grab the cake and spin it; a fling carries momentum, then settles on the nearest slice. While pinned, the page scrolls to match | Pointer events + GSAP |
| Selection | The chosen wedge slides out 34 units along its centre line with a slight scale; the name rolls in letter by letter (direction follows the spin); index, tagline, price, notes and allergens crossfade | GSAP + SplitText, Motion |
| Background word | All eight names in giant outline type drift sideways as the wheel turns | GSAP, tied to rotation |
| Ticker | A continuous espresso band at the top | GSAP ticker |
| Box of four | "Add" fills a quarter of the mini pie with that slice's colour (pop-in), squashes the wedge and bumps the nav counter | GSAP + Motion |
| Phones | The wheel moves to the top with the pointer at 12 o'clock; no pin; drag and arrows | CSS + the same JS |
| Reduced motion | No pin, intro or ticker; the buttons and tapping still change the slice instantly | — |

## Rulebook

| Rule | How |
|---|---|
| 1 Free fonts | Big Shoulders Display, Instrument Sans, Instrument Serif |
| 2 Framer Motion + GSAP | GSAP for the scroll, intro and spin; Motion for UI springs. The Framer component uses `framer-motion` |
| 3 Horizontal / zoom / stagger | Background words and ticker (horizontal), plate zoom-in and wedge pull-out (zoom), wedge and letter staggers |
| 4 Trendy palette | Butter yellow + Mocha Mousse + tomato red |
| 5 motionsites.ai | A pinned scroll that drives a product dial, with a kinetic headline |

## In Framer

`framer/code-components-v4/SliceWheel.tsx` covers the wheel and its details in one component:
- an array of slices (name, tagline, price, notes, top and crust colours, topping style, order link)
- pointer Left or Top
- optional spin on scroll
- a show/hide details toggle

Build the ticker (Framer Ticker), nav, rules and bottom strip natively.
