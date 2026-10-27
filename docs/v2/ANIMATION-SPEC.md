# Cerise (Velvet v2) — Animation Spec

Rulebook rules 2, 3 and 5 apply here as in version 1, with a new set of effects:
- **GSAP 3.13** (ScrollTrigger, SplitText) drives everything tied to scroll.
- **Motion** (vanilla Framer Motion) drives the interactions.

Code components for Framer are in `framer/code-components-v2/`. The version 1 components (`HorizontalScroll`,
`VelocityMarquee`, `ScrollHighlightText`) also work here, restyled.

Every effect respects `prefers-reduced-motion`, which shows the final state with no motion.

| # | Effect | Where | Prototype | In Framer |
|---|---|---|---|---|
| 1 | **Preloader**: 000→100 counter and a gold line, then the curtain lifts (`clip-path`). Once per session | Home | GSAP timeline | `Preloader.tsx` |
| 2 | **Hero intro**: each word's letters rise from a mask; the slice drops in with an elastic spring; the foot row staggers | Home | SplitText `mask: chars` | Text effect "Appear per character"; slice Appear with spring |
| 3 | **Falling crumbs**: canvas particles in cherry, rose and gold that drift with the pointer | Home hero, 404 | Canvas 2D on the GSAP ticker | Embed as a code component (port the `[data-crumbs]` block), or a Framer "Particles" community component |
| 4 | **Pointer spotlight**: the rose beam follows the cursor | Home hero | CSS vars tweened by GSAP | Framer "Cursor follow" gradient, or skip |
| 5 | **Scroll-split hero**: "Desserts / after / dark." slide apart in opposite directions while the slice zooms 1.9× and spins away | Home | ScrollTrigger scrub | Scroll Transform: Offset X ±28% per line, Scale/Rotate on the image |
| 6 | **Kinetic flavour rows** (horizontal): two giant rows, filled and outlined, slide in opposite directions | Home | scrub `xPercent` | Scroll Transform Offset X on each row |
| 7 | **Pinned exhibit**: one piece per scroll step; the number rolls, the cake swaps with rotate + scale + blur, the panel crossfades. Auto-advances on phones | Home | ScrollTrigger pin + state | `ExhibitScroller.tsx` |
| 8 | **Text-mask zoom**: fly 70× into the word TASTE until cherry floods the screen, then the philosophy fades in | Home | Sticky + scrubbed timeline | `TextMaskZoom.tsx` |
| 9 | **Menu with cursor preview**: hover a row and an arched frame with the dish trails the cursor and tilts with its speed. Tabs re-stagger rows | Home | GSAP `quickTo` + Motion | `CursorPreviewList.tsx` |
| 10 | **Ticket tear-in** + **live cut-off countdown** | Home | GSAP + setInterval | Appear (slide from left/right) + `CutoffCountdown.tsx` |
| 11 | **Stacking cards**: sticky cards pile up; each sinks back (scale 0.92, dimmed) as the next lands | Home, Atelier | CSS sticky + scrub | Native: Sticky position on each card with a top offset + Scroll Transform Scale on the card |
| 12 | **3D coffret carousel** (horizontal): a pinned track; each card turns (rotateY ±28°) and recedes by its distance from centre; a gold sheen sweeps across on hover | Home | ScrollTrigger pin + per-frame 3D | `HorizontalScroll.tsx` (v1) + Scroll Transform Rotate Y; sheen as a Hover variant |
| 13 | **Quote crossfade**: blur-to-sharp quotes with progress bars, 6s each | Home | Motion | Slideshow component with Fade, Autoplay 6s |
| 14 | **Live boutique card**: open/closed pulse, clock, today's hours highlighted | Home, Boutiques | JS | Code override or static hours |
| 15 | **Drag to turn**: drag the cake to spin it (rotateY), with an elastic return | Product | Pointer + GSAP | Framer Drag with "Drag control", or a simple Hover rotate |
| 16 | **Price estimate**: the total counts up as the slider moves | Atelier | GSAP tween | Code component (slider + number) |
| 17 | **Conversational form**: one question per screen, Enter to continue, A–F to choose, shake on error | Atelier | Motion | Framer Form with one variant per question; keyboard shortcuts need a code override |
| 18 | **Manifesto**: words light up as you scroll | Maison | SplitText words + scrub | `ScrollHighlightText.tsx` (v1) |
| 19 | **Rolling year**: a sticky year that flips (2019 → 2026) as each chapter passes | Maison | ScrollTrigger toggles | Sticky text + variants per section ("While in view" trigger) |
| 20 | **Collection spotlight + view switch**: a glow follows the cursor inside each tile; Gallery ↔ List re-staggers | Collection | CSS vars + Motion | Hover variant with radial fill; two CMS lists toggled by a variant |
| 21 | **Footer gold shine**: the giant "Cerise" gold gradient highlight follows the pointer | All | CSS var | Static gold gradient text, or a code override |
| 22 | **Cursor dot**: a gold dot (difference blend) that grows over links | All (desktop) | GSAP `quickTo` | Framer "Custom cursor" setting |

## Timing

- Ease: `cubic-bezier(.16, 1, .3, 1)` (expo-out) for reveals; `cubic-bezier(.65, 0, .35, 1)` for curtains and fills.
- Reveals 0.8–1.3s; letters stagger 0.035s; rows 0.06–0.07s; cards 0.08s.
- Scrubbed scenes use `scrub: 1`, except the kinetic rows, which use 0.5 to feel livelier.
