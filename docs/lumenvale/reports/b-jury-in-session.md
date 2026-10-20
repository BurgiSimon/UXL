# Jury report — Lumenvale (index.html, full site, phase-7 second round) — 2026-10-20

disposition: ship
Design 7.6 · Usability 7.8 · Creativity 8.0 · Content 8.3 — weighted 7.81
1. Re-centre the flipped plate markers on their stars — src/styles/main.css:255-260 (src/js/story.js:256-264)
2. Apply the protect mask in the Canvas 2D fallback — src/js/sky.js:486-521
3. Phone header: keep the arc mark and chevron, one torch Book per view, fit 320 px — src/styles/main.css:32, :108-109, :505-512, :551-555

## Evidence
- Manifest: `.awards/captures/20261020T205745-jury/manifest.json` — valid: yes. 45 frames, created 20:57:45Z and newer than every source file (only `session.jsonl` is newer). Console errors 0, page errors 0, failed requests 0. CLS 0 in desktop, mobile and desktop-rm. DOM 1,392. WebGL2 at the mid tier with 1,657 stars. `__awards` hook present, scrollMode `hook`.
- No-GL manifest: `.awards/captures/20261020T210200-nogl/nogl-manifest.json` — valid: yes. 0 errors, canvas2d renderer, 496 stars. Control frames nogl-desktop-focus-1/2/3 and nogl-desktop-hover-3 were opened (all `matched: true`).
- Supplementary passes (this run, each into a fresh directory):
  - `20261020T210455-jury-states/manifest.json` (exit 0): hero-book-focus, hero-book-hover, calendar-row-focus and booking-done, on desktop and mobile.
  - `20261020T210656-jury-index/manifest.json` (exit 0): mobile index-open and index-keyboard.
  - `20261020T210716-jury-404/manifest.json` (exit 0): 404.html at desktop/mobile s00/s100, plus hover-1..3 and focus-1..3.
  - `20261020T210730-jury-320/manifest.json` (exit 0): 320×640 at s00, s25, s50, s75 and s100.
  - `20261020T210759-jury-lost/manifest.json` (exit 2): the state runner's reload of a `#night-…` hash URL returned no navigation response ("target unreachable: undefined"). This is a runner artifact. Its s00 frames rendered, and the lost state is evidenced by the probe instead.
  - `20261020T211425-jury-probe/probe.json` (scripted DOM assertions), with desktop-probe-markers.png, desktop-probe-lost.png and mobile-probe-lost.png.
- Coverage from this manifest and Page map (every frame opened, none blank, pixel stddev 19–54, s00/s50/s100 all different):
  1. The plate:
     - desktop-s00, mobile-s00, desktop-rm-s00
     - nogl-desktop-s00, nogl-mobile-s00
     - jury-320/mobile-s00
     - jury-states hero-book-focus/hover (desktop + mobile)
     - jury-index index-open/index-keyboard
  2. Lights out: desktop-s12, mobile-s12, desktop-rm-s12.
  3. Naked eye:
     - desktop-s25, mobile-s25, desktop-rm-s25
     - jury-320/mobile-s25
     - jury-probe/desktop-probe-markers
  4. Telescope: desktop-s38, mobile-s38, desktop-rm-s38, nogl-desktop-s50.
  5. Moon → Choose your night:
     - desktop-s50/62/75, mobile-s50/62/75, desktop-rm-s50/62/75
     - nogl-mobile-s50, jury-320/mobile-s50/s75
     - booking-open, booking-details-errors, booking-keyboard, booking-escape, moon-full-keyboard and calendar-dark-filter, each at desktop, mobile and desktop-rm
     - jury-states booking-done and calendar-row-focus (desktop + mobile)
  6. Dawn:
     - desktop-s88/s100, mobile-s88/s100, desktop-rm-s88/s100
     - nogl-desktop-s100, nogl-mobile-s100
     - jury-320/mobile-s100
  7. 404:
     - jury-404 desktop-s00/s100, mobile-s00/s100, desktop-hover-1..3, desktop-focus-1..3
     - in-page lost state: desktop-probe-lost, mobile-probe-lost
