# What UXL contributed to the Voxmere build (Session B, with UXL) vs Session A (awards only)

Sources:
- B transcript `demo3-runs/with-uxl/session.jsonl` (3,709 lines), parsed with Python. **Event index = 0-based line number in that file**; times are the event `timestamp` (UTC, 2026-10-21).
- A transcript `demo3-runs/without-uxl/session.jsonl`.
- Both project folders: AWARDS.md, DESIGN.md, `.awards/` reports, `src/`.

Attribution rule: every path contains `with-uxl` and the session dir contains `-home-user-UXL`, so both strings were stripped before searching. UXL evidence counts only when it is one of these:
- the `uxl:ux-lawyer` Skill call;
- a Bash call to `UXL/skills/ux-lawyer/...` (`uxl_lint.py`, `uxl_audit.mjs`, references);
- a `§Lnn` citation or a "UXL" label in B's own output;
- a Laws-of-UX name in B's own output.

Thinking blocks in this transcript are short summaries, and they are quoted as such.

---

## 0. Timeline (B)

| Event | Time | What happened |
|---|---|---|
| 8 | 06:46:06 | `Skill awards:craft` (pipeline driver) |
| 63 | 06:46:53 | AWARDS.md brief written. **Pre-UXL:** `the "first-batch remaining" figure is a fictional counter.` |
| 69 | 06:46:57 | `Skill awards:concept` |
| 276 | 06:51:04 | `Skill awards:system`. DESIGN.md is written at [389]; it already has `touch targets ≥ 48 px`, a 52 px primary, a primary "disabled" state and three reduced-motion tiers |
| 402 | 06:54:15 | `Skill awards:structure` loaded |
| **409** | **06:54:19** | **`Skill uxl:ux-lawyer`**, 4 s after structure loaded and before any page map or skeleton work |
| 413, 415 | 06:54:21–23 | B reads the UXL `references/component-playbook.md` sections: Global navigation, Hero, CTAs, Forms, Checkout and payment, Pricing, Modals, Multi-step wizards, Landing page order, Footer |
| 435, 437 | — | B reads the awards base.css, the 404 template and the a11y/responsive patterns |
| 582 | 06:57:23 | Thinking: "I've incorporated the UX laws into the reservation flow design…" |
| **583** | **06:57:43** | **AWARDS.md page map edit.** Row 5 Notes get the `UXL:` clause |
| 709 | 07:02:00 | index.html skeleton: Step 1 of 3, region options carrying their ship month, the summary `<dl>`, "Step 2 of 3" dialog, the decline-card note, the reserved panel with cancel |
| **961** | **07:07:54** | **DESIGN.md Components rewritten**, citing §L24, §L28 and §L29 |
| 998 / 1157 / 1430 | 07:08 / 07:11 / 07:18 | `awards:stack` / `awards:motion` / `awards:webgl` |
| 1295–1315 | 07:14–07:15 | reserve.js and checkout.js written "following the UXL spec" |
| 1366 | 07:16:20 | Playwright flow test: happy path, empty submit, declined card, confirmation (UXL step 7) |
| **1977–2258** | **07:31–07:36** | **UXL scanner block, after WebGL and before the jury:** lint → fix → audit ×3 → fixes |
| 2326 | 07:38:13 | `Skill awards:jury` round 1 (component `#light`), run as a forked subagent |
| 2672 / 2728 | 07:53 / 07:55 | B declines jury fix 1, citing "UXL §L05, §L25" |
| 2745 | 07:57:25 | Brief rewritten: counter "Deliberately absent… (it would be invented scarcity, UXL §L04)" |
| 2952 | 08:08:14 | `Skill awards:jury` round 2 (full site), forked subagent |
| 3248 | 08:24:17 | `Skill awards:ship` |
| **3597** | **08:37:43** | **Final UXL audit and lint**, for the before/after numbers |
| 3684 | 08:43:15 | Ship report written with a UXL line |
| 3705 | 08:43:55 | Final message |

---

## 1. The `uxl:ux-lawyer` invocation [409]

**Where in the pipeline:**
- After `awards:concept` and `awards:system`, whose DESIGN.md and tokens already existed.
- Immediately after `awards:structure` loaded [402–404] and before structure produced anything (page map, skeleton, 404).
- Before `awards:stack`, `awards:motion`, `awards:webgl`, `awards:jury` and `awards:ship`.

