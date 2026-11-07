# AI Robots product pages

Two independent static sites, each self-contained in its own folder:

| Folder | Site |
| --- | --- |
| `go2/` | Unitree Go2 product page (remake of ai-robots.apps.mdxpreview.xyz/unitree-go2) |
| `mower/` | Remote-controlled crawler lawn mower product page |

`index.html` at the root is a small landing page linking to both.

## Run locally
```
python3 -m http.server 8000
```
Then open http://localhost:8000/ (landing), `/go2/` or `/mower/`.

## Deploy on Vercel
- **One project** (Root Directory `./`): the sites are served at `/go2/` and `/mower/`.
- **Two projects** (one per site): import this repo twice and set Root Directory to `go2` for one and `mower` for the other. Each gets its own URL.

No build step: Framework Preset "Other", no build command, no output directory.
