# Jury verdict — Voxmere Cube (index.html, built from src/) — 2026-10-21

disposition: ship
Design 7.8 · Usability 7.7 · Creativity 8.4 · Content 8.2 — weighted 7.93
1. Theme flip: switch the ink discretely at the ground's midpoint instead of tweening it over 420 ms, so no frame holds mid-grey ink on a mid-grey ground (`src/styles/base.css:15-16`; p320-mobile-s45 reads 1.41:1)
2. Phone turn: scale the phone hero rig by 1 / (|cos θ| + |sin θ|) of the current turn, so the turned Cube stays inside the 16 px gutters (`src/js/gl/scene.js:251,317`, `src/styles/main.css:230`; p320/p390 `*-state-signature-drag-phone`)
3. Phone header: keep the "Voxmere" wordmark text under 400 px and show the chip as the angle only, with the chapter name kept in its accessible name (`src/styles/main.css:109-111`; mobile-s00, p320-mobile-s20)

Phase 7, jury round 2 of 2 (verdict on the ship batch from `.awards/ship/2026-10-21.md`). The round-1 report `.awards/jury/2026-10-21.md` stays intact.

## Evidence
- **Primary manifest:** `.awards/captures/20261021T081619-ship/manifest.json`, valid: yes.
  - 48 frames captured 08:16–08:19Z. No source file is newer (the newest, `src/styles/base.css` and `src/js/gl/scene.js`, date from 08:15:16Z).
  - Console 0 · page 0 · failed requests 0.
  - `__awards` hook present, `scrollMode: hook`, WebGL true (desktop tier mid, mobile tier low).
- **No-WebGL manifest:** `.awards/captures/20261021T081947-nogl/nogl-manifest.json`, valid: yes. 13 frames, `gl: false`, 0 canvases, 0 errors.
- **Fresh manifests for this verdict**, each a new timestamped directory, captured one at a time under `.awards/capture.lock`:
  - `.awards/captures/20261021T082531-verdict320/p320-manifest.json` closes the 320 px gap that ship left uncaptured.
    - 320×693, s00–s100 at the nine Page-map stops.
    - States: `signature-drag-phone` (drag at phone coordinates), `walk-nautilus-side`, `reserve-configured`, `pay-sheet`, `keyboard-first-tab`.
    - 0 console, page or request errors.
  - `.awards/captures/20261021T082617-verdict390/p390-manifest.json`: 390×844 s00 plus `signature-drag-phone`. This replaces the round-1 frame that replayed desktop coordinates. 0 errors.
  - `.awards/captures/20261021T082748-verdict404/lost-manifest.json` covers the 404 because the hero and top bar it shares changed in the batch.
    - Route `#/somewhere-else`: desktop, mobile and desktop-rm at s00 and s100.
    - 5 control frames, all `matched: true`.
    - 0 errors.
- **Live DOM probe** (Playwright, read-only) at 320×693 and 390×844, through top, light, walk, sizes and reserve:
  - The header Reserve is 96 × 44 px, with its right edge at 304 / 374, and `scrollWidth` equals the viewport in every chapter.
  - Home link "Voxmere, back to the start"; the skip link goes to `#main`.
  - The hero is `role=slider` with `touch-action: pan-y`; 1 h1 and 1 main.
