# Jury report — Voxmere Cube (`release/index.html` + `release/404.html`) — 2026-10-21 · phase 7 full site, round 2 of 2

disposition: fix
Design 7.6 · Usability 7.8 · Creativity 8.2 · Content 8.1 — weighted 7.83
1. Recompose the close so its last screen holds 360°, the whole "Seen from every side.", the action and a visible refund line on desktop and phone (index.html:275-311, src/styles/site.css:320-326)
2. Redeclare `--muted`, `--line` and `--line-strong` under `[data-theme="smoke"]` so the Smoke chapter's helper text, legends and scale links clear 4.5:1 (src/styles/tokens.css:45-50)
3. After the nav scroll, focus the chapter heading only if focus is still on the link or on `body` (src/app/chrome.js:155)

## Evidence
- Manifest: `.awards/captures/20261021T080333-jury/manifest.json` — valid: yes. 0 console errors, 0 page errors, 0 failed requests. The captures were taken at 08:03 and are newer than every source file (`find -newer` returned nothing). CLS 0.001 desktop / 0.0008 mobile; 498 DOM nodes; WebGL on, 1 canvas; `__awards` hook present; `scrollMode: hook` (s00–s100 all differ).
- Additional manifests from the same build. All are valid with 0 errors:
  - `.awards/captures/20261021T080333-jury-desktop-states/manifest.json`: 16 frames, with every state of `.awards/capture-states.json` captured at full and reduced motion.
  - `.awards/captures/20261021T080333-jury-mobile-states/manifest.json`: 5 frames.
  - `.awards/captures/20261021T080333-jury-nogl/nogl-manifest.json`: 11 frames; `webgl: false`, `gl: false`, `stageError: null`.
  - `.awards/captures/20261021T080916-jury-404/manifest.json`: 13 frames. **Recaptured in this pass**, because no recorded manifest covered Page map row 7. Command: `capture.mjs release/404.html --scroll 0,100 --mobile --reduced-motion`, exit 0.
- Coverage against the Page map. Every listed frame was opened, and none is blank, flat or stuck:
  - 1 Light: desktop-s00, mobile-s00, desktop-rm-s00 (byte-identical to s00), nogl-desktop-s00, nogl-mobile-s00, desktop-state-skip-link (and its rm twin, identical).
  - 2 Glass: desktop-s12/s22/s32, mobile-s12/s22/s32, desktop-rm-s12/s22/s32.
  - 3 Turn: desktop-s45, states/desktop-s50, mobile-s45, mobile-states/mobile-s50, desktop-rm-s45, states/desktop-rm-s50, nogl-desktop-s50, nogl-mobile-s50, desktop-state-turn-keys (+rm), desktop-state-turn-orrery-smoke (+rm).
  - 4 Sizes: desktop-s60, mobile-s60, desktop-rm-s60.
  - 5 Reserve: desktop-s75/s90, mobile-s75/s90, desktop-rm-s75/s90, desktop-state-checkout-errors (+rm), desktop-state-checkout-done (+rm), mobile-state-checkout-open.
  - 6 Close: desktop-s100, mobile-s100, desktop-rm-s100 (identical to s100), nogl-desktop-s100, nogl-mobile-s100.
  - 7 404: jury-404 desktop-s00, mobile-s00, desktop-rm-s00 (s00 = s100 = rm: a one-viewport page).
  - Phone nav: mobile-state-chapters-open.
  - Controls: desktop-focus-1/2/3 and desktop-hover-2/3 (all `matched: true`); nogl-desktop-focus-1/2/3 and nogl-desktop-hover-2/3; 404 desktop-focus-1/2/3 and desktop-hover-1/2/3.
- Live DOM probe (Playwright against `release/`). It checked tab order, the skip-link landing, focus after nav travel, the dialog trap and Escape return, overflow at 320 and 390 px, phone touch-target sizes, computed contrast in Smoke, and reduced-motion wheel response. The results are cited inline below.
- Neighbours: all three recapture attempts exited 4 (`ERR_TUNNEL_CONNECTION_FAILED`). Their manifests are `.awards/neighbours/{oryzo-20261021T081339,son-daven-20261021T081340,seasats-20261021T081341}/manifest.json`; the earlier 07:44 attempts failed the same way. The finish bar therefore uses each card's §3.
- Audit: `.awards/audit.json` (2026-10-21T08:08:05Z, target `release`, 2 files) — P0 0 · P1 0 · P2 0 · P3 2 (S06: no Open Graph image in `index.html` or `404.html`). Accepted exceptions: C02, X09.
- Console / page errors: 0 / 0 across all five manifests.

