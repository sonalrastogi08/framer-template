# Sugarstack (Velvet v3) — Hero Spec

Version 3 is **hero only**, in a light theme. It takes the third direction from the research ("B. Playful
pâtisserie: pastels, rounded type, stickers") that versions 1 and 2 didn't use. The demo brand is the fictional
**Sugarstack**, a Brooklyn cake shop where you build your own layer cake.

| | v1 Velvet Crumb | v2 Cerise | **v3 Sugarstack** |
|---|---|---|---|
| Theme | Light, editorial | Dark, luxury | **Light, candy-pop** |
| Type | Fraunces + Manrope | Bodoni Moda + Jost | **Bagel Fat One + Bricolage Grotesque** |
| Shape language | Soft cards | Hairlines, arches | **Thick ink outlines, hard offset shadows, blobs, stickers** |
| Hero idea | Wordmark behind a cake | Words split around a floating slice | **Build your cake, then scroll to see its anatomy** |

## References

- **11 Cupcake House box:** the scalloped awning, outlined shopfront shapes, mint + cream.
- **19 CakeLuv, 17 SweetCrumbs:** bubblegum pink, "ready today" promises, rating badges.
- **02 BBK, 15 BrandBloom:** the floating info cards became stickers.

## Color styles

| Name | Hex | Use |
|---|---|---|
| Base / Blush Milk | `#FFF3F5` | Background |
| Base / Paper | `#FFFDF9` | Nav, builder, chips |
| Ink / Raisin | `#3B1F2B` | Text, every outline and offset shadow (13.7:1 on Blush Milk) |
| Ink / Muted | `#6E4A58` | Lead text (7.0:1) |
| Pop / Bubblegum | `#FF8FB1` | Awning, CTA, sticker |
| Pop / Raspberry | `#E2426F` | Accent word "your" (3.7:1, large text only) |
| Pop / Mint | `#9FE2BF` | Stage blob, outline-word shadow |
| Pop / Butter | `#FFE48A` | Selected chip, belt, sticker |
| Pop / Lilac | `#C9B6FF` | Sticker, candle |
| Cake / Sponge, Filling, Frosting | variable | Set by the builder |

## Type (free in Framer's font picker, from Google Fonts)

- **Bagel Fat One:** display, logo, prices. Headline 106 → 51px, line height 0.92.
- **Bricolage Grotesque:** body and UI. 600–800 for chips and buttons.
- Signature treatment: "happy." is set in Paper with a 3px Ink stroke and a 6px Mint offset shadow.

## Anatomy of the hero

1. **Awning:** a scalloped stripe band made with a CSS mask. Drops in with an elastic bounce.
2. **Nav pill:** outlined, with an offset shadow, and a basket counter that bounces when you add.
3. **Copy:** kicker with a live dot, a two-line headline (words pop in, rotated), and the lead.
4. **Builder:** Sponge / Filling / Frosting chips. Each choice recolours the cake (CSS variables, 0.45s fill
   transition), squishes the changed layers, renames the anatomy labels and counts the price up.
5. **Stage:** a mint blob with a 7-layer SVG cake (plate, 3 sponges, 2 fillings, frosting with drips, toppings,
   candle with a flickering flame). Three **draggable stickers** (rating, ready-time, spinning same-day badge).
6. **Exploded view:** on desktop the hero pins for 120% of the viewport height while scrolling spreads the layers
   apart, labels each one, shrinks the cake slightly, morphs the blob and swings the stickers. **See inside**
   does the same with a button, on every screen size.
7. **Conveyor belt:** today's bakes ride a butter-yellow belt with rollers. It speeds up with scroll velocity.

## Rulebook

| Rule | How |
|---|---|
| 1 Free fonts | Bagel Fat One + Bricolage Grotesque (Google) |
| 2 Framer Motion + GSAP | GSAP for the intro, pin, exploded timeline and belt; Motion for chip and basket springs. The Framer component uses `framer-motion` |
| 3 Horizontal / zoom / stagger | Conveyor belt (horizontal), cake scale + blob morph (zoom), staggered word pops, layer drop-in, sticker pops |
| 4 Trendy palette | Candy-pop pastels with heavy ink outlines and hard offset shadows, a current "soft neo-brutalist" style |
| 5 motionsites.ai | A pinned scroll scene that explains the product (exploded anatomy) |

## In Framer

- `framer/code-components-v3/CakeStackBuilder.tsx` is the whole builder and cake in one component, with arrays
  for sponges, fillings and frostings (colour, anatomy label, price add-on), an order link and a scroll-explode
  toggle.
- Build the awning, nav, headline, stickers and belt natively:
  - **Stickers:** Framer Drag on a frame.
  - **Belt:** Framer Ticker.
  - **Awning:** an SVG.
