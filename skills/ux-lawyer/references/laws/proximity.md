---
id: L13
name: "Law of Proximity"
source: https://lawsofux.com/law-of-proximity/
origin: "Max Wertheimer (1923), 'Untersuchungen zur Lehre von der Gestalt II', Psychologische Forschung (the Gestalt grouping laws)."
category: perception
summary: "Set related things close together and unrelated things far apart, so spacing alone shows what belongs to what."
applies_to: [forms, labels, buttons, cards, lists, headings, navigation, toolbars, captions, page layout]
rules:
  - "Inner spacing < outer spacing, always. The gap inside a group is at most half the gap between groups."
  - "Use a 4/8px scale: 4–8px inside a control, 12–16px between items, 24–32px between groups, 48–96px between sections."
  - "A label sits 4–8px from its input. The next field starts 16–24px below. Never make the two gaps equal."
  - "Headings sit closer to what they introduce than to what precedes them: e.g. 32–64px above, 8–12px below."
  - "Put help text, errors, units, and actions directly next to the element they belong to."
---

# Law of Proximity (L13)

## In plain words

The eye groups things by distance. Elements close together are read as one unit, and a larger gap is read as a boundary. Whitespace is therefore information, not leftover space: it says "this label belongs to this field", "this caption belongs to this photo", "this button acts on this card".

Grouping by distance happens before anyone reads a word. If the gaps are wrong, users regroup the content wrongly: they attach a label to the wrong input, read a price as belonging to the neighboring product, or miss where one section ends and the next begins.

## Why it matters in a UI

- **Ambiguous gaps cause real errors.** A label equally far from two inputs gets attached to the wrong one. Inline help that floats midway between fields gets misread.
- **It is the cheapest grouping cue.** No borders, fills, or shadows are needed, so layouts stay light. Add a [Common Region](common-region.md) only when spacing can't do the job.
- **Orphaned headings break the outline.** A heading with equal space above and below belongs to neither section, so the page structure can't be scanned.
- **Consistent rhythm makes scanning predictable.** When gaps follow a scale, users know where the next item starts. Random gaps turn every block into a puzzle.
- **Responsive reflow breaks proximity.** When columns stack, side-by-side pairs can end up far apart, and unrelated blocks can end up pressed together.

## Build it right

