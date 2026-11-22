# Mohammed Shaheem — Portfolio

The source of [shaheeem.me](https://www.shaheeem.me/): a static site (plain HTML, CSS and JS, no
framework, no build step) on top of a 14-second generated film that is scrubbed by the scroll position.

The film is one continuous shot of ~16,000 particles:

| Time | Scene | Section it plays behind |
| --- | --- | --- |
| 0.0 – 1.0s | `SHAHEEM` wordmark | Hero |
| 2.3 – 2.9s | Raw data cloud | Hero → About |
| 4.1 – 5.3s | Neural network (input → hidden → output) | 01 About |
| 6.3 – 7.5s | Embedding space, a query retrieving its top-k (RAG) | 02 Experience |
| 8.5 – 9.7s | Product interfaces (dashboard, chat, map) | 03 Projects |
| 10.7 – 11.7s | Tools orbiting a core | 04 Expertise |
| 12.9 – 14.0s | Horizon | 05 Contact |

## Run it

No build step and no dependencies. Serve `public/` with any static server:

```bash
python3 -m http.server 8000 -d public   # then open http://localhost:8000
```

(It has to be served over http — browsers block ES modules on `file://`.)

## Files

```
public/index.html          markup + all copy, links and the analytics tag
public/css/styles.css      design tokens and layout
public/js/scroll-scrub.js  the scrubber — standalone, reusable, no dependencies
public/js/main.js          page wiring: loader, pinned headlines, nav, archive toggle
public/assets/film-landscape-*   the film at 720p (13 MB, quick first paint), 1080p (38 MB), 1440p (51 MB) and 2160p (68 MB)
public/assets/film-portrait-*    the same film re-framed for phones and tablets: 720×1560 (11 MB), 1080×2340 (33 MB) and 1440×3120 (43 MB)
public/assets/…            portrait, project images, résumé
video-source/              the film's source code (see "Changing the film"); not deployed
vercel.json                tells Vercel to serve public/ as is, and caches the films
```

## Deploying (Vercel)

Pushing to `main` deploys. `vercel.json` sets the framework preset to "Other", skips the install and
build steps and serves `public/`, so nothing needs changing in the Vercel dashboard. The films are
cached for 30 days; if you re-render them, give the files new names (and update `public/js/main.js`)
so returning visitors get the new version.

## Reusing the scrubber on another page

1. Copy `public/js/scroll-scrub.js` and the `public/assets/film-*.mp4` files.
2. Add the fixed film layer as the first child of `<body>` and keep page content above it:

   ```html
   <div class="film" aria-hidden="true"><video class="film__video" muted playsinline preload="auto"></video></div>
   ```
   ```css
   .film { position: fixed; inset: 0; z-index: 0; overflow: hidden; background: #080808; pointer-events: none; }
   .film__video { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: none; }
   main { position: relative; z-index: 1; }   /* sections need a transparent background where the film should show */
   ```
3. Mark sections with the film time they belong to:

   ```html
   <section data-film="0:0, 1:2.5">…</section>             <!-- 0s at its top edge, 2.5s at its bottom edge -->
   <section data-film="0:2.5, 0.38:4.2, 1:5.1">…</section>  <!-- reaches 4.2s after 38% of its height -->
   ```
4. Start it:

   ```html
   <script type="module">
     import { ScrollScrubVideo } from './js/scroll-scrub.js';
     const film = new ScrollScrubVideo(document.querySelector('.film__video'), {
       sources: {
         landscape: [
           { src: 'assets/film-landscape-720p-v2.mp4', width: 1280, height: 720, preview: true },
           { src: 'assets/film-landscape-1080p-v2.mp4', width: 1920, height: 1080 },
           { src: 'assets/film-landscape-1440p-v2.mp4', width: 2560, height: 1440 },
           { src: 'assets/film-landscape-2160p-v2.mp4', width: 3840, height: 2160 },
         ],
         portrait: [
           { src: 'assets/film-portrait-720p-v2.mp4', width: 720, height: 1560, preview: true },
           { src: 'assets/film-portrait-1080p-v2.mp4', width: 1080, height: 2340 },
           { src: 'assets/film-portrait-1440p-v2.mp4', width: 1440, height: 3120 },
         ],
       },
       onProgress: (p) => {},   // 0..1 while the film downloads
       onReady: () => document.body.classList.add('is-ready'),
     });
   </script>
   ```

In React/Next/Astro: create it in an effect (`useEffect` / `onMount`) with a ref to the `<video>`,
and call `film.destroy()` on unmount. Call `film.measure()` after anything changes the page height.

Picture quality: the `preview` rendition is shown first so the page opens after an 11–13 MB download.
The scrubber then fetches the smallest full-quality rendition that covers the screen at its pixel
density (1080p on a normal laptop, 1440p on QHD, 2160p on Retina and 4K screens, 1080×2340 on phones) and swaps
it in on the same frame. Visitors with Data Saver or a 2G/3G connection stay on the preview. A source
can also be a single URL string if you only want one file per orientation.

How it works: each rendition is fetched as a Blob (so seeks never hit the network), every `data-film`
keyframe is converted to a scroll offset, and on each animation frame `video.currentTime` eases toward
the time for the current scroll position. Because every frame of the MP4 is a keyframe, seeking is
instant in both directions. `prefers-reduced-motion` turns the easing off.

## Changing the film

The film is code, not footage: `video-source/scene.js` draws any timestamp of it onto a 2D canvas.

```bash
cd video-source
python3 -m http.server 8001          # open http://localhost:8001/preview.html to scrub it live
                                      #   preview.html?w=1080&h=2340 for the phone framing

pip install playwright               # renderer drives a local Chrome (set CHROME=/path/to/chrome)
python3 render.py --w 3840 --h 2160 --out frames/landscape
python3 render.py --w 1440 --h 3120 --out frames/portrait
./encode.sh                          # needs ffmpeg; scales the frames down into the seven public/assets/film-*.mp4 renditions
```

Things you are likely to change, all at the top of `scene.js`: `TOOLS` (orbit labels),
`ACCENT`/`CREAM` colours, `LOOK` (contrast, particle sharpness, glow), `N` (particle count) and `HOLDS` (when each scene is at rest — keep the
`data-film` values in `public/index.html` in step with it). Quality against file size is the CRF number per
rendition in `encode.sh` (lower is sharper and larger). The wordmark text is the `text` constant in `sampleWordmark`.

All rights reserved. © Mohammed Shaheem.
