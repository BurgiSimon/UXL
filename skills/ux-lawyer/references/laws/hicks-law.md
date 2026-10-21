---
id: L10
name: "Hick's Law"
source: https://lawsofux.com/hicks-law/
origin: "W. E. Hick (1952), 'On the rate of gain of information'. Extended by Ray Hyman (1953), 'Stimulus information as a determinant of reaction time'."
category: decision
summary: "Cut the options visible at each decision point and point to a sensible default, so people can decide quickly."
applies_to: [navigation, menus, tab bars, toolbars, selects, forms, settings, command palettes, onboarding, CTAs]
rules:
  - "Desktop top nav: about 5–7 items. Mobile bottom tab bar: 3–5. Move the rest to 'More', a utility nav, or search."
  - "Give each view one primary action, mark the recommended option, and preselect a safe default."
  - "Past ~10–15 options, add type-to-filter search or a command palette instead of growing the list."
  - "Show the common options and reveal advanced ones on demand (progressive disclosure)."
  - "Long lists in a known order (countries A–Z, years) are fine as one list. Add type-to-filter instead of splitting them."
---

# Hick's Law (L10)

## In plain words

Every extra option adds a little to the time it takes to decide. With equally likely options, decision time grows roughly with the logarithm of how many there are, so the 20th option costs less than the 2nd, but the total keeps climbing. That is the clean lab case. Real options that are vaguely labelled, similar to each other, or that need reading and comparing slow people down much more than the raw count predicts.

The classic model is `RT = a + b · log2(n + 1)`, where *n* is the number of equally likely alternatives. It describes *choosing*, not *finding*. When people already know what they want and the list follows an order they know (alphabetical countries, months, numbers), they scan or type straight to it. That is a search task, and a long, well-ordered list is often faster than a "simplified" multi-step one.

## Why it matters in a UI

- **Each decision point costs time.** A 12-item nav bar, a 20-icon toolbar, or a settings page that shows everything makes users read and weigh before they act. Repeated on every screen, the delay makes the product feel hard.
- **Complexity multiplies the count.** Five options with jargon labels or near-identical descriptions take longer than ten clear ones. Label quality matters as much as quantity.
- **Equal weight forces full evaluation.** When nothing stands out, users must consider every option. A clear primary action or a "Recommended" marker lets them skip the comparison.
- **Hesitation turns into guessing or leaving.** People who can't decide fast pick the first item, pick nothing, or drop off. On mobile, with less screen and more interruptions, patience is shorter.
- **Ordered, familiar lists are the exception.** A 200-item country list is fast if it's alphabetical and accepts typing. Splitting it into region → country *adds* a decision.

## Build it right

