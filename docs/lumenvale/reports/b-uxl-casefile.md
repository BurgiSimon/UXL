# UX Case File: Lumenvale (hero → calendar → booking dialog → confirmation, plus the phone dock and chapter index)

> Prepared by UXL · 2026-10-20 · Viewports: 390×844 and 375×667 touch, 1440×900 desktop · I ran the flows in Playwright Chromium with swiftshader WebGL and booked for real in the page.

## Verdict

The booking path works well and nothing blocks booking. The hero offers the next dark night with a Book button above the fold, the dialog is short and shows progress, and the ending is designed. The biggest risks:
- On phones, two filled orange "Book" buttons compete through most of the story, and they lead to different places. This is a CSS specificity bug.
- "Dark", the attribute task 1 depends on, is hard to read in the calendar rows.
- Two key facts are missing where users decide: "no payment now" at the moment of committing, and a findable meeting point on the confirmation.

| | Mobile | Desktop |
|---|---|---|
| Heuristic score (uxl_audit, from `.awards/uxl-report`) | 96/100 | 96/100 |
| Static score (uxl_lint, re-run on src/) | 92/100 | |
| Critical / major / minor (this audit) | 0 / 5 / 7 | 0 / 4 / 5 |

**Top 3 issues**
1. Two filled "Book" buttons on screen at once through the mobile story, with different destinations (§L28, §L15).
2. Dark nights aren't labelled "dark" in the calendar rows (§L17, §L15).
3. The pay-at-the-venue reassurance is hidden at the commit point, and the calendar intro contradicts it (§L29, §L17).

## Findings

### Critical
None.

### Major

**[M1] §L28 Von Restorff, §L15 Similarity: on mobile, the header button and the dock are both filled "Book" buttons, but they do different things**
- **Evidence:**
  - `src/styles/main.css:108` (`.bar.is-solid:not(.is-calm) .bar__book`, specificity 0,4,0) beats the mobile override at `main.css:109` (`.bar.is-solid .bar__book`, 0,3,0).
  - Measured at 390px: from Lights out through The moon decides (scrollY ≈ 865–3,900, about 4.5 screens), the header button is `rgb(255,91,69)` and the dock is on with a filled `Book`.
  - `src/js/story.js:208` says the intent is "one primary Book per view".
  - Screenshots: `m-lights-out.png` and `m-index-open.png`
  - The lint's §L28 finding counted buttons from separate views, but this runtime check shows a real §L28 problem on mobile.
- **Impact:** Two equal, maximum-emphasis buttons cancel each other out. "Book a night" scrolls to the calendar, while the dock's "Book" opens the dialog for Sat 31 Oct. Users can't predict which one does what.
- **Remedy:** Limit the filled header style to desktop and delete line 109.
  ```css
  @media (min-width: 768px) {
    .bar.is-solid:not(.is-calm) .bar__book { background: var(--accent); color: var(--on-accent); border-color: transparent; }
  }
  ```

**[M2] §L17 Mental Model, §L15 Similarity: calendar rows never say "Dark", and the row's moon icon can suggest the opposite**
- **Evidence:**
  - The row markup at `src/js/schedule.js:186-187` shows the phase and the moon line only.
  - The only row-level cue is a 6px dot (`main.css:353`), and the legend (`index.html:205`) doesn't explain the dot.
  - The vocabulary is split: the filter says "Dark sessions only", the hero and dock say "Next dark night", the dialog select says "Dark sky" (`booking.js:49`), and the rows say none of these.
  - The featured "dark" night, Sat 31 Oct, shows a 63%-lit moon icon. Fri 30 Oct (74%, moon rises 20:38, not dark) looks almost the same.
  - The definition doesn't match the data. The legend says "moon is down or nearly new for the whole session", but `dark = darkness >= 0.85` (`schedule.js:71,114`) also marks Fri 13 Nov ("Waxing crescent, 18% lit · Moon sets 19:32") and Sat 12 Dec (12%, sets 19:30) as dark.
  - Screenshots: `d-calendar.png` and `mobile-calendar-rows.png`