There was exactly one invocation in the session.

**Args (verbatim):**
> "Building the Voxmere single-page site (award-level, see AWARDS.md/DESIGN.md in the project root): hero, story chapters, a hand-turn interaction, size comparison, and a multi-step reservation flow (size, finish, region, price/deposit/ship date, fake payment, confirmation). Desktop and mobile. Apply the laws while building the static skeleton and the reservation flow."

**What B read:**
- SKILL.md [411], in Build mode.
- The playbook sections listed above [415].
- B did **not** open any `references/laws/*.md` file, `platform-mobile.md`, `design-tokens.md`, `assets/checklist.md` or `assets/report-template.md`.

**What B decided or wrote right after:**

1. Thinking summary [582]:
   > "I've incorporated the UX laws into the reservation flow design: three choices per view, a payment breakdown for today vs. shipping, a "Step 2 of 3" progress indicator, and no fake scarcity counters. Next, I'll write the page map and static HTML."

2. AWARDS.md page map, row 5 "Reserve" Notes [583]. The text survives in the final AWARDS.md:69:
   > "Register: numeric, plain. **UXL: one primary per view, labels above inputs, autocomplete, card grouping, decline path (4000 0000 0000 0002), never-disabled submit, selection saved to localStorage, no scarcity counter.** Live region for errors and result."

   The same row's Design column adds:
   > "Payment is a `<dialog>` (Step 2 of 3) that goes full-screen on phones; Step 3 is the confirmation."

   That echoes the UXL Modals spec ("Long forms open full-screen") and the Multi-step spec ("Step 2 of 4").

3. DESIGN.md `## Components` rewritten [961], with explicit citations:
   - Primary button:
     > "Loading: label becomes "Processing…" with a spinner, `aria-busy="true"`, width locked, repeat presses ignored. **Never disabled to signal invalid input (UXL §L24). One per view (§L28).**"

     This **replaced** the pre-UXL entry from [389]: "disabled: `--line` fill, `--muted` text, `cursor: not-allowed`, `aria-disabled`".
   - Configurator:
     > "three `<fieldset>`s of radio rows (60 px, label + meta)… **the ship month sits inside each region option (recognition over recall, §L29).** Summary `<dl>` updates live (item, price, due today, due at shipping, ship month). Choice saved to localStorage and restored."
   - Checkout dialog:
     > "native `<dialog>` with `showModal()`, "Step 2 of 3", close button (48 px) and Escape; labels above inputs; `autocomplete` email, cc-name, cc-number, cc-exp, cc-csc; card number grouped in fours, expiry normalised to MM / YY; validation on blur and on submit with an error summary (`role="alert"`) that links to each field; decline path on 4000 0000 0000 0002; full screen on phones. Step 3 "Reserved." with the reference, the summary, what happens next and one action."

4. Building the flow [1295], thinking summary:
   > "next I'll build the reservation slip and demo checkout, **following the UXL spec** with labeled inputs, autocomplete, card grouping, blur/submit validation with a linked error summary, a decline path, busy state, and a clear confirmation."

   The checkout.js header comment restates the UXL forms rules (§L24 Postel) in code:
   > "Accept messy input (spaces, dashes, 4/29 or 0429), validate on blur and on submit, keep every value, show one error summary that links to each field, and end on a confirmation that says what happens next."

**Every law citation in B's own output, and the decision each one drove:**

