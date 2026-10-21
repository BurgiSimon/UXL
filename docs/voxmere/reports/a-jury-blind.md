# Jury report — index.html (Voxmere Cube) — 2026-10-21

disposition: fix
Design 7.7 · Usability 7.0 · Creativity 8.3 · Content 8.1 — weighted 7.65

> Run note: invoked with `--verdict`, but no earlier jury report (`.awards/jury/`), fix batch or `AWARDS.md` exists, so there was nothing to verify. A full jury pass was run instead. Offer: no direction contract exists; `/awards:craft` can write `AWARDS.md` (contract, Page map, Exceptions, Jury log), and a later verdict needs it.

## Evidence
- Target: `index.html`, a single-file build of 911,791 bytes (CSS and a base64 Mona Sans woff2 on line 16, markup on lines 17–504, the Three.js/GL bundle as `text/plain` on lines 505–4935, GSAP, ScrollTrigger, SplitText, Lenis and the app on lines 4937–4939). No `package.json`, `AWARDS.md`, `DESIGN.md` or `PRODUCT.md`. Doctor: ready (Chromium 141, headless WebGL2).
- Manifests (all from this pass, all valid, none older than the source):
  - `.awards/captures/20261021T084459-jury/manifest.json`: baseline s00/s50/s100 at desktop 1440×900, mobile 390×844 and desktop-rm, plus hover/focus control frames. `desktop-s00.png` was the only frame opened for the section-1 inventory. Valid.
  - `.awards/captures/20261021T084853-jury-chapters/manifest.json`: chapter coverage. No Page map exists, so positions were derived from the seven `data-chapter` sections measured in the DOM: 0 (0° hero), 11 (90° block), 25/33/41 (135° light: captions 1, 2, 3 of the sticky track), 53 (180° walk), 66/72 (270° sizes: bench, table), 84/90 (360° reserve: head, form and ledger), 100 (lap footer). Each position at desktop, mobile and desktop-rm, plus focus-1/2/3 and hover-2/3. All 38 frames opened and valid. s00, s50 and s100 differ. Scroll mode `hook`, so no virtual-scroll fallback was needed.
  - `.awards/captures/20261021T085029-jury-states-desktop/manifest.json`: named states at desktop and desktop-rm (the plan is kept in `interactiveStates`): hero-drag, hero-keys, skip-then-tab, walk-leman-side, walk-medusa, reserve-evening, pay-open, pay-escape, reserved. All 20 frames opened and valid.
  - `.awards/captures/20261021T085233-jury-states-mobile/manifest.json`: mobile states index-open, index-escape, walk-nautilus and pay-open, all opened and valid. The `walk-nautilus` element crop is taller than the viewport and shows an empty stage. A DOM-probe frame at viewport scroll showed the nautilus rendering (state `chapter: walk, subject: nautilus`), so the gap is a crop artefact, not a defect.
  - `.awards/captures/20261021T085303-nogl/nogl-manifest.json`: `--no-webgl` resilience at s00/s33/s55/s90 plus control frames. `glError: "no WebGL2"`, 0 canvases, the CSS-3D cube and DOM words render. Valid.
  - `.awards/captures/20261021T085326-jury-404/manifest.json`: `index.html?404` served over HTTP, desktop and mobile s00 plus control frames. Title "404°: nothing held here · Voxmere". Valid.
  - Neighbour finish-bar captures `.awards/neighbours/{oryzo,seasats,white-desert}/manifest.json`: exit 4, `net::ERR_TUNNEL_CONNECTION_FAILED` (the egress proxy refuses these hosts). The frames are unavailable, so the cards' §3 were used instead.