- **Coverage.** Every frame below was opened. None is blank, a flat colour or a stuck preloader, and s00, s45 and s100 differ.
  - Row 1, hero (0°):
    - desktop-s00, mobile-s00, desktop-rm-s00, p320-mobile-s00, p390-mobile-s00
    - `*-state-signature-key-90`, `*-state-signature-drag`, `*-state-keyboard-first-tab`
    - p320 and p390 `*-state-signature-drag-phone`, p320-mobile-state-keyboard-first-tab
  - Row 2, the block (90°): s08 on desktop, mobile, desktop-rm and p320.
  - Row 3, the light (135°): s20, s32 and s45 on all four passes, plus nogl-desktop-s45 and nogl-mobile-s45.
  - Row 4, walk around (180°):
    - desktop-s58, desktop-rm-s58
    - `*-state-walk-nautilus-side`, `*-state-walk-leman-front`, p320-mobile-state-walk-nautilus-side
  - Row 5, two sizes (270°): desktop-s70, desktop-rm-s70, mobile-s58, mobile-s70, p320-mobile-s58, p320-mobile-s70.
  - Row 6, reserve (360°):
    - s82 on all passes
    - `*-state-reserve-configured`, `*-state-pay-sheet`, p320 reserve-configured and pay-sheet, nogl-*-s82
  - Row 7, footer: s100 on all passes, plus nogl-*-s100.
  - Row 8, 404°: lost-desktop-s00 / s100, lost-mobile-s00 / s100, lost-desktop-rm-s00 / s100.
  - Control frames: lost-desktop-focus-1 / 2 / 3 and lost-desktop-hover-2 / 3. Focus rings are authored; hover is a colour swap.
- **Audit:** `.awards/audit.json` (2026-10-21T08:15:25Z, newer than every source): P0 0 · P1 0 · P2 0 · P3 0. Exception M03, for the ease strings inside the inlined, minified GSAP; the reason is accepted.
- **Console / page errors:** 0 / 0 in all five manifests.
- **Metrics:**
  - 498 DOM nodes, 1 canvas
  - CLS 0.026 desktop, 0.0006 at 390, 0.0008 at 320
  - `index.html` 911,699 B raw / 319,245 B at gzip -9
  - `lcpColdSynthetic` 228 ms desktop / 108 ms mobile. This is a headless cold-cache software-GL number, read only as an asset-weight signal, never as performance.
- **Neighbours:** not recaptured in verdict mode. Round 1 found all three card URLs refused by the egress proxy (exit 4).

## Scores
| Axis (weight) | Score /10 | One-line reason |
|---|---|---|
| Design (40) | 7.8 | The world holds end to end, and the phone first viewport now carries the headline behind the smoke glass (mobile-s00). Captions are clear of the title (desktop-s32), and the evening is a hard-edged niche (desktop-state-reserve-configured). Four smaller seams remain: the turned phone Cube clips at both edges (p320-mobile-state-signature-drag-phone), low-tier glass edges stair-step at 84 vw (mobile-s00), the grey flip window is still there (p320-mobile-s45), and the bench Cubes stand 31 px apart (desktop-s70) |
| Usability (30) | 7.7 | No walk cap remains. There is a keyboard path for every gesture, touch turn with `pan-y`, three reduced-motion tiers, no gate, a 44 px header action at 320 and 390 in every chapter (probe), an authored 404 and a test payment. Friction: twice per visit a ~420 ms flip drops copy and the chip to 1.2–2.6:1 (p320-mobile-s45, nogl-mobile-s45), and on the phone the configured preview sits above the viewport while choosing (mobile-state-reserve-configured) |
| Creativity (20) | 8.4 | The interaction is the argument, now on the phone as well. The h1 is seen through the glass (mobile-s00), Shift+→ turns GLASS into LIGHT (mobile-state-signature-key-90), and a phone drag shows the mirrored back (p390-mobile-state-signature-drag-phone). The dial, the laps footer and the 404° reuse the one metaphor. No cap applies |
| Content (10) | 8.2 | Numbers instead of adjectives: 16.7 M points, 8 litres, 21.6 kg, ship month by country, 123 of 500 left. Registers switch at Two sizes. Round-1 slips are still there: the 404 footer says a lap was walked (lost-desktop-s100), and two zero forms sit side by side, "Cube 1Ø" in the table header against "Cube 10" on the bench label (desktop-s70) |
| **Weighted** | **7.93** | 7.8×0.4 + 7.7×0.3 + 8.4×0.2 + 8.2×0.1 = 3.12 + 2.31 + 1.68 + 0.82. SOTD territory: ≥ 7.2 with no axis < 6.8 |

