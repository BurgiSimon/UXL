# Jury verdict — Lumenvale (single-file `index.html`) — 2026-10-20

disposition: ship
Design 7.5 · Usability 7.0 · Creativity 7.7 · Content 7.8 — weighted 7.42
1. Keep the booking error message above the sticky footer — src/styles/base.css:355-360 (`.book__foot` sticky) with src/index.html:237 (`[data-book-error]` sits under it): move the message into `.book__foot` above the total, or above the Name field
2. Make phone rail links at least 44 px wide — src/styles/base.css:396 and :422 (`.rail a`, 39 × 44 px at 320 px)
3. Decide the uncharted state before first paint — src/js/app.js:456-465 (`checkHash` unhides `#uncharted` after load; hash-404 CLS 0.08 → 0.38 desktop)

Checklist: the 10 material fixes in `.awards/jury/2026-10-20.md`. Resolved 8 · partial 2 · unresolved 0 · regressions 2.

## Evidence
- **Why recaptured.** The handed-over verdict capture `.awards/captures/20261020T210501-verdict` (21:05) predates the last edit. `src/styles/base.css` and `index.html` were rebuilt at 21:07:55 for the `.btn--strip` gap fix. Doctor: ready (Chromium 141 screenshot, WebGL2).
- **Main manifest:** `manifest.json`. Valid, exit 0. 48 frames, all present. `pageErrors` [], `consoleErrors` [], `failedRequests` []. `find -newer desktop-s00.png` returns only `session.jsonl`.
  - Plan: `--scroll 0,10,20,30,42,55,70,85,100 --mobile --reduced-motion --states .awards/capture-states.json`.
  - Sky tier in every pass: `quality: low` (software GL).
- **Coverage.** Every frame was opened; s00, s50 and s100 differ.
  - Ch1 19:40: `desktop-s00`, `mobile-s00`, `desktop-rm-s00`.
  - Ch2 20:10: `desktop-s10`, `mobile-s10`, `desktop-rm-s10`.
  - Ch3 21:00: `desktop-s20/s30`, `mobile-s20`, `desktop-rm-s20/s30`, plus `moon-full` in all three passes.
  - Ch4 21:45: `desktop-s42`, `mobile-s30`, `desktop-rm-s42`.
  - Ch5 22:30: `desktop-s55`, `mobile-s42`, `desktop-rm-s55`.
  - Ch6 00:45: `desktop-s70/s85`, `mobile-s55/s70/s85`, `desktop-rm-s70/s85`, plus `booking-open`, `booking-errors`, `booking-done`, `booking-escape` and `rail-jump` in all three passes.
  - Close 01:15: `desktop-s100`, `mobile-s100`, `desktop-rm-s100`.
  - Keyboard: `keyboard-skip` in all three passes.
- **No-GL:** `.awards/captures/20261020T211046-verdict2-nogl/nogl-manifest.json`. Valid, 13 frames, 0 errors.
  - Frames: `nogl-desktop-s00/30/70/100`, `nogl-mobile-s00/30/70/100`, `nogl-desktop-focus-1..3`, `nogl-desktop-hover-2..3`.
  - Every hover and focus element reports `matched: true`; every state is authored in the torch style.
- **Hash 404:** `.awards/captures/20261020T211109-verdict2-404/manifest.json`. Target `http://127.0.0.1:47933/index.html#andromeda`; valid, 7 frames, 0 errors.
  - Frames: `desktop-s88`, `mobile-s88`, `desktop-focus-1..3`, `desktop-hover-2..3`.
- **Live DOM probes** (Playwright, same build, at 320 / 390 / 768 / 1440):
  - `#uncharted` is `hidden`, `display:none`.
  - `scrollWidth` equals the viewport width.
  - The readout is visible at every width; at 320 it reads "37 stars".
  - Rail links are at least 44 px tall: 39 × 44 at 320, 48 × 44 at 390.
  - The ledger has 16 lines, 16 unique, and one "best night".
  - In the error state, `[data-book-error]` is covered by `.book__foot`:
    - 390: error at 824–870, foot top 750.
    - 1440: error at 760–783, foot top 770; `elementFromPoint` hits `book__foot`.
  - A rail jump focuses the target h2 in both the reduced and full tiers (`h-2100`, `h-nights`, `:focus-visible`).
  - Hash-404 layout shift: CLS 0.5047, from one 0.5 shift at 242 ms with sources `#lights-on` and `.close__inner`.