- Supplementary DOM probe (Playwright, this session): Tab order from the top (34 stops, every one with a 2 px accent `:focus-visible` ring), horizontal overflow 0 px at 320 and 390, touch-target sweep (one control under 44 px), element-at-point for a stray mark at desktop-s84 (it is the full stop of `p.sizes__line` passing under the 64 px topbar, not a defect).
- Transitional frames read as such: desktop-s25 and mobile-s25 (grey topbar band), desktop-s53 and mobile-s53 (grey page). These are the 1.4 s `--ground` crossfade caught mid-way (`index.html:16`, `html{transition:--ground var(--dur-hero)…}`). The settled frames desktop-rm-s25 and desktop-rm-s53 are correct. The mid-fade is still a real visitor state and is listed under Craft.
- Unmeasured: 200 % zoom, 40-character strings, real-device frame rate, throttled LCP, browser back after anchor navigation.
- Audit: `.awards/audit.json` (2026-10-21T08:45:41Z): P0 0 · P1 2 · P2 0 · P3 0, exceptions none. Both P1 are M03 at `index.html:4939` and were verified as false positives (see Floor).
- Console / page errors: 0 / 0 in every manifest above; failed requests 0 (neighbour captures aside).

## Scores
| Axis (weight) | Score /10 | One-line reason |
|---|---|---|
| Design (40) | 7.7 | A committed three-token world (bone `#E6E4DE`, ink `#1B1815`, signal orange) with degrees as the system's unit everywhere: ruler nav, mobile "Walk to" index, 404°, 360° close, themed scrollbar, selection and theme-color. It loses points to seams: the hero cube reads as a flat brown panel at rest (desktop-s00, mobile-s00), the light-chapter cube overhangs its dark section (desktop-s50), the evening preview is a hard black box (desktop-state-reserve-evening), mid-fade frames are muddy (desktop-s53), and daylight glass looks frosted grey (desktop-s11, desktop-s66). |
| Usability (30) | 7.0 | Capped at 7 by walk 2: the mobile chapter toggle is 41×44 px at "0°". Walks 1, 3, 4, 5, 6, 7 and 8 pass: full keyboard path, slider keys, trapped and inert index dialog, native modal deposit flow, reduced motion that keeps every state, a skippable real-signal loader. Without the cap the walk would sit near 8.5. |
| Creativity (20) | 8.3 | One concept does the feature list's work: scroll is a walk round the object from 0° to 360°. The dial, the turnable cube (GLASS from the front, LIGHT a quarter turn on) and the closing "360° Back where you started" plus lap count all enact "there is no front". Partly known moves remain (masked line reveal, sticky dark interruption, counter loader). |
| Content (10) | 8.1 | Specification-grade throughout: 16.7 M points at 0.02 mm, 256/512 slices, 6/21 days cooling, 3.1/21.6 kg, 45 W USB-C, under 24 dB(A), regional ship dates, an honest test-mode payment notice, authored 404 and footer. It loses points for metric-only units while shipping to the US/UK (desktop-s72), the hint claiming "You are walking around it" on mere Tab focus (desktop-state-skip-then-tab), and caption 1 "Unlit… you cannot see them" shown over lit points (desktop-s25). |
| **Weighted** | **7.65** | 7.7×0.4 + 7.0×0.3 + 8.3×0.2 + 8.1×0.1. SOTD territory (≥ 7.2, no axis < 6.8), but the audit has two P1s and there is no contract, so the result is `fix`. |

