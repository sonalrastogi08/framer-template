# Cerise (Velvet v2) — Design System

Version 2 of the template takes the other direction the research recommended: **the luxury cake studio**. The demo
brand is the fictional **Cerise Pâtisserie de Nuit**, a New York dessert bar open until midnight.

It has nothing in common with version 1 (Velvet Crumb):

| | Version 1 · Velvet Crumb | Version 2 · Cerise |
|---|---|---|
| Mood | Sunny neighbourhood cake studio | Spotlit dessert exhibition after dark |
| Base | Cream, light | Black cherry, dark |
| Accents | Pistachio + strawberry | Cherry red + champagne gold + rose spotlight |
| Type | Fraunces (soft serif) + Manrope + Caveat script | Bodoni Moda (high-contrast Didone) + Jost (geometric) |
| Shapes | Rounded cards, pills, tinted tiles | Hairlines, arches, square frames, tickets |
| Hero | Wordmark behind a cake | Words split apart around a floating slice and falling crumbs |
| Product browsing | Card shelves | Pinned exhibition, a typographic menu with cursor previews, gallery/list grid |

## References used (`reference-images/` on the reference branch)

| Reference | What we took |
|---|---|
| 03 Red-velvet bite | The floating slice with crumbs, the black-to-rose spotlight |
| 07 SR.Cake, 04 Premium chocolates | Gold on chocolate, the gold-ribbon coffret, glossy glazes |
| 06 "Flavored" exhibition poster | Exhibition framing ("The collection · Autumn 2026"), flavour words, velvet green |
| 05 Matcha menu | Dark menu with tags and per-item notes (La carte) |
| 12 SLOY, 13 Enola | Arched frames, editorial Didone headlines |
| 08 Rustico | Giant type as image (TASTE mask zoom) |

Rule 4 ("trendy, catchy, modern"): cherry red has been a popular food and fashion colour lately, and it is paired here with
champagne gold and black-cherry neutrals.

## Color styles

| Framer name | Hex | Use |
|---|---|---|
| Night / Black Cherry | `#140A0C` | Page background |
| Night / Plum | `#1E1013` | Raised surfaces |
| Night / Velvet | `#2A171B` | Frames, inputs |
| Light / Porcelain | `#F4E9E1` | Text on dark; light sections |
| Light / Bisque | `#E9DACE` | Secondary light text |
| Light / Muted | `#B39A93` | Captions (7.4:1 on Night) |
| Accent / Cherry | `#C2213F` | Primary CTA, cherry sections, tags. Large text only on Night (3.3:1) |
| Accent / Cherry Deep | `#7A0C1F` | Accent text on Porcelain (9.3:1) |
| Accent / Rose | `#E7A3A8` | Spotlight glows, a stacking card |
| Accent / Champagne | `#D8B46A` | Labels, italic accents, hairlines (9.9:1 on Night) |
| Accent / Velvet Green | `#5C6830` | One stacking card, pistachio pieces |
| Ink | `#1A0F0F` | Text on light sections |
| Hairline | `rgba(216,180,106,.28)` | All dividers |

The design is **dark-first by choice**. The light Porcelain sections (Boutiques, Estimate, FAQ) give the page rhythm.

## Typography (free in Framer's font picker, from Google Fonts)

| Role | Font | Notes |
|---|---|---|
| Display | **Bodoni Moda** | Optical-size axis 6–96; tracking −3.5% to −6%. Italic for accent words, numbers and prices |
| Body / UI | **Jost** | 300 for leads, 400 body, 500 for uppercase labels (tracking +24–32%) |

| Text style | Size (desktop → mobile) | Line height |
|---|---|---|
| Display / Hero | 192 → 64 | 0.84 |
| Display / XL (page titles) | 168 → 58 | 0.86 |
| Display / L (H2) | 80 → 38 | 0.92 |
| Display / M (H3) | 38 → 26 | 1.02 |
| Display / Menu row | 51 → 29 | 1.0 |
| Display / Number | 176 → 80, italic | 0.8 |
| Body / Lead | 19 → 17, 300 | 1.65 |
| Body / Regular | 16 | 1.65 |
| Label | 11.5, 500, uppercase, +32% | 1 |

Accent rule: the italic word in each heading is Champagne on dark and Cherry on Porcelain.

## Components

| Component | Variants |
|---|---|
| Button | Hairline (gold border; a gold fill sweeps in from the left on hover), Solid cherry, Dark-on-light; a trailing line that grows on hover |
| Tag | Default, Gold, Cherry, Sold out (porcelain) |
| Nav | Transparent → blurred black on scroll, hides on scroll down; centred italic logo; cherry curtain drawer on mobile |
| Exhibit panel | Tag, name + italic word, lead, details list (Serves / Notice / Contains), price, CTA |
| Menu row | Roman numeral, name, notes, tag, price; Hover (indent + italic + cherry wash), Sold out (strikethrough) |
| Order ticket | Mode list (a–d) + live countdown + 3 facts + CTA; notched ticket edges |
| Stacking card | 5 colourways (Cherry, Champagne, Rose, Velvet Green, Porcelain) |
| Coffret card | Gold sheen sweep on hover |
| Collection tile | Spotlight follows cursor; Gallery and List layouts; Sold out (desaturated) |
| Boutique item + status card | Arched card with live clock, open/closed pulse and the week's hours (today highlighted) |
| Size selector | Three cells with serving dots (one dot ≈ one guest) |
| Flavour pyramid | Top / Heart / Base notes, the way a perfume is described |
| Allergen grid | 8 cells: filled cherry dot = contains |