- Audit: `.awards/audit.json` (re-run 2026-10-20T21:03:58Z, because the 20:56 file predated `src/styles/main.css` at 20:57:37) — P0 0 · P1 0 · P2 0 · P3 0. Exceptions S06, C05, L08, P04 and L05 each carry a reason a juror accepts (`AWARDS.md ## Exceptions`).
- Console / page errors: 0 / 0 in the jury, nogl, states, index, 404 and 320 passes. The two jury-lost errors are the runner artifact above.
- Doctor: ready (Chromium 141, headless WebGL2).
- Bytes: `index.html` is identical to `dist/index.html`: 474,615 B raw / 231,366 B gz.
  - Inline JS: 90,943 B gz.
  - Two inlined woff2 fonts: 93,102 B + 26,832 B.
  - `404.html`: 130,677 B.
- Neighbours: `.awards/neighbours/{son-daven,white-desert,to-top}/manifest.json` all exited 4 (the outbound proxy answered CONNECT 403), so no frames.

## Scores
| Axis (weight) | Score /10 | One-line reason |
|---|---|---|
| Design (40) | 7.6 | It owns a world: a real-sky trail plate, a ground that follows the hour (dusk → red light → night → dawn negative), one wide display face plus Public Sans held from hero to calendar to dialog to 404, and torch red on the path. Seams hold it under 8: chapters 2–4 repeat one composition, so the flat Saturn and the missed markers are the only pictures between s12 and s50; the phone header loses its mark and chevron and shows two torch Books; the no-GL tier loses its quiet ground. |
| Usability (30) | 7.8 | Walk steps 1–7 pass, with a keyboard, a reduced-motion tier and a two-step booking dialog with errors, ticket and .ics at both widths. Walk 8 fails (320 px overflow, no-GL text over trails) and caps the axis at 8. Minor friction: a chevron-less phone index, and chapter state that lags after a jump. |
| Creativity (20) | 8.0 | One concept does the work: scroll is the exposure, trail length is the hour, and the moon range washes the plate out (1,874 → 237 stars) as the argument for booking a dark night. The still reads partly as a familiar star-trail texture, and the chapter-3 markers circle empty sky. |
| Content (10) | 8.3 | Numbers in sentences, two registers split at chapter 5, an authored close, 404, errors and ticket, and the synthetic content disclosed in the colophon. No real photography, and dual units appear only once (2,140 m / 7,021 ft). |
| **Weighted** | 7.81 | 7.6×0.4 + 7.8×0.3 + 8.0×0.2 + 8.3×0.1. SOTD threshold ≥ 7.2 with no axis < 6.8: met. |

| Developer criteria | Score /10 | Note |
|---|---|---|
| Animation and interaction | 8.0 | One ticker (gsap.ticker → Lenis → frame, src/js/main.js:23; story.js:377). Exponential damping at λ 8 (story.js:11, :281). The sweep runs once per session (:325-341), the loop stops on a hidden tab (:378), and it draws only when dirty. Deductions: protectRects runs getBoundingClientRect on every tick (:287); the eyepiece iris animates clip-path (:415); Lenis wheel smoothing still runs under reduce (main.js:21); chapter state lags after a jump (craft 4). |
| Performance | 7.6 | One file: 231 KB gz including two fonts (120 KB) and the star table. JS is 90.9 KB gz: over the project's own 60 KB target, under the 200 KB floor. No rasters. DPR is capped (1 on desktop, 1.5 on mobile). CLS 0, rising to 0.13 on the mobile bad-hash route (jury-lost). The GL cannot be a lazy chunk (P04, initialised after first paint). lcpColdSynthetic 300 / 160 / 228 ms is a headless cold-cache software-GL asset-weight signal only, not a score. Real-device frame rate is unmeasured. |
| Responsive | 7.6 | Vw-lock with floors and a designed phone layout: stacked hero with a full-width Book, dock, two-line calendar stubs, bottom-sheet dialog, index disclosure. No overflow at 390 px. At 320 px the page overflows by 5 px and clips the header Book. The bar's SVGs collapse to 3 px and 0 px (probe mobile390.markSvg, toggleSvg). |
| Accessibility and semantics | 7.9 | Landmarks, one h1, heading order and lang are in place. Skip links reach main. The canvas is aria-hidden with an sr-only star mirror. Every tab stop gets a 2 px torch ring (probe). The native modal dialog is inert behind, closes on Escape and returns focus. Errors use aria-invalid/describedby, the range has aria-valuetext, and there is a role=status region. Deductions: filter radios are 42 px tall on phones, and the no-GL tier puts strokes under body copy. |
| Code quality | 8.0 | 0 console and page errors in every pass, no console.log or debugger shipped. The renderer is disposed on pagehide and context loss is handled (src/js/sky.js:435-460); the ResizeObserver is debounced. Deductions: a `window.lenis` global (main.js:26); the 2D fallback keeps its resize listener and has an empty dispose (sky.js:524, :539) and ignores `params.protect` (:486-521). |