## Scores
| Axis (weight) | Score /10 | One-line reason |
|---|---|---|
| Design (40) | 7.6 | A committed daylight-optics world: ground, graphite, one HeNe red and one wide grotesque hold from s00 through s100, the dialog, the Smoke inversion and the 404, and the glass really refracts "held" (desktop-s00). Several seams pull it down: the translucent degree bar ghosts captions and readouts (desktop-s22, desktop-s32, states/desktop-s50, desktop-s90); a paper masthead band crosses Smoke after the nav jump (desktop-state-turn-keys); the story beats leave the top half empty and the slip opens with an empty left column (desktop-s22, desktop-s75); and the close is cut at max scroll (desktop-s100, mobile-s100). |
| Usability (30) | 7.8 | All eight walk steps pass, so nothing is capped. Three things hold it back: Smoke helper text and chapter links sit at about 2.6:1; at 1440×900 the Turn readout and controls fall under the bar or below the fold after the nav jump (probe: readout top 831 vs bar 836, controls 930–1009); and focus is pulled to the heading after nav travel (chrome.js:155). |
| Creativity (20) | 8.2 | The turn is the argument. The plate collapses to a line at 90° while the volume keeps its back at 180° (desktop-s22, desktop-s32), and the same angle is the nav, the progress and the hand-turn readout. A scroll-turned product object is a known move, which keeps it from 9. |
| Content (10) | 8.1 | Numbers with dual units (desktop-s60: 100 mm 3.9 in, 3.1 kg 6.8 lb); a poetic register that switches to numbers at Sizes; an honest demo checkout and refund terms (desktop-state-checkout-errors); an authored 404, "This angle doesn't exist." Two minor misses: the phone shows the arrow-key help on touch (mobile-s45), and the bar reads 350° under a static "360°" (mobile-s90). |
| **Weighted** | **7.83** | SOTD territory (≥ 7.2, no axis < 6.8); the disposition is `fix` because LOAD & CLOSE is not kept |

| Developer criteria | Score /10 | Note |
|---|---|---|
| Animation and interaction | 8.0 | One GSAP ticker runs Lenis → angle → DOM → GL (src/main.js:40, src/lib/scroll.js:13, src/gl/stage.js:646). The scroll→angle map is linear over measured segments (src/app/angle.js:47-54), the hand turn uses framerate-independent damping with k 8 (angle.js:101), the GL renders only on change (stage.js:627) and leaves the ticker when the tab is hidden (stage.js:648). Only colour and transform are transitioned. Minus: the nav-scroll focus race (chrome.js:155). |
| Performance | 7.5 | One self-contained file, 1,061,524 B raw / 335,448 B gz, carrying the inline 98 KB font and the GL module as inert text that is imported from a Blob only when the tier gate passes (main.js:75-85). CLS ≤ 0.004; 498 DOM nodes; mid tier caps DPR at 1.5. Minus: the inert GL text rides in every load, low tier included, which the single-file brief forces. `lcpColdSynthetic` (412 / 136 ms) is read only as a headless cold-cache asset-weight signal, never as a score. |
| Responsive | 8.0 | The phone layout is designed, not shrunk: mobile-s00, a chapter sheet (mobile-state-chapters-open) and a full-screen checkout (mobile-state-checkout-open). No overflow at 320 or 390 px, and no sampled target under 44 px (probe). Swipe is limited to the stage with `touch-action: pan-y` (site.css:206). Minus: the bank-card caption wraps to four lines in a 49 px column (mobile-s60), and the phone close is cut (mobile-s100). |
| Accessibility and semantics | 7.0 | One h1; header, main, footer and nav landmarks; ordered headings; the canvas is `aria-hidden` (probe). The stage is `role="slider"` with `aria-valuetext` and a polite announcement on settle (turn.js:103-107). The `showModal` dialog traps Tab and returns focus to `#reserve-btn` on Escape (probe). The error summary links each field (desktop-state-checkout-errors). Minus: computed `--muted` in Smoke is about #646866 on #262826, ≈2.6:1, failing the WCAG 2.2 AA target for the help text, legends and chapter links (tokens.css:11-12 vs :45-50); plus the focus race. |
| Code quality | 8.0 | 0 console errors, 0 page errors and 0 failed requests in five manifests; the renderer, materials and textures are disposed on teardown and context loss (stage.js:657-671). Minus: the global `window.lenis` stays on (scroll.js:15); `lib/raf.js` keeps an unused standalone ticker; there is no OG image (S06 ×2). |