| Developer criteria | Score /10 | Note |
|---|---|---|
| Animation and interaction | 8.6 | One GSAP ticker drives Lenis, ScrollTrigger, the GL render and turn inertia. Damping is framerate-independent exponential decay (`Fs`, `exp(-4n)` velocity). The `scrub` triggers own no tween (they write progress in `onUpdate`). The GL clears and returns when no stage is visible. Reduced motion renders only on change. Transforms and opacity only. Minus: the time-based theme crossfade and the rig overhang at the light exit. |
| Performance | 7.4 | Entry JS 61 KB gz (GSAP, ScrollTrigger, SplitText, Lenis, app). Tiered DPR, `maxPixels`, point budget (20k/36k/56k) and a frame-time downscale. CLS 0.026 desktop, 0.0006 mobile. 498 DOM nodes, 1 canvas. Minus: the 143 KB gz GL bundle is evaluated lazily but downloaded inline ahead of the main script, so it is not a lazy chunk. The ~98 KB variable woff2 is base64-inlined into render-blocking CSS (107 KB gz). The whole document is 319 KB gz in one request. `lcpColdSynthetic` (140–312 ms) is a headless cold-cache asset-weight signal only and was not scored. |
| Responsive | 8.2 | A designed phone layout: the cube under a three-line headline, the degree ruler collapsed to a readout button and a full-screen "Walk to" index, a 2×2 subject grid, a 4-up view row and a reflowed spec table. No overflow at 320 or 390. `touch-action: pan-y` on drag stages, and vertical touch drags hand back to page scroll. Minus: the toggle is 41 px wide at ≤ 400 px. |
| Accessibility and semantics | 8.4 | Skip link to `main[tabindex=-1]`, labelled landmarks (`header`, 3 `nav`s, `main`, `aside`, `footer`), one h1, `lang`, table with `caption`/`scope`, SVG with `title`/`desc`, `role="slider"` with per-angle `aria-valuetext` ("from the side, it reads LIGHT"), loader `role="status" aria-live`, `aria-hidden` canvas over a DOM/CSS-3D mirror, `inert` behind the index dialog. Minus: `aria-current` sits on "360° Reserve" while the 404 is shown, and the 41 px target. |
| Code quality | 7.6 | 0 console or page errors in 6 passes. Full disposal on `pagehide`, `webglcontextlost` and loader skip (`ut()`, `index.html:4935`). One ticker, no debug logging. Minus: 558 KB of GL shipped as `text/plain` and re-injected through `script.textContent` (needs `'unsafe-inline'` under CSP, cannot be cached apart from the page). `window.__vx` and the test hook `window.__awards` ship in production. The minified single file hides the app's structure from the audit (the M03 false positive). |

## Memory test
What a visitor who left after one viewport describes an hour later — an object or a behaviour, never a mood:

A smoked-glass cube standing in the middle of the headline with the word GLASS glowing orange inside it, which you drag (or arrow-key) round to see from every side, under a nav that is a ruler of degrees from 0° to 360°.

## Specificity test
Could a juror name a source site from the first viewport? **no.** No DIVERGENCE block exists, so the comparison used the three nearest corpus cards by class, visitor mode and palette (`oryzo`, `seasats`, `white-desert`) and the `_index.md` palette and type columns. The palette shares a principle with `white-desert` §8 ("ink-on-bone plus one functional accent") and with `oryzo`'s single orange, but none of their hexes, faces or objects. The turnable volumetric cube and the degree-ruler navigation have no corpus precedent.

- oryzo — neighbour frame unavailable (proxy refused; compared with card §3, "expensive through … depth of field and a single warm key light on one mesh"). Finish gap: in daylight chapters the "clear" glass renders as a flat frosted grey-green slab with thin edge highlights and no depth, caustic or thickness cue. desktop-s11, desktop-s66 vs oryzo.md §3.
- seasats — neighbour frame unavailable (compared with card §3, "the ground itself cross-fades between acts", driven by scroll-trigger opacity tokens). Finish gap: Voxmere's day/night ground is a 1.4 s time-based transition with ink stepping at 0.7 s, so a fast scroll lands on muddy mid-fade frames: grey page, low-contrast pressed "Back 180°" chip, grey topbar band. desktop-s53, desktop-s25, mobile-s53 vs seasats.md §3.
- white-desert — neighbour frame unavailable (compared with card §3/§8, a specification register with dual units). Finish gap: the spec table, ledger and option rows are metric-only (cm, kg, litres) although the order form ships to the United States and the United Kingdom. desktop-s72, desktop-s90 vs white-desert.md §3.

## Slop scan
families present: 1
- Colour: bone ground plus hairline rules plus small tracked uppercase labels, the editorial-print register (desktop-s72, desktop-s90: "SIZE", "GLASS", "SHIP TO", "YOUR RESERVATION"; desktop-s53: "WHAT THE CUBE SHOWS"). The ground has a job in the room-light device (night at 135° via `data-theme="night"`, `index.html:126`; the Evening chip, `index.html:308`), so it reads as derived rather than defaulted, but no `## Exceptions` record says so.