| Event | Verbatim | Law(s) | Decision |
|---|---|---|---|
| 583 | "UXL: one primary per view, … decline path (4000 0000 0000 0002), never-disabled submit, selection saved to localStorage, no scarcity counter." | labelled UXL (statutes §L28/§L10, §L24, §L30, §L04) | Specification of the reservation flow |
| 961 | "Never disabled to signal invalid input (UXL §L24). One per view (§L28)." | §L24 Postel, §L28 Von Restorff | Removed the "disabled" state from the primary button spec |
| 961 | "the ship month sits inside each region option (recognition over recall, §L29)" | §L29 Working Memory | Ship month shown in each region option before choosing |
| 2672 | "skipping fix 1 since bending "held." on phones would make the glass cover most of the word, hurting legibility (UXL §L05, §L25)" | §L05 Cognitive Load, §L25 Selective Attention | Overrode a jury craft fix; the phone keeps a legible `<h1>` under the cube |
| 2728 (AWARDS.md Jury log, line 102) | "Not applied: 1) on a 390 px phone the glass covers nearly the whole word (the first phone build read "L ght, h t, ld."), so the phone keeps a legible `<h1>` under the cube (UXL §L05 Cognitive Load, §L25 Selective Attention); the refraction stays a desktop moment." | §L05, §L25 | Same, recorded in the contract |
| 2745 (AWARDS.md:21) | "Deliberately absent: a "first batch remaining" counter (it would be invented scarcity, UXL §L04)" | §L04 Cognitive Bias (dark patterns) | Removed the planned counter from the brief |
| 3684 (ship report) | "UXL (with-UXL run): runtime `uxl_audit.mjs` small/mobile/desktop 80/100 with 3 major → 96/100, 0 critical, 0 major, 3 minor…" | — | Reporting |

---

## 2. Scanner runs, findings and the fixes that followed

There were 3 lint runs and 4 audit runs. [2009] only printed the audit's `--help`, and [2088] grepped the audit script's source; neither is a scan.

