# Jury report — site-p/index.html (Voxmere Cube) — 2026-10-21

disposition: ship
Design 8.0 · Usability 7.0 · Creativity 8.4 · Content 8.5 — weighted 7.83

Mode note: invoked with `--verdict`, but no earlier `.awards/jury/*.md` report exists in this project. There was no fix batch to check, so this run scored the page from scratch (sections 0–6) and writes this full report instead of a `-verdict.md` file. No `AWARDS.md`, `DESIGN.md` or `PRODUCT.md` exists on disk, so there is no Page map, direction contract, DIVERGENCE block or Exceptions list. The juror chose stand-in neighbours from `references/sites/_index.md` (see Specificity test).

## Evidence
- Manifest (baseline): `.awards/captures/20261021T084503-jury/manifest.json`. Valid: yes. 0 console errors, 0 page errors, 0 failed requests. desktop/mobile/desktop-rm at s00 / s50 / s100. s00, s50 and s100 all differ. `scrollMode: hook` (`window.__awards`).
- Manifest (chapter coverage): `.awards/captures/20261021T084852-jury-chapters/manifest.json`. Valid: yes, 0 errors. Positions 0, 15, 25, 38, 50, 62, 70, 80, 90, 100 at desktop, mobile and desktop-rm. Without a Page map, the positions came from section offsets probed in the DOM: Light 0 %, Glass 10.6–46.5 % (three beats at s15 / s25 / s38), Turn 46.5–57 % (s50), Sizes 57–77 % (s62, s70), Reserve 77–98 % (s80, s90), Close (s100). Mobile offsets are similar: Glass 9–43 %, Turn 43–55 %, Sizes 55–72 %, Reserve 72–96 %. Every frame was opened. None is blank, flat or stuck. desktop-rm-s00 and desktop-rm-s100 match their full-motion frames pixel for pixel. The middle frames differ only because the reduced tier snaps the angle per chapter.
- Hover and focus-visible frames: `desktop-focus-1` (Skip to content), `desktop-focus-2` (wordmark), `desktop-focus-3` (Reserve), `desktop-hover-2`, `desktop-hover-3`. Every frame reports `matched: true`. Hover and focus states are authored: an ink fill and a 2 px red ring.
- Manifest (desktop states): `.awards/captures/20261021T085033-jury-states-desktop/manifest.json`. These states are valid: `turn-plus90`, `turn-keyboard`, `scene-orrery-smoke`, `choose-10`, `checkout-open`, `checkout-errors`, `checkout-escape`. `nav-keyboard-glass` in this pass is invalid: it was captured mid-scroll (blank ground, masthead drawn at the bottom). It was replaced by the next manifest.
- Manifest (desktop states, recapture): `.awards/captures/20261021T085840-jury-states-desktop2/manifest.json`. Valid: yes, 0 errors. `nav-keyboard-glass` (6 s settle) and `tab-from-top`.
- Manifest (mobile states): `.awards/captures/20261021T085252-jury-states-mobile/manifest.json`. Exit 2 from a plan error, not a site error: the plan clicked `.scale-reserve`, which is `display:none` while a primary CTA is in view (by design). `menu-open`, `menu-escape` and `turn-plus90` are valid.
- Manifest (mobile states, recapture): `.awards/captures/20261021T085416-jury-states-mobile2/manifest.json`. Valid: yes. `checkout-open` and `reserve-slip`.
- Resilience: `.awards/captures/20261021T085353-nogl/nogl-manifest.json`. Valid: yes. `webgl: false`, `quality: low`, 0 errors. `nogl-desktop-s00` shows the SVG line still and all the text.
- Each manifest keeps its interaction plan in `interactiveStates` for replay.
- Neighbour frames: `.awards/neighbours/{seasats,oryzo,the-line}/manifest.json`. All three runs exited 4 (unreachable from the capture browser). Neighbour frames are unavailable; the finish bar uses each card's §3.
- Audit: `.awards/audit.json` (2026-10-21T08:47:49Z, 1 file scanned, the built single-file bundle). P0 0 · P1 0 · P2 1 · P3 0. The P2 is X09 at index.html:23. Exceptions: none (there is no AWARDS.md).
- Console / page errors: 0 / 0 across every site pass.
- Metrics (desktop / mobile): CLS 0.0085 / 0.0037 (chapters pass 0.001 / 0.0008). DOM nodes 507. 1 canvas. WebGL2 on SwiftShader, tier `mid`. `lcpColdSynthetic` 988 ms and 404 ms desktop, 108–300 ms mobile. These are headless cold-cache numbers, cited only as a rough asset-weight signal, never as LCP. Idle frame rate with the stage mounted, measured headless: 41 fps desktop, 51 fps mobile.
- Size: index.html is 1,065,100 B raw and 337 KB gzipped. Entry script (GSAP + ScrollTrigger + Lenis 1.3.26 + app): 58 KB gz. Three.js r186 stage module: 149 KB gz, inlined as `text/plain` (index.html:411) and evaluated lazily through a blob import. One variable Mona Sans woff2 is inlined (index.html:25).