## Usability walk
- walk 1 — pass — The skip link is the first stop and lands on `main`. Tab order runs mark → rail → Book → stub Book → range → skip → filter → night Books, with a 2 px torch ring on every one of the 22 stops. The native modal dialog makes the page inert; Escape closes it and returns focus to the stub Book. The range takes End, and PageDown, Space and End scroll the page (probe.json; desktop-state-booking-keyboard, -escape, -moon-full-keyboard).
- walk 2 — pass — No cursor or magnetic effects. The calendar's moon preview also fires on focus (src/js/story.js:387-390). The rail becomes a 77×44 disclosure that closes on Escape and returns focus (mobile-state-index-open; probe mobileIndex). Targets are ≥ 44 px except the filter radios at 42 px. The disclosure chevron renders 0 px wide (craft 3).
- walk 3 — pass — desktop-rm-s00…s100 are readable at rest: the hero rests on the finished plate and each chapter cuts to its settled hour. The dialog, range and filter work under reduce (desktop-rm-state-*). CSS shortens transitions to 200 ms rather than a global kill (src/styles/main.css:558-563). Lenis wheel smoothing still runs under reduce (src/js/main.js:21; desktop-rm awardsState.lenis true).
- walk 4 — pass — No preloader, and the h1 is DOM text. The sky starts after fonts.ready plus an idle callback; the 1.5 s sweep plays once per session (sessionStorage, src/js/story.js:325-341), with a 4 s never-hold timeout (:374).
- walk 5 — pass — s00 alone answers what (guided stargazing at 2,140 m), who (groups of twelve) and what to do (Book Sat 31 Oct, 3 of 12 seats, CHF 48 / 24 / +30) (desktop-s00, mobile-s00).
- walk 6 — pass — The rail or toggle shows the current chapter and its hour, and the exposure readout is the progress cue. The logo goes to the top and anchors push history. The in-page lost state is authored and focused (desktop-probe-lost), and 404.html offers three exits (jury-404). After a direct jump the phone index lags one chapter (mobile-s25; craft 4).
- walk 7 — pass — One named action, "Book Sat 31 Oct", sits in s00 and at the close. Desktop has the header Book and phones the dock. The two-step dialog shows the total, inline errors, a ticket and an .ics (desktop/mobile-state-booking-done). It takes 3 taps from the first phone screen.
- walk 8 — fail — At 320 px the page overflows by 5 px and clips the header Book (20261020T210730-jury-320/mobile-s00.png; probe mobile320.scrollWidth 325). The no-GL fallback strokes trails across the lede, the ticket and the footer copy (nogl-desktop-s00, nogl-mobile-s00, nogl-desktop-s100). Caps Usability at 8.

## Memory test
"A long-exposure photograph of the night sky — cream star trails wheeling around the pole above a black mountain ridge — with 'One night, exposed.' across it and a red button that books Saturday 31 October, 3 of 12 seats left."

## Specificity test
Could a juror name a source site from the first viewport? **No.** No corpus card shows a computed star-trail plate, plate-margin annotations or a dated ticket stub as the hero action. The wider index has no astronomical neighbour.
- son-daven — neighbour frame unavailable (capture exit 4, proxy 403). Card §3: one shader gives every image the same material. Lumenvale's one illustration, the eyepiece Saturn, is flat SVG bands with no limb darkening or seeing blur, a lower finish than the computed trail field around it (desktop-s38, mobile-s25).
- white-desert — neighbour frame unavailable (exit 4). Card §3: orange never decorates and marks only the enquiry path. Lumenvale spends torch on the private-session price and a side rule outside the Book path (desktop-s50 top right, src/styles/main.css:286). The dawn close (night ink on starlight paper, darkroom red Book) also sits one step from the refused navy-on-bone-plus-orange pairing; the negative-print trails earn it (desktop-s100).
- to-top — neighbour frame unavailable (exit 4). Card §3: its landscape is built from graded photographic planes. Lumenvale's only landscape, the ridge, is a straight-segment polyline whose facets read as vector at 1440 (desktop-s00 bottom edge, src/index.html:257).

