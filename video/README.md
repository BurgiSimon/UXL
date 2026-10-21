# The Voxmere film

The source of [`docs/voxmere/uxl-voxmere.mp4`](../docs/voxmere/uxl-voxmere.mp4), the short film of the [Voxmere case](../docs/voxmere/index.html). It is made in code: Playwright records the two published pages, and [Remotion](https://www.remotion.dev) cuts the footage into scenes.

## Make it

```bash
npm i
npm run capture   # records docs/voxmere/{without,with}-uxl into public/clips/ (about 5 min)
npm run render    # writes ../docs/voxmere/uxl-voxmere.mp4
npm run dev       # or preview and edit in Remotion Studio
```

Both steps need Chromium. Playwright is loaded from the global npm root, and Remotion uses its own headless shell unless you pass `--browser-executable`.

## How the footage is captured

`capture.mjs` takes one screenshot per video frame under a virtual clock. `requestAnimationFrame`, `performance.now` and `Date.now` advance exactly 1/30 s per frame, so GSAP, Lenis and WebGL move at video speed however slow the renderer is. It writes four clips:

| Clip | What it shows |
|---|---|
| `a-desktop`, `b-desktop` | the first screen at 1440 × 900, then the story scrolling by |
| `a-phone`, `b-phone` | the same reservation on a 390 × 844 phone: Cube 20, Smoke glass, shipped to Germany; checkout submitted empty; a declined card (B only); payment; confirmation |

Both phone runs use one script, so their marks in `public/clips/clips.json` line up. The scenes in `src/VoxmereCase.tsx` cut both clips at those marks, and the tap ripples are drawn from the recorded tap positions. Exhibit A's native country picker can't appear in a headless screenshot, so the film redraws it and says so on screen.

## Licences

The fonts in `public/fonts/` are Libre Caslon Display, Public Sans and IBM Plex Mono from npm `@fontsource`, under the SIL Open Font License 1.1 (texts alongside). Remotion is free for individuals and companies of up to three people; see [remotion.pro/license](https://www.remotion.pro/license).
