# Real Bakery Shop Websites — Analysis

How real cake and pastry shops run their websites, as input for our Framer bakery-shop template.
Compiled 2026-10-25. Companion to `bakery-template-research.md`. That file covered the Framer Marketplace;
this one covers real businesses only.

> **Method & limits:** this environment's network policy blocks direct access to the bakery sites, so I couldn't
> open pages or take screenshots. Findings come from web-search reads of each brand's own pages (product, FAQ,
> delivery, location and collection pages) plus press coverage. That makes this solid on **structure, ordering
> flows and content**, and thin on **visual design**. Before moodboarding, browse the "Visual review" sites in §6
> by hand.

---

## 1. Sites analysed

| Bakery | Market | Type | Why it's relevant |
|---|---|---|---|
| **Magnolia Bakery** | US (NYC + nationwide) | Cupcakes, cakes, banana pudding | Shipping + pickup + catering in one site |
| **Milk Bar** | US | Cakes, cookies | Delivery-date ordering, flagship store pages |
| **Levain Bakery** | US | Cookies | Built around one hero product; illustration-led brand |
| **Lady M** | US / global | Mille crêpe cakes, boutique | Three ordering channels, size-based pricing |
| **Dominique Ansel** | US | Pâtisserie (Cronut) | Weekly pre-order "drops", monthly flavour |
| **Nothing Bundt Cakes** | US (franchise) | Bundt cakes | Location-first ordering |
| **Sprinkles** | US | Cupcakes | Flavour-quantity picker, "fill a box" |
| **Ladurée** | FR / global | Macarons, pâtisserie | Luxury gift boxes, build-your-own box, heritage |
| **Pierre Hermé** | FR | Macarons, pâtisserie | Gift-led e-shop, free-shipping threshold |
| **Peggy Porschen** | UK (London) | Celebration & wedding cakes | Collection slots, lead times, cancellation rules |
| **Konditor** | UK (London) | Cakes, brownies | Same-day / next-day / timed delivery, click & collect |
| **Lola's** | UK (London) | Cupcakes, celebration | 30+ shops, own delivery fleet, preset boxes |
| **Lune Croissanterie** | AU | Croissants / pastry | Same-day vs pre-order per venue; booked "Lune Lab" experience; loyalty |
| **Flour Bakery** | US (Boston) | Bakery-café | Whole cakes need 24h pre-order |
| **Tartine** | US (SF) | Bakery | Ordering run on Toast; holiday pre-order deadlines |
| **Violet (Claire Ptak), Lily Vanilli** | UK | Independent cake shops | Founder-led stories, bespoke wedding work |
| Wedding-cake bakeries (various) | US | Bespoke | Consultation / tasting / per-serving pricing patterns |

---

## 2. Key findings: the 12 patterns that recur

### 2.1 Every shop offers several ways to get the cake, and labels each one clearly
No serious cake shop has just one "Buy" button. Typical channels:

| Channel | Who does it | How it's presented |
|---|---|---|
| **Nationwide shipping** | Magnolia, Milk Bar, Levain, Lady M, Ladurée, Dominique Ansel | Pick a **delivery date** at checkout. Cakes ship frozen. Often a separate shipping store (Dominique Ansel uses a separate domain) |
| **Scheduled pickup / click & collect** | Peggy Porschen, Lady M, Konditor, Milk Bar | Choose **shop + date + time slot** |
| **Same-day local delivery** | Konditor, Milk Bar, Lady M (via DoorDash) | **Cut-off time** ("order before midday"), fixed slot, fee |
| **Third-party apps** | Dominique Ansel (Caviar, DoorDash), Nothing Bundt (Uber Eats, DoorDash, Grubhub), Levain | Outbound links |
| **Catering / large orders** | Magnolia | A separate path from the homepage |

Magnolia's homepage puts the choice up front: **Ship nationwide · Pick up locally · Catering.**

**For the template:** ship an "How do you want it?" selector component (Delivery / Pickup / Shipping / Apps),
with each option linking anywhere. Add a delivery-info section showing cut-off, slot and fee.

### 2.2 Lead times and cut-offs are written down, per product
- Peggy Porschen: two-tier cakes need **72h**. Changes and cancellations need 48h for cupcakes and 6" cakes, and
  72h for 8" and tiered cakes. Lead times sit in each product description.