Usability walk:
- walk 1 — pass — The skip link comes first (desktop-state-skip-link) and lands on `h1#light-title` inside `<main>` (probe). Tab order runs hero action → Skip to sizes → stage → turn buttons → radios → Choose → slip (probe). The focus ring is in the accent (desktop-focus-1/2/3). Checkout opens on Enter, traps Tab, and returns to `#reserve-btn` on Escape (probe). Arrow keys turn the stage (desktop-rm-state-turn-keys, 240°). One race: focus is pulled to `h2#turn-title` when the nav scroll completes (src/app/chrome.js:155).
- walk 2 — pass — No cursor or magnetic kit and no hover-only path. Phone targets are at least 44 px (probe). Swipe works only on the stage (site.css:206), and the phone chapter sheet exists (mobile-state-chapters-open). The keyboard help still shows on touch (mobile-s45).
- walk 3 — pass — rm-s00 is identical to s00. The beats cut to 30°, 90° and 180° (desktop-rm-s12/s22/s32), the hand turn steps instantly (desktop-rm-state-turn-keys), and checkout and confirmation are intact (desktop-rm-state-checkout-done). Durations are shortened rather than killed (tokens.css:52-57).
- walk 4 — pass — There is no gate: the DOM h1 and the SVG poster paint first. The light switches on after `document.fonts.ready` and the first GL frame (main.js:126-133), and is simply on for a repeat visit in the same session (main.js:93).
- walk 5 — pass — s00 says what it is (a true 3D image inside solid glass), what to do (Reserve a Cube) and the stake (CHF 100, refundable). "Who it is for" is implicit.
- walk 6 — pass — The degree bar, with `aria-current` and a live needle, is on every frame; the wordmark links to `#light`; the 404 offers three routes out (jury-404/desktop-s00).
- walk 7 — pass — One primary action, "Reserve a Cube", appears at s00, in the masthead Reserve, in the phone bar's Reserve and at the close. It names the outcome.
- walk 8 — pass — Without WebGL, SVG stills keep the live readout (nogl-desktop-s00, nogl-desktop-s50 at 251°). The canvas is `aria-hidden` and there is no overflow at 320 px (probe).

## Memory test
A glass cube on a degree-marked turntable that bends the word 'held' through itself, with a red dotted stepped pyramid floating inside, and chapters that are degrees on a ruler along the bottom.

## Specificity test
no. The nearest palette and type row in `_index.md` is `[site:the-line]`: one hot red over cool-grey grounds and a single variable grotesk. But The Line spends its red everywhere, while Voxmere rations it to light and the one action, and The Line has no object. None of the three DIVERGENCE cards' object, palette, type or archetype appears at s00.
- oryzo — neighbour frame unavailable (exit 4). From §3, Oryzo's material reads through grain, depth of field and one warm key light on one mesh. Against that, Voxmere's empty block in the window beat reads as a pale frosted slab with soft edges and no hard bevel highlight (desktop-s12.png, mobile-s12.png); the lit hero carries the material (desktop-s00.png).
- son-daven — neighbour frame unavailable (exit 4). From §3, Son Daven carries one texture through wordmark, ornament, photography and footer. Voxmere's engraved-scale detail stays on the ring and the bar and stops at the order slip and the close, which are plain hairline rows and radio cards (desktop-s75.png, desktop-s100.png).
- seasats — neighbour frame unavailable (exit 4). From §3, Seasats sets renders near full-bleed and specs as rhetoric. Voxmere's Sizes figures are small (Cube 20 about 190 px wide at 1440) over a long body-size table, so the numeric half reads as a datasheet rather than as headlines (desktop-s60.png).