- **Metrics:** DOM 817 nodes; CLS 0.0051 desktop / 0.0003 mobile / 0.0049 rm.
  - `lcpColdSynthetic` 244 / 104 / 76 ms. This is a headless cold-cache value, read only as an asset-weight signal.
- **Audit:** `.awards/audit.json` (2026-10-20T21:07:55Z, newer than every source). P0 0 · P1 0 · P2 0 · P3 0.
  - Exceptions: C02, P04, T02, S06, X14. C02 is still parsed from the example inside the `## Exceptions` HTML comment and masks nothing.
- **Neighbours:** `.awards/neighbours/{white-desert,son-daven,usavionix}` hold only the 20:42 exit-4 manifests (no frames). Not retried in verdict mode.
- **Console / page errors:** 0 / 0 across all three passes.

## Verdict
| Location | Change | Expected visible result | Viewport/state | Before evidence | After evidence | Status |
|---|---|---|---|---|---|---|
| base.css global `[hidden]` (was `.ch` display at base.css:144), src/index.html:160 | `[hidden]` wins over `.ch { display:grid }` | No uncharted notice between the ledger and "Lights on."; it still appears on an unknown hash | desktop, mobile, rm s85; hash state | 20261020T203234-jury/manifest.json `desktop-s85.png`, `desktop-rm-s85.png` | 20261020T210858-verdict2/manifest.json `desktop-s85.png`, `desktop-rm-s85.png`, `mobile-s85.png`; 20261020T211109-verdict2-404/manifest.json `desktop-s88.png`, `mobile-s88.png`; DOM `display:none` at 320–1440 | resolved |
| src/js/app.js done text, src/index.html done pane | The confirmation says it is a client-side demo; the TWINT / pay-at-hut instruction is removed | The done state reads as a demo | desktop, mobile, rm `booking-done` | 20261020T203234-jury `desktop-state-booking-done.png`, `mobile-state-booking-done.png` | 20261020T210858-verdict2 `desktop-state-booking-done.png`, `mobile-state-booking-done.png`, `desktop-rm-state-booking-done.png`: "Your seats are marked." plus a "Demo booking … nothing was sent or charged" note | resolved |
| src/styles/base.css:370, :389-397 (readout below 1100 / 900 px) | Keep the star count in the phone strip | "37 stars" in the phone strip, climbing with scroll | mobile s00/s10/s20 | 20261020T203234-jury `mobile-s00.png` (no count) | 20261020T210858-verdict2 `mobile-s00.png` 37 → `mobile-s10.png` 3,700 → `mobile-s20.png` 4,000 stars | resolved |
| src/js/nights.js:75-112 (`line()`) | One line per night from its own Moon and Orion times; "An 18%" | No two rows share a sentence; one "best night" | desktop s70/s85, mobile s55/s70 | 20261020T203234-jury `desktop-s70.png`, `mobile-s55.png` | 20261020T210858-verdict2 `desktop-s70.png`, `desktop-s85.png`, `mobile-s55.png`, `mobile-s70.png`; DOM 16 / 16 unique, 1 "best night" (nights.js:82); no "A 18%" in index.html | resolved |
| src/index.html:190 (`.close__colophon`) | Dual-unit altitude | The close carries both units | desktop s100, mobile s100 | 20261020T203234-jury `desktop-s100.png` | 20261020T210858-verdict2 `desktop-s100.png`, `mobile-s100.png`: "2,340 m (7,677 ft)" | resolved |
| src/styles/base.css:117-123 (`.strip` background `var(--ground)`) | Opaque strip | No copy reads through the strip | mobile s10/s30/s85, `booking-escape` | 20261020T203234-jury `mobile-s30.png`, `mobile-state-booking-escape.png` | 20261020T210858-verdict2 `mobile-s10.png`, `mobile-s30.png`, `mobile-s85.png`, `mobile-state-booking-escape.png`; desktop `desktop-s20.png` | resolved |
| src/js/sky.js (M31 as its own point kind, alpha .07, 4 px) | Exempt M31 from the low-tier glow gain | A faint soft oval, not a bright smudge over text | desktop s10–s55, mobile s10–s42 | 20261020T203234-jury `desktop-s20.png`, `mobile-s20.png` | 20261020T210858-verdict2: desktop is softer and fainter (`desktop-s20.png`, `desktop-s42.png`). On phone it is still a bright blob crossing UI and text: inside the "New Moon" chip (`mobile-s20.png`), over "Galaxy" in the Andromeda h3 (`mobile-s30.png`), over "paths" (`mobile-s10.png`) | partial |
| src/styles/base.css:396, :422 (`.rail a` < 900 / < 360 px) | Rail targets ≥ 44 × 44 at 390 and 320 | Rail hit areas ≥ 44 × 44 | mobile strip | 20261020T203234-jury DOM probe 48×40 / 39×40 | DOM probe 48 × 44 at 390, **39 × 44 at 320**; 20261020T210858-verdict2 `mobile-s00.png` | partial |
| src/styles/base.css:355-360 (`.book__foot` sticky) | Total and submit pinned in the phone sheet | The opened sheet shows the total and the submit without scrolling | mobile `booking-open` | 20261020T203234-jury `mobile-state-booking-open.png` | 20261020T210858-verdict2 `mobile-state-booking-open.png`: "Total CHF 150 · Hold 3 seats · CHF 150" in view. It introduced regression 1 | resolved |
| src/js/app.js:479-483 (heading clip reveal) | Clip inset extends below the line box | The "g" of "Lights on." keeps its descender | desktop s100, nogl s100 | 20261020T203234-jury `desktop-s100.png`, 20261020T203234-nogl `nogl-desktop-s100.png` | 20261020T210858-verdict2 `desktop-s100.png`, 20261020T211046-verdict2-nogl `nogl-desktop-s100.png` | resolved |