### Everywhere
1. **Define a spacing hierarchy and never invert it.** Each tier is roughly double the one inside it: 4px (icon ↔ its text, input ↔ hint), 8px (label ↔ input, heading ↔ its text, buttons in a group), 16px (item ↔ item), 24–32px (group ↔ group), 48–96px (section ↔ section).
2. **Label closer to its input than to the previous field.** Label 4–8px above the input, hint or error 4–6px below it, next label 16–24px further down. Use top-aligned labels by default.
3. **Headings hug their content.** `margin-top` at least 2–3x `margin-bottom`. Reset default `h2 { margin: 0.83em 0 }`-style symmetric margins.
4. **Put actions beside their objects.** "Remove" next to the item, "Edit" next to the value, submit right after the last field ([Fitts's Law](fitts-law.md)). Keep primary and secondary buttons 8–12px apart, and destructive ones visibly further away.
5. **Errors and help next to the field.** Inline, directly under the input, linked with `aria-describedby`. A summary at the top of the form is an addition, not a replacement.
6. **Let parents own spacing.** Use `gap` on flex and grid containers instead of margins on children, and take every value from spacing tokens.
7. **Captions and media stay paired.** Caption 8px below its image, next figure 24px or more away.

### Mobile
- **Keep pairs together when stacking.** A two-column layout must collapse as label+value, image+caption pairs, not "all of column A, then all of column B". Order the DOM by pair, or use grid areas per pair.
- **Shrink outer tiers, keep inner ones.** Section gaps drop to 48–64px. Label-to-input stays 6–8px. The ratio between tiers matters more than the absolute size.
- **Separate targets ≥ 8px apart even when they belong together** ([Fitts's Law](fitts-law.md)). Show the grouping with a shared container or a segmented shape instead of by squeezing.
- **Hints and errors directly under the input** stay visible above the on-screen keyboard while the field is focused. A hint placed above the label scrolls away.

### Desktop
- **Wide screens pull pairs apart.** A label at the left edge and its value at the right edge of a 1200px row lose each other. Cap forms and key-value lists at about 600–720px, or add zebra striping or dotted leaders.
- **Side-by-side labels:** keep the label column narrow, with 12–16px between label and input and 16–24px between rows.
- **Toolbars:** 4px between related tools, 16–24px or a divider between tool groups.
- **Multi-column forms:** make the column gutter (≥ 32px) clearly larger than the field gap so users read down a column, not across.

## Code patterns

```css
:root {
  --space-1: 4px;   /* inside a control: icon ↔ text, input ↔ hint */
  --space-2: 8px;   /* label ↔ input, heading ↔ its text, buttons in a group */
  --space-3: 12px;
  --space-4: 16px;  /* item ↔ item: list rows, fields on mobile */
  --space-6: 24px;  /* field ↔ field on desktop, card ↔ card */
  --space-8: 32px;  /* group ↔ group: fieldsets, card sections */
  --space-16: 64px; /* section ↔ section */
}
.form  { display: grid; gap: var(--space-8); }   /* groups: 32px */
.group { display: grid; gap: var(--space-6); }   /* fields: 24px */
.field { display: grid; gap: var(--space-2); }   /* label, input: 8px */
.field .hint, .field .error { margin-top: calc(var(--space-1) - var(--space-2)); } /* input ↔ hint: 4px */
h2 { margin: var(--space-16) 0 var(--space-3); } /* far from above, close to below */
```

```jsx
// Bad: one uniform gap, so each label floats between two inputs
<div className="space-y-4"><label>First name</label><input /><label>Last name</label><input /></div>

// Good: pairs tight (8px), pairs apart (24px)
<div className="space-y-6">
  <div className="space-y-2"><label htmlFor="first">First name</label><input id="first" autoComplete="given-name" /></div>
  <div className="space-y-2"><label htmlFor="last">Last name</label><input id="last" autoComplete="family-name" /></div>
</div>
```

Tailwind: `gap-1`/`gap-2` inside, `gap-4`/`gap-6` between items, `gap-8`+ between groups. Avoid arbitrary values like `mt-[13px]`.

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Label equidistant between its input and the previous field | manual: compare label `margin-bottom` with field spacing; in a screenshot, labels float | major | Label ↔ input 4–8px, field ↔ field 16–24px |
| Spacing off the 4/8 scale, or different per component | `lint: spacing-off-scale` | minor | Snap to tokens; set spacing with `gap` on the parent |
| Orphaned headings (equal space above and below) | manual: `margin-top` ≈ `margin-bottom` on `h1`–`h4` | minor | `margin-top` ≥ 2–3x `margin-bottom` |
| Errors or hints far from their field (top summary only, or below a long block) | manual: error element not adjacent to its input; no `aria-describedby` | major | Inline message right under the field, linked by `aria-describedby` |
| Action far from the object it affects | manual: screenshot, follow each button to its target | major | Move next to the item or to the end of the form |
| Separate targets squeezed together to look grouped | `audit: tap-target-spacing` | major | ≥ 8px apart; group with a container instead |
| Pairs split when columns stack on mobile | manual: 390px screenshot shows all labels, then all values | major | Pair-ordered DOM, or grid areas per pair |
| Key-value rows stretched across a wide screen | manual: 1440px screenshot, label and value > 400px apart | minor | `max-width` 600–720px, zebra rows, or leaders |

## Tensions & trade-offs

- **vs. [Common Region](common-region.md):** a box overrides spacing. Use one when the gaps can't be made big enough (dense dashboards), and make sure the box and the gaps agree.
- **vs. [Fitts's Law](fitts-law.md):** grouping wants things close, touch wants ≥ 8px between targets. On touch screens, group with a shared shape or container instead of squeezing.
- **vs. density and [Cognitive Load](cognitive-load.md):** generous gaps fit less per screen. Tighten outer tiers before inner ones and keep the ratios.
- **vs. [Similarity](similarity.md):** in uniform grids, spacing is equal and styling has to carry the grouping. Use both cues deliberately so they don't contradict each other.

## Quick test

Strip every border and background (or blur the screenshot). Can you still tell which label goes with which input, and where each section starts?
