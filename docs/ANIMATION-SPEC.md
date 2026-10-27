# Velvet — Animation Spec

Covers rulebook rules 2, 3 and 5:

- **Rule 2:** animate with **Framer Motion + GSAP**.
- **Rule 3:** use horizontal scroll, zoom and stagger effects.
- **Rule 5:** take inspiration from motionsites.ai (big masked type, scroll-scrubbed zooms, pinned storytelling,
  velocity marquees).

In the HTML prototype (`template/assets/js/main.js`):
- **GSAP 3.13** (ScrollTrigger and SplitText, both free since 3.13) drives everything tied to scroll position.
- **Motion** (`motion.dev`, the framework-agnostic build of Framer Motion) drives UI micro-interactions:
  springs, stagger-in, tilt, magnetic hover.

In Framer, use **native effects** where Framer has them. Everything else ships as a code component in
`framer/code-components/`.

All effects respect `prefers-reduced-motion`. Content is fully visible with motion off.

| # | Effect | Where | Prototype | In Framer |
|---|---|---|---|---|
| 1 | **Hero intro**: wordmark letters rise one by one (stagger 0.06s), cake rises and un-rotates, floating bakes pop in with back-ease, badge spins in, script note draws left to right | Home hero | GSAP timeline + SplitText | Appear effects on each layer with staggered delays (wordmark: one text layer per letter, or Framer's per-character text effect). Badge: Appear with rotate −90° → 0, spring |
| 2 | **Hero scroll zoom**: cake scales 1 → 1.12 and tilts 6°, wordmark drifts up and tracks out, floats parallax at different speeds | Home hero | ScrollTrigger scrub | Scroll Transform: Scale/Rotate/Offset Y, "Scroll Section" trigger |
| 3 | **Masked text rise**: headings split into lines or chars, each slides up from a mask | All H1/H2 | SplitText `mask` + ScrollTrigger | Framer text effect "Appear → per line / per character, Slide up"; or Appear on a clipped stack |
| 4 | **Velocity marquee**: auto-scrolls; scrolling speeds it up, reverses it and skews it | Home (strawberry band) | GSAP ticker + ScrollTrigger velocity | `VelocityMarquee.tsx`. For a simpler version, use Framer's Ticker component |
| 5 | **Scroll-highlight statement**: words go from 14% to 100% opacity as you scroll | Home, About | SplitText words + scrub | `ScrollHighlightText.tsx` |
| 6 | **Count-up stats** | Home | GSAP tween on enter | Framer "Counter" community component, or keep static numbers with Appear |
| 7 | **Horizontal scroll (pinned)**: bestsellers shelf, portfolio, timeline, cross-sells. Each card rises and un-tilts as it enters from the right; a progress bar fills | Home, Custom, About, Product | ScrollTrigger `pin` + `containerAnimation` | `HorizontalScroll.tsx`. On mobile it falls back to native swipe with scroll-snap |
| 8 | **Signature zoom reveal**: an arch-shaped frame grows to full-screen, side words slide out, title fades in | Home | Sticky stage + scrubbed timeline | `ZoomReveal.tsx` |
| 9 | **Stagger-in grids**: cards, board rows, tiles, locations | everywhere | Motion `inView` + `stagger(0.08)` | Appear effect, "Stagger children" on the parent stack, 0.08s |
| 10 | **Process line draw**: line scales across (vertical on mobile), steps stagger | Home, Custom | ScrollTrigger scrub | Scroll Transform: Scale X 0 → 1 on the line; Appear on steps |
| 11 | **Reviews drift**: two rows move in opposite directions while scrolling | Home | scrub xPercent | Scroll Transform Offset X on each row (−25% / +25%) |
| 12 | **Gallery zoom-out**: starts zoomed into the centre tile, zooms out to the full grid, tiles stagger from the centre, label appears | Home | Sticky + scrubbed scale | `GalleryZoom.tsx` |
| 13 | **Footer wordmark rise** | All | SplitText chars | Appear per character |
| 14 | **Order-mode pill**: spring-sliding indicator | Hero, PDP | Motion spring (stiffness 380, damping 30) | `OrderModeSelector.tsx` (Framer Motion `layoutId`) |
| 15 | **Micro-interactions**: magnetic buttons, card hover lift + image tilt, occasion tilt (3D), heart pop, basket badge bounce, add-button spin, build-a-box slot pop, toast slide-up | everywhere | Motion springs | Hover/Press variants on components. Magnetic and tilt: Framer "Magnetic" / "Tilt" community effects, or skip |
| 16 | **Header**: hides on scroll down, glass on scroll | All | scroll listener | Framer sticky header + "Scroll Variant" (Default → Scrolled) |
| 17 | **Mobile menu**: circular clip-path reveal from the menu button, links stagger | All | CSS + Motion | Overlay with Appear: clip/scale from the top-right, children stagger |

## Easing & timing

- Default ease: `cubic-bezier(.22, 1, .36, 1)` (expo-out feel). GSAP equivalent: `expo.out`.
- Springs: UI 380/30, playful pops 500/12–14.
- Durations: micro 0.3s, reveal 0.8–1.1s, hero 1.2–1.6s. Stagger 0.02s (chars), 0.08s (cards), 0.1s (lines).
- Scrubbed sections use `scrub: 1`, about a one-second catch-up, so they feel smooth rather than jittery.

## Performance notes (Framer review checks this)

- Animate only `transform` and `opacity`. The zoom frame's width/height tween is the one exception. It runs on a
  single sticky element; if Lighthouse flags it, swap it for `scale`.
- Images in pinned sections should be ≤ 300 KB WebP.
- Kill ScrollTriggers on unmount. All code components return cleanup functions.
