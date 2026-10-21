# UX Case File: {{Product / page name}}

> Prepared by UXL (UX Lawyer) · {{date}} · Scope: {{flows/screens}} · Viewports: 390px mobile, 1440px desktop
> Laws cited from the Laws of UX (lawsofux.com) as §L01–§L30.

## Verdict

{{2–3 sentences: overall state, the biggest risk to users/business, and what to fix first.}}

| | Mobile | Desktop |
|---|---|---|
| Heuristic score (uxl_audit) | {{n}}/100 | {{n}}/100 |
| Static score (uxl_lint) | {{n}}/100 | |
| Critical / major / minor | {{c}} / {{M}} / {{m}} | {{c}} / {{M}} / {{m}} |

**Top 3 issues**
1. {{issue}} (§Lxx)
2. {{issue}} (§Lxx)
3. {{issue}} (§Lxx)

## Findings

### Critical

**[C1] §L07 Fitts's Law: {{one-line statement of the violation}}**
- **Evidence:** `{{file:line}}` · {{measurement, e.g. "Add to cart" 32×32px at 390px}} · screenshot `{{page-mobile-annotated.png}}`
- **Impact:** {{who is affected and how: mis-taps, abandonment, exclusion}}
- **Remedy:** {{concrete change; include a short diff or snippet when useful}}

### Major

**[M1] §Lxx {{Law}}: {{statement}}**
- **Evidence:** …
- **Impact:** …
- **Remedy:** …

### Minor

| # | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|
| m1 | §Lxx | … | `file:line` | … |

## What works well (keep it)
- {{strength}} (§Lxx)

## Not assessed
- {{e.g. authenticated area (no test account), runtime audit (Playwright unavailable)}}

## Fix plan
1. **Root causes:** tokens/shared components ({{list}}). Fixes {{n}} findings at once.
2. **Critical flow fixes:** {{list}}
3. **Polish:** {{list}}

## After fixes (fill in after the fix pass)
| Metric | Before | After |
|---|---|---|
| Critical / major / minor | | |
| Tap-target violations (mobile) | | |
| Contrast failures | | |
| Heuristic score | | |