## Scores
| Axis (weight) | Score /10 | One-line reason |
|---|---|---|
| Design (40) | 8.0 | A committed world. The ground is a cool glass-green #e6eae7 with ink #141917, and one red #c8260f is the light inside the cube; that red also carries the needle, degree numerals, focus ring and selection. One variable grotesque is held from the 170 px display down to the rail labels, and the ruler is the chrome. Seams: the close at desktop-s100 drops the object and leaves the right 45 % empty; the plinth renders as a flat unlit slab (desktop-s00, desktop-s15); no 404 is shipped. |
| Usability (30) | 7.0 | Capped at 7 by walk 6: the chapter rail still reads "0° Light" after jumping to Glass (desktop-state-nav-keyboard-glass), and no 404 is shipped. Without the cap this would sit near 8.2. Walks 1–5, 7 and 8 pass: skip link, slider with arrow keys, native dialog with an error summary, a live announcer, three motion tiers and a no-GL still. |
| Creativity (20) | 8.4 | The page is measured in degrees. Scrolling turns the cube 0→360° on its protractor while the rail counts the angle. The Glass beats (window, plate, volume; desktop-s15 / s25 / s38) perform the product argument: a plate becomes a line at 90°, while the volume keeps its back at 180°. The "Light, held." headline is refracted through the glass at s00. The product turntable itself is a known category move, which holds this below 9. |
| Content (10) | 8.5 | Specification-grade throughout: 100 × 100 × 100 mm / 3.9 in, 512 points per side, 30 volumes a second, 1,000 lux, 3.1 kg / 6.8 lb, ship dates by region, a VAT note, deposit terms and a labelled demo checkout. Each scene has a precise note ("13 contour lines"). The one miss is a keyboard-only hint shown on phones (mobile-s50). |
| **Weighted** | 7.83 | 8.0×0.4 + 7.0×0.3 + 8.4×0.2 + 8.5×0.1. SOTD threshold is ≥ 7.2 with no axis < 6.8: met. |