### Everywhere
1. **Count the decisions.** For each screen, list what the user must choose between. Remove, merge, or defer anything not needed for the current step ([Occam's Razor](occams-razor.md)).
2. **One primary action per view.** Make it the only filled button. Secondary actions become outline or text buttons ([Von Restorff](von-restorff.md)).
3. **Recommend and preselect.** Mark a "Recommended" option and set a safe default (the usual shipping method, the user's locale, the plan most people pick). Never preselect anything that costs money or shares data.
4. **Progressive disclosure.** Show the 3–5 options most people need. Put the rest behind "More options" or "Advanced". `<details>` does this with zero JS.
5. **Search beats scanning for big sets.** Past ~10–15 options, add a type-ahead combobox or filter field. For apps with many actions, add a command palette.
6. **Group what must stay.** When a long menu is unavoidable, split it into labelled groups so users can rule out whole groups at a glance ([Chunking](chunking.md)).
7. **Order deliberately.** Put the most frequent options first, or use an order users already know (alphabetical, chronological, numeric). Never order by internal IDs.

### Mobile
- **Bottom tab bar: 3–5 destinations.** More than 5 squeezes labels and targets. Put the rest in a "More" tab or the profile screen.
- **A hamburger hides choices; it doesn't remove them.** Keep the drawer to about 7 top-level items with section headings, and keep the 1–2 key actions on screen, not in the drawer.
- Action menus go in a bottom sheet with ≤ 5–6 items. For long pickers (country, timezone), open a full-screen list with a search field pinned to the top.
- A native `<select>` is fine for a long ordered list on mobile: the OS picker is built for fast scrolling. Past ~50 items, prefer a searchable list.

### Desktop
- **Top nav: about 5–7 items.** Beyond that, use a mega menu with grouped columns, or move secondary links (Help, Careers, Investors) to a utility nav or footer.
- **Command palette (⌘K / Ctrl+K)** for apps with dozens of actions. Typing three letters replaces scanning menus, and power users skip navigation entirely.
- Toolbars: show the 5–8 most used tools and put the rest in an overflow "⋯" menu. Context menus: keep them short and group with separators.
- Wide screens tempt you to show every option at once. Free space is not a reason to add choices.

## Code patterns

```html
<!-- Default preselected, recommendation marked, rare options disclosed on demand -->
<fieldset>
  <legend>Delivery</legend>
  <label><input type="radio" name="ship" value="standard" checked> Standard, 3–5 days <strong>Recommended</strong></label>
  <label><input type="radio" name="ship" value="express"> Express, 1–2 days (+$9)</label>
  <details>
    <summary>More delivery options</summary>
    <label><input type="radio" name="ship" value="pickup"> Pickup point</label>
    <label><input type="radio" name="ship" value="scheduled"> Scheduled delivery</label>
  </details>
</fieldset>
```

```jsx
// Large action set: filter by typing instead of listing everything
function CommandPalette({ commands, open, onClose }) {
  const [q, setQ] = useState("");
  const hits = commands
    .filter(c => c.label.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 8);                                   // short, ranked result list
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={e => e.key === "Escape" && onClose()}>
      <input autoFocus aria-label="Search commands" value={q} onChange={e => setQ(e.target.value)} />
      <ul>{hits.map(c => <li key={c.id}><button onClick={c.run}>{c.label}</button></li>)}</ul>
    </div>
  );
}
// Open it on (e.metaKey || e.ctrlKey) && e.key === "k" from a global keydown listener.
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Desktop top nav > 7 items, or mobile bottom bar > 5 tabs | `lint: nav-overload` · `audit: nav-overload` | major | Group items, move secondary links to "More" or a utility nav |
| Several equally styled primary buttons in one view | `lint: multiple-primary-cta` · `audit: cta-competition` | major | One filled primary; demote the rest to secondary or text |
| `<select>` or radio group with many options in no useful order | `lint: select-overload` | major | Sort by frequency or alphabetically, add type-to-filter, or ask a narrowing question first |
| Every setting or filter shown at once | manual: > 10 controls in one view with no `<details>`, tabs, or "Advanced" section | minor | Show common options, collapse the rest |
| No default or recommendation where one is obvious | manual: radio groups with no `checked`; plan or option cards with none highlighted | minor | Preselect the safe common choice, add a "Recommended" marker |
| Dozens of actions reachable only through nested menus | manual: app with > 20 commands and no search or ⌘K | minor | Add a command palette or searchable menu |
| Familiar ordered list split into extra steps (region → country) | manual: cascading pickers for items users know by name | minor | One list with type-to-filter |
| Vague or near-identical option labels | manual: read options aloud; can you say how "Standard" differs from "Essential"? | major | Name options by outcome and add a one-line description |

## Tensions & trade-offs

- **vs. [Fitts's Law](fitts-law.md):** hiding options behind "More" removes decisions but adds a click and a target to hit. Keep the frequently used ones visible ([Pareto Principle](pareto-principle.md)) and hide only the rare ones.
- **vs. [Tesler's Law](teslers-law.md):** some complexity is irreducible. If users truly need 40 options, give them grouping, search, and defaults instead of pretending the options don't exist.
- **vs. [Jakob's Law](jakobs-law.md):** a familiar long menu can be faster than a novel "simplified" one. Don't restructure a known pattern just to lower a count.
- **Speed vs. satisfaction:** Hick's Law is about how *long* a choice takes. The motivational cost of too many comparable options (giving up, regret) is [Choice Overload](choice-overload.md).

## Quick test

Point at each decision on the screen: can a first-time user tell almost at a glance which option is theirs, and is there an obvious default if they don't care?
