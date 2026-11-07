# Crawler lawn mower: product page

A static, dependency-free product page for the remote-controlled crawler lawn mower, built on the layout of `https://ai-robots.apps.mdxpreview.xyz/unitree-go2`
(originally an Astro site). It runs from any static file server.

```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Layout
- `index.html`: the page markup (header, desktop nav and dropdowns, mobile menu, all sections, footer)
- `css/styles.css`: only the rules from the original stylesheets that apply to this page, cleaned of Astro scoping
- `js/main.js`: the interactions: smooth scroll, intro, a pinned photo that zooms as you scroll while key specs cycle, section reveals, nav dropdowns, mobile menu, footer accordions
- `js/vendor/`: GSAP 3.13 (gsap, ScrollTrigger, ScrollSmoother), bundled locally (GSAP standard no-charge licence)
- `assets/mower/`: product photos cropped from the supplied images; `assets/` also holds the icons, logo, favicons and nav images

## Differences from the original
- The search, account and cart buttons are not wired up.
- Links to the site's other pages point at the original domain.