| Developer criteria | Score /10 | Note |
|---|---|---|
| Animation and interaction | 8.4 | One `gsap.ticker` clock, exponential damping, scrubs written through `onUpdate` with no ease, and GL renders on change. Lost points: the ink still tweens over 420 ms across the ground's midpoint (`src/styles/base.css:15-16`) |
| Performance | 8.0 | One self-contained file at 319 KB gz. Entry 59.7 KB gz; the GL chunk (140.6 KB gz) is evaluated after first paint. DPR is capped per tier, 498 nodes, CLS ≤ 0.026. Throttled LCP is 1.38 / 1.11 s per the ship report. The GL bytes still ride the critical download because the build is a single file |
| Responsive | 7.8 | The header fits at 320 and 390 with a 44 px pill and no overflow (probe). The phone hero is designed around the device (mobile-s00), and the skip link is in flow (mobile-s20). Lost points: the turned phone Cube clips at both edges, chip names ellipsise at 320 ("128° The lig…", p320-mobile-s20), and the wordmark text is hidden under 400 px |
| Accessibility and semantics | 8.4 | `lang`, one h1, one main. The canvas is `aria-hidden` and every subject has DOM text. The slider has `aria-valuetext`, the payment sheet is a native modal, and the phone index is trapped with `inert`. The skip link lands on `main`; focus rings are authored (lost-desktop-focus-1–3). The caption overprint is gone. Lost points: mid-flip contrast drops to 1.2–2.6:1 |
| Code quality | 8.3 | 0 console, page or request errors in five manifests, disposal on `pagehide`, no debug logging, and the audit is clean. The dead `--font-mono` token remains (`src/styles/tokens.css:16`) |

### Usability walk
- walk 1 — pass:
  - The skip link comes first and goes to `#main` (desktop-state-keyboard-first-tab, p320-mobile-state-keyboard-first-tab, probe).
  - The slider takes keys (desktop-state-signature-key-90).
  - The dialog and phone-index keyboard paths were not touched by the batch; the round-1 probe stands.
- walk 2 — pass (round-1 fail resolved):
  - The header Reserve is 96 × 44 px at 320 and 390 in all five chapters (probe).
  - `touch-action: pan-y`, and a phone drag turns the Cube (p390 / p320-mobile-state-signature-drag-phone).
- walk 3 — pass:
  - desktop-rm frames read at rest, and the theme flips instantly (desktop-rm-s20, desktop-rm-s58).
  - Views change by cut (desktop-rm-state-walk-*), and the configurator still responds (desktop-rm-state-reserve-configured).
- walk 4 — pass: there is no gate. The h1, label and action paint first (desktop-s00, mobile-s00).
- walk 5 — pass:
  - mobile-s00 answers what it is, what it costs and what to do within 844 px.
  - At 320×693 the header Reserve carries the action (p320-mobile-s00).
- walk 6 — pass:
  - The angle chip shows where you are, the logo goes home, and the 404° offers three routes out (lost-desktop-s00, lost-mobile-s00).
  - Seam: the 404 dial still reads "360° Reserve".
- walk 7 — pass: the header Reserve is present in every chapter (probe), the tombstone and footer repeat it, and the pay sheet opens (p320-mobile-state-pay-sheet).
- walk 8 — pass (round-1 fail resolved):
  - The no-GL path sells and reserves (nogl-desktop-s00…s100, nogl-mobile-s82).
  - At 320 px, `scrollWidth` is 320 in every chapter (probe).

## Memory test
A dark glass block standing in the middle of the headline with the word GLASS glowing orange inside it, under a menu that is a 0° to 360° ruler you turn by dragging the glass.

(Written from desktop-s00 before the contract was read. A later fact check: the ruler measures the scroll walk, not the hand turn. The sentence stays as written.)

## Specificity test
No. desktop-s00 is unchanged from round 1, and the phone now carries the same device (mobile-s00).