- Konditor: same-day if you order before **12pm**, next-day before **2pm**, and up to **a month ahead**.
- Lady M: scheduled pickup needs **2 days' notice before 12pm**, and you can book up to **30 days** ahead.
- Flour: whole cakes need **24h** notice. Lune: pre-orders need **1 day** and a **minimum of 6** items.

**For the template:** every product page gets a **"Lead time" badge** and an **"Order by" note**. Add a
reusable "Ordering policy" block (lead times, changes, cancellations) used on product pages, FAQ and checkout
info.

### 2.3 Size and serving variants drive price
Lady M lists the same cake in 6" and 9" sizes (about $75 and $120). Peggy Porschen splits cupcakes, single-tier
and two-tier cakes. Wedding bakeries price **per serving** ("from $6 per serving buttercream, $7 fondant",
"from $10 per serving").

**For the template:** a product card and detail page with **size chips (6" / 8" / 10")** and their prices, plus a
**"serves X"** line. The custom-cake page shows **"from $X per serving"** pricing.

### 2.4 Navigation is by occasion, not just by product type
Lady M has *Birthday Cakes* and *Anniversary Cakes* collections. Ladurée has *Thank-you gifts* and special
occasions. Konditor has *Personalised Cakes* and *Same-Day Delivery*. Milk Bar has *Birthday cakes delivered*.

**For the template:** the CMS should have **two ways to browse**:
- **Category:** Cakes, Cupcakes, Pastries, Cookies, Gift boxes
- **Occasion:** Birthday, Wedding, Anniversary, Thank you, Kids, Corporate

Products belong to several occasions.

### 2.5 One signature product carries the brand
Magnolia has banana pudding, Lady M the Signature Mille Crêpes, Dominique Ansel the Cronut, Levain the 6oz
cookie, Ladurée the macaron. The signature item gets the hero, its own landing page and the gift boxes.

**For the template:** include a **"Signature" hero / spotlight section** and a `signature` flag in the CMS.

### 2.6 Seasonal and limited items create urgency
Dominique Ansel has a **Cronut flavour of the month**, and pre-orders open **Mondays 11am for two weeks out,
max 12**. Milk Bar runs a **Spring Shop**. Ladurée has limited-edition boxes and collaborations. Tartine posts
holiday pre-order deadlines.

**For the template:**
- a **"This month / Seasonal" collection** with availability dates
- an announcement bar for drops ("Pre-orders open Monday 11am")
- an optional countdown
- **sold-out** states on products

### 2.7 Personalisation is a feature in itself
Konditor sells a *Personalised Cakes* range. Milk Bar offers **cake writing**, but only for pickup and not for
shipping. Ladurée has a **"compose your box"**. Sprinkles' ordering lets you choose **any flavour in any
quantity** with +/− steppers and then **fill a box**, showing the running count as you go.

**For the template:**
- a **personalisation field** on the product page (message on cake, with a character limit)
- a **build-a-box component**: a flavour grid, +/− steppers, a box-size progress bar (e.g. 4/6, 6/6) and a
  summary

The actual cart comes from a commerce plugin or an external link. See §4.

### 2.8 Location comes first for multi-shop brands
- Nothing Bundt asks you to **find your bakery and "Set as my bakery"** before ordering.
- Milk Bar and Konditor have a **page per store**, each with its own ordering options.
- Lune shows which venues allow **same-day vs pre-order**.
- Lola's runs 30+ London shops.

**For the template:** a **Locations CMS**, where each shop has its own hours, services (pickup / delivery /
pre-order / seating) and an Order link. Plus a store-finder list.

### 2.9 Gifting is a primary use case
Ladurée and Pierre Hermé sell **gift boxes** at clear price points (Ladurée: 8 macarons $40, 12 for $56,
42 for $170; Pierre Hermé boxes at €88 and €231). Pierre Hermé ships free from €75, and Milk Bar has free
shipping over **$100**. Ladurée, Lady M and Levain gift lines put the packaging front and centre.

**For the template:** a **Gifts** page (boxes by price, gift message, ship-to-someone note), a **free-shipping
threshold bar**, and "perfect for" occasion tags.

### 2.10 Care and storage info builds trust
Magnolia ships cakes frozen. Its guidance is to thaw for 5–6 hours, and to eat banana pudding within 24h and
never freeze it. Lady M asks you to choose a delivery date 3–7 days before serving, since cakes arrive frozen.

**For the template:** product detail tabs for **Ingredients & allergens · Storage & serving · Delivery**.

### 2.11 Bespoke and wedding cakes run as a consultation, not a cart
Wedding-cake bakeries typically:
- book **consultations and tastings**, with tasting boxes from about $45 or a ~$50 fee credited if you book
- price **per serving**
- take a **deposit**
- finalise designs **about a month before the event**
- deliver larger tiers (often 3+ tiers) themselves

Common enquiry fields:
- event date, guest count / servings
- style, flavours, fillings, frosting
- dietary needs
- budget, with an "I don't know" option
- inspiration photo upload
- delivery and setup details

Peggy Porschen, Lily Vanilli and Violet all present wedding work as a separate, portfolio-led offer.

**For the template:** a **Wedding & Custom Cakes** page with:
- a portfolio gallery
- a "How it works" timeline (Enquire → Tasting → Design → Deposit → Delivery)
- per-serving price guidance
- a **multi-step enquiry form** with the fields above
- a tasting-box product

### 2.12 Story, people and loyalty
- **Heritage:** Ladurée "since 1862".
- **Founder stories:** Flour's Joanne Chang left management consulting; Violet's Claire Ptak started on a market
  stall; Lily Vanilli's Lily Jones is a self-taught former graphic designer.
- **Press:** Violet made a royal wedding cake.
- **Loyalty:** Magnolia's in-store rewards, Lune's Lune Dollars / Passport.
- **Experiences:** Lune Lab is a booked, pre-paid pastry tasting.

**For the template:**
- an **About** page with a founder story, timeline and team
- a **press logo strip**
- an optional **Classes / Experiences** CMS (tastings, decorating classes) with booking links
- a loyalty/newsletter block

---

## 3. Typical information architecture (synthesised)

```
Header:  Logo · Shop/Order ▾ (Cakes, Cupcakes, Pastries, Gift Boxes, Seasonal)
         · Occasions ▾ · Custom & Wedding · Locations · About · [Order now] [Cart]
Top bar: Seasonal drop / cut-off message ("Order by 12pm for same-day London delivery")

Home
 ├─ Hero: signature product + "How do you want it?" (Delivery / Pickup / Ship)
 ├─ Shop by occasion (Birthday, Wedding, Thank you, Kids…)
 ├─ Bestsellers (cards with size-from price, lead-time badge)
 ├─ Seasonal / this month's flavour (+ countdown or pre-order date)
 ├─ Build-a-box teaser
 ├─ Custom & wedding cakes teaser (gallery + "Enquire")
 ├─ Story / founder snippet + press logos
 ├─ Reviews
 ├─ Locations & hours
 └─ Newsletter / loyalty
Product      : gallery · sizes & servings · personalisation · lead time · order modes
               · tabs (Ingredients & allergens / Storage & serving / Delivery)
Collection   : by category and by occasion, with filters (dietary, size, delivery type)
Custom/Wedding: portfolio · process · pricing guide · multi-step enquiry · tasting box
Gifts        : boxes by price · gift messaging · free-shipping threshold
Locations    : shop list → shop page (hours, services, map, order link)
Delivery & Ordering info · FAQ · About · Journal · Contact · Legal · 404
```

---

## 4. Implications for our Framer template

**Positioning update:** the first research doc suggested an artisan *bread* bakery. Following your direction,
we'll target a **cake & pastry shop**: celebration cakes, cupcakes, pastries, gift boxes and custom/wedding
orders. The "Today's Bake" idea becomes **"Fresh this week / Seasonal drops"** with sold-out states.

### Must-have (v1)
1. Order-mode selector (Delivery / Pickup / Ship / Apps). Each mode links to any provider.
2. Product CMS:
   - sizes and prices, servings
   - lead time, personalisation option
   - allergens, dietary tags
   - storage instructions
   - occasions (multi-reference)
   - seasonal dates, sold out, signature flag
3. Collections by **category and by occasion**.
4. **Custom & Wedding** page with a multi-step enquiry form and a process timeline.
5. **Locations** CMS with per-shop services and hours.
6. **Ordering policy** block: cut-offs, lead times, changes and cancellations, delivery zones and fees.
7. Announcement bar for drops and cut-offs. Seasonal collection.
8. **Gifts** page with box sizes and a free-shipping bar.
9. About (founder, timeline, press), FAQ, Contact, 404.

### Should-have
- A build-a-box UI component (visual picker that hands off to cart or form).
- Countdown component for pre-order drops.
- Classes / experiences CMS.
- Reviews CMS, plus an Instagram-style gallery.

### Commerce reality check
None of these shops runs checkout on a plain website builder. They use Shopify-type stores (Konditor, Milk Bar,
Magnolia, Peggy Porschen all show Shopify-style `/collections` and `/products` URLs), Toast (Tartine), or
dedicated ordering platforms (Lune, Dominique Ansel). The template should:
- look like a full shop (cards, size chips, build-a-box, cart icon)
- link out or integrate through a Shopify-for-Framer plugin, documented as optional
- work fully with **no commerce at all**, using enquiry forms and external order links

### Pricing language to reuse in sample content
"From $45" for 6", "Serves 8–10", "Order 48h ahead", "Order before 12pm for same-day", "Free delivery over $100",
"From $8 per serving" (wedding).

---

## 5. Gaps & open questions

- **Visual design** (typography, colour, layout details, motion) couldn't be checked from here. See §6.
- Not every bakery's live ordering flow could be verified. Lola's, Violet, Carlo's and Tartine's cake
  pre-ordering returned only third-party or older sources.
- Third-party snippets for prices and policies may be out of date. That doesn't matter for our template
  structure, but don't copy figures as facts.

## 6. Visual review list (browse manually before moodboarding)

| Look for | Sites |
|---|---|
| Playful, colourful, illustration | milkbarstore.com, levainbakery.com, sprinkles.com |
| Pretty / romantic cake shop | peggyporschen.com, lolascupcakes.co.uk |
| Luxury pâtisserie | laduree.com, pierreherme.com, ladym.com, dominiqueansel.com |
| Clean modern cake e-commerce | konditor.co.uk, magnoliabakery.com |
| Independent / founder-led | violetcakes.com, lilyvanilli.com, rosalindmillercakes.com, cutterandsquidge.com |
| Pastry-first | lunecroissanterie.com, flourbakery.com, tartinebakery.com |

For each site, capture: hero treatment, product-card anatomy, how price/size is shown, colour palette, type
pairing, photo style (cut-out vs styled), and mobile nav.

---

## Sources

**Magnolia Bakery:** [Home](https://www.magnoliabakery.com/) ·
[Order now](https://www.magnoliabakery.com/pages/order-now) ·
[Pick up or delivery](https://www.magnoliabakery.com/pages/pick-up-or-delivery) ·
[Collections](https://www.magnoliabakery.com/collections) ·
[Banana pudding multipack](https://www.magnoliabakery.com/products/world-famous-banana-pudding-variety-multipack) ·
[Storage FAQ](https://magnoliabakery.gorgias.help/en-US/how-should-i-store-nationwide-shipping-products-310002) ·
[Goldbelly](https://www.goldbelly.com/restaurants/magnolia-bakery)

**Milk Bar:** [Cakes](https://milkbarstore.com/collections/cakes) · [FAQs](https://milkbarstore.com/pages/faqs) ·
[Birthday cake](https://milkbarstore.com/products/birthday-cake) ·
[Spring Shop](https://milkbarstore.com/collections/spring-shop) ·
[Locations](https://milkbarstore.com/pages/locations) ·
[LA flagship](https://milkbarstore.com/pages/melrose-flagship)

**Levain:** [FAQ](https://levainbakery.com/pages/faq) ·
[DesignRush homepage review](https://www.designrush.com/best-design/leva) ·
[DC News Now](https://www.dcnewsnow.com/living-local-dmv/mothers-day-cookies-with-levain-bakery/amp/)

**Lady M:** [Birthday cakes](https://www.ladym.com/collections/birthday-cakes) ·
[Anniversary cakes](https://www.ladym.com/collections/anniversary-cakes) ·
[Signature 6"](https://www.ladym.com/items/md-signature-mille-crepes) ·
[Pistachio 9"](https://www.ladym.com/items/lg-pistachio-mille-crepes)

**Dominique Ansel:** [NYC](https://www.dominiqueanselny.com/) ·
[Pre-order](https://www.dominiqueanselny.com/pre-order/) · [Menu](https://www.dominiqueanselny.com/menu/) ·
[Online shop gift box](https://dominiqueanselonline.com/products/4pc-cronut%C2%AE-gift-box)

**Nothing Bundt Cakes:** [FAQs](https://www.nothingbundtcakes.com/faqs/) ·
[Bakery page example](https://www.nothingbundtcakes.com/find-a-bakery/mi/grandrapids/bakery-227.html)

**Sprinkles:** [BHW Group case study](https://thebhwgroup.com/blog/sprinkles-cupcakes-release-announcement) ·
[Time Out NYC](https://www.timeout.com/newyork/restaurants/the-best-bakeries-to-order-cupcake-delivery-in-nyc)

**Ladurée:** [Macarons](https://laduree.com/en-us/pages/macarons) ·
[Gift boxes](https://laduree.com/en-us/collections/macarons-boxes) ·
[Box to compose](https://laduree.com/en/products/macarons-box-to-compose) ·
[Thank-you gifts](https://laduree.com/en-us/pages/special-occasion-thank-you-gifts)

**Pierre Hermé:** [Gifts](https://www.pierreherme.com/en/cadeaux.html)

**Peggy Porschen:** [Home](https://www.peggyporschen.com/) ·
[Delivery & collection](https://www.peggyporschen.com/pages/delivery) ·
[Customer service](https://www.peggyporschen.com/pages/customer-service) ·
[Wedding cakes](https://www.peggyporschen.com/collections/wedding-cakes) ·
[Two-tier cakes](https://www.peggyporschen.com/collections/two-tier-party-cakes) ·
[Cupcakes](https://www.peggyporschen.com/collections/cupcakes)

**Konditor:** [Home](https://konditor.co.uk/) · [Delivery](https://konditor.co.uk/pages/delivery) ·
[Same-day](https://konditor.co.uk/collections/same-day-delivery) · [FAQ](https://konditor.co.uk/faq) ·
[Personalised](https://konditor.co.uk/collections/personalised-cakes) ·
[Stores](https://konditor.co.uk/pages/our-stores) · [About](https://konditor.co.uk/pages/about-us)

**Lola's:** [Not On The High Street](https://www.notonthehighstreet.com/lolascupcakes) ·
[Deliveroo](https://deliveroo.co.uk/menu/London/ealing/lolas-cupcakes-ealing)

**Lune:** [Home](https://lunecroissanterie.com/) · [Order](https://lunecroissanterie.com/pre-order/) ·
[FAQs](https://lunecroissanterie.com/faqs/) · [Passport](https://lunecroissanterie.com/passport/)

**Flour:** [Boston.com](https://www.boston.com/food/restaurants/2018/05/31/joanne-chang-teases-the-new-desserts-coming-to-flour-and-myers-chang/) ·
[QSR Magazine](https://www.qsrmagazine.com/menu-innovations/flour-bakery-cafe) ·
[Time Out](https://www.timeout.com/boston/restaurants/flour-bakery-cafe)

**Tartine:** [Toast ordering](https://order.toasttab.com/online/tartine-bakery-san-francisco) ·
[7x7](https://www.7x7.com/the-sf-thankgiving-pie-bible-1779565424.html)

**Violet / Lily Vanilli / London:** [Visit London: top cake shops](https://www.visitlondon.com/things-to-do/food-and-drink/top-10-cake-shops) ·
[Marie Claire: Violet](https://www.marieclaire.co.uk/news/violet-cakes-587070) ·
[SheerLuxe: birthday cakes](https://sheerluxe.com/life/the-best-birthday-cakes-you-can-order-for-delivery) ·
[The Shopkeepers: Lily Vanilli](https://theshopkeepers.com/shops/lily-vanilli/)

**Wedding/custom patterns:** [Rose Bakes consultations](https://rosebakes.com/wedding-cake-tastings/) ·
[BakeSmart guide](https://blog.bakesmart.com/guide-custom-cake-consultations) ·
[Paperform consultation form](https://paperform.co/templates/wedding-cake-design-consultation-booking-form) ·
[Paperform custom cake form](https://paperform.co/templates/bakery-custom-cake-order-form/) ·
[Zola: Iris Street Bakery](https://www.zola.com/wedding-vendors/wedding-cakes-desserts/iris-street-bakery)