## Slop scan
families present: 1
- Layout: text under a layer — the fixed degree bar is 92 % ground (src/styles/site.css:348), so captions, headings and readouts ghost through it and collide with its labels: Fig. 2 in desktop-s22, Fig. 3 in desktop-s32, "Two sizes." in states/desktop-s50, "360°" in desktop-s90, "253°" in desktop-state-turn-keys. The masthead scrim (site.css:116-118) also fades the close headline and the phone close action (desktop-s100, mobile-s100).
- Not counted, because earned or absent:
  - One family for everything: one characterful grotesque at display scale, held as a contract (DESIGN.md Typography).
  - The light ground is derived from the "readable in a daylit room" claim (WORLD).
  - The scale ticks are recorded under `## Exceptions` (X09).
  - There is no template order: chapters with beats and one interruption.
  - The audit found no slop, type, layout or colour rules beyond S06 (P3).
generator nameable: no

## Contract fidelity
| Block | Kept? | Evidence (capture, file:line) |
|---|---|---|
| THESIS | kept | desktop-s00: cube on a graduated ring, degree-scale nav, one action. desktop-s22: the flat picture is a line at 90°. desktop-s32: the volume shows its far side. |
| WORLD | kept | Ground, graphite and one red from s00 to s100, the dialog and the 404. Smoke floods only Turn (desktop-s45). Glass is the only material, with no glass UI. Note: DESIGN.md's "derived tokens follow" fails in Smoke (tokens.css:11-12, :45-50); fixed under Floor 2. |
| STORY | kept | The five chapters come in order (s00 / s12–s32 / s45 / s60 / s75–s90), then the close (s100) and the 404 "This angle doesn't exist." (jury-404/desktop-s00). |
| FIRST VIEWPORT | kept | Desktop matches the contract (desktop-s00). On the phone the headline sits under the cube, not behind it (mobile-s00). That is the round-1 deviation, recorded in the Jury log with a legibility reason; it is accepted and lifts no score. |
| SIGNATURE | kept | Proof at desktop-s22/s32; the needle reads the live angle on every frame; the hand turn by keys works (desktop-rm-state-turn-keys); the two sizes compare on one stage (desktop-s60); reduced motion shows settled stills (desktop-rm-s12/s22/s32); the no-GL SVG keeps the readout (nogl-desktop-s50). |
| SCROLL MODEL | kept | Native + Lenis with sticky stages (`scrollMode: hook`; site.css:186). Lenis is still built with `smoothWheel: true` under reduced motion (src/lib/scroll.js:9), but the reduced-motion wheel lands on target in about 95 ms (probe), so the rendered behaviour matches. Logged under Source findings. |
| LOAD & CLOSE | not kept | The load is kept: no gate, a poster, and the light switches on after fonts are ready and the first GL frame (main.js:126-133). The close is not: at max scroll the 360° readout is off-screen and "Seen from" sits under the masthead scrim (desktop-s100). On the phone neither 360° nor the headline is on the last screen, and the action is half under the masthead (mobile-s100). The refund terms exist only inside a collapsed `<details>` (index.html:285-288). |

## Source findings
- `src/lib/scroll.js:9`: Lenis keeps `smoothWheel: true` under `prefers-reduced-motion`, although the contract says it is off there. No visible effect was measured (above).
- `src/lib/scroll.js:15`: `window.lenis` is exposed for capture; it ships in the release.
- `src/lib/raf.js:1-30`: a standalone ticker that is never used. Only `damp` and `clamp` are imported, by angle.js:5.
- `404.html`: no wordmark or masthead. Routes out are present.
- `index.html:277`: the close readout is a static "360°", while the bar shows the live angle (350° in mobile-s90).
- `index.html` `#turn-help`: arrow-key help is shown on coarse pointers (mobile-s45).
- The wordmark has no hover state: desktop-hover-2 and nogl-desktop-hover-2 match the rest state, and the probe found the computed style unchanged (`src/styles/site.css:120-126`).

