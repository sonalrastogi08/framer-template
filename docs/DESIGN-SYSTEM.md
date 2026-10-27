# Velvet — Design System

The template is **Velvet**, a cake-studio template. The demo brand is the fictional **Velvet Crumb Cake Studio**.
Every token below lives in `template/assets/css/styles.css` (`:root`). Recreate each one as a Framer **Color Style**
or **Text Style** with the exact name shown, so buyers can re-theme the whole site from one panel.

## Where the look comes from

| Reference (in `reference-images/`) | What we took |
|---|---|
| 12 SLOY pâtisserie, 08 Rustico, 13 Enola | Oversized serif wordmark behind or overlapping the hero product |
| 02 BBK, 15 BrandBloom, 01 Harth | Warm cream base, cocoa ink, editorial serif + handwritten script accents ("baked fresh, daily ♡") |
| 11 Cupcake House, 17 SweetCrumbs, 05 Matcha | Pistachio / olive green as the second brand colour; checkerboard and packaging motifs |
| 03 Red velvet, 19 CakeLuv, 18 Bonbon | Strawberry accent; cut-out product shots on tinted tiles; sale/sold-out badges |
| 07 SR.Cake, 04 Chocolates, 06 Flavored | Dark, rich "signature" moment (Midnight Ganache zoom section) with gold/butter highlights |
| 09 Brewed, 17 SweetCrumbs | Text-first menu rows with prices; "how to order" steps; trust badges |

Rule 4 ("trendy, catchy, modern") is met by pairing the 2026 warm-neutral base with a **pistachio + strawberry**
duo, the colour combination used in current pâtisserie branding (SLOY, SweetCrumbs, Cupcake House).

## Color styles

| Framer name | Hex | Use |
|---|---|---|
| Base / Cream | `#FBF4EA` | Page background |
| Base / Oat | `#F3E7D6` | Alternate section background |
| Base / Paper | `#FFFDF8` | Cards, inputs |
| Ink / Cocoa | `#2B1611` | Text, primary buttons, footer |
| Ink / Mocha | `#4A2A20` | Secondary text |
| Ink / Muted | `#7A6158` | Captions, meta |
| Ink / Line | `rgba(43,22,17,.14)` | Borders, dividers |
| Accent / Pistachio | `#B9CB8C` | Brand green, marquee alt, tiles |
| Accent / Pistachio Soft | `#E4EBCB` | "Fresh" pill, product tile tint |
| Accent / Olive | `#3F5130` | Custom & wedding section, wordmark |
| Accent / Strawberry | `#E8576B` | Highlights, italic accents, hover fill, badges |
| Accent / Blush | `#F8D7DA` | Newsletter, tile tint |
| Accent / Butter | `#F5D589` | "Few left" pill, lead-time notes, process numbers |
| Accent / Gold | `#C9A15B` | Stars, small details |

Contrast (WCAG): Cocoa on Cream 15.7:1, Muted on Cream 5.2:1, Cream on Olive 7.9:1. Strawberry is 3.2–3.4:1 against
Cream/Paper, so use it only for large display text (italic accents) and bold badges, never body copy;
badges on Strawberry use 800 weight.

## Typography (all free in Framer's font picker, from Google Fonts)

| Role | Font | Notes |
|---|---|---|
| Display | **Fraunces** (variable) | Weight 300–500. Set the `SOFT` axis to 100 for rounded, "frosted" terminals. Italic plus `WONK` 1 for accent words |
| Body / UI | **Manrope** | 400–800. Prices and labels use 700–800 |
| Script accent | **Caveat** | Small notes only ("baked fresh, daily ♡"). Never for body text |

| Text style | Size (desktop → mobile) | Line height | Tracking |
|---|---|---|---|
| Display / Mega (wordmark) | 22vw, max 352px | 0.8 | −5% |
| Display / H1 | 112 → 48 | 0.98 | −2% |
| Display / H2 | 74 → 37 | 0.98 | −2% |
| Display / H3 | 34 → 24 | 1.1 | −2% |
| Display / Statement | 67 → 30 | 1.12 | −2% |
| Body / Lead | 21 → 18 | 1.6 | 0 |
| Body / Regular | 16 | 1.6 | 0 |
| Body / Small | 14 | 1.5 | 0 |
| Label / Eyebrow | 12, 700, uppercase | 1 | +22% |
| Script / Note | 30 | 1 | 0 |

Accent rule: in every heading, italicise the **last 1–2 words** and colour them Strawberry
("Cakes that make *the moment.*"). On green or cocoa sections, use Butter for the accent.

## Spacing, radius, elevation

- Container: 1320px max, side gutter `clamp(16px, 4vw, 56px)`
- Section padding: `clamp(80px, 12vw, 160px)` (tight variant: 56–96px)
- Radius: cards 28px, small 16px, pills 999px, feature sections 40px, "arch" frames 300px top
- Shadow: `0 30px 60px -30px rgba(43,22,17,.35)`, used only on hover and on floating UI
- Texture: a 35% flour-grain noise overlay (multiply) across the whole page

## Components to build in Framer (with variants)

| Component | Variants / props | Found in |
|---|---|---|
| **Button** | Primary, Ghost, Light, Small; hover = strawberry fill rising from the bottom, arrow rotates −45° | everywhere |
| **Pill** | Default, Fresh, Few left, Sold out, Hot | cards, board, locations |
| **Product Card** | Default, Few left, Sold out (greyed image, disabled add); props: tint, image, title, meta, sizes, price | home, shop, product |
| **Size Chips** | 2–3 options, selected state | cards, PDP |
| **Order Mode Selector** | code component `OrderModeSelector.tsx` | hero, PDP |
| **Board Row** | Fresh, Few left, Sold out (strikethrough) | Fresh this week |
| **Occasion Tile** | 6 colour variants, hover lift + tilt | home |
| **Process Step** | number, title, text | home, custom |
| **Location Card** | Open now / Closed / Market | home, visit |
| **Review Card** | – | home |
| **FAQ Item** | closed / open (+ rotates to ×, butter fill) | visit |
| **Header** | Default, Scrolled (glass), Hidden (on scroll down); Mobile menu with circular reveal | all |
| **Footer** | giant italic wordmark | all |
| **Announcement Bar** | ticker | all |
