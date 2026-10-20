# Jury report — Lumenvale (index.html) — 2026-10-20

disposition: ship
Design 7.9 · Usability 8.1 · Creativity 8.5 · Content 8.5 — weighted 8.14
1. Make the scrolled header ground opaque so vermilion buttons and display type stop ghosting behind the wordmark and the header CTA — index.html:154 `.bar.is-solid` (desktop-s80, mobile-s70)
2. Remove the inherited 465.7 px paragraph measure from the moon scale so NEW / QUARTER / FULL span the 679 px track — index.html:326 `.instrument__scale` (desktop-s54.3, desktop-state-moon-full)
3. Fit the dawn close inside the 1440×900 last screen so "Every guest gets the plate." is not cut under the header at s100 — index.html:643 `footer#dawn` (desktop-s100)

Run notes
- Requested as `--verdict`, but no earlier report exists in `.awards/jury/`, so there was no fix batch to check. This is a full scoring pass and stands as the original report.
- `AWARDS.md`, `DESIGN.md` and `PRODUCT.md` are absent. There is no direction contract and no Page map, so chapter coverage was derived from the DOM (`[data-chapter]`: blue-hour, lights-out, naked-eye, telescope, moon, nights, dawn). `/awards:craft` would write the contract.
- `session.jsonl` and `session.err` in the project root were deliberately not read. They are build-side material, and the jury scores what a stranger sees.
- Because `AWARDS.md` does not exist, the two `## Jury log` lines were not appended. They are at the end of this report for whoever creates the file.

## Evidence
- Manifest (baseline): `.awards/captures/20261020T215359-jury/manifest.json` — valid: yes. Desktop/mobile/desktop-rm s00, s50, s100, plus hover-3 and focus-1/2/3. Errors: 0 console, 0 page, 0 failed requests.
- Manifest (desktop chapters + states): `.awards/captures/20261020T215719-jury-desktop/manifest.json` — valid: yes. Desktop and desktop-rm at s14.6 (lights-out), s28.5 (naked-eye), s41.8 (telescope), s54.3 (moon), s67 (nights head), s80 (nights November), s90 (nights end into dawn). States: booking-open, booking-seats-error, booking-step2-errors, booking-done, booking-escape, moon-full, moon-new, filter-dark, show-more, tab-3, tab-index, each in normal and reduced motion. Errors: 0 / 0 / 0.
- Manifest (mobile chapters + states): `.awards/captures/20261020T220105-jury-mobile/manifest.json` — valid: yes. Mobile at s9.9, s19.9, s32, s44, s53.4, s70, s85. States: index-open, index-escape, booking-open, moon-half. Errors: 0 / 0 / 0.
- Manifest (no-WebGL, walk 8): `.awards/captures/20261020T220212-nogl/nogl-manifest.json` — valid: yes. nogl-desktop-s00 and nogl-desktop-s28.5 use the canvas-2D renderer, 496 stars. Errors: 0.
- Manifest (not-found state): `.awards/captures/20261020T220236-jury-lost/manifest.json` — partial. The s00 frames are valid. The two named states exited 2 with "target unreachable" because the capture tool re-navigates to a same-document `#hash` URL. This is a tool limitation, not a page error. The not-found state is evidenced instead by a read-only Playwright probe: `probe-desktop-lost.png`. The same probe directory holds `probe-desktop-done-longname.png` and `probe-320-s00.png`.
- Every listed frame was opened or checked. None is blank, flat or stuck. s00, s50 and s100 differ (grey mean 48.8 / 26.2 / 207.4 desktop). The hover-3 and focus frames were taken at the end of the pass on the dawn theme. focus-2 shows an authored skip link. hover-3 shows no visible change on the wordmark.
- Audit: `.awards/audit.json` (2026-10-20T22:06Z, static) — P0 0 · P1 0 · P2 1 (L05 index.html:201) · P3 1 (X07). A `--render --no-write` pass gave identical counts. No exceptions recorded.
- Metrics (baseline manifest): CLS 0 desktop / 0.0003 mobile; 1,411 DOM nodes; one canvas, WebGL2 tier "mid", DPR 1 desktop / 1.5 mobile; `__awards` hook present. lcpColdSynthetic 296 ms desktop is a headless cold-cache figure, cited only as an asset-weight signal and not scored.
- Neighbour captures: `.awards/neighbours/{white-desert,to-top,united-carriers}/manifest.json`. All exited 4 (unreachable from this sandbox).