Also re-checked (not a fix row):
- Source finding app.js:435, reduced-tier rail jump without focus: resolved (`desktop-rm-state-rail-jump.png`; DOM focus on `h-nights`).
- The ship-originated `.btn--strip` gap fix: resolved. `20261020T210501-verdict/mobile-s00.png` shows a double gap; `20261020T210858-verdict2/mobile-s00.png` and `desktop-s00.png` read "Book a night" with single spacing.

## Regressions (≤ 3)
1. **The booking error message is now under the sticky footer.**
   - Mobile: invisible.
   - Desktop: only its top edge shows.
   - Before the batch it read in full below the Email field (20261020T203234-jury `mobile-state-booking-errors.png`, `desktop-state-booking-errors.png`).
   - After: 20261020T210858-verdict2 `mobile-state-booking-errors.png`, `desktop-state-booking-errors.png`, `desktop-rm-state-booking-errors.png`.
   - DOM: at 390 the error sits at 824–870 against a foot top of 750; at 1440 it sits at 760–783 against 770.
   - Cause: `position: sticky; bottom: -24px` on `.book__foot` (base.css:355-360), with `[data-book-error]` directly above it in the scroller (src/index.html:237).
   - A sighted phone visitor sees two red-outlined fields and no reason. `role=alert` still announces the message.
2. **Hash-404 layout shift.**
   - Desktop CLS on `#andromeda`: 0.0814 before (20261020T203640-jury404b/manifest.json), 0.3818 after (20261020T211109-verdict2-404/manifest.json; 20261020T210501-verdict-404 measured 0.5047).
   - The probe recorded one 0.5 shift at 242 ms on `#lights-on` / `.close__inner`.
   - Cause: `#uncharted` is now `display:none` until `checkHash` unhides it after load (src/js/app.js:456-465).
   - Rare path only; a normal load stays at 0.005.

No other regression was found. The ridge-layering change (motion.css) keeps the 404 links clear (`20261020T211109-verdict2-404/mobile-s88.png`). The dome top peeking at the bottom edge of `desktop-rm-s10/s20` was already present in `20261020T203234-jury/desktop-rm-s10.png`.

## Keep
The split "Stay until / the stars arrive." over an almost empty 19:40 sky, the scroll-clock star count, and the moon dial feeding the same star model as every ledger row.

Still visible:
- The split over an empty sky: `desktop-s00.png`, `mobile-s00.png`.
- The count climbing:
  - desktop: 37 → 960 → 4,000 (`desktop-s00`, `desktop-s10`, `desktop-s20`);
  - phone: 37 → 3,700 → 4,000 (`mobile-s00`, `mobile-s10`, `mobile-s20`).