Checked and absent or earned: no glass UI panels (the glass is the product, in GL). The orange floor glow belongs to the scene. No card grid, metric row or eyebrow over any h2. The 0°…360° markers carry the concept (viewing angle). One characterful grotesque (Mona Sans at 125 % width, weight 540) is held as the contract, with Mona Sans on the reflex list's alternatives, not its faces. No promise words, "Not X. A Y." or dash habit. Of the staple kit (counter preloader, full-screen index overlay, masked line reveal), the first two are reshaped to the world ("Writing light n / 48,000 points"; "Walk to" with degrees).

generator nameable: no

## Contract fidelity
| Block | Kept? | Evidence (capture, file:line) |
|---|---|---|
| THESIS | no contract on disk | observed: h1 "Glass that holds light." (`index.html:53`) made literal by GLASS written in light inside the cube, desktop-s00 |
| WORLD | no contract on disk | observed: three tokens plus a night theme (`index.html:16` `:root` / `[data-theme=night]`), degrees as the unit, themed browser surfaces; desktop-s00, desktop-s33, 404 desktop-s00 |
| STORY | no contract on disk | observed: 0° glass, 90° block, 135° light (interruption), 180° walk, 270° sizes, 360° reserve, lap close (`index.html:51-437`) |
| FIRST VIEWPORT | no contract on disk | observed: object, thesis, price and primary action all in desktop-s00 and mobile-s00 |
| SIGNATURE | no contract on disk | observed: turnable cube, GLASS to LIGHT by drag or keys (desktop-state-hero-drag, desktop-state-hero-keys) |
| SCROLL MODEL | no contract on disk | observed: native plus Lenis on the GSAP ticker, scroll mapped to the angle (dial needle), sticky 340svh light track (`index.html:16` `.light__track.is-staged`) |
| LOAD & CLOSE | no contract on disk | observed: point-writing loader with skip and repeat skip (`index.html:71-74`, `mu()` at `index.html:4939`); close "360° Back where you started" with lap count (desktop-s100) |

Visual fidelity cannot be judged without a contract. No block is "not kept", and none can be "kept" for `ship` until one is written.

## Source findings
- `index.html:4939` (minified app, hint handler bound with `addEventListener("keyup", l)` on `[data-turn="hero"]`): a Tab keyup arriving on the focused slider passes `:focus-visible`, so the hint changes to "You are walking around it. Keep going, or scroll on." before anything has turned (desktop-state-skip-then-tab).
- `index.html:4939` (chapter tracker `jl()`): on the 404 route `aria-current` and the dial needle sit on "360° Reserve" (404 desktop-s00, mobile-s00 readout "360°").

## Material fixes
### Floor (uncapped: fidelity, walk 1 and 3, audit P0/P1)
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| `index.html:4939` (audit M03 ×2) | Verified false positive. The three `scrub:!!u` triggers (`#block`, `#light`, `.light__track`) own no tween and only write progress in `onUpdate`. The flagged eases belong to the non-scrubbed hero line reveal, the `once:true` bench draw and GSAP's internal normalizeScroll tween; minification (`st.`/`L.create`) defeats the rule's call window. Record `M03 — <that reason>` under `AWARDS.md ## Exceptions` (create `AWARDS.md` via awards:craft), or emit the app script unminified so the audit can see `ScrollTrigger.create`. | No visual change; `audit.json` P1 0 | n/a (audit) | `.awards/audit.json` 2 × M03 | pending | unresolved |

Walk 1 (keyboard) and walk 3 (reduced motion) passed, and no contract exists, so there are no other floor items.