## Inventory (desktop-s00, written before any contract or later frame)
A full-bleed night sky of concentric star trails in cream and pale slate on deep navy wheels around a pole high on the left. A black mountain ridge runs along the bottom edge. Top left is the "LUMENVALE" wordmark in a wide grotesque with a small arc mark; top right is a ghost-outlined "Book a night". A tracked small-caps line reads "PLATE OF SAT 31 OCT · 17:55–05:15 · EXPOSURE 11 H 20 MIN". Under it, "One night, exposed." is set at about 150 px in a wide, heavy grotesque, two lines, filling two thirds of the width. A 17–18 px neutral grotesque lede says this is guided stargazing for twelve at 2,140 m, and that the background is every real star of the next dark night ("Scroll back to dusk and live it"). A ticket stub follows: half-moon glyph, "Saturday 31 October", "Moon down all session · Meet 17:30 · 3 of 12 seats left". The primary action is a filled vermilion "Book Sat 31 Oct" button at about y 730, with an underlined "See all nights" link and a price line beside it. A left rail lists the night as clock times (31.10 The plate · 18:20 Lights out · 19:10 Naked eye · 20:05 Telescope · 21:25 The moon · 29 Nights to book · 06:30 Dawn) above an exposure/plate/coordinates block. The system is two families (wide display + neutral grotesque), cream ink on navy and one vermilion. Motion, from the source: the sky is a WebGL2 star-catalogue renderer (index.html:153). Scroll position maps to clock time, so the trails shorten back to dusk and grow again chapter by chapter until dawn. A first visit opens with a 1.5 s expo tween.

## Scores
| Axis (weight) | Score /10 | One-line reason |
|---|---|---|
| Design (40) | 7.9 | One world is held from dusk to dawn: the computed plate under every chapter, a red-light chapter (desktop-s14.6), an eyepiece iris (desktop-s41.8), a moon instrument that lights the sky (desktop-state-moon-full) and a paper-print inversion at the close (desktop-s100). Two families, cream/navy/vermilion, themed selection, scrollbar, favicon and not-found. Held below 8 by visible seams: header ghosting (desktop-s80, mobile-s70), the moon scale stopping two thirds along its track (desktop-s54.3), the close headline cut under the bar (desktop-s100), the barred display zero reading as "θ" ("18:2θ", "CHF θ", desktop-state-booking-seats-error) and a flat-vector Saturn below the sky's fidelity |
| Usability (30) | 8.1 | Walk 1–8 all pass with no caps: skip link to main, focus visible everywhere, native modal booking with Escape and focus return, keyboard moon range, chapter index on desktop and in the mobile header, authored not-found, nothing gated. Friction: on the done panel at 900 px the actions sit below the dialog fold (body 847 vs 685 px, desktop-state-booking-done), and the mobile hero plate line is crossed by bright trails (mobile-s00) |
| Creativity (20) | 8.5 | One metaphor carries the brief: scroll is the night's exposure, computed from real catalogues for the bookable date. Each chapter enacts a step of the visit (dark adaptation turns the UI red, markers find Polaris/Andromeda/Pleiades on the plate, the moon slider argues for dark-sky nights and feeds the calendar filter), and the close hands over the product, the plate. A scrubbed background is itself a known move, which keeps it under 9 |
| Content (10) | 8.5 | Numbers instead of adjectives throughout: 2,140 m (7,021 ft), −3 °C, 25 minutes, pupils 2→7 mm, mag 6 / 1,874 stars, 600 mm f/4, 96×–300×, CHF 48/24/+30, a 14:00 cloud rule, live moon phase and seats per night. An honest colophon labels the fictional observatory and the illustrative seat counts (desktop-s100). The static fallback HTML ages until JS recomputes it |
| **Weighted** | **8.14** | 7.9×0.4 + 8.1×0.3 + 8.5×0.2 + 8.5×0.1 = 3.16 + 2.43 + 1.70 + 0.85. SOTD threshold ≥ 7.2 with no axis < 6.8 is met |