## Slop scan
families present: 0
- The audit has 0 findings. L05 (tracked margin labels) is earned under `## Exceptions`: WORLD names a metadata world, and every label carries a fact.
- Judge rows walked against the captures, none present:
  - No glass, glow, offset shadow, blob, gradient text or rounded crop.
  - No fade-and-rise; the only entrance is the eyepiece iris.
  - No staple kit: no preloader counter, overlay menu, cursor, magnetic button, marquee or split text.
  - No template order, no metric row, no "Get started".
- Earned uses:
  - The dark ground plus saturated red accent is earned: the ground is the sky at the hour, red is the observing field's only light, and nothing glows (desktop-s00, desktop-s12).
  - The paper, labels and hairlines of the dawn close are earned as a photographic negative (desktop-s100).
- Not counted: the offer's 1 px and the featured row's 2 px torch rules are hairlines, not X06 stripes. They appear under the accent-discipline finish gap instead.

generator nameable: no

## Contract fidelity
| Block | Kept? | Evidence (capture, file:line) |
|---|---|---|
| THESIS | kept | The trails lengthen with the clock and the margin readout counts it: 01 h 00 at s12 → 02 h 17 at s38 → 07 h 45 at s75 → 12 h 25 at s100 (desktop-s12…s100). The moon re-exposes the plate, 1,874 → 237 stars (moon-full-keyboard, desktop/mobile/rm). Every refusal holds: no photo, serif, triad, testimonials, FAQ, particles or glow. |
| WORLD | kept | Ground follows the hour: dusk/night (s00) → red light (desktop-s12, mobile-s12) → night → dawn negative with darkroom red (desktop-s100). Hubot Sans wide plus Public Sans throughout, including the dialog and the 404 (desktop-state-booking-open, jury-404 desktop-s00). Radius 0, no shadow or glass. Seam: the no-GL tier drops the quiet ground (craft 2). |
| STORY | kept | Six chapters in order with real timestamps; register switch at chapter 5. Interruption: the moon range plus "Skip to the nights" (desktop-s62). Dawn close (s100). Seam: the chapter-3 markers miss their stars, and the Pleiades marker is culled (desktop-probe-markers; craft 1). |
| FIRST VIEWPORT | kept | Finished plate at rest around the pole, annotation "Plate of Sat 31 Oct · 17:55–05:15 · Exposure 11 h 20 min", h1, fact sentence, ticket stub with moon glyph, date, moon line, meet time and 3 of 12 seats, one torch "Book Sat 31 Oct", price line, protect mask (desktop-s00). On phones: pole mid-screen, Book full-width in the first screen, header Book outlined (mobile-s00). |
| SIGNATURE | kept | One WebGL2 canvas with instanced arcs; DPR capped; reduced tier cuts per chapter (desktop-rm-s12…s100). Native range and scroll keys (probe). Canvas 2D fallback present (nogl-*). Seam: the fallback ignores the protect mask (src/js/sky.js:486-521). |
| SCROLL MODEL | kept | Native scroll plus Lenis with syncTouch off, fixed sky, no pin. PageDown/Space/End scroll (probe keyboardScroll 717/1434/6720). Persistent Book plus skip links (desktop-s50, mobile-s38). |
| LOAD & CLOSE | kept | No preloader; LCP is DOM. fonts.ready → idle → sky → 1.5 s expo.inOut sweep, skipped on repeat (src/js/story.js:310-375). Dawn negative with Book, meeting point, what to bring and contact (desktop-s100, mobile-s100). Authored in-page lost state (desktop-probe-lost) and 404.html in the same world (jury-404). |