### Craft (at most 5, inside the contract)
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| `index.html:16` (`@media (max-width:400px){.dial-toggle{padding:0 12px}}`), markup `index.html:41` | Add `min-width:44px` (or `min-inline-size:2.75rem`) to `.dial-toggle`, centring the readout | The chapter toggle is ≥ 44×44 px at every angle, so walk 2 passes and the Usability cap lifts | mobile 390 and 320, rest state "0°" | `20261021T084853-jury-chapters/mobile-s00.png` (toggle ≈ 41 px wide; DOM probe 41×44) | pending | unresolved |
| GL hero stage (`index.html:4935`, the `hero` entry in the stage list feeding `fe()`/`se()`) | Give the hero rig a resting yaw and tilt like the CSS fallback (`.c3d` `--turn:-8`, `--tilt:-13`), keeping the yaw inside the ±12° band where GLASS still reads | At rest the first viewport shows a glass block with a visible side and top, not a flat brown rectangle on a black slab | desktop and mobile s00, full and reduced motion | `20261021T084853-jury-chapters/desktop-s00.png`, `mobile-s00.png` vs `20261021T085303-nogl/nogl-desktop-s00.png` | pending | unresolved |
| `index.html:16` (`.js .light__track.is-staged{height:340svh}` / `.js .is-staged .light__sticky`), GL stage weight in `se()` (`index.html:4935`) | Keep the light stage's plinth and floor glow inside the dark section: add bottom room to the staged track, or weight the `light` stage by its section's visible fraction rather than the stage box | At the 135°→180° exit the dark room's edge no longer cuts across the cube; no plinth or glow on the walk chapter's bone ground | desktop s50 (and rm) | `20261021T084459-jury/desktop-s50.png`, `desktop-rm-s50.png` (cube base ≈ 65 px below the dark edge) | pending | unresolved |
| `index.html:16` (`html{transition:--ground var(--dur-hero) …, --ink 0s step-end calc(var(--dur-hero)/2)}`) | Drive the day/night ground from the existing `lightOff`/`lightBack` scrub progress, or shorten the theme crossfade to ≤ .5 s with ink and ground switching together | Fast scrolls into and out of the light chapter never show a mid-grey page with dark-on-grey text or a near-invisible pressed chip | desktop and mobile s25 and s53 after a jump | `20261021T084853-jury-chapters/desktop-s53.png`, `desktop-s25.png`, `mobile-s53.png` | pending | unresolved |
| Evening backdrop quads `x`/`S` (`index.html:4935`, `uAlpha` driven by `Nt` when `room==="evening"`) | Feather the evening backdrop's edges (radial falloff to the ground) and clip the floor caustic to it | "Evening" reads as the room dimming around the cube, not a hard 558 px black square with orange glow leaking past its left edge | desktop reserve, Evening chip, full and rm | `20261021T085029-jury-states-desktop/desktop-state-reserve-evening.png`, `desktop-rm-state-reserve-evening.png` | pending | unresolved |

## Keep
Keep the angle model: scroll as a walk from 0° to 360° on the ruler, the cube that turns GLASS into LIGHT under drag and arrow keys, the headline seen through the glass, and the "360° Back where you started" lap close. No fix may replace the degree ruler with a conventional nav or flatten the hero's headline-through-glass.

## Ceiling
Ceiling: the page builds a whole room-light system (Daylight, Evening, the lights going down at 135°) yet never reads the visitor's own room, so neither local time nor colour scheme ever sets the light the Cube is first seen in.

## Jury log lines (not appended)
`AWARDS.md` does not exist, and this jury may not create it. The two lines below are for awards:craft to place under `## Jury log` once the file exists. `## Status` was not updated.

```
- 2026-10-21 · fix · D 7.7 / U 7.0 / C 8.3 / Co 8.1 → 7.65 · dev 8.6 / 7.4 / 8.2 / 8.4 / 7.6 · .awards/jury/2026-10-21.md
  top fixes: 1) record M03 exception or emit unminified app JS (index.html:4939) 2) mobile chapter toggle min-width 44px (index.html:16 .dial-toggle) 3) hero cube resting yaw/tilt so s00 reads as a block (index.html:4935)
```