| Developer criteria | Score /10 | Note |
|---|---|---|
| Animation and interaction | 8.6 | One GSAP ticker drives Lenis (`lagSmoothing(0)`), the scroll→angle state, the UI and the GL stage (index.html:22, the `uc` and `gi.ticker.add` calls). Damping is framerate-independent, using `1-exp(-k·dt)`. The scroll angle is computed rather than tweened, so no eased scrub (M03 clean). The stage renders only when its state hash changes, pauses on `visibilitychange` and handles `webglcontextlost` (index.html:11995–12036). Weakness: the tier probe samples fps before the scene mounts, so a SwiftShader device still lands on `mid` with full GL. |
| Performance | 7.6 | Entry JS is 58 KB gz. DPR is capped at 1.5 / 2 (index.html:11845). CLS ≤ 0.009, DOM 507. However, the 149 KB gz Three module and the ~100 KB font travel inside the HTML on every load: the GL is lazy in execution but not in transfer. |
| Responsive | 8.0 | The phone layout is designed, not shrunk: cube over headline, and the rail becomes a "0° Light" readout pill plus Reserve (mobile-s00, mobile-state-menu-open). No page overflow at 320 / 390 / 720 px. The drag stage declares `touch-action: pan-y`, and hover is guarded by `@media (hover:hover)`. Rough edges: orphaned "mm" in the phone spec table (mobile-s62), "Choose Cube 10" wrapping to two lines (mobile-s70), keyboard hint on touch (mobile-s50). |
| Accessibility and semantics | 8.6 | Skip link to `main#main[tabindex=-1]`, one h1, `lang`. The canvas is `aria-hidden` with SVG stills (`role=img`, aria-label) as the DOM mirror. The turn stage is `role=slider` with `aria-valuetext`. There is a `role=status` announcer, a `role=alert` error summary with links to fields, a native `<dialog>` that returns focus, `aria-current="step"` on the rail, native radios and `<details>`. All three motion tiers are present, and Lenis `respectReducedMotion` is on by default. |
| Code quality | 7.8 | 0 console and 0 page errors in every pass, and disposal is implemented. Weaknesses: `og:image` / `twitter:image` point to `og.png`, which is not in the deliverable (index.html:14, 19); no 404 file; the `window.__awards` test hook ships in production (index.html:22). |

Developer mean: 8.12.

## Memory test
"A glass cube sitting on a protractor dial with a red dotted pyramid floating inside it, and the page counted along the bottom in degrees as if scrolling walks you around the object."

## Specificity test
Could a juror name a source site from the first viewport? No. The palette register (cool grey ground, near-black ink, one hot red, one variable grotesque) is close to `the-line`'s cool-silver + flare-red pairing, but the first viewport's object, a refracting glass cube on a graduated turntable with the page counted in degrees, belongs to no card in the index.

Neighbours are the juror's stand-ins because there is no DIVERGENCE block: seasats (B2B hardware, specification), oryzo (single-object launch), the-line (nearest palette and type register).
- seasats — neighbour frame unavailable (capture exit 4). Per card §3, Seasats gives its specs a separate label voice on an artboard-locked scale. Here, spec labels and values share size and face and are separated by grey alone (desktop-s62), and on phones the values wrap into orphaned "mm" lines (mobile-s62).
- oryzo — neighbour frame unavailable (capture exit 4). Per card §3, Oryzo's single mesh reads as expensive through grain, depth of field and one warm key light. Here, the plinth that carries the cube is a flat, unlit dark slab, and the glass base shows a blurred transmission band at the mid tier (desktop-s00, desktop-s15, desktop-s80), so the object reads as CG rather than machined.
- the-line — neighbour frame unavailable (capture exit 4). Per card §3, The Line holds one material policy (zero radius, depth by luminance). Here three radius policies coexist: 999 px pills on every action, square option rows and fields in the reservation form (desktop-s80), and a 24 px rounded focus box on the turn stage (desktop-state-turn-keyboard).

## Slop scan
families present: 1
- Surface: graph-paper lines / pinstripes. Audit X09 (P2) flags index.html:23, the `.scale-track` repeating-linear-gradient. In substance this use is earned: the ticks are degrees (36 minor ticks of 10°, 4 majors of 90°), and the chapter labels sit at their angles on them. It is counted only because no `## Exceptions` entry records the reason.
- Judge rows walked against the captures with nothing found: one family for everything (Mona Sans held as a display-scale contract, so earned); no reflex face (T01 clean); no dark + neon (light glass-green ground, red derived from the light in the cube); no template order (chapters keyed to the angle, with the Turn chapter as a smoke-glass interruption); no fade-and-rise on every section, no staple kit (no preloader, cursor, marquee, fullscreen overlay or magnetic button); no slogan habit or promise words.
generator nameable: no

