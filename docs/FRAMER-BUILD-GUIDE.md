# Velvet — Framer Build Guide

How to turn the HTML prototype in `template/` into a Framer Marketplace template.

## 1. How the import works

Framer can't open an HTML/CSS site as an editable project. Pasting raw HTML through third-party plugins tends to
produce absolutely-positioned layers that fail Framer's responsiveness review. So the prototype is the **spec**,
and we rebuild it natively in Framer, section by section, using the same tokens, copy and structure.

Recommended route: this Claude session has the **Framer connector** attached, so the rebuild can be scripted.
1. Create or open a Framer project (`create_project` / `open_project`).
2. Create the Color and Text Styles from `DESIGN-SYSTEM.md`.
3. Create the CMS collections below and seed them with the sample content from the HTML pages.
4. Add the code components from `framer/code-components/`.
5. Build each page as Stacks (auto-layout) with Desktop 1440 / Tablet 810 / Phone 390 breakpoints.

Manual route: open `template/index.html` in a browser next to Framer and rebuild section by section. Copy and
paste each text block, and use the component list in `DESIGN-SYSTEM.md`.

## 2. Pages

| Framer page | Prototype file | Key sections |
|---|---|---|
| `/` Home | `index.html` | Hero (wordmark + cake + order modes), marquee, statement + stats, bestsellers (horizontal), signature zoom, Fresh this week, occasions, custom & wedding + process, build-a-box, reviews + press, locations, gallery zoom, newsletter |
| `/shop` | `shop.html` | Free-delivery bar, filters (category / occasion / dietary), product grid, custom CTA |
| `/shop/:slug` (CMS page) | `product.html` | Gallery, size cards, message on cake, lead time, order modes, tabs (ingredients & allergens / storage / delivery), cross-sell shelf |
| `/custom-cakes` | `custom-cakes.html` | Portfolio shelf, process + per-serving pricing, 5-step enquiry form, tasting box |
| `/about` | `about.html` | Story statement, timeline shelf, values, team, press |
| `/visit` | `visit.html` | Location cards (CMS), ordering policy block, FAQ (CMS), contact form |
| `/404` | `404.html` | Wobbling cake 4🎂4 |
| Legal (add in Framer) | – | Privacy, Terms, Allergen & dietary policy |

Shop filtering in Framer: use CMS collection-list **filters** on separate category and occasion pages
(`/shop/birthday`, …), or a filter plugin. The prototype's client-side filtering is a reference for the UX.

## 3. CMS collections

| Collection | Fields |
|---|---|
| **Products** | Title, Slug, Category (ref → Categories), Occasions (multi-ref → Occasions), Image (cut-out, transparent), Gallery (images), Tint (color), Description (rich text), Price 6" / 8" / 10" (numbers; or Small / Large), Servings text, Lead time (option: Same day / 24h / 48h / 3 weeks), Allergens (multi-option: Gluten, Eggs, Dairy, Tree nuts, Peanuts, Soy, Sesame), Dietary (multi-option: GF, Vegan, Nut-free), Storage (rich text), Personalisable (bool), Fresh today (bool), Bake time (text "07:30"), Stock status (option: Available / Few left / Sold out), Back on (text), Signature (bool), Featured (bool), Order URL (link) |
| **Categories** | Name, Slug, Description, Image, Sort |
| **Occasions** | Name, Slug, Tile color, Image, Sort |
| **Locations** | Name, Address, Map link, Phone, Hours (rich text or 7 text fields), Opens / Closes (for "Open now"), Type (Studio / Market / Pop-up), Services (multi-option), Image |
| **Cake Gallery** | Title, Image, Occasion, Tiers, Servings, Caption |
| **Reviews** | Quote, Name, Context, Source (Google / Yelp / Press), Rating, Avatar color |
| **FAQ** | Question, Answer, Group (Ordering / Delivery / Allergens / Custom) |
| **Journal** (optional) | Title, Slug, Date, Cover, Body, Tags |

**Fresh this week** is a Products collection list filtered `Fresh today = true`, sorted by Bake time. The row
variant comes from Stock status. The owner flips toggles each morning in the Framer CMS, from their phone.

## 4. Ordering (provider-agnostic)

- Every "Order" or "+" action links to the product's **Order URL**: Square, Toast, Shopify, Uber Eats, or a form.
- `OrderModeSelector` has one link per mode (Delivery / Pickup / Nationwide / Apps).
- For a real cart, document an optional Shopify-for-Framer plugin. Never require it.
- Custom-cake enquiry and contact use **native Framer Forms**. Rebuild the 5-step form as one Framer form with
  5 stacked groups shown through variants, or keep it as a single long form on phones.

## 5. SEO & local

- Per-page title and description: copy them from the `<!--meta …-->` line at the top of each `template/src/pages/*.html`.
- Paste the `Bakery` JSON-LD from `template/src/partials/head.html` into **Site Settings → Custom Code → <head>**,
  and tell buyers to edit the name, address, hours and URL.
- Keep NAP (name/address/phone) identical to the Google Business Profile.

## 6. Assets & licensing

- Fonts: Fraunces, Manrope and Caveat are all free from Framer's font picker (rule 1).
- Illustrations in `template/assets/img/` are original SVGs made for this template (`template/tools/gen_svgs.py`).
  They are placeholders. Replace them with photography generated from `IMAGE-PROMPTS.md`, or with licensed stock.
- Brand, press names and people are fictional. Don't use real bakery or press logos.

## 7. Marketplace submission checklist

- [ ] Color Styles and Text Styles named as in `DESIGN-SYSTEM.md`; no hard-coded colours left
- [ ] Breakpoints checked at 1440 / 1200 / 810 / 390; no horizontal overflow
- [ ] Horizontal-scroll sections fall back to swipe on phones
- [ ] All links work (no `#` placeholders on socials and legal)
- [ ] Custom 404 page published
- [ ] Lighthouse: performance ≥ 90 on Home, no CLS from fonts (use `display=swap` metrics) or late images
- [ ] Reduced-motion check (OS setting on): everything readable
- [ ] Screenshots and preview match the live remix
- [ ] "Start here" page in the project: edit Today's bake, change order links, swap colours
- [ ] Listing hooks: "Update today's bake from your phone", "Works with Square, Toast or Shopify",
      "Custom-cake enquiry included", "Allergen-ready menu"