- **Impact:** Task 1 is to find a dark night. Without the filter, users have to read two lines of muted text per row. People scanning by the moon icon will skip good nights such as 31 Oct and 28 Nov (78% lit, moon down).
- **Remedy:**
  - Add a text tag to dark rows and use one term everywhere:
    ```js
    const tag = n.dark ? '<span class="night__tag">Dark sky</span>' : '';
    // render before .night__window; style as a small outlined label, not just a dot
    ```
  - Dim the moon icon when the moon is below the horizon all session.
  - Either tighten `dark` to match the legend, or reword the legend: "moon below the horizon, or a thin crescent, for most of the session".

**[M3] §L29 Working Memory, §L17 Mental Model: "No payment now" is out of sight when users commit, and the calendar intro implies prepayment**
- **Evidence:**
  - The `.booking__pay` paragraph sits at the bottom of step 2 (`index.html:325`).
  - At 375×667 it is at y=622–665, while the scrollable body ends at y=502, so it's 163px under the sticky footer.
  - At 390×844 it fits only until a validation error shows. After that it is hidden.
  - Step 1's footer total (`index.html:340`) never says when you pay.
  - The calendar intro promises to "refund in full" if it's cloudy (`index.html:199`), which implies money was taken. Nothing earlier in the flow says you pay at the venue.
  - Screenshots: `s-step2.png` and `mobile-dialog-errors.png`
- **Impact:** "Reserve 2 seats · CHF 96" next to a big total looks like a charge. Hesitant users drop out right before the one fact that would reassure them. This is not a dark pattern: the information is honest, it's just placed late.
- **Remedy:**
  - Put the fact in the sticky footer note, e.g. `totalNote` → "2 adults · pay on the night, nothing now" (`booking.js:94`), or move `.booking__pay` above the fields.
  - Change the intro to "…move you to another night or cancel at no cost".
  - Say what happens after the 24-hour free-cancellation window.

**[M4] §L23 Peak-End, §L29 Working Memory: the confirmation says when to meet but not how to find the place**
- **Evidence:**
  - Ticket rows (`booking.js:226-235`): "Meet 18:45, Lumenvale valley station". There is no address, map link, PostBus stop, what to bring, or how a cloud cancellation will reach you.
  - The ICS `LOCATION` is "Lumenvale valley station, Val Lumen" (`booking.js:307`), which a maps app can't locate.
  - The directions live only in the footer "Getting here" text (`index.html:240`).
  - The phone number is optional, yet the cloud notice is a text message (`index.html:323`, `index.html:248`). Users who skip the phone are never told how they'll be informed.
  - Screenshot: `mobile-dialog-done.png`
- **Impact:** Task 3 ("know when and where to meet") is only half served at the step people screenshot and keep. A minibus with a fixed departure up a mountain road leaves no slack for getting lost.
- **Remedy:**
  - Add ticket rows: "Where" (street address plus a map link), "Getting there" (PostBus stop, free parking), "Bring" (warm layers, −3 °C), and "If cloudy" (we email, and text if you gave a number, by 14:00).
  - Put the full address and `GEO:46.5;8.05` in the ICS.

**[M5] §L24 Postel's Law (all input methods): after a booking started from a calendar row, keyboard focus drops to `<body>`**
- **Evidence:**
  - `onBooked` calls `hydrate()` (`main.js:41-46`), which replaces the calendar's HTML (`hydrate.js:45`). The original trigger button is removed, so the `document.contains(trigger)` check in `booking.js:279` fails.
  - Measured after pressing Done: `document.activeElement` is `BODY` (scrollY 4665).
  - Starting from the hero button, focus returns correctly.