| # | Event / time | Command | Headline result |
|---|---|---|---|
| L1 | 1978 / 07:31:12 | `python3 UXL/skills/ux-lawyer/scripts/uxl_lint.py index.html src --format md` | "**21** files scanned · **1** findings (**0** critical, **1** major, **0** minor) · heuristic score **95/100**". Finding: `index.html:59` `multiple-primary-cta` (§L28 Von Restorff Effect, §L10 Hick's Law), "6 primary-styled actions (5 different) in one file/view" |
| A1 | 2011 / 07:31:32 | `node …/uxl_audit.mjs http://127.0.0.1:8765/ --out .awards/uxl-1 --viewports small,mobile,desktop` | "3 renders · 8 findings (0 critical, 3 major, 5 minor) · **score 80/100**" |
| A2 | 2082 / 07:32:47 | the same command with `--out .awards/uxl-2` | still **80/100**; 3 major / 5 minor |
| A3 + L2 | 2220 / 07:35:40 | audit with `--out .awards/uxl-3`, plus the lint | audit "5 findings (0 critical, 0 major, 5 minor) · **score 93/100**"; lint unchanged (1 major) |
| A4 + L3 | 3597 / 08:37:43 | audit with `--out .awards/uxl-final`, plus the lint | audit "3 findings (0 critical, 0 major, 3 minor) · **score 96/100**"; lint "21 files · 1 findings (0 critical, 1 major, 0 minor) · heuristic score 95/100" |

### "Before" findings: A1 (`.awards/uxl-1/report.md`)

The 3 majors are one problem measured at each of the 3 viewports:
> `contrast` §L01 Aesthetic-Usability Effect, §L25 Selective Attention — "12 text elements below WCAG AA contrast (12 below 3:1)": h1#light-title "Light, held." 1.00:1; a.btn.btn-primary "Reserve a Cube" 1.00:1; h2#turn-title "Turn it yourself." 1.00:1; p.lede "Drag or swipe the Cube, or use the arrow" 1.00:1; a.skip-inline "Skip to sizes" 1.00:1 …

The 5 minors:
- `text-too-small` ×2 (small, mobile): "Most body text renders at 14px on mobile" (32 % of characters). Laws §L01, §L05.
- `font-sprawl` ×3: 9 / 9 / 13 distinct sizes. Laws §L15, §L14, §L01.

Other metrics: "Filled CTAs in first screen: 0" (the hero CTA measured as invisible); "Targets: 25 interactive, 0 undersized".

Cause: the page ground and the hero headline were painted in the WebGL canvas behind the DOM. The DOM `<h1>` was set to `color: transparent` (`.gl-headline .hero-title { color: transparent; }`), so the DOM text was measured against an invisible background.

### What B changed in response, in order

1. **[2008→2009] after L1.** Thinking:
   > "The lint flagged six primary-styled actions in one file, with the phone bar's red "Reserve" conflicting with "Reserve a Cube" on the same viewport—two primaries on one screen. I'll hide the bar's Reserve whenever another primary action is visible."

   Change in `src/app/chrome.js`: an IntersectionObserver counts the `#main .btn-primary, #close .btn-primary` buttons in view, and the phone bar's Reserve gets `data-hidden` whenever any are visible. The code comment says: "so a view never shows two red buttons (one primary per view)".

2. **[2081→2082] after A1.** Thinking:
   > "The 1.00:1 contrast flags are measurement artifacts from WebGL-rendered text, canvas-painted backgrounds, and unparseable P3 colors rather than real issues, but I'll still fix the underlying causes: dropping the P3 accent duplicate so tools read the real 4.62:1 ratio, and consolidating secondary text to a single 15px step to reduce overly small 14px text on mobile."

   Changes:
   - `src/styles/tokens.css`: removed the `@supports (color: display-p3)` accent override.
   - `src/styles/site.css`: 10 secondary-text rules (`.fine`, figure captions, size captions, nav labels, `.steps`, `.hint`, `.sum-note`, `.turn-help`, `.meta-list`, phone spec table) went from 13–14 px to 0.9375rem (15 px). Phone story beats went from 15 to 16 px.
   - DESIGN.md: the accent row now reads "`#c8260f` (sRGB only, so every contrast tool reads the same 4.62:1)".

   A2 still scored 80 (9 contrast elements; body text 15 px).

3. **[2125 → 2186→2189] after A2.** B first planned to except the findings:
   > "I'll log both as reasoned exceptions to preserve the refraction effect, then visually check the annotated phone screenshot." [2125]

   After looking at the annotated screenshot [2128], it reversed:
   > "I found that the ground and headline only exist in canvas, making them invisible to screenshots, prints, or CSS readers. I'm restructuring so the canvas draws only the cubes above a transparent page, while the real background and headline live in the DOM, with the glass still refracting them via its transmission buffer." [2186]

   Changes:
   - `src/gl/stage.js`: renderer `alpha: true` with a transparent clear; `scene.background` removed; a new `behindGlassOnly()` draws the ground plane, the Smoke plane and the headline copy **only into the transmission buffer**; canvas set to `z-index: 5` over the page.
   - `site.css`: removed `.gl-headline .hero-title { color: transparent; }` and `.gl-on .ch-turn { background: transparent; }`.
   - Result, thinking [2219]: "all text now real, visible DOM content and the phone's first screen showing one clear red action."

4. **[2257→2258] after A3** (93/100, 0 major). Thinking:
   > "the lint's "multiple primary CTA" flag is a false positive at the file level, since each rendered view only shows one primary CTA. I'll bump the phone spec table to 16px and update the contract to reflect the new canvas model."

   Changes:
   - `site.css`: phone `.spec-table` cells go from 15 to 16 px.
   - AWARDS.md WebGL contract: "Canvas model: one fixed, transparent canvas over the page… every word and background on the page stays real DOM (no transparent text, correct in print, full-page captures and contrast tools)".
   - DESIGN.md Elevation updated to match.

5. **Final A4 [3597]** (96/100):
   - 0 critical, 0 major, 3 minor, all `font-sprawl` (9 / 9 / 10 sizes).
   - Body text now 16 px on small and mobile.
   - "Filled CTAs in first screen: 1".

   Thinking [3622]: "The UXL runtime audit improved to 96/100 (0 critical, 0 major, 3 minor font-size findings), up from 80/100 with 3 major issues."

   The remaining lint major is justified in the ship report:
   > "Static `uxl_lint.py` 95/100 with 1 major, `multiple-primary-cta`, which is file-level: rendered, each view holds one primary (the phone bar's Reserve steps aside whenever another primary or the order slip is on screen)."

   The text-too-small minor cleared between A3 and A4. The 16 px spec-table edit [2258] was the last edit made for it; the jury fix batch in between also changed the text mix.

**Summary of 80 → 96:**
- 3 majors fixed by the layer inversion: DOM text that rendered at 1.00:1 over canvas-painted ground, plus a transparent h1.
- The P3 accent duplicate was removed.
- Small text was consolidated to 15–16 px.
- Font sprawl (minor) remains.

---

## 3. Case file / report template

**None was written.**
- Searches of B's assistant text, tool inputs and written files for "Case File", "case file" and `report-template` found nothing UXL-related. The only `report-template.md` reads are the **awards** jury template, read by the jury subagents.
- `.awards/uxl-*/report.md` are the scanner's own outputs, not a hand-written case file.
- B was in UXL **Build mode**, which asks for a short "**UX decisions**" hand-off list (≤ 8 bullets with § citations) rather than a case file. B did **not** write that list either.
- Its final message has a "Decisions I made without asking you" list without § citations. Only one bullet there is UXL-derived (the counter).
- Because no case file exists, `b-uxl-casefile.md` was **not** created.
- Files that carry §L text: AWARDS.md:21, :69, :102; DESIGN.md:127, :136; `.awards/ship/2026-10-21.md:22`.

---

## 4. UX decisions traceable to UXL that A did not make

Legend:
- **C** = B cites a law or labels the decision "UXL".
- **U** = matches a UXL statute or playbook line B read, but is uncited.
- **N** = not UXL: it predates the UXL call or comes from the awards plugin.

| Topic | Session A | Session B | B's stated reason | Attribution |
|---|---|---|---|---|
| **Batch-of-500 counter** | Brief [A:43]: "Scarcity is real: batch one = 500 Cubes…". `reserve.js`: `// SYNTHETIC: reservations already taken in batch one…` `const TAKEN_BEFORE_VISIT = 377;` → "Batch one has ${left} of ${BATCH} places left." The footer reads "Batch one: 123 of 500 Cubes left". A's final message: "The "123 of 500 places left" counter, which is also made up." | **No counter.** It states the rule instead: "First batch: 500 Cubes, shipping March 2027 to Switzerland and the EU. Reservations made after the first 500, and every UK and US reservation, ship in June 2027." | [583] "no scarcity counter"; [2745] "Deliberately absent: a "first batch remaining" counter (it would be invented scarcity, UXL §L04)"; final [3705] "**No "units left" counter:** a live count of the 500 would be invented urgency. The page states the rule instead…" | **C.** Source: SKILL.md statute "**No dark patterns, ever:** fake scarcity or countdowns…" (§L04) and the playbook Pricing line "Invented "was $99" strikethroughs, countdown timers or "only 3 spots left" (§L04 dark pattern)". **In-session before/after:** B's own pre-UXL brief [63] planned the same counter ("the "first-batch remaining" figure is a fictional counter"). Both sessions saw the awards corpus row "Scarcity as a number \| fewer than 500 people each year" (B [89], A [67]) |
| Region and ship month | A 30-country `<select>`; the ship month appears only in the ledger after choosing | 4 region radios, each carrying its ship month ("Switzerland · Ships March 2027"); region pre-guessed from `navigator.languages` | DESIGN.md: "the ship month sits inside each region option (recognition over recall, §L29)" | **C** (§L29); the region guess is **U** (§L27 "smart detection") |
| Price / deposit / balance | Ledger: Price · Deposit today · Charged when it ships · Ships to you | Summary: Price · "Due today CHF 100 deposit, refundable until it ships" · Due when it ships · "Ships March 2027 to Switzerland"; primary button labelled "Reserve for CHF 100" | [582] "a payment breakdown for today vs. shipping" | Both had a breakdown, so the difference is small; **U** |
| Tax line | "I didn't state shipping or tax costs because your brief didn't give them." | "Prices are in CHF and include Swiss VAT; outside Switzerland, import VAT and duties are shown before the balance is charged." | none stated | **U** (Pricing spec: "Make the currency and tax treatment explicit"; Checkout: "never add a new charge on the last step") |
| Progress | none | "Step 1 of 3 Choose your Cube" → "Step 2 of 3 Details and deposit" → "Step 3 of 3 Confirmed" | [582] "a "Step 2 of 3" progress indicator" | labelled UXL in thinking; §L09 Goal-Gradient statute (**C/U**) |
| Payment fields | Email and name only; the card is **readonly and prefilled** `4242 4242 4242 4242` ("A test card is filled in for you."); no expiry or CVC; browser `reportValidity()` | Email (with hint), name, card number, expiry, CVC in a `<fieldset>`; `autocomplete` cc-*; `inputmode="numeric"`; auto-grouping in fours (Amex 4-6-5); expiry normalised from "429"/"04 2029" to "04 / 29" | [583] "labels above inputs, autocomplete, card grouping"; checkout.js "Accept messy input (spaces, dashes, 4/29 or 0429)…" | **C** (UXL label) / §L24 Postel |
| Validation and errors | native browser bubbles | Blur and submit validation; inline `.err` per field with fix-it text ("Enter the expiry as MM / YY, for example 04 / 29."); a `role="alert"` summary "N things to fix before paying" with links that focus each field; values kept | [1295] "blur/submit validation with a linked error summary" | **C** (UXL label) |
| Decline path | none | Demo note: "Any card number works; use 4000 0000 0000 0002 to see a declined card." On decline: "Your card was declined (demo). Nothing was charged. Try a different card number." Focus moves to the summary and the email is kept (verified in the flow test [1372]) | [583] "decline path (4000 0000 0000 0002)" | **C** (UXL label). The playbook line is "On a decline, say what happened, keep every other field, focus the payment section and suggest another method". The specific number is the common processor test card, chosen by B |
| Submit button | `paySubmit.disabled = true` while processing; required fields enforced natively | Never disabled; busy state is a spinner plus "Processing…", width locked, repeat presses ignored (`if (busy) return`) | DESIGN.md: "Never disabled to signal invalid input (UXL §L24)" | **C.** The pre-UXL DESIGN.md had a "disabled" state |
| Remembered choice | none; sessionStorage only stores reservations, which feed the counter and reference numbers | `localStorage` `vx-draft` restores size, finish and region on return; `vx-reservation` restores the "You have reserved…" panel | [583] "selection saved to localStorage"; reserve.js "The choice is kept on this device (resume later)" | **C** (UXL label; Build step 5 "remembered choices"; statute "save progress, and are resumable", §L30) |
| Cancel and undo | no cancel control; "Reserve another" button | "Cancel this reservation and refund the deposit" leads to "Reservation VX-27-… cancelled. The CHF 100 deposit is refunded in full (demo: nothing was charged)." with an **Undo** button and a live-region announcement | none stated | **U** (statute "Prefer undo over confirmation dialogs") |
| Confirmation | "Reserved." + reference + rows + refund note + "Reserve another" | "Reserved." + reference + summary + "**What happens next**" (receipt to email; we write before your ship month; balance charged on ship day, cancel until then) + one action "Back to the Cube" | DESIGN.md: "Step 3 "Reserved." with the reference, the summary, what happens next and one action" | **U** (statute "a clear confirmation, what happens next, and a single next action", §L23) |
| Primary-CTA count | Header "Reserve · CHF 100" fixed in every chapter, plus the tombstone and the footer | Masthead Reserve is a quiet button; the phone bar's red Reserve hides whenever another primary is in view | DESIGN.md "One per view (§L28)"; [2008] "two primaries on one screen. I'll hide the bar's Reserve…" | **C**, and **scanner-driven** (lint `multiple-primary-cta`) |
| Labels | visible labels | visible labels above inputs; placeholders only as examples; hint and error via `aria-describedby` | [583] "labels above inputs" | Both labelled; B adds hints and errors (**C**) |
| Target sizes | Jury round 1 failed walk 2: header Reserve **96 × 40 px** | 44 px quiet buttons, 48 px controls on phone, 52 px primary, 60 px radio rows; UXL audit "0 undersized" in all 4 runs | Pre-UXL DESIGN.md [389]: "touch targets ≥ 48 px", primary "Min height 52 px" | **N** in origin (awards:system set these before UXL); the UXL audit verified them |
| Navigation | degree-dial nav; skip link | degree-scale nav, phone chapter sheet, skip link, "Skip to sizes" | concept [264], before UXL | **N** |
| Reduced motion | three tiers | three tiers | pre-UXL DESIGN.md [389] | **N** (both from awards) |
| Loading | "Processing…" + `aria-busy` | the same, plus a width lock and repeat-press guard | pre-UXL design had "Processing…"; the width-lock and repeat-press wording matches the UXL CTA spec | mostly **N**; the additions are **U** |
| Real DOM text | A's h1 is DOM text with a GL copy | B's h1 had been `color: transparent` with the visible headline in canvas; changed after the UXL audit | [2186] "invisible to screenshots, prints, or CSS readers" | **scanner-driven** |
| Phone headline | A moved the phone headline behind the glass after its jury asked | B refused the same jury request | "(UXL §L05 Cognitive Load, §L25 Selective Attention)" | **C** |

---

## 5. Juries in both sessions: usability scores and notes

### Scores

| | Disposition | Design | **Usability** | Creativity | Content | Weighted / mean |
|---|---|---|---|---|---|---|
| A round 1 (`2026-10-21.md`) | fix | 7.6 | **7.0** (capped) | 8.3 | 8.2 | 7.62 |
| A verdict (`2026-10-21-verdict.md`) | ship | 7.8 | **7.7** | 8.4 | 8.2 | 7.93 |
| B round 1 (`2026-10-21.md`, component `#light`) | ship | 7.5 | **7.8** | 8.0 | — | 7.77 mean |
| B round 2 (`2026-10-21-2.md`, full site) | fix | 7.6 | **7.8** | 8.2 | 8.1 | 7.83 |

### A usability notes

Round 1:
- Usability line: "Capped at 7 by walk 2: the phone header Reserve is 96 × 40 px. Otherwise complete: a keyboard path for every gesture, touch turn with `pan-y`, three reduced-motion tiers, no gate, an authored 404 and a working test payment".
- Walk 2: **fail**, "the phone header Reserve measures 96 × 40 px, under 44".
- Walk 8: **fail**, "the chapter name in the chip pushes the fixed header's Reserve pill past the viewport, to a right edge of 357–384 px in a 320 px viewport".
- Slop: captions run through the sticky title; "Skip to Walk around it" sits on the h2.
- Content praised "**123 of 500 left**" under "Numbers instead of adjectives". The jury rewarded the invented counter.

Verdict:
- "No walk cap remains… a 44 px header action at 320 and 390 in every chapter… Friction: twice per visit a ~420 ms flip drops copy and the chip to 1.2–2.6:1… and on the phone the configured preview sits above the viewport while choosing".
- Content again lists "123 of 500 left".

### B usability notes

Round 1:
- "All eight walk steps pass at component scope… Friction: on desktop the h1's second word is readable only as a refracted ghost, and on short laptop screens the paragraph crowds the display line".
- Walk 2: "targets 44 px (wordmark, masthead Reserve), 52 px (CTA, full width on phone)".
- Walk 7: "one primary action naming the outcome, above the bar at every measured viewport from 360×740 to 1920×1080".
- Keep note: a 320 px overflow of `.turn-buttons`.

Round 2:
- "All eight walk steps pass, so nothing is capped. Three things hold it back: Smoke helper text and chapter links sit at about 2.6:1; at 1440×900 the Turn readout and controls fall under the bar or below the fold after the nav jump…; and focus is pulled to the heading after nav travel (chrome.js:155)."
- Responsive: "no sampled target under 44 px (probe)".
- Accessibility: "The error summary links each field (desktop-state-checkout-errors)".
- Content: "an honest demo checkout and refund terms (desktop-state-checkout-errors)".

### Did the A jury flag things UXL prevented or fixed in B?

- **Target size.** A's round-1 Usability cap (40 px header Reserve) did not occur in B; B's jury measured ≥ 44 px. B's target rule came from awards:system **before** UXL; the UXL audit only confirmed "0 undersized". This is supporting evidence, not a clean attribution.
- **Primary CTAs.** A's jury did not object to A's always-on header Reserve. In B, UXL's lint caused the phone-bar Reserve to step aside, and B's jury noted "one primary action" in both rounds.
- **Payment flow.** Neither jury penalised A's prefilled readonly card, missing decline path or browser-native validation; A's jury called it "a working test payment". B's richer flow earned explicit praise ("honest demo checkout", "error summary links each field") but no extra score.
- **Scarcity.** The awards jury rewarded A's invented counter as content. This is the clearest case where UXL's §L04 statute overrode the awards corpus' "scarcity as a number" pattern, against the jury's own taste.

### Problems UXL did not catch in B (honest limits)

- **Smoke-chapter muted text at about 2.6:1** (B round-2 Floor fix 2). The UXL audit measures the page at load, before the Smoke theme applies, so it reported 0 contrast findings.
- **320 px overflow** (B round 1). The audit's smallest viewport is 360.
- **Turn controls under the bar at 1440×900** and the **focus race after nav scroll** (round 2).
- **The close cut off at max scroll.** This drove B's round-2 "fix" disposition.

A had analogous issues: a mid-flip contrast dip and text-over-title overlaps.

Net result: B's Usability axis was higher in every round (7.8 / 7.8 vs 7.0 → 7.7), but A finished with the higher weighted score and a "ship" verdict (7.93 vs 7.83 "fix"). B's "fix" came from a layout and close problem, not from usability.

---

## 6. Counts (B)

- `Skill` calls: 11 in total.
  - `uxl:ux-lawyer`: **1** [409].
  - awards: craft, concept, system, structure, stack, motion, webgl, jury ×2, ship.
- UXL reference reads: 2 Bash calls into `component-playbook.md` [413, 415].
- UXL scanner runs: **7**.
  - `uxl_lint.py` ×3 [1978, 2220, 3597].
  - `uxl_audit.mjs` ×4 [2011, 2082, 2220, 3597].
  - Plus 1 `--help` call [2009] and 1 grep of the script source [2088].
- `Agent`/`Task` tool calls: **0**.
  - Subagents: 2, both forked `/awards:jury` skill runs (`subagent_type: general-purpose`) [2327, 2953].
  - The `uxl:ux-auditor` agent was loaded (listed in `init.agents`) but **never used**.
  - The jury subagents ran no UXL scanners; they only read AWARDS.md with its "UXL:" note.
- Session A for comparison: 10 Skill calls, 0 Agent calls, 2 forked jury subagents, 0 UXL calls.
- Cost and time parity:

  | | Duration | Cost | Turns |
  |---|---|---|---|
  | B | 7,077 s | $37.28 | 220 |
  | A | 6,997 s | $36.33 | 232 |

  The UXL work added about 1 minute and about $1.

---

## 7. Showcase-ready before/after items

1. **Fake urgency removed, with a paper trail.**
   - A shipped "Batch one has 123 of 500 places left", backed by `const TAKEN_BEFORE_VISIT = 377;`, and the awards jury praised it.
   - B planned the same counter before UXL ("the "first-batch remaining" figure is a fictional counter", [63]). After UXL it rewrote the brief: "Deliberately absent: a "first batch remaining" counter (it would be invented scarcity, UXL §L04)".
   - B's final message: "a live count of the 500 would be invented urgency. The page states the rule instead."
2. **Checkout went from a prefilled 4242 card to a real flow.**
   - A: readonly prefilled `4242 4242 4242 4242`, no expiry or CVC, browser bubbles.
   - B: grouped and normalised card/expiry/CVC, blur+submit validation, a linked error summary, a decline path (`4000 0000 0000 0002` → "Your card was declined (demo). Nothing was charged. Try a different card number."), and "Step 2 of 3".
3. **Ship month before you choose.** A hides it behind a 30-country select; B puts "Ships March 2027" / "Ships June 2027" on each region option: "recognition over recall, §L29".
4. **Forgiving end state.** B adds cancel with **Undo**, a remembered selection (localStorage), and "What happens next" on the confirmation. A has none of these.
5. **Scanner-driven fixes.**
   - UXL audit 80 → 96/100, 3 major → 0.
   - The audit exposed that the hero `<h1>` was transparent DOM text over a canvas-painted ground. B rebuilt the layering so "every word and background on the page stays real DOM".
   - The lint's `multiple-primary-cta` made the phone bar's red Reserve step aside so a view never shows two primaries.
   - Mobile body text went from 14 px to 16 px.
6. **Never-disabled submit.** B's DESIGN.md went from "disabled: … `cursor: not-allowed`" to "Never disabled to signal invalid input (UXL §L24). One per view (§L28)."
7. **B used the laws to push back on the jury.** It declined a jury craft fix: "bending "held." on phones would make the glass cover most of the word… (UXL §L05, §L25)".

Caveats for the showcase:
- Target sizes and reduced motion were **not** UXL-originated in B.
- UXL missed the Smoke-chapter contrast and the 320 px overflow; the jury caught them.
- B wrote no UXL case file and no "UX decisions" list.
