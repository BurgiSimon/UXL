# Audit & Fix workflow

How to review an existing site or app against the 30 Laws of UX, produce a defensible case file, and fix what matters most. The scripts find roughly a third of real issues, the measurable ones. The rest needs the per-law questions below and your judgment.

## Contents
1. Scope the case (Pareto)
2. Gather evidence: static scan
3. Gather evidence: runtime scan + screenshots
4. Manual law sweep: 30 questions
5. Severity & priority
6. Write the case file
7. Fix, verify, report before → after
8. Handling false positives

---

## 1. Scope the case ([§L21 Pareto](laws/pareto-principle.md))

- Identify the stack (framework, styling: Tailwind/CSS modules/CSS-in-JS, component library) and how to run it (`package.json` scripts, README).
- List the **critical flows**: the 3–5 journeys that carry the product's value. Typical: landing → sign-up; login; the core task (create/search/buy/book); checkout/payment; onboarding/first run. Add any screen the user named.
- Audit those first, at **both** mobile (390px) and desktop (1440px). Shared components (Button, Input, Nav, Modal) multiply impact, so fixing one fixes every screen.
- Time-box: for a large app, a deep audit of the critical flows beats a shallow audit of everything.

## 2. Static scan

```bash
python3 <skill-dir>/scripts/uxl_lint.py src/ --format md            # or app/, components/, pages/, public/…
python3 <skill-dir>/scripts/uxl_lint.py src/ --min-severity major    # focus
python3 <skill-dir>/scripts/uxl_lint.py --list-rules                 # catalogue with laws
```

- Scans HTML, CSS/SCSS/Less, JSX/TSX, Vue, Svelte, Astro and inline `<style>` blocks; understands Tailwind classes.
- Every finding cites its law(s) and a remedy. It is heuristic, so open the file and confirm before reporting or fixing.
- Project-wide findings (`font-size-sprawl`, `color-sprawl`, `spacing-off-scale`, `reduced-motion-missing`) point to a missing token system. Fix once at the root, not per file.
- Suppress a verified false positive with a comment: `uxl-ignore <rule-id>` on the same or previous line.

## 3. Runtime scan + screenshots

Start the app (e.g. `npm run dev`), then:

```bash
node <skill-dir>/scripts/uxl_audit.mjs http://localhost:3000 http://localhost:3000/signup --out uxl-report
node <skill-dir>/scripts/uxl_audit.mjs ./dist/index.html --out uxl-report   # static builds / single files work too
```

- Renders each URL at **mobile 390×844 (touch)** and **desktop 1440×900**. It measures tap-target sizes and spacing, horizontal overflow, text size, input zoom, WCAG contrast, nav item counts, competing filled CTAs in the first screen, the h1, paint timing (FCP/LCP), layout shift (CLS), keyboard focus visibility, unlabeled fields, long forms, font/color sprawl, and autoplaying media and carousels.
- Writes `uxl-report/report.md`, `report.json`, `<page>-<viewport>.png` (first screen, what users see before scrolling) and `<page>-<viewport>-annotated.png` (full page with violations outlined and labelled).
- **Look at the screenshots.** Judge hierarchy, the primary action, grouping, density and polish visually. That is where Gestalt, Von Restorff, Serial Position and Aesthetic-Usability problems show up.
- Needs Playwright (`npm i -D playwright && npx playwright install chromium`). If it can't be installed, say so in the report and rely on static + manual review. Never invent runtime numbers.
- Pages behind auth: ask for a test account, or audit the public pages plus static code for the rest.

## 4. Manual law sweep: 30 questions

Ask these of every critical screen (mobile *and* desktop). Each "no" is a candidate finding citing that law.

**Perception & attention**
- §L01 Aesthetic-Usability: Does it look intentional and trustworthy (consistent spacing, type scale, palette)? And is any visual polish hiding a usability problem?
- §L12 Common Region: Are related items enclosed together, and are containers cut along real relationships (not nested 3+ deep)?
- §L13 Proximity: Is space inside groups smaller than between groups? Do labels sit closest to their own field?
- §L14 Prägnanz: Is the layout simple enough to grasp at a squint: few alignment edges, regular shapes, no visual noise?
- §L15 Similarity: Do things that look alike behave alike? Do links look like links and are non-clickable things free of link styling?
- §L16 Uniform Connectedness: Are steps, tabs, related controls and their content visibly connected? Are there accidental connections?
- §L25 Selective Attention: Is key content free of ad-like styling? Is anything moving, blinking or autoplaying that steals focus?
- §L28 Von Restorff: Is there exactly one visually dominant primary action per view? Is emphasis carried by more than color?