| Developer criteria | Score /10 | Note |
|---|---|---|
| Animation and interaction | 8.4 | One GSAP ticker drives Lenis and the sky (`yi.ticker.add(e=>yu.raf(e*1e3))`, `lagSmoothing(0)`, index.html:153). Framerate-independent damping `du=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r))`. Ticker removed on `visibilitychange`, one ScrollTrigger, smoothWheel only in the full tier. The eyepiece iris animates `clip-path` once, a paint property rather than transform/opacity |
| Performance | 8.0 | Single 477 KB document, 232 KB gzip: JS 92 KB gz (GSAP, ScrollTrigger, Lenis, a hand-written WebGL2 renderer with high/mid/low tiers) plus two inlined variable woff2 (Hubot Sans, Public Sans, ≈160 KB base64, `font-display:swap`, size-adjusted fallbacks). No separate GL chunk. DPR capped at 1 / 1.5. CLS 0. 1,411 nodes |
| Responsive | 8.2 | A designed phone layout: the chapter index becomes a header disclosure (mobile-state-index-open), a docked "Book" bar appears (mobile-s9.9), the booking dialog becomes a full-width sheet (mobile-state-booking-open) and the night rows restack (mobile-s70). Display locked with `clamp(3.25rem, 10.4167vw, 9.375rem)`. No overflow at 390 or 320 px. Targets ≥ 44 px |
| Accessibility and semantics | 8.3 | header/nav/main/footer, one h1, lang, two skip links, `:focus-visible` 2 px accent ring, canvas `aria-hidden`, sr-only mirrors of the adaptation figures (index.html:237), labelled range with `<output>`, native `<dialog>` (page inert, Escape, focus return), polite live status, reduced-motion token tier plus a static tier |
| Code quality | 7.6 | 0 console/page errors in every manifest. Renderer disposed on `pagehide`, `webglcontextlost` handled, one ticker. But `og:image` is a `data:` URI that link scrapers ignore (index.html:13), and the `window.__awards` test hook ships to production |

## Usability walk
- walk 1 — pass — Tab order: skip links, wordmark, chapter rail, Book, hero CTA, moon range, filter. The skip link lands on `<main>`, and every stop shows a 2 px vermilion outline. The modal dialog traps Tab (the page behind is inert) and Escape returns focus to "Book Sat 31 Oct" (desktop-state-booking-escape). The mobile index closes on Escape with focus back on its toggle (mobile-state-index-escape). The range moves on arrows, Home and End. PageDown, Space and arrows scroll the page (scratchpad probe2).
- walk 2 — pass — No custom cursor or magnetic effects. Nothing is hover-only: the plate markers are aria-hidden duplicates of the ledger text. The eccentric left rail becomes a header disclosure on phones (mobile-state-index-open). Targets are ≥ 44 px.
- walk 3 — pass — Reduced-motion frames read at rest, with a chosen sky frame per chapter (desktop-rm-s14.6, desktop-rm-s41.8, desktop-rm-s100). The red-light theme, dialog and moon instrument survive (desktop-rm-state-booking-open, desktop-rm-state-moon-full). Durations shorten through tokens, with no global kill (index.html:154 `@media (prefers-reduced-motion:reduce)`).
- walk 4 — pass — No preloader. The sky's 1.5 s opening tween runs once per session (sessionStorage) and gates nothing.
- walk 5 — pass — s00 answers all three questions: what (guided stargazing at 2,140 m), who (groups of twelve, adult and under-16 prices) and what to do (Book Sat 31 Oct, See all nights).
- walk 6 — pass — The rail and the mobile header mark the current chapter by its clock time. The wordmark goes to #top. A bad night hash renders "That night isn't on the plate." with the three nearest nights and two ways out, and focus moves to it (probe-desktop-lost.png). As a single-file site, an unknown path falls to the host's default 404.
- walk 7 — pass — One primary action that names its outcome ("Book Sat 31 Oct"). It is present in the header on every chapter and in the mobile dock, and deep links `#book-night-…` open the dialog.
- walk 8 — pass — The no-WebGL capture keeps all text over a canvas-2D plate (nogl-desktop-s00). The canvas is aria-hidden. At 320 px there is no horizontal overflow. A 44-character email fits the confirmation ticket (probe-desktop-done-longname.png). In the 2D fallback, hard-edged dark rectangles show behind the text blocks.

