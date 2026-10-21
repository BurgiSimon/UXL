---
id: L16
name: "Law of Uniform Connectedness"
source: https://lawsofux.com/law-of-uniform-connectedness/
origin: "Stephen E. Palmer & Irvin Rock (1994), 'Rethinking perceptual organization: The role of uniform connectedness', Psychonomic Bulletin & Review."
category: perception
summary: "Physically join related elements with lines, shared surfaces, or attached shapes when spacing and boxes can't show the relationship."
applies_to: [steppers, timelines, tabs, tooltips, popovers, segmented controls, button groups, input addons, trees, diagrams]
rules:
  - "Tie sequences together with one continuous 2px connector that takes the accent color as steps complete."
  - "Attach the active tab to its panel: same background, no border between them."
  - "Anchor tooltips and popovers to their trigger with an 8–12px arrow or a flush edge."
  - "Fuse options that form one choice into one control (segmented control, button group, input + addon)."
  - "Never connect unrelated things: full-width rules and shared bands imply relationships that aren't there."
---

# Law of Uniform Connectedness (L16)

## In plain words

Elements joined by a line, a shared fill, or touching edges are seen as one unit, more strongly than elements that are merely close together or styled alike. Connection is the most explicit grouping cue there is: it draws the relationship instead of implying it.

In UI, connection shows sequence (steps, timelines), ownership (this tooltip explains that icon, this tab owns that panel), and compound controls (an input fused with its unit or its button). Because the cue is so strong, accidental connections, like a divider running through two unrelated columns, mislead just as strongly.

## Why it matters in a UI

- **It wins when cues conflict.** Palmer and Rock proposed that connected regions are among the first units perception forms, before grouping by proximity or similarity. A connector tends to override contradictory spacing or styling.
- **It encodes direction and order.** Lines and arrows say "this leads to that", which pure grouping can't. Sequences, flows, and hierarchies need it.
- **It resolves ownership in overlays.** With several identical info icons on a screen, an arrow or flush anchor is what tells users which one a popover explains.
- **Fused controls read as one decision.** A segmented control says "pick one of these". Three separate buttons say "three separate actions".
- **Responsive layouts break connectors.** Horizontal steppers and timelines that wrap or squeeze on a phone lose their line, and the sequence falls apart.

## Build it right

### Everywhere
1. **Steppers and progress.** Number or dot markers joined by a continuous 2px line. Completed segments in the accent, upcoming ones neutral, the current step labeled. Mark up as an `<ol>` with `aria-current="step"`.
2. **Tabs.** The selected tab shares the panel's background and drops the border between them, or carries an accent indicator sitting on the panel edge. Use `role="tablist"`, `tab`, `tabpanel`, `aria-selected`, `aria-controls`.
3. **Overlays.** Tooltips, popovers, and menus attach to their trigger with an 8–12px arrow or a flush edge, and flip to stay on screen (Floating UI or CSS anchor positioning).
4. **Compound controls.** Segmented controls and button groups share one outer border and radius, with squared inner corners and 1px dividers. An input with a prefix, suffix, or attached button ("USD", "kg", "Copy") shares one boundary and one focus ring.
5. **Relationships in content.** Indent guides in trees, a vertical thread line in nested comments, connectors in org charts and diagrams. Keep connectors lighter than the content (1–2px, muted color).
6. **Linked highlighting.** Hovering or focusing a table row highlights the matching chart point or map pin, and vice versa.
7. **No accidental links.** Scope dividers to their own column or group, keep background bands inside one section, and check every arrow points at the right element.

### Mobile
- **Compact steppers.** Replace a wide horizontal stepper with "Step 2 of 4" plus a connected progress bar, or a vertical stepper with the line running down the left edge.
- **Vertical timelines.** One line 16–24px from the left edge, with events hanging off it.
- **No hover.** Tooltips become tap-to-open popovers or inline help. Bottom sheets connect to their context through a grabber and a scrim.
- **Segmented controls with > 3–4 options or long labels** don't fit at 390px. Switch to a select or scrollable chips instead of shrinking the segments ([Fitts's Law](fitts-law.md)).