**Cognition & memory**
- §L03 Chunking: Are long content, forms and numbers broken into labeled, scannable groups?
- §L04 Cognitive Bias: Are defaults honest and in the user's interest? Any dark patterns (fake urgency, pre-checked add-ons, confirmshaming, hidden costs, hard cancellation)?
- §L05 Cognitive Load: Can anything be removed, defaulted or deferred? Is text readable (16px+, 45–75ch, sufficient contrast)?
- §L17 Mental Model: Do labels use the users' words? Does each control behave the way its appearance promises (no hover-only on touch)?
- §L18 Miller's Law: Is the user asked to hold more than a few items in mind at once (codes, comparisons, options)?
- §L26 Serial Position: Are the most important items first and last in nav, lists and tab bars?
- §L29 Working Memory: Is needed context visible (selected options, previous answers, persistent filters), or must users remember it across screens? Are labels persistent (not placeholder-only)?

**Decision**
- §L02 Choice Overload: Are long option sets curated, filtered or given a recommended default?
- §L10 Hick's Law: Is the number of choices per step minimal (top nav ≤ 7, tab bar 3–5)? Is progressive disclosure used for rare options?
- §L19 Occam's Razor: Does every element earn its place? Is there a simpler design that fully works?

**Interaction**
- §L06 Doherty Threshold: Does every action respond within ~400ms or show progress? Loading/skeleton states present? Layout stable (CLS)?
- §L07 Fitts's Law: Are targets ≥ 44px on touch with ≥ 8px gaps? Is the primary action near the end of the task / in the thumb zone?
- §L08 Flow: Any needless interruptions (modals on load, native alerts, forced sign-up before value, zoom-on-focus)?
- §L20 Paradox of the Active User: Can a first-timer succeed without reading instructions? Is help contextual? Empty states teach the next step?
- §L24 Postel's Law: Does input accept reasonable variations (spaces, case, formats, paste)? Are all input methods supported (keyboard, touch, zoom, screen reader)?

**Motivation & journey**
- §L09 Goal-Gradient: Do multi-step flows show progress and proximity to the goal?
- §L22 Parkinson's Law: Is the task as short as possible (autofill, defaults, express paths, time estimates)?
- §L23 Peak-End Rule: Are the peak moment and the end (success screen, confirmation) designed? Are error and failure moments handled with care?
- §L30 Zeigarnik Effect: Can users see what's left and resume interrupted work (drafts, saved progress)? Without manufactured nagging?

**Strategy**
- §L11 Jakob's Law: Are standard conventions followed (logo → home, search, cart/account placement, form patterns, platform norms)?
- §L21 Pareto Principle: Are the top tasks the most prominent and polished? Does secondary stuff stay out of their way?
- §L27 Tesler's Law: Is unavoidable complexity handled by the system (smart defaults, detection, autofill) rather than pushed onto users, without oversimplifying into ambiguity?

## 5. Severity & priority

| Severity | Definition | Examples |
|---|---|---|
| **critical** | Blocks a task or excludes users | Untappable or unlabeled controls, zoom disabled + tiny text, no feedback on payment, data loss on error, content cut off on mobile, contrast < 3:1 on key text |
| **major** | Slows, confuses or misleads on a critical flow: a measurable conversion/retention risk | Placeholder-only labels, 12-item nav, 3 competing CTAs, no loading states, long ungrouped forms, dark patterns |
| **minor** | Polish, consistency, efficiency | Off-scale spacing, extra font sizes, slow-ish transitions, generic labels |

**Priority = severity × reach × effort⁻¹.** A major issue in a shared `<Button>` outranks a critical one on a rarely visited admin page. Dark patterns are always at least *major* (trust and legal exposure).

## 6. Write the case file

Use `assets/report-template.md`. Keep it scannable:
- Verdict first: 2–3 sentences + score (from scripts, labelled heuristic) + top 3 issues.
- Findings grouped by severity; each cites `§Lxx Law`, evidence (`file:line`, screenshot name, measured value), impact on the user, and the remedy (ideally a concrete diff).
- Separate "what works well" (keep it): it tells the team what not to break, a nod to [§L23](laws/peak-end-rule.md) for your report too.

## 7. Fix, verify, report before → after

1. Fix **root causes** first: tokens (type scale, spacing, colors, focus ring), then shared components, then individual screens.
2. Stay inside the project's stack and design language; don't rewrite the app or swap libraries unless asked.
3. Keep behavior intact: run the project's tests/linters/build after changes.
4. Re-run `uxl_lint.py` and `uxl_audit.mjs`; compare counts and scores. View the new annotated screenshots.
5. Report: what changed (grouped by law), before → after numbers (e.g. "tap-target violations 18 → 0, contrast failures 5 → 0, score 31 → 92"), and what's left (with reasons).

## 8. Handling false positives

The scripts are deliberately sensitive. Common false positives:
- `input-unlabeled` when a design-system wrapper renders the label (check the component).
- `async-no-feedback` in data-fetching utilities or server components whose loading UI lives elsewhere (`loading.tsx`, Suspense boundary higher up).
- `small-target` for dense desktop-only tools (acceptable at ≥ 24–32px with pointer input; still 44px on touch).
- `nav-overload` for mega-menus whose *top level* is ≤ 7 but whose panel links were counted.
- `contrast` over background images/gradients is skipped (unknown), so check those visually.

Don't report a finding you haven't verified; do mention when a check couldn't run.