## Memory test
"The page whose whole background is a long-exposure star-trail photograph of the next bookable night, Sat 31 Oct, and when you scroll it winds the trails back to dusk and lets them grow again hour by hour until dawn."

## Specificity test
Could a juror name a source site from the first viewport? No. Star-trail imagery is a common astronomy-site picture, but no corpus site opens on a computed sky plate scrubbed by clock time. The nearest palette strategy, White Desert's navy ink + bone + one orange enquiry accent, does not carry its photography or italic-serif voice into this frame.
There is no DIVERGENCE block, so the jury picked its own neighbours from `references/sites/_index.md` (luxury travel / chaptered journey / scroll-as-process):
- white-desert — neighbour frame unavailable (capture exit 4). Against card §3: its orange marks only the enquiry path. Lumenvale spends the vermilion on the CTA and also on the plate markers, the offer rule and the featured-row stripe (desktop-s28.5, desktop-s41.8, desktop-s80), so the booking colour is less singular.
- to-top — neighbour frame unavailable (capture exit 4). Against card §3: its imagery is graded photographic cut-outs with physical depth. Lumenvale's one non-sky picture, the eyepiece Saturn, is flat bands and an ellipse (desktop-s41.8), below the fidelity of the catalogue-computed plate around it.
- united-carriers — neighbour frame unavailable (capture exit 4). Against card §3: its telemetry readouts are set in a mono beside the display face. Lumenvale sets its readouts ("mag 5.6", "1,523", "18:20") in the wide display, whose default barred zero reads as θ at display size (desktop-s14.6, desktop-s67).

## Slop scan
families present: 1
- Type — labels and time strips over headings: L05 index.html:201 ("Next dark-sky night" kicker over the stub date) plus the plate line over the h1 (index.html:196), and X07 micro-meta (chapter clock times, middle-dot coordinate strip, desktop-s00). Each strip carries a computed fact of the plate, which is the earned case, but none is recorded under `## Exceptions`, so it counts.
- Judge rows walked with no hit: dark + neon (the dark is the night itself, and the vermilion is the red-light lamp of the lights-out chapter, desktop-s14.6); cream as palette (the dawn cream is the printed plate, desktop-s100); glass, glow, side stripes (1–2 px rules only), nested cards, staple kit (no preloader, cursor, magnetic button, marquee or split-text reveal), fade-and-rise, idle loops, slogan copy.
generator nameable: no

## Contract fidelity
No direction contract exists: `AWARDS.md` and `DESIGN.md` are absent. No block can be marked not kept. The page's own stated thesis ("One night, exposed." plus "every real star of the next dark night") is visible at s00.

| Block | Kept? | Evidence (capture, file:line) |
|---|---|---|
| THESIS | no contract | stated thesis visible at desktop-s00 / mobile-s00 (index.html:197–198) |
| WORLD | no contract | — |
| STORY | no contract | — |
| FIRST VIEWPORT | no contract | — |
| SIGNATURE | no contract | — |
| SCROLL MODEL | no contract | — |
| LOAD & CLOSE | no contract | — |