### Desktop
- **Cross-view highlighting** (row ↔ chart point ↔ map pin) is worth building on wide screens. Trigger it on keyboard focus as well as hover.
- **Menus touch their trigger.** No gap between a dropdown and its button, or a visible arrow, so the pointer path and the visual link match.
- **Split buttons** (action + caret) share one boundary with a 1px divider, and the caret is its own labeled target (`aria-label="More save options"`).
- **Diagrams and flow builders:** orthogonal connectors, clear arrowheads, minimal crossings.

## Code patterns

```html
<ol class="stepper" aria-label="Checkout progress">
  <li data-done>Cart</li>
  <li data-done>Shipping</li>
  <li aria-current="step">Payment</li>
  <li>Review</li>
</ol>
```

```css
/* Stepper: markers on one continuous line */
.stepper { display: flex; list-style: none; padding: 0; counter-reset: step; }
.stepper li { flex: 1; position: relative; text-align: center; }
.stepper li::before {                                   /* marker */
  counter-increment: step; content: counter(step); position: relative; z-index: 1;
  display: grid; place-items: center; width: 28px; height: 28px; margin: 0 auto 8px;
  border: 2px solid var(--border); border-radius: 50%; background: var(--surface);
}
.stepper li + li::after {                               /* line back to the previous marker */
  content: ""; position: absolute; top: 13px; right: 50%; width: 100%; height: 2px;
  background: var(--border);
}
.stepper li:is([data-done], [aria-current="step"])::before { border-color: var(--accent); }
.stepper li[data-done] + li::after { background: var(--accent); }

/* Active tab and panel share one surface */
[role="tablist"] { display: flex; gap: 4px; border-bottom: 1px solid var(--border); }
[role="tab"] { min-height: 44px; padding: 0 16px; margin-bottom: -1px;
  border: 1px solid transparent; border-radius: 8px 8px 0 0; }
[role="tab"][aria-selected="true"] { background: var(--surface);
  border-color: var(--border); border-bottom-color: var(--surface); }
[role="tabpanel"] { background: var(--surface); border: 1px solid var(--border); border-top: 0; padding: 24px; }
```

Tailwind: button group = `inline-flex divide-x rounded-lg border overflow-hidden`. Input addon = a `flex rounded-md border focus-within:ring-2` wrapper around a borderless `<input>` and its suffix.

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Stepper or timeline without a connector, or broken where it wraps | manual: screenshots at 390px and 1440px; steps wrapping onto two rows | major | Continuous line; vertical stepper or "Step x of n" + bar on mobile |
| Horizontal timeline or diagram overflowing the phone viewport | `audit: horizontal-overflow` | major | Reflow vertically, or a contained scroll area with a visible cue |
| Active tab detached from its panel (gap, border between, styled like inactive tabs) | manual: inspect `[aria-selected="true"]` styles | minor | Shared surface, no dividing border, accent indicator on the panel edge |
| Popover or tooltip floating without an anchor among similar triggers | manual: open each one; is the owner obvious? | minor | Arrow or flush anchor; Floating UI or anchor positioning |
| One choice rendered as separate buttons, or unrelated actions fused into one group | manual: view switchers and filters vs. toolbars | minor | Segmented control for one choice; separate unrelated actions |
| Accidental connections: dividers or bands spanning unrelated columns | manual: screenshot, full-width rules crossing a two-column layout | minor | Scope dividers to their column or group |
| Linked highlighting that works on hover only | `lint: hover-only` | major | Also trigger on `:focus-visible` and on tap selection |
| Progress shown only visually | manual: no `<ol>`, no `aria-current="step"`, no "Step x of n" text | minor | Ordered list, `aria-current`, visible step count |

## Tensions & trade-offs

- **vs. [Prägnanz](pragnanz.md) and [Occam's Razor](occams-razor.md):** every line adds ink. Connect only where proximity or a shared region doesn't already make the relationship clear.
- **vs. [Common Region](common-region.md):** a region says "these belong together", a connector says "this leads to, or belongs to, that". Boxing sequential steps together hides their order.
- **vs. [Goal-Gradient](goal-gradient.md):** a filling progress line motivates by showing the distance left. Never fake it, for example by showing steps as done that the user never completed.
- **vs. [Fitts's Law](fitts-law.md):** fused segments share borders, but each one still needs a full-size hit area.

## Quick test

Point at any tooltip, tab, step, or grouped control. Is it physically attached to what it belongs to, and is anything attached that shouldn't be?