- The dial: 410 stars at full Moon (`desktop-state-moon-full.png`).
- Ledger rows from the same model: 610, 460 and 430 stars under a gibbous Moon, 4,000 on dark nights (`desktop-s70.png`).

## Remaining
1. Booking error hidden under the sticky footer (regression 1). src/styles/base.css:355-360, src/index.html:237.
2. Phone rail links 39 px wide at 320 px (partial; walk 2). src/styles/base.css:396, :422.
3. Hash-404 CLS 0.38–0.50 desktop (regression 2). src/js/app.js:456-465.
4. M31 still a bright blob over text and controls on phone, on the low tier (partial): `mobile-s10/s20/s30.png`. src/js/sky.js, M31 point kind.
5. Carried source finding: at the close (clock 01:15) the rail still marks 00:45, because the rail maps the close to `nights` (src/js/app.js:383; DOM `aria-current` on 00:45 at the page end).

## Scores (recomputed on the recapture)
| Axis (weight) | Score /10 | One-line reason |
|---|---|---|
| Design (40) | 7.5 | One red-torch world now holds from strip to sheet to close to 404, with no notice in the flow and no copy through the strip. Seams left: the M31 blob over phone text (`mobile-s30`), 16 equal red Book blocks with no lead row (`desktop-s70`), and the error text under the sheet footer (`mobile-state-booking-errors`). |
| Usability (30) | 7.0 | Capped at 7 by walk 2: rail links are 39 × 44 at 320. Walk 6 now passes. Phone count, sticky total, opaque strip and reduced-tier focus all work. The hidden error message (regression 1) costs the conversion path its feedback. |
| Creativity (20) | 7.7 | The scroll clock filling the sky now reads on the phone too (`mobile-s00` → `mobile-s20`). The dial and every ledger row share the star model (`desktop-state-moon-full`, `desktop-s70`). |
| Content (10) | 7.8 | Sixteen distinct lines, each from that night's own Moon and the computed time Orion clears the ridge, with its own telescope target (`desktop-s70`, `desktop-s85`). Dual units (`desktop-s55`, `desktop-s100`). An honest demo note (`desktop-state-booking-done`). The submit still says "Hold 3 seats" for a demo. |
| **Weighted** | 7.42 | 7.5×0.4 + 7.0×0.3 + 7.7×0.2 + 7.8×0.1 = 3.00 + 2.10 + 1.54 + 0.78. ≥ 7.2, no axis < 6.8. |

| Developer criteria | Score /10 | Note |
|---|---|---|
| Animation and interaction | 8.2 | One ticker, `ease:'none'` scrub. The reveal no longer crops descenders (`desktop-s100`, `nogl-desktop-s100`). |
| Performance | 8.3 | 0 failed requests; normal-load CLS 0.005; whole file ≈ 150 KB gz per the ship report. The hash-404 path shifts by 0.38–0.50 (regression 2). |
| Responsive | 7.8 | Two-row phone strip with the count, a sticky sheet total, no overflow at 320. Rail links are 39 px wide at 320, and the sticky footer covers the error at 390. |
| Accessibility and semantics | 7.6 | The hidden 404 is no longer exposed in `<main>`; reduced-tier rail jumps move focus. The error text is visually covered and not tied to its fields with `aria-describedby` (src/index.html:237). |
| Code quality | 7.9 | 0 console and page errors. A global `[hidden]` guard. Context loss and pagehide teardown are unchanged. |