- **Impact:** Keyboard and screen-reader users lose their place on a page about 9,000px long, at the end of the main task. Their next Tab goes back to the skip link at the very top.
- **Remedy:**
  ```js
  const back = document.contains(trigger) ? trigger
    : document.querySelector(`#${night.id} .night__book`) || document.getElementById(`${night.id}-t`); // give the h4 tabindex="-1"
  back?.focus({ preventScroll: true });
  ```

### Minor

| # | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|
| m1 | §L11 Jakob's, §L17 | The mobile chapter-index button is a bare time ("20:05") in a box. Its chevron renders 0px wide, so nothing shows it's a menu. Fix this first among the minors: it's a one-line change. | Measured `svg` width 0 (computed `max-width:100%` from `main.css:32` inside the inline-flex button at `main.css:116`). `main.css:511` also hides the chapter name. | `.bar__index-toggle svg { flex: none; max-width: none; }` and show a short label, e.g. "Chapters". |
| m2 | §L15 Similarity | When both private sessions are taken, the add-on still looks available: label at full strength, pointer cursor, only the box at 40% opacity. | `main.css:461-467`; Wed 21 Oct in `mobile-dialog-step1.png` | `.addon:has(input:disabled) { opacity:.5; cursor:not-allowed }` |
| m3 | §L05 Cognitive Load | In the red "Lights out" theme, muted text is 3.39:1, below the 4.5:1 minimum. This hits the fact labels and the dock's "NEXT DARK NIGHT" (12px). All other themes measure 6.1–7.4:1. | `tokens.css:17` and `tokens.css:64-69`; computed from the tokens | In `[data-theme="red"]`, mix muted at about 85% ink, or use ink for labels. |
| m4 | §L17 Mental Model | The row label "MEET 18:45–22:40" puts a point-in-time label on a range. | `schedule.js:188` | Write "Meet 18:45 · back 22:40", as the dialog summary already does. |
| m5 | §L17, §L21 | The index item "Your night" goes to the moon slider, not the calendar, and there is no "Nights" entry. | `index.html:38`, `story.js:160` | Point it to `#nights` or add a "Nights · Book" item. |
| m6 | §L14 Prägnanz | The native select's text is cut off on phones ("…3 seats l"). | `booking.js:49`; `mobile-dialog-step1.png` | Shorter options: "Wed 21 Oct · 3 left · bright moon". |
| m7 | §L15, §L01 | 11–12 font sizes are in use (carried over from uxl_audit). | `.awards/uxl-report/report.md` | Fold them into the token scale. |

I'm not reporting the two lint `slow-animation` hits (`main.css:29`, `main.css:173`). They are 900ms ambient theme cross-fades, not interaction feedback.

**Dark-pattern sweep (§L04):** none found. The add-on is unchecked by default, the total is always visible, there are no timers, the optional phone field states its purpose, and the colophon says seat counts are illustrative.

## What works well (keep it)
- The hero shows the next dark night with moon status, meet time, seats and a direct Book button. The button is above the fold at 390×844 and 375×667, and it skips the calendar (§L21, §L22).
- The "Dark sessions only (15)" filter shows counts, and the "Show N more" control respects the filter (§L02, §L10).
- In the calendar, only the featured row's Book is filled, and the header calms down there. Desktop keeps one primary action per view (§L28).
- The dialog:
  - It says "Step 1 of 2" and has a progress bar (§L09).
  - The total stays visible with a live breakdown (§L29).
  - The button names count and price ("Reserve 2 seats · CHF 96").
  - Step 2 recaps the choices.
  - Seats are capped to what's left, with an explanation.
  - Fields are 44–48px, with correct `autocomplete`/`inputmode`.
  - Validation runs on blur, with specific messages and focus moved to the first error (§L07, §L24, §L20).
- Escape keeps typed details and returns focus to the button that opened the dialog (§L30).
- The end is designed: a "You're on the plate." ticket, a reference number and an .ics file. The calendar row then shows "Booked · 2 seats" and a live-region announcement (§L23).
- The dock is short (date, seats left, Book), sits in the thumb zone, and hides over the calendar and while the dialog is open (§L07).
- Body-text contrast is 6.1–7.4:1 in the dusk, night and dawn themes, and there are proper reduced-motion tiers.

## Not assessed
- Virtual keyboard behaviour in step 2 on real iOS/Android devices. Name is focused automatically, so the keyboard will likely cover even more of the dialog than measured here.
- Whether the .ics data-URI download works in iOS Safari.
- Screen-reader output (I only checked the DOM and focus).
- Performance on low-end phones (the WebGL here ran on swiftshader).
- Deep links (`#night-…`, `#book-night-…`) and the "lost" not-found state, the no-JS fallback, the 768–1099px breakpoint, `404.html`, and whether confirmation emails are actually sent.

## Fix plan
1. **Root causes:** the header-button specificity (M1, one rule), the chevron CSS (m1), and the red-theme muted token (m3).
2. **Critical flows:** dark labelling and definition (M2), pay-later copy in the footer plus the "refund" wording (M3), meeting point on the ticket and in the ICS (M4), focus return after booking (M5).
3. **Polish:** m2, m4–m7.

Probe scripts are in `probe`/` (flow.cjs, chrome.cjs, desk.cjs, dual2.cjs). I didn't edit any project files.
