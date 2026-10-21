---
id: L21
name: "Pareto Principle"
source: https://lawsofux.com/pareto-principle/
origin: "Vilfredo Pareto (1896), 'Cours d'économie politique', on the uneven distribution of wealth. Generalized as 'the vital few' by Joseph M. Juran (1951), 'Quality Control Handbook'."
category: strategy
summary: "A few tasks, pages, and issues drive most of the outcome, so find that vital few with data and optimize them before anything else."
applies_to: [information architecture, navigation, top tasks, key flows, audits, performance, design systems, analytics, settings, roadmaps]
rules:
  - "Identify the top 3–5 user tasks from analytics and research. Give them the best placement, speed, and test coverage."
  - "Fix audit findings by severity × reach: shared components and top-traffic templates before one-off pages."
  - "Put the long tail behind progressive disclosure (More menu, Advanced section, command palette). Hide it, don't delete it."
  - "Rare but critical tasks (cancel, delete account, reset password, contact) still get clear, working paths."
  - "Re-check the data every release cycle. The vital few shift as the product and its audience change."
---

# Pareto Principle (L21)

## In plain words

In many systems, results are spread unevenly: a minority of causes produces most of the effect. "80/20" is shorthand, not a measured constant. The real split might be 90/10 or 70/30, and the two numbers don't need to add up to 100. The point is the skew.

In product work, a few tasks make up most usage, a few pages get most of the traffic, a few components appear on most screens, and a few defects cause most of the complaints. Find those with data and spend your effort there first. Everything else still matters, but it comes second.

## Why it matters in a UI

- **Effort is finite.** Spreading it evenly improves everything a little. Concentrating it on the top tasks improves the experience of most users a lot.
- **Templates and components multiply.** One product-page template may serve most of the traffic, and one `Button` component may render on every screen. A fix there lands everywhere at once.
- **Audits produce long lists.** Without a ranking, teams fix easy minor items first while a critical flaw in checkout ships for another month.
- **Feature usage is skewed.** Most users use a small set of features. Giving the rest equal prominence adds choices and noise for everyone ([Hick's Law](hicks-law.md), [Cognitive Load](cognitive-load.md)).
- **The long tail is collectively large.** Each rarely used feature matters to someone, and different users need different rare features. Demote it; don't delete it.

## Build it right

### Everywhere
1. **Find the vital few.** Pull top pages by visits, top events and conversions, top site-search queries, and top support-ticket topics. For content-heavy sites, a top-task survey (Gerry McGovern's "Top Tasks" method) ranks what users actually come for.
2. **Name the critical paths.** Write the top 3–5 flows down in the repo (e.g. "search → product → cart → checkout") and tag their tests. They get end-to-end tests, performance budgets, and accessibility checks on every change.
3. **Optimize those first.** Fewest steps, fastest load, clearest labels, and the most prominent placement. Apply the other laws here before anywhere else.
4. **Rank fixes by severity × reach.** A major issue on a page with 60% of traffic beats a critical one on a page nobody visits. Fix in shared components and design tokens so one change propagates.
5. **Progressive disclosure for the rest.** Use "More" menus, "Advanced options" sections, settings sub-pages, and search or command palettes. The long tail stays reachable without crowding the main path.
6. **Don't confuse frequency with importance.** Rare but critical tasks (password reset, cancellation, account deletion, accessibility settings, contact) must be easy to find and must work. Hiding cancellation is a dark pattern, not prioritization.
7. **Re-measure.** Check the data each release cycle, and after any launch that changes the audience.

### Mobile
- **Screen space forces the call.** The vital few get the bottom tab bar, the first screen, and the sticky CTA. Everything else goes behind "More", a drawer, or a bottom sheet.
- **Segment by device.** Top tasks on mobile often differ from desktop (checking status and quick replies vs. bulk editing and reports). Pull analytics per device and optimize each layout for its own top tasks, while keeping every feature reachable on both.
- **Budget the critical pages first.** Test the top flows on a mid-range Android phone with a throttled network. That's where slow paints and layout shifts show up.

### Desktop
- **Extra space tempts you to show everything.** Still give the top tasks dominant placement. Secondary nav, overflow menus, and settings pages hold the rest.
- **Power users are a Pareto within your users.** A minority of users often generates a large share of activity. Serve them with keyboard shortcuts, bulk actions, and a command palette (Cmd/Ctrl+K) that reaches the long tail without adding nav weight.

## Code patterns

```js
// Rank audit findings by severity × reach, so effort goes where most users are
const weight = { critical: 9, major: 3, minor: 1 };
const ranked = findings
  .map((f) => ({ ...f, score: weight[f.severity] * f.monthlyViews }))
  .sort((a, b) => b.score - a.score);
```

```jsx
// Toolbar: top actions by usage stay visible; the long tail moves into "More"
const sorted = [...actions].sort((a, b) => b.uses30d - a.uses30d);
const [visible, overflow] = [sorted.slice(0, 3), sorted.slice(3)];

<div role="toolbar" aria-label="Document actions">
  {visible.map((a) => <button key={a.id} onClick={a.run}>{a.label}</button>)}
  {overflow.length > 0 && <OverflowMenu label="More" items={overflow} />}
</div>
```

```html
<!-- Progressive disclosure: rarely used options stay reachable, not in the way -->
<details class="advanced">
  <summary>Advanced options</summary>
  <!-- webhooks, custom headers, retention policy… -->
</details>
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Top tasks need more than 2 taps or clicks from home | manual: list the top 5 tasks from analytics, count steps from the home screen | major | Promote them into nav, home, or a persistent CTA |
| Critical flows are slow or unstable | `audit: slow-paint` · `audit: layout-shift` (run on top-traffic URLs first) | critical | Performance budget and fixes on the critical path first |
| Nav gives equal weight to core and rarely used features | `audit: nav-overload` · `lint: nav-overload` | major | Core items in nav, the rest under "More" or in settings |
| Long-tail options crowding a core form | `audit: form-load` · `lint: form-long` | major | Move optional fields to "Advanced" or a later step |
| Effort spent on low-traffic pages while key templates have defects | manual: compare the backlog against page-view and conversion data | major | Re-rank the backlog by severity × reach |
| Rare but critical tasks hidden (cancel, delete account, contact) | manual: try each from the account page; count steps and dead ends | critical | Clear, labeled paths in account settings and the footer |
| The same fix repeated page by page instead of in shared code | `lint: color-sprawl` · `lint: spacing-off-scale` · manual: grep duplicated component styles | minor | Fix once in the shared component or token |
| Priorities set with no usage data | manual: no analytics events on key flows; no site-search logging | major | Instrument key flows and search, then decide |

## Tensions & trade-offs

- **vs. [Tesler's Law](teslers-law.md):** moving the long tail out of sight doesn't remove its complexity. Make sure the hidden features are still well designed when someone needs them.
- **vs. [Occam's Razor](occams-razor.md):** cutting features is tempting once the data shows low usage. Prefer progressive disclosure, and delete only when usage is near zero and a fallback exists.
- **vs. inclusion:** the "20%" may be screen-reader, keyboard, or low-bandwidth users. Accessibility is never part of the long tail you deprioritize.
- **vs. [Jakob's Law](jakobs-law.md):** some low-traffic conventions (footer legal links, contact page) are expected everywhere. Keep them even if few people click.

## Quick test

Name the 3 tasks most users come here to do. On this screen, is each one obvious, fast, and covered by tests, with nothing else competing for the same attention?