## Source findings
- `.bar__mark svg` and `.bar__index-toggle svg` shrink under `svg { max-width: 100% }` inside the flex/grid bar (src/styles/main.css:32, :110-120): 3 px and 0 px wide at 390 px.
- `.bar.is-solid:not(.is-calm) .bar__book` (0,4,0) beats the phone override `.bar.is-solid .bar__book` (0,3,0) (src/styles/main.css:108-109). The header Book therefore stays filled torch next to the filled dock Book in chapters 2–4 on phones (mobile-s12, mobile-s25, mobile-s38).
- `.marker.is-flip` uses `flex-direction: row-reverse` (src/styles/main.css:259). The translate origin then lands on the label's left edge, and the ring sits a label-width to the right: 100 / 198 / 108 px from Polaris, M31 and the Pleiades (probe.json markers.ringOffsetPx).
- `scripts/finalize.mjs:50` writes `.btn` for 404.html with no `:hover` rule, and 404.html contains 0 `:hover` selectors. The 404 primary and its links do not change on hover (jury-404 desktop-hover-1/2).
- Unhiding `#lost` after load shifts the calendar: CLS 0.067 on desktop and 0.13 on mobile on the bad-hash route (jury-lost manifest metrics).

## Material fixes
### Floor (uncapped: fidelity, walk 1 and 3, audit P0/P1)
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| — | none: every contract block kept, walk steps 1 and 3 passed, audit P0 0 / P1 0 | — | — | 20261020T205745-jury/manifest.json + .awards/audit.json | — | — |

### Craft (at most 5, inside the contract)
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| src/styles/main.css:255-260 (src/js/story.js:256-264) | In flip mode, keep the ring at the translate origin: place the label absolutely to the ring's left instead of `row-reverse`, and re-test the Pleiades culling box against the new label side | Each red ring circles its star (probe ringOffsetPx ≤ 4, now 100/198/108), the label sits beside the star rather than on it, and the Pleiades shows when its box is clear | desktop and mobile · naked-eye (s25) | 20261020T205745-jury/desktop-s25.png + 20261020T211425-jury-probe/desktop-probe-markers.png | pending | unresolved |
| src/js/sky.js:486-521 | Use `params.protect` in the Canvas 2D path as the GL shader does (sky.js:128-146): clip or feather the trails to about 20 % inside each protect rect | No-GL lede, ticket facts, price line, plate data and dawn columns sit on a quiet ground, matching desktop-s00 | desktop and mobile · `--no-webgl` · s00, s50, s100 | 20261020T210200-nogl/nogl-desktop-s00.png, nogl-mobile-s00.png, nogl-desktop-s100.png | pending | unresolved |
| src/styles/main.css:32, :108-109, :110-120, :505-512, :551-555 | Make the bar's SVGs `flex: none`. Let the phone rule outrank `:not(.is-calm)` so the header Book stays outlined while the dock is on. At ≤ 360 px, shorten the header label to "Book" (keep "a night" visually hidden) or tighten the gutter | Phones show the arc mark and the index chevron; one filled torch Book per view; no horizontal overflow at 320 (scrollWidth 320), with the header Book fully visible | mobile 390 and 320 · s00, s12–s38, index-open | 20261020T205745-jury/mobile-s00.png, mobile-s12.png; 20261020T210730-jury-320/mobile-s00.png; probe.json mobile390.markSvg/toggleSvg, mobile320.scrollWidth 325 | pending | unresolved |
| src/js/story.js:156-188 | Derive the current chapter in `frame()` from the section under the 55 % line, or re-check on ScrollTrigger `scrollEnd`, instead of relying only on `onToggle` | After a direct jump into chapter 3 the theme is night and the index reads "19:10"; no torch-red ledger outside the red-light beat | mobile · s25 (direct jump) | 20261020T205745-jury/mobile-s25.png (red theme, "18:20" over the naked-eye ledger) + probe2 jump {theme red, toggle 18:20, section naked-eye} | pending | unresolved |
| scripts/finalize.mjs:50 | Author the 404's hover states from the index tokens: Book → starlight ground, links → torch underline under `(hover: hover)` | The 404 primary and its two links visibly change on hover, matching hero-book-hover | desktop · 404.html hover-1..3 | 20261020T210716-jury-404/desktop-hover-1.png, desktop-hover-2.png | pending | unresolved |

## Keep
Keep the plate as the one continuous layer: the scroll-driven exposure with its margin readout, the moon range that washes the trails out, and the dawn negative. Fix around them, and never add a second effect, a glow or a photograph.

## Ceiling
Ceiling: the plate the confirmation promises is never shown, because the booked night's own exposure (its moon, its trail count) never becomes the ticket, which stays a text ledger.
