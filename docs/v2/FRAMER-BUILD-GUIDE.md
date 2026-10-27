# Cerise (Velvet v2) — Framer Build Guide

The import approach is the same as version 1 (see `../FRAMER-BUILD-GUIDE.md` §1): rebuild natively in Framer,
using the prototype in `template-v2/` as the spec. The Framer connector in this session can script it.

## Pages

| Framer page | Prototype | Sections |
|---|---|---|
| `/` | `index.html` | Preloader · split hero + crumbs · kinetic rows · pinned exhibit · TASTE mask zoom · La carte · order ticket · stacking atelier cards · 3D coffrets · quotes + press · boutiques |
| `/collection` | `collection.html` | Sticky toolbar (category / dietary / Gallery–List), spotlight tiles, cherry CTA band |
| `/collection/:slug` | `product.html` | Sticky drag-to-turn stage · flavour pyramid · size cells with serving dots · plaque message · buy bar · order notes · allergen grid · pairings |
| `/atelier` | `atelier.html` | Price estimator · stacking process cards · 6-question conversational enquiry |
| `/maison` | `maison.html` | Manifesto highlight · sticky rolling-year chapters · people list · house rules |
| `/boutiques` | `boutiques.html` | Live boutique card · ordering policy · numbered FAQ · contact |
| `/404` | `404.html` | Crumbs canvas, 4*0*4 |

## CMS changes vs version 1

The same collections (Products, Categories, Locations, Gallery, Reviews, FAQ), plus these fields:

| Collection | Extra fields |
|---|---|
| Products | `Accent word` (the italic word in the name), `Top note`, `Heart note`, `Base note`, `Exhibit` (bool: show in the pinned exhibit), `Exhibit order`, `Sizes` as 3 × (diameter cm, servings, price), `Plaque` (bool), `Allergens` as the 8-item grid |
| Locations | `Hours` as 7 open/close pairs (drives the live card), `Code` (LES / BK / FRI–SAT) |
| Chapters (new) | Year, Title, Accent word, Body, Image, Order |
| People (new) | Name, Role, Note |

## Ordering

The same provider-agnostic approach as version 1. Each order mode in the ticket carries its own link and cut-off
hour (`CutoffCountdown.cutoffHour`).

## SEO

- Per-page titles and descriptions come from the `<!--meta-->` line of each `template-v2/src/pages/*.html`.
- Bakery JSON-LD is in `template-v2/src/partials/head.html` (price range `$$$`, late opening hours).

## Submission notes specific to v2

- The dark-first design must still pass contrast. Cherry text on Night is for ≥ 32px text only.
- The preloader must not block Lighthouse. It shows once per session, and you can turn it off in the component.
- Pinned scenes (exhibit, mask zoom, coffrets) fall back to static or swipe layouts on phones. Check this at 390px.
