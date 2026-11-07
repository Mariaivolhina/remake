# Plan: turning the website into the crawler mower site

The starting point is `site/`, a full copy of the original AIROBOTS site (47 pages). We keep its design,
layout and animations, and replace the content, brand and data with ours.

Work goes one step at a time, in order. Each step ends with a deploy and a check before the next one.

---

## Step 0 — Decisions (before any page work)

### Decided
- **Brand:** your own brand replaces AIROBOTS everywhere (name and logo still to be sent)
- **Products:** several mower models, so a model overview page plus one product page per model
- **Sales:** both: "Request a quote" on every model **and** an online shop with cart and checkout
- **Dealers / showrooms:** yes, so the Locations page stays
- **Field demos:** not offered (no "Book a demo")
- **Footage:** you have video of the robot working, which covers part of the media list below

### Still open

| # | Decision | Why it matters |
| --- | --- | --- |
| 0.1 | **Brand:** company name, logo (SVG preferred), colours (keep the blue/black?) | Header, footer, page titles, favicon and social links show it on every page |
| 0.2 | **Products:** one mower, or several models/versions (size, engine, electric)? Model name for each | Decides whether we need a product overview page or just one product page |
| 0.3 | **How you sell:** quote/contact only, or an online shop with cart and payment? | Quote-only lets us delete the cart, account and shop pages (12 pages) |
| 0.4 | **Market and language:** which countries, which languages, currency | Decides addresses, legal text and whether we need translations |
| 0.5 | **Demos and dealers:** do you offer field demos? Do you have dealers or showrooms? | Decides whether "Request a demo" and "Locations" survive |
| 0.6 | **Where enquiries go:** an email address (and optionally a CRM) | Needed to rewire the forms (they currently post to AIROBOTS's server) |

---

## Step 1 — Sitemap: what stays and what goes

**From 47 pages to about 20** (the shop and accounts stay because you sell online).

### Keep and rewrite

| New page | Built from (original) | What it becomes |
| --- | --- | --- |
| `/` Home | `/` | Mower home page (details in Step 4) |
| `/mowers` | `/products` page layout + the home carousel | Model overview: one card per model with photo, 3 key specs, price/"from", Buy and Quote buttons, and a comparison table |
| `/mowers/<model>` (one per model) | `/unitree-go2` (template) + our `mower/` page | Product page per model, all from the same template. The first is already written in `mower/` |
| `/technology` | `/quadruped` (hero + 4 feature blocks) | "Independently developed core components": controller, walking motor, lifting actuator, control module |
| `/applications` | `/industries` (list of 8) | List of where the mower is used |
| `/applications/slopes-embankments` | `/industries/construction` | Steep slopes, dams, embankments, flood banks |
| `/applications/orchards-vineyards` | `/industries/agriculture` | Under-tree and between-row mowing |
| `/applications/solar-farms` | `/industries/energy-utilities` | Mowing under and between panel rows |
| `/applications/parks-municipal` | `/industries/education-research` (template only) | Parks, golf roughs, roadside and railway verges |
| `/about` | `/story` | Your company, factory, in-house development story |
| `/contact` | `/contact` | Request a quote / contact sales, with a working form (model picker included) |
| `/locations` | `/locations` | Your dealers and showrooms: address, phone, opening hours, map |
| Shop: cart (side cart), checkout | the existing cart code | Kept, but connected to **your** store (see Step 2b) |
| `/account/*` (6), `/access/*` (5) | same | Optional: only if you want customer accounts. Shopify-style checkout works without them (guest checkout) |
| `/support` | `/tech-support` | FAQ and maintenance: fuel, oil, charging, remote pairing, tracks, blades, service intervals |
| `/legal/privacy`, `/legal/cookie-policy`, `/legal/terms-conditions` | same | **Your** legal texts (the current ones are AIROBOTS's and must not be reused) |

Also kept because you sell online: `/legal/returns-refunds` and `/legal/seller-liability` (your own texts).
Optional, later: `/blog` (news).

### Delete (about 25 pages)

| Pages | Reason |
| --- | --- |
| 13 Unitree product pages: `/unitree-*`, `/z1-d1`, `/l2-4d-lidar`, `/holographic-cabinet`, `/oled-mobile-robot` | Not your products (one is kept as the product-page template) |
| `/industries/manufacturing`, `/logistics-warehousing`, `/security-surveillance`, `/personal-entertainment` | Not mower use cases |
| `/request-demo` | No field demos |
| `/blog` (for launch) | Its feed loads from AIROBOTS's API; it can come back later |

Also removed from every page: links to Unitree products and AIROBOTS social accounts. The cart icon stays;
search and account icons stay only if we keep those features.

---

## Step 2 — Brand shell (applies to every page at once)

- Logo in header, footer and loading screen; favicon and app icons
- Navigation menu: **Home · Mowers ▾ (one entry per model) · Technology · Applications · About · Contact**
  (the mega-menu's product dropdown is reused for the models; the mobile menu matches it)
- Footer: our link groups, contact details, social links, copyright with our company name
- Page titles, descriptions and social preview image (`og:image`) on every page
- Remove the newsletter code; keep cart and (optionally) account and search, reconnected in Step 2b
- **Forms:** contact and quote forms send to our email (via a form service such as Formspree, or a small
  Vercel serverless function), with a thank-you message and spam protection

## Step 2b — Online shop backend

The cart, accounts and checkout call AIROBOTS's API (`api.ai-robots.ai`), which fronts their Shopify store.
For your shop:
- **Recommended:** your own **Shopify** store (Basic plan is enough) with one product per model and its
  variants and options. The site keeps its own design and uses Shopify only for products, cart and
  checkout (payments, taxes, shipping, order emails).
- The small API layer between the site and Shopify runs as **Vercel serverless functions** in this repo.
- Needs from you: a Shopify store, a Storefront API token, product data (prices, variants, shipping
  rules, which countries you ship to).
- Large machines usually have freight shipping: decide flat rates by region, or "price on request" for
  delivery, which sends buyers to the quote form.

---

## Step 3 — Product pages `/mowers/<model>` and overview `/mowers`

One template, one data file per model. The first model's content is already written in `mower/`. Port it
into the site's product-page template and upgrade the media. Each model page also gets **Buy now** (adds to
cart) next to **Request a quote**.

| Section | Content | Media and animation |
| --- | --- | --- |
| Hero | Name, tagline, 2-line intro | **Hero video** (looping, no sound): mower climbing a slope, cutting tall grass |
| Pinned showcase | "Independently developed core components" + 4 cycling specs | **360° scroll sequence**: the mower turning on a dark background (replaces the static zoom) |
| Remote control | Joysticks and switches | Remote photo, plus a short clip of the operator driving from a distance |
| Tracks and slopes | 45°, 150 mm steel-wire tracks, 2 × 750 W | Video: mower on a steep slope, side view |
| Cutting deck | 550 mm width, 20–150 mm remote height adjust | Video: deck lifting/lowering; before/after grass shot |
| Parts diagram | Labelled parts | Studio photo, labels drawn in code (sharper than the baked-in labels) |
| Core components | 4 cards | Higher-resolution photos of each component |
| Specifications | 18-row table + note | — |
| Call to action | Request a quote | Cut-out mower photo (transparent background) |
| New: Downloads | Spec sheet PDF, brochure, manual | PDFs |

---

## Step 4 — Home page `/`

| Original section | Becomes |
| --- | --- |
| Hero carousel of 4 robots with videos | One full-screen **hero video** of the mower working, headline and "Request a quote" button. If there are several models later, the carousel comes back |
| "Advanced autonomy" (4 features around a robot photo) | "Built for ground you can't walk": 4 features around a **cut-out mower photo** (45° slopes, remote control, 1,500 m²/h, 20–150 mm) |
| "Redefining robotics / Next-gen companion" | Applications teaser: 3 cards linking to the application pages |
| "Targeted inspections" video section | "See it work": a 30–60 s showcase video |
| "Step into the future" call to action | "Ready to mow the slopes others can't?" + quote button |

---

## Step 5 — Technology, Applications, About

- **Technology** (`/quadruped` layout): hero image, then 4 full-width blocks, one per core component,
  each with a close-up photo or short clip (controller, motor, lifting actuator, control module).
- **Applications** (4 pages, same template): hero photo of the mower in that setting, the problem,
  how the mower solves it, 2–3 benefit points, a short clip, call to action.
- **About:** your story, factory and production photos, team photo, "developed in-house" message,
  certifications (CE, ISO…), service and warranty promise.

## Step 6 — Contact and Support

- **Contact:** form fields (name, company, email, phone, country, application, message, "I'd like a demo");
  company address, phone, email, map if you have a showroom.
- **Support:** FAQ grouped as: getting started, fuel & oil, battery & charging, remote control,
  cutting deck & blades, tracks, maintenance schedule, safety, warranty.

## Step 7 — Legal, SEO, launch

- Your privacy policy, cookie policy, terms (and returns/liability only if selling online)
- Sitemap and robots.txt for the new pages; redirects from deleted URLs to the closest new page
- Final check on desktop and phone, all forms tested, then connect a custom domain in Vercel

---

## Media we need

**What we already have:** 3 product images (small, ~870 px, with text baked in), fine for a draft but
too soft for full-screen use, **plus your videos of the robot working** (to be sent). Your footage may
already cover V1, V3, V5 and V6. Once you send it, I'll go through it and mark which shots are covered.
For several models, P1, P2 and V2 are needed **per model**.

### Photos (minimum 2400 px on the long side, no text on them)

| # | Shot | Used on |
| --- | --- | --- |
| P1 | Studio, 3/4 front view, plain background (for a transparent cut-out) | Home features, CTA, product hero fallback |
| P2 | Studio, side view and rear view | Parts diagram, technology |
| P3 | Mower on a steep grass slope (show the angle) | Home, product, slopes page |
| P4 | Mower in tall/rough grass, before-and-after strip | Product, applications |
| P5 | In an orchard row, under solar panels, on a roadside verge, in a park | One per application page |
| P6 | Close-ups: tracks, cutting deck from below (machine off), engine, lift actuator, LED lights at dusk | Technology, product |
| P7 | Remote control in hand, operator at a safe distance with the mower working | Product, home |
| P8 | Each core component on a plain background | Technology, component cards |
| P9 | Factory, assembly line, team | About |

### Videos (landscape 1920×1080 or 4K, no music needed; we compress them)

| # | Clip | Length | Used on |
| --- | --- | --- | --- |
| V1 | Hero loop: mower driving towards the camera through grass, low angle | 10–20 s, seamless loop | Home and product hero |
| V2 | **360° turntable**: mower rotating once on a turntable (or a 3D render), dark background, locked camera | 8–12 s | Product scroll sequence (we convert it to ~300 frames) |
| V3 | Climbing a 30–45° slope, side view | 10 s | Product, slopes page |
| V4 | Deck lifting and lowering by remote, close-up | 5–8 s | Product, technology |
| V5 | One clip per application setting | 8–15 s each | Application pages |
| V6 | Showcase edit: best moments | 30–60 s | Home "See it work" |

**Filming tips:** shoot in daylight with soft sun, lock exposure, keep the camera steady (tripod or gimbal),
and avoid people's faces unless they've agreed. Film a bit longer than needed so we can pick clean loops.

### What Claude can do with the media

- Write the shot list and storyboard for a photographer or videographer (this section is the start)
- Process footage: trim, make seamless loops, compress for the web, create poster images, make mobile crops
- Turn the turntable video into the scroll-sequence frames and wire up the animation
- Cut out the mower from studio photos (transparent background) and resize everything for the web
- Draw diagram labels and spec graphics in code so they stay sharp
- Write and edit all page copy from your data

Claude can't film, and there is no image or video generator in this environment. For a real product,
use real photos and footage of the machine: generated images could show details that differ from what
customers receive. A 3D render for the turntable (V2) is fine if you have a CAD/3D model of the mower.