## Material fixes
### Floor (uncapped: fidelity, walk 1 and 3, audit P0/P1)
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| `index.html:275-311`, `src/styles/site.css:320-326` | Move `.faq` above `.close-turn`. Add one visible refund line under the close action ("CHF 100 deposit, refundable until it ships."). Trim `.close` padding-top and `.close-turn` padding-bottom so readout + headline + action + refund line + `.meta` fit within 900 − 64 px and 844 − 64 px. | At max scroll the page shows "360°", the uncut "Seen from every side.", "Reserve a Cube", the refund line and the meta line | desktop 1440×900 s100; mobile 390×844 s100 | 20261021T080333-jury/manifest.json: desktop-s100.png, mobile-s100.png | pending | unresolved |
| `src/styles/tokens.css:45-50` (with `:11-12` and `src/styles/site.css:6`) | Redeclare `--muted`, `--line` and `--line-strong` inside `[data-theme="smoke"]` so they derive from the Smoke ink and ground. They currently resolve to about #646866 on #262826, ≈2.6:1. | Turn help, scene note, the "What it holds" and "Glass" legends, and the scale's non-current chapter links read at ≥ 4.5:1 in Smoke (DESIGN.md states 5.90:1) | desktop s45/s50, mobile s50, Smoke-themed scale | jury/desktop-s45.png, jury-desktop-states/desktop-s50.png, jury-mobile-states/mobile-s50.png; probe ratio ≈2.6:1 | pending | unresolved |
| `src/app/chrome.js:155` | In the nav scroll's `onComplete`, call `focusChapter` only while focus is still on the activating link or on `body`. Never move focus off an element the visitor focused during the 1.4 s scroll. | Click "180° Turn", focus the stage and press arrows before the scroll ends: focus and its ring stay on the stage | desktop full motion, state turn-keys | jury-desktop-states/desktop-state-turn-keys.png (ring on `h2#turn-title`); probe: focus moves to the h2 after settle | pending | unresolved |

### Craft (at most 5, inside the contract)
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| `src/styles/site.css:348` (`.scale` background) | Make the degree bar's ground opaque: `var(--ground)` instead of 92 %. | No caption, heading or readout shows through the bar or collides with its labels | desktop s22, s32, s50, s90; turn-keys | jury/desktop-s22.png, desktop-s32.png, desktop-s90.png; jury-desktop-states/desktop-s50.png | pending | unresolved |
| `src/styles/site.css:200-207` (`.ch-turn .ch-head` padding, `.turn-stage` width `min(50svh, 78vw)`) | At ≥ 1100 px, size the Turn table so stage + readout + help + controls end above the bar: either the head moves into a column beside the stage, or the stage height becomes `100svh` − head − controls − bar. | Arriving via "180° Turn" at 1440×900 shows the cube, the live readout and the turn, scene and glass controls together | desktop 1440×900, state turn-keys | jury-desktop-states/desktop-state-turn-keys.png; probe: readout 831 vs bar 836, controls 930–1009 | pending | unresolved |
| `src/app/chrome.js:185` (`r.top < mh * 0.5`), against `src/styles/site.css:10` (`scroll-padding-top` ≈ 60 px) | Flip the masthead to Smoke once the Turn section reaches the masthead's bottom edge (`r.top < mh`). | No paper band or gradient across the top of the Smoke chapter after the nav jump | desktop, states turn-keys and turn-orrery-smoke | jury-desktop-states/desktop-state-turn-keys.png, desktop-state-turn-orrery-smoke.png | pending | unresolved |
| `src/styles/site.css:250` (`.size-cube span, .size-card span`) | Keep the size captions on one line (`white-space: nowrap`), or break "Bank card / 85.6 mm" on purpose. | The bank-card caption reads on one or two lines, level with "Cube 10" and "Cube 20" | mobile 390, s60 | jury/mobile-s60.png; probe: label 49 px wide, 93 px tall | pending | unresolved |
| `src/styles/site.css:120-126` (`.wordmark`) | Author a fine-pointer hover in the button vocabulary: ink fill with ground text, or the accent point lit, at `--dur-feedback`. | The wordmark's hover frame differs visibly from its rest state | desktop hover | jury/desktop-hover-2.png, jury-nogl/nogl-desktop-hover-2.png (identical to rest) | pending | unresolved |

## Keep
The turn must survive every fix. That means one refracting glass cube whose angle is the page's progress, its nav and its proof; "held" bent through the glass at 0° (desktop-s00.png); the plate collapsing to a line at 90° (desktop-s22.png); and the single red spent only on light and the one action.

## Ceiling
Ceiling: The page never moves the visitor's own viewpoint: the product's claim is that you walk around the glass, yet every view of the image's back comes from turning the object, never from the camera leaning with the pointer or the phone's tilt the way a head moves around a real Cube.