## Source findings
- index.html:13 — `og:image` is a `data:image/svg+xml` URI. Open Graph scrapers need an absolute http(s) URL.
- index.html:154 — `.dawn__colophon .link{min-height:44px;display:inline-flex}` drops the colophon's last line about 20 px below the paragraph leading (desktop-s100, mobile-s100).
- The static calendar HTML (index.html:404 onward) is a snapshot. Seat counts and the "Show n more nights" horizon are recomputed from the Zurich date at runtime, and they changed across the 22:00 UTC midnight between capture runs (3 → 2 seats on Sat 31 Oct). Each load is consistent with itself.

## Material fixes
### Floor (uncapped: fidelity, walk 1 and 3, audit P0/P1)
None. There is no contract, walk steps 1 and 3 pass, and the audit has no P0/P1.

### Craft (at most 5, inside the contract)
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| index.html:154 `.bar.is-solid{background:color-mix(in srgb, var(--ground) 92%, transparent)}` | Make the scrolled bar ground opaque (100 % `--ground`, hairline kept) | No vermilion block behind "Book a night" / "Book", and no display type ghosting behind LUMENVALE | desktop s80; mobile s70, s100, state moon-half | `20261020T215719-jury-desktop/desktop-s80.png`, `20261020T220105-jury-mobile/mobile-s70.png`, `20261020T220105-jury-mobile/mobile-state-moon-half.png`, `20261020T215359-jury/mobile-s100.png` | pending | unresolved |
| index.html:326 `<p class="instrument__scale">` inherits `p{max-width:var(--measure)}` = 465.7 px (index.html:154) | Set `max-width:none` on `.instrument__scale` | The FULL label sits at the right end of the 408–1087 px track, where the thumb lands at 100 % | desktop, moon chapter, states moon-new / moon-full | `20261020T215719-jury-desktop/desktop-s54.3.png`, `desktop-state-moon-full.png` (scale 408–874 px vs range 408–1087 px) | pending | unresolved |
| index.html:643 `footer#dawn` (`.chapter` padding 120 px top in index.html:154; chapter is 1,041 px tall) | Fit the dawn label, title, actions and columns inside 100svh at 1440×900 by trimming its top padding and ridge allowance | At s100 "Every guest gets the plate." shows whole below the 64 px bar | desktop s100, desktop-rm s100 | `20261020T215359-jury/desktop-s100.png`, `desktop-rm-s100.png` | pending | unresolved |
| index.html:196 `<p class="hero__plate label">` has no `data-protect` (the lede at index.html:198 has it) | Add `data-protect` so the trail shader fades to 20 % behind the plate line | "PLATE OF SAT 31 OCT · 17:55–05:15 · EXPOSURE 11 H 20 MIN" reads on a quiet ground at 390 px | mobile s00 | `20261020T215359-jury/mobile-s00.png` | pending | unresolved |
| index.html:201 (L05) and X07 — slop family "labels and time strips" | Record L05 and X07 under `AWARDS.md ## Exceptions` with the reason: each strip is a computed fact of the plate (date, clock times, exposure, coordinates). Or mark them inline with `<!-- audit-ignore: L05 … -->` | No visual change. The audit's P2/P3 clear and the family no longer counts | audit | `.awards/audit.json` (P2 1, P3 1) | pending | unresolved |

## Keep
Keep the computed plate as the ground of every chapter, scrubbed by scroll from dusk to dawn, including the red-light chapter and the dawn inversion into the printed plate. No fix may lay a second visual system over it.

## Ceiling
Ceiling: the page shows dark adaptation as a chapter but never offers the red-light mode an observer actually switches on, so a phone carried up to 2,140 m still glows white.

## Jury log lines (not written: AWARDS.md absent)
```
- 2026-10-20 · ship · D 7.9 / U 8.1 / C 8.5 / Co 8.5 → 8.14 · dev 8.4 / 8.0 / 8.2 / 8.3 / 7.6 · .awards/jury/2026-10-20.md
  top fixes: 1) opaque scrolled header (index.html:154 .bar.is-solid) 2) moon scale spans its track (index.html:326) 3) dawn close fits the last screen (index.html:643)
```