Finish bar (neighbour frames were unavailable in round 1, so each line uses the card's §3):
- **oryzo** — neighbour frame unavailable.
  - Card §3: one warm key light on one mesh reads as expensive.
  - Here: the low-tier glass and plinth edges stair-step, now at 84 vw in the phone first viewport (mobile-s00 at y≈405 / 1025 @2x; p320-mobile-state-signature-drag-phone).
- **seasats** — neighbour frame unavailable.
  - Card §3: a stacked cross-fade, so ink never meets ground.
  - Here: a 420 ms ink tween still crosses the mid-grey ground (p320-mobile-s45 at 1.41:1, nogl-mobile-s45 at 2.63:1).
- **son-daven** — neighbour frame unavailable.
  - Card §3: one treatment gives one texture.
  - Here: the bench now draws square-on with centred labels, but the two Cubes stand on floors 31 px apart (bases end at y 309 and y 278 over a ruler at y 327). The 10 cm ticks at x 720 and 873 also miss Cube 20's left edge at x 750 (desktop-s70).

## Slop scan
families present: 1
- Quality (body text below 4.5:1), transient mid-flip:
  - p320-mobile-s45: 1.41:1. p320-mobile-s20: the chip at 1.17:1. nogl-mobile-s45: 2.63:1.
  - Source: `src/styles/base.css:15-16`.
  - The round-1 Layout family is cleared (desktop-s32, mobile-s20, p320 top bars).

generator nameable: no

## Contract fidelity
| Block | Kept? | Evidence (capture, file:line) |
|---|---|---|
| THESIS | kept | GLASS at 0° (desktop-s00, mobile-s00) becomes LIGHT at Shift+→ (desktop-state-signature-key-90, mobile-state-signature-key-90). Subjects show their other sides (desktop-state-walk-nautilus-side, -leman-front) |
| WORLD | kept | Limestone, smoke and 612 nm tokens. Exactly one dark chapter (desktop-s32). Glass only on the object; the DOM is flat and hairline-only (desktop-s70) |
| STORY | kept | 0° → 360° chapters with one interruption and its skip (mobile-s20, now in flow). Registers switch at Two sizes (desktop-s70). The flow runs to the sheet (p320-mobile-state-pay-sheet). The close reads GLASS (desktop-s100) |
| FIRST VIEWPORT | kept (was not kept on the phone) | At 390, "Glass / that holds / light." sets on three lines, with the middle line darkened behind the smoke glass. The glass is 329 px ≈ 84 vw; the tombstone action and header Reserve are in view (mobile-s00). At 320, the same composition (p320-mobile-s00). Note: the top-bar wordmark text is hidden under 400 px (regression 3) |
| SIGNATURE | kept | Drag (desktop-state-signature-drag; p390 / p320-mobile-state-signature-drag-phone), keys (`*-state-signature-key-90`), `role=slider` and `pan-y` (probe), view buttons (`*-state-walk-*`), configurator preview (desktop-state-reserve-configured), CSS-3D fallback (nogl-desktop-s00) |
| SCROLL MODEL | kept | Native document scroll plus Lenis. Anchors drive every state plan (`.lap__colophon a[href="#walk"]`), and `scrollMode: hook` |
| LOAD & CLOSE | kept | No gate (desktop-s00). The close at 360° carries GLASS, laps, "123 of 500" and the reserve action (desktop-s100, p320-mobile-s100). 404° shows an empty Cube and three routes out (lost-desktop-s00, lost-mobile-s00) |

## Verdict
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| **Floor.** `src/styles/main.css:226-231` phone hero; `src/js/gl/scene.js:251` `ePhone: 0.84` | Phone h1 on three lines, with the stage rising so the middle line passes behind the glass at ≈78 vw | At 390, "holds light." is seen darkened through the glass, the Cube is about 300 px, and the header Reserve stays in view | mobile 390 · s00, key-90 | `20261021T074145-jury` mobile-s00, mobile-state-signature-key-90 (glass 167 px, no overlap) | `20261021T081619-ship` mobile-s00, mobile-state-signature-key-90: "that holds / light." behind the glass, which is 329 px; Reserve 96×44 in view. `20261021T082531-verdict320` p320-mobile-s00 | resolved |
| `src/styles/main.css` darkroom staging; `src/js/score.js` light-spread | One sticky caption lane under the title; the phone skip link moves into flow | No caption prints over "Then we taught it to hold light."; the phone skip link is clear of the h2 | desktop, desktop-rm · s32 / s45; mobile · s20 | `20261021T074145-jury` desktop-s32, desktop-rm-s32, mobile-s20 | `20261021T081619-ship` desktop-s32, desktop-s45, desktop-rm-s32, mobile-s20; `20261021T082531-verdict320` p320-mobile-s20 | resolved |
| `src/styles/base.css:6-7,15-16` (`@property --ground / --ink`) | The ground fades over 1.4 s; the ink tweens over 420 ms, centred on the ground's midpoint | Wordmark, dial and copy stay legible during both flips; no grey-on-grey frame | desktop · s20 / s58; mobile · s20 / s58; no-GL · s45 | `20261021T074145-jury` desktop-s20, desktop-s58, mobile-s58 | Legible in `20261021T081619-ship` desktop-s20, desktop-s58, mobile-s20, mobile-s58. Grey-on-grey still in `20261021T082531-verdict320` p320-mobile-s45 (h2 and body 1.41:1), p320-mobile-s20 (chip 1.17:1), and `20261021T081947-nogl` nogl-mobile-s45 (2.63:1). The ink still passes through mid-grey for 420 ms | partial |
| `src/styles/main.css:41-48, 90-111` top bar under 900 px and under 400 px | `auto minmax(0,1fr) auto` grid, ellipsised chip, header Reserve `min-height: 44px` | Glyph, chip and the full Reserve pill fit inside 16 px gutters at 320 and 390 in every chapter; the pill is ≥ 44 px | mobile 390 and 320 · all chapters | `20261021T074145-jury` mobile-state-walk-nautilus-side (glyph gone, pill 6 px from the edge); round-1 probe at 320 (pill edge at 384 px) | `20261021T081619-ship` mobile-s00 / s20 / state-walk-nautilus-side; `20261021T082531-verdict320` all p320 frames; probe: 96×44, right edge 304 / 374, `scrollWidth` = viewport in all 5 chapters | resolved |
| `src/index.html` bench SVG; `src/styles/main.css` `.bench__caption`; `src/js/gl/scene.js` sizes rig | Labels centred inside the drawing; both rigs face their view ray (no wedge) | "Cube 10" and "Cube 20" sit centred under their blocks, with edges square to the ruler and dimension lines | desktop, desktop-rm · s70; mobile · s58 | `20261021T074145-jury` desktop-s70 (labels about 110 px left, perspective wedge), desktop-rm-s70, mobile-s58 | `20261021T081619-ship` desktop-s70: label centres at 490 / 903 under blocks 413–567 / 750–1057, square-on. Also desktop-rm-s70, mobile-s58, p320-mobile-s58 | resolved |
| `src/js/gl/scene.js:103-106,150-153,407-418` evening alcove | Planes fitted to the reserve stage rect, `uSoft` 0, night token | Evening reads as a dark niche around the Cube, not a feathered box | desktop, desktop-rm · reserve-configured | `20261021T074145-jury` desktop-state-reserve-configured (feathered box) | `20261021T081619-ship` desktop-state-reserve-configured, desktop-rm-state-reserve-configured: a hard-edged niche at x 93–651, y 160–718. Residue: the daylight floor haze still shows outside it (x 0–93 and 651–760, y 680–720) | resolved |

Tally: resolved 5 · partial 1 · unresolved 0.

## Regressions
1. **The phone turn clips the Cube at the viewport edges.**
   - Cause: the floor fix sized the phone glass at 0.84 of a 92 vw stage, so the turned diagonal is about √2 × 84 vw ≈ 119 vw. A drag sends glass and plinth past the right edge at 390 (p390-mobile-state-signature-drag-phone, x 780 of 780) and past both edges at 320 (p320-mobile-state-signature-drag-phone).
   - Location: `src/js/gl/scene.js:251,317`, `src/styles/main.css:230`.
   - Fix: scale the phone hero rig, or pull the camera back, by 1 / (|cos θ| + |sin θ|) of the current turn. The projected width then stays inside the 16 px gutters at every angle, while front-on keeps ≈78–84 vw.
2. **The low-tier glass edges stair-step, and the 84 vw phone glass doubles their size.**
   - On the phone low tier, `antialias` is off and DPR is 1 (`src/js/gl/scene.js:37`, `src/js/lib/quality.js:41`). The glass and plinth edges step by 2–4 px at fixed rows in the first viewport (mobile-s00 at y≈405 / 750 / 1025 @2x), and the turned plinth is visibly jagged (p320-mobile-state-signature-drag-phone).
   - This seam was present in round 1 at 43 vw; the floor fix doubled it.
   - Fix: keep `antialias: true` on the low tier while the hero stage is on screen, or render the hero at DPR 1.5 there.
3. **The phone header lost the wordmark text under 400 px.**
   - At 390 the header showed "Voxmere" in round 1 (`20261021T074145-jury` mobile-s00) and now shows only the glyph (`20261021T081619-ship` mobile-s00), on the brief's primary arrival device. The contract places the wordmark at the left edge.
   - The chip names also ellipsise at 320: "85° The blo…", "128° The lig…", "272° Two si…" (p320-mobile-s08, s20, s58).
   - Location: `src/styles/main.css:109-111`.
   - Fix: under 400 px, keep the wordmark text and show the chip as the angle only, with the chapter name kept in the chip's accessible name.

## Keep
The turn: one smoke-glass block in front of the headline whose light reads GLASS and becomes LIGHT at 90° by drag, keys or touch, measured by the degree dial. Fix around it; never trade it for a lighter hero.

Checked against the recapture, the turn remains visible:
- desktop-state-signature-key-90 and mobile-state-signature-key-90 read LIGHT.
- desktop-state-signature-drag and p390-mobile-state-signature-drag-phone turn.
- The dial carries the scroll walk (desktop-s58 at 180°, mobile-s82 at 360°).

The batch strengthened this line on the phone, where the headline now sits behind the glass.

## Remaining
1. Fix row 3, theme flip (partial): `src/styles/base.css:15-16`.
   - Change: replace the 420 ms `--ink` tween with a discrete switch at the ground's midpoint (`0s step-end`, delay `calc(var(--dur-hero) / 2)`).
   - Expected result: every mid-flip frame shows the day or the night ink, never a mid-grey. The worst case at the midpoint becomes about 3.6:1 instead of 1.2–1.4:1.
   - Viewports: p320 s20 / s45 and nogl-mobile-s45.
2. Regression 1, the phone turn clip (above).
3. Regression 2, low-tier edge aliasing on the phone hero (above).
4. Regression 3, the hidden phone wordmark and ellipsised chip names (above).

Carried from round 1, not in this batch:
- the 404 footer laps sentence (lost-desktop-s100)
- the two zero forms in one row (desktop-s70, mobile-state-reserve-configured)
- the bench floors 31 px apart and ruler ticks off Cube 20's left edge (desktop-s70)
- the daylight floor haze outside the evening niche (desktop-state-reserve-configured)

## Ceiling
Ceiling: the Cube never writes the visitor's own word in light, so the receipt (the moment the glass becomes theirs) stays plain DOM instead of their name standing inside the block.

disposition: ship. Derivation:
- Weighted 7.93 ≥ 7.2, and no axis is below 6.8 (lowest: Usability 7.7).
- The audit has P0 0 and P1 0.
- All seven contract blocks are kept; FIRST VIEWPORT is now kept on the phone.
- Walk 1 and walk 3 pass.
- The Remaining items are ship-pass polish. None reopens a floor rule.