## Contract fidelity
| Block | Kept? | Evidence (capture, file:line) |
|---|---|---|
| THESIS | not applicable | No AWARDS.md on disk. The inferred thesis (a true 3D image held in glass that you can walk around) is visible at desktop-s00. |
| WORLD | not applicable | No contract. The rendered world is consistent across every capture, including the smoke-themed Turn chapter (desktop-s50). |
| STORY | not applicable | No contract. |
| FIRST VIEWPORT | not applicable | No contract. |
| SIGNATURE | not applicable | No contract. |
| SCROLL MODEL | not applicable | No contract. |
| LOAD & CLOSE | not applicable | No contract. |

No block can be "not kept" without a contract, so fidelity does not enter the disposition.

## Material fixes
### Floor (uncapped: fidelity, walk 1 and 3, audit P0/P1)
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| — | none: walks 1 and 3 pass, the audit has no P0/P1, and there is no contract to break | — | — | 20261021T084852-jury-chapters/manifest.json | — | — |

### Craft (at most 5, inside the contract)
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| index.html:22, bundled app `bc()` / `xc()` (the glass chapter entry uses `from: vc.from`, the start of `.story`) | Start the Glass chapter at the `#glass` section top (as the other chapters do, `c(#glass) - e*0.5`) so `aria-current` and the readout switch when the Glass title arrives | After a jump to "30° Glass", the rail marks "30° Glass" as current while the Glass h2 is in view (walk 6) | desktop, state nav-keyboard-glass; mobile s15 | 20261021T085840-jury-states-desktop2/manifest.json + desktop-state-nav-keyboard-glass.png | pending | unresolved |
| footer `#close` (index.html markup ~l.282–320); stage anchors `[data-stage]` and the close segment `{id:'close', a0:350, a1:360}` in `bc()` (index.html:22) | Add a stage anchor in the close so the cube finishes its turn at 360° beside "Seen from every side." | desktop-s100 shows the cube at 0/360° in the empty right half, next to the red "360°" | desktop s100; mobile s100 | 20261021T084852-jury-chapters/manifest.json + desktop-s100.png | pending | unresolved |
| deliverable root (only index.html ships) | Ship a 404 in the world: same ground, ink and red, the rail and a link back to `#light` (template `assets/templates/404.html`) | An authored 404 with a way back (walk 6) | desktop, mobile | directory listing on 2026-10-21 (index.html only) | pending | unresolved |
| index.html:136 `#turn-help` | Under `(pointer: coarse)`, swap the arrow-key help for a touch hint (drag, swipe, the 45° buttons) | The phone Turn chapter no longer tells a touch visitor to use arrow keys | mobile s50; mobile turn-plus90 | 20261021T084852-jury-chapters/mobile-s50.png; 20261021T085252-jury-states-mobile/mobile-state-turn-plus90.png | pending | unresolved |
| index.html:14 and :19 (`og:image`, `twitter:image` = `og.png`) | Ship the 1200×630 `og.png` beside index.html, or point the tags at a file that exists | Share cards show the cube instead of a broken image (S06) | link unfurl | audit run 2026-10-21; directory listing (no og.png) | pending | unresolved |

## Keep
The page measured in degrees: scrolling turns the cube on its protractor while the rail counts the same angle. Never replace the rail with a generic progress bar, and never decouple the rail from the cube.

## Ceiling
Ceiling: the two crossing infrared beams that actually draw the image are only described in the Glass copy (desktop-s38) and never shown sweeping the block, so the product's mechanism stays an assertion.

## Log
Not appended: no `AWARDS.md` exists in the project, and this jury does not create one. When `/awards:craft` creates it, these two lines belong under `## Jury log`:
- 2026-10-21 · ship · D 8.0 / U 7.0 / C 8.4 / Co 8.5 → 7.83 · dev 8.6 / 7.6 / 8.0 / 8.6 / 7.8 · .awards/jury/2026-10-21.md
  top fixes: 1) Glass chapter readout lag (index.html:22 bc/xc) 2) cube absent from the 360° close (#close) 3) no 404 shipped
