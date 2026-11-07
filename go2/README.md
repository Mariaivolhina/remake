# Go2 product page: remake

A static, dependency-free rebuild of `https://ai-robots.apps.mdxpreview.xyz/unitree-go2`
(originally an Astro site). It runs from any static file server.

```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Layout
- `index.html`: the page markup (header, desktop nav and dropdowns, mobile menu, all sections, footer)
- `css/styles.css`: only the rules from the original stylesheets that apply to this page, cleaned of Astro scoping
- `js/main.js`: the interactions, rewritten: smooth scroll, intro, an 801-frame canvas sequence scrubbed by scroll, section reveals, nav dropdowns, mobile menu, footer accordions
- `js/vendor/`: GSAP 3.13 (gsap, ScrollTrigger, ScrollSmoother), bundled locally (GSAP standard no-charge licence)
- `assets/`: hero video, images, icons, logo, favicons, `sequence/0000-0800.avif`

## Differences from the original
- "Add to cart" only shows a confirmation; the original posted to the store API. The search, account and cart buttons are not wired up.
- Links to the site's other pages point at the original domain.
- The two feature videos are still Vimeo embeds, with poster images behind them.
