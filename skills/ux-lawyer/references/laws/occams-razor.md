---
id: L19
name: "Occam's Razor"
source: https://lawsofux.com/occams-razor/
origin: "Principle of parsimony attributed to William of Ockham (c. 1287–1347), English Franciscan friar and scholastic logician."
category: decision
summary: "Remove every element, step, and field the task doesn't need, and stop the moment clarity starts to suffer."
applies_to: [forms, checkout, onboarding, layouts, navigation, buttons, icons, copy, settings, visual styling]
rules:
  - "Remove until it breaks: delete an element, rerun the task, and restore it only if something fails."
  - "Every field needs a reason. Ask only what this step requires; infer or defer the rest."
  - "Keep the system small: ~2 typefaces, a 5–7 step type scale, one accent color, one spacing scale."
  - "One clear path per common task: one primary CTA per view, no duplicate buttons for the same action."
  - "Never trade clarity for minimalism: icon-only buttons need a visible label, or an aria-label plus tooltip."
---

# Occam's Razor (L19)

## In plain words

When two designs do the same job, prefer the one with less in it. Every element on a screen (a field, a step, a button, a divider, a badge, a sentence) costs attention to notice, understand, and then ignore. If it doesn't help the user finish what they came for, it is pure cost. The working method is subtractive: take things away until the design stops working, then put back only what was needed.

Simple is not the same as minimal. Removing a label to make an icon "clean", hiding a required step, or merging two different actions into one ambiguous button makes the interface *harder*, because the work moves from the screen into the user's head. The target is the fewest elements that still make the task obvious.

## Why it matters in a UI

- **Everything competes for attention.** Decorative badges, redundant icons, and secondary links dilute what matters ([Selective Attention](selective-attention.md)). The primary action stands out less with every neighbor.
- **Every field and step is a drop-off point.** Each extra input adds effort, a chance of error, and a privacy doubt ("why do they need my phone number?").
- **Redundancy creates doubt.** Two buttons that do almost the same thing, or one setting in two places, make users stop and wonder what the difference is.
- **Less UI is cheaper everywhere.** Fewer components and variants mean fewer bugs, smaller bundles, faster pages ([Doherty Threshold](doherty-threshold.md)), and less to make accessible.
- **Over-trimming backfires.** Unlabeled icons, mystery-meat navigation, and gesture-only actions shift cost from the screen to the user's memory.

## Build it right

### Everywhere
1. **Run a removal pass.** For each element ask: what breaks if this goes? If the answer is "nothing", delete it. "It looks emptier" is not breakage.
2. **Trim forms hard.** One "Full name" field unless you truly need parts. No "Confirm email" or "Confirm password" (offer show-password instead). Delete most optional fields, and mark the survivors "(optional)".
3. **Infer instead of asking.** Detect card brand from the number, fill city from postal code, default country from locale, and use `autocomplete` tokens so the browser fills the rest.
4. **Cut steps.** Merge screens that each hold one trivial question. Offer guest checkout. Replace confirmation dialogs for reversible actions with undo.
5. **Shrink the visual system.** Use tokens: ~2 font families, a 5–7 step type scale, one accent plus neutrals and semantic colors (success, warning, error), one spacing scale on a 4px or 8px grid. Delete one-off values.
6. **Write less.** Cut intro paragraphs nobody reads. Button labels are verb + object ("Save draft"), not "Click here to save your draft".
7. **Keep what makes it clear.** Labels, helpful error text, focus indicators, and confirmation of irreversible actions are not clutter. Never remove them in the name of simplicity.

### Mobile
- Small screens enforce the razor. If something doesn't fit, first ask whether it is needed before shrinking it. Don't bury desktop clutter in a hamburger; remove it.
- One column, one task per screen, one sticky primary action.
- Icon-only bottom tabs look clean but are ambiguous. Keep short text labels under the icons (≥ 12px).
- Native inputs (`type="date"`, `type="email"`, `inputmode="numeric"`) beat custom widgets: the OS keyboard and picker are the simplest UI you can ship.