## Usability walk (recapture)
- **walk 1 — pass.** Skip link first (`*-state-keyboard-skip`). Dial on End / arrows (`*-state-moon-full`). Escape returns focus to the row's Book (`*-state-booking-escape`). Rail jump focuses the h2 in both tiers (`desktop-state-rail-jump`, `desktop-rm-state-rail-jump`).
- **walk 2 — fail.** Rail links are 39 × 44 at 320 (src/styles/base.css:422); 48 × 44 at 390 passes. Caps Usability at 7. No custom cursor and nothing hover-only.
- **walk 3 — pass.** Reduced frames are readable at rest. The sky steps per chapter (`desktop-rm-s10`, 460 stars). The dial and dialog survive (`desktop-rm-state-moon-full`, `desktop-rm-state-booking-open`).
- **walk 4 — pass.** No preloader; the twilight beat never gates content.
- **walk 5 — pass.** s00 answers what (a dark-sky observatory at 2,340 m), for whom (twelve guests, from CHF 48) and what to do (Choose your night).
- **walk 6 — pass.** No uncharted notice on a normal load (`desktop-s85`, `mobile-s85`). The hash 404 is authored with three exits (`20261020T211109-verdict2-404/desktop-s88.png`). Minor: the rail marks 00:45 at the 01:15 close.
- **walk 7 — pass.** One named action on every chapter; booking completes (`*-state-booking-done`). The error feedback is hidden (regression 1).
- **walk 8 — pass.** The no-GL 2D sky keeps all text (`nogl-desktop-s30`, `nogl-mobile-s70`); no overflow at 320; no external requests.

## Contract fidelity (recomputed)
| Block | Kept? | Evidence |
|---|---|---|
| THESIS | kept | Red and ember only in the UI. The count runs 37 → 4,000, and the full Moon cuts it to 410 (`desktop-s00`, `desktop-s20`, `desktop-state-moon-full`). Each night shows its own moon and count (`desktop-s70`). |
| WORLD | kept | Opaque strip (`mobile-s30`). Same tokens and faces in the dialog, the 404 and the close (`desktop-state-booking-done`, `20261020T211109-verdict2-404/desktop-s88.png`). |
| STORY | kept | Six clock-headed chapters plus the close, with the register switch at 00:45 (`desktop-s10` … `desktop-s100`). |
| FIRST VIEWPORT | kept | The phone strip carries wordmark, star count and action (`mobile-s00`). Desktop strip, split h1 and ridge (`desktop-s00`). |
| SIGNATURE | kept | Readout (job 2) on every width. The dial and the ledger share the model (`desktop-state-moon-full`, `desktop-s70`). 2D fallback (`nogl-desktop-s30`). |
| SCROLL MODEL | kept | Native scroll plus Lenis on one ticker; `scrollMode: hook` reaches every chapter. |
| LOAD & CLOSE | kept | No 404 notice on a normal load (`desktop-s85`). The close shows "01:15 Lights on." (src/index.html:173), a second action and "2,340 m (7,677 ft)" (`desktop-s100`). |
| DIVERGENCE | kept | One concept line per night, 16 unique (`desktop-s70`, `desktop-s85`; DOM). |
| BRIEF (binding) | kept | The confirmation says it is a demo (`desktop-state-booking-done`, `mobile-state-booking-done`). |

## Memory test (verdict recapture, written from `desktop-s00.png` before the contract was re-read)
"A night clock: a strip of times from 19:40 to 00:45 beside a counter reading '37 stars, limit 2.7 mag', above the split line 'Stay until / the stars arrive.' with an almost empty dusk sky between its halves, and a black ridge carrying a domed observatory with one lit red window."

On a phone the counter now reads "37 stars" in the strip (`mobile-s00`).

## Specificity and slop
- **Specificity:** no. The first viewport matches neither white-desert, son-daven nor usavionix.
- **Finish bar:** the neighbour frames are unavailable for all three cards (white-desert, son-daven, usavionix: capture exit 4 at 20:42, no frames).
  - The white-desert §3 gap still stands: 16 equal torch-red Book blocks, so no row leads (`desktop-s70.png`).
- **Slop scan:** families present: 1.
  - Layout, "text under an opaque layer": the booking error sits under the sticky `.book__foot` (`mobile-state-booking-errors.png`; base.css:355-360).
  - The strip and ridge instances from the first report are resolved.
  - generator nameable: no.

## Disposition derivation
1. **recapture:** no. The evidence is valid.
2. **rebuild:** no. Weighted 7.42 ≥ 6.8; no nameable source site; the memory test names objects; the THESIS is visible at s00.
3. **fix:** no. Weighted ≥ 7.2; no axis < 6.8 (lowest is Usability 7.0); audit P0/P1 0; every contract row kept.
4. **ship:** yes. Walk 1 and walk 3 passed.

The regressions and partials above are recorded under Remaining. They do not alter the mechanical rule.

## Ceiling
Ceiling: the chart's ring markers sit beside the paragraphs and never on the objects in the live sky, so the page names Andromeda and the Pleiades without ever pointing a finder at them.
