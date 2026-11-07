# AI Robots product pages

Two independent static sites, each self-contained in its own folder:

| Folder | Site |
| --- | --- |
| `go2/` | Unitree Go2 product page (remake of ai-robots.apps.mdxpreview.xyz/unitree-go2) |
| `mower/` | Remote-controlled crawler lawn mower product page |
| `site/` | Full copy of the whole original website: all 47 pages with their CSS, JS, images and videos |

`index.html` at the root is a small landing page linking to both.

## About `site/`
A static mirror of the built original site, so every page runs from this repo. Only things that need the
original's servers don't work: the shop cart, account sign-in and the blog feed (they call `api.ai-robots.ai`),
and the shop's individual product pages, which aren't static pages on the original either. It is the
starting point for adapting the whole site to our own robot content.

Serve it with `site/` as the web root, because its links start with `/`:
```
cd site && python3 -m http.server 8000
```

## Run locally
```
python3 -m http.server 8000
```
Then open http://localhost:8000/ (landing), `/go2/` or `/mower/`.

## Deploy on Vercel
- **One project** (Root Directory `./`): the sites are served at `/go2/` and `/mower/`.
- **Full site:** a project with Root Directory `site`.
- **Two projects** (one per site): import this repo twice and set Root Directory to `go2` for one and `mower` for the other. Each gets its own URL.

No build step: Framework Preset "Other", no build command, no output directory.