### Desktop
- Big screens invite filler: "related" sidebars, stacked banners, decorative illustrations. Let whitespace be the layout; don't fill space because it exists.
- Icon-only toolbar buttons are acceptable for universally known actions (bold, undo, print) when each has an accessible name and a tooltip. Anything less familiar gets a text label.
- Avoid duplicate paths: the same action in a toolbar, a context menu, a header button, and a footer link. Keep the paths people actually use, plus a keyboard shortcut.

## Code patterns

```html
<!-- Before: first, last, email, confirm email, phone, password, confirm password.
     After: 3 fields, and the browser fills most of them -->
<form>
  <label for="email">Email</label>
  <input id="email" type="email" autocomplete="email" required>
  <label for="name">Full name</label>
  <input id="name" autocomplete="name" required>
  <label for="pw">Password</label>
  <input id="pw" type="password" autocomplete="new-password" minlength="8" required>
  <button type="button" aria-controls="pw" aria-pressed="false">Show password</button>
  <button type="submit">Create account</button>
</form>
```

```jsx
// Minimal but not mystery-meat. Best: icon + visible text.
<button className="btn"><TrashIcon aria-hidden="true" /> Delete draft</button>

// Only where space is tight and the icon is universal: accessible name + real tooltip
<Tooltip content="Delete draft">
  <button className="icon-btn" aria-label="Delete draft"><TrashIcon aria-hidden="true" /></button>
</Tooltip>
```

```css
/* One scale, few values. Replace one-offs like 13px, 15px, 22px, #3a7bd5 with tokens */
:root {
  --font-sans: system-ui, sans-serif;
  --text-sm: .875rem; --text-base: 1rem; --text-lg: 1.25rem; --text-xl: 1.5rem; --text-2xl: 2rem;
  --space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px; --space-5: 32px; --space-6: 48px;
  --accent: #2563eb;
}
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Form asks more than the step needs (confirm fields, phone, title, fax) | `lint: form-long` · `audit: form-load` | major | Remove, infer, or defer to after the task |
| Icon-only buttons with no accessible name or label | manual: grep `<button>` whose only child is `<svg>`, `<i>`, or an icon component, with no `aria-label` | critical | Visible text, or `aria-label` + tooltip for universal icons |
| Many one-off font sizes and colors | `lint: font-size-sprawl` · `lint: color-sprawl` · `audit: font-sprawl` · `audit: color-sprawl` | minor | Map to tokens; delete off-scale values |
| Arbitrary spacing values | `lint: spacing-off-scale` | minor | Snap to the spacing scale |
| Several primary CTAs, or the same action duplicated | `lint: multiple-primary-cta` · `audit: cta-competition` | major | One primary per view; remove duplicate paths |
| Decorative clutter: autoplay carousels, stacked banners, badges everywhere | `lint: autoplay-carousel` · manual: count elements competing above the fold in a screenshot | minor | Remove, or replace with one static hero |
| Steps holding one trivial question, or confirm dialogs for reversible actions | manual: walk the flow and count screens and clicks to finish | major | Merge steps; use undo instead of confirm |
| Copy trimmed into vagueness ("OK", "Submit", "Click here") | `lint: generic-button-label` | minor | Verb + object labels |

## Tensions & trade-offs

- **vs. [Tesler's Law](teslers-law.md):** complexity you remove from the UI doesn't vanish. Make sure it moves to the system (inference, defaults), not to the user's memory.
- **vs. [Aesthetic-Usability](aesthetic-usability.md):** a sparse screen can look elegant and still fail. Judge by completed tasks, not by screenshots.
- **vs. [Jakob's Law](jakobs-law.md) / [Mental Model](mental-model.md):** conventions sometimes add elements users rely on (a visible cart, a footer with contact info). Removing an expected element costs more than keeping it.
- **vs. [Hick's Law](hicks-law.md):** the razor removes what is unnecessary. Hick's Law governs how to present what is left: grouping, defaults, disclosure.

## Quick test

Pick any element and imagine deleting it. Would anyone notice or fail the task? If not, delete it. If they'd be confused, it stays, and may need a clearer label.
