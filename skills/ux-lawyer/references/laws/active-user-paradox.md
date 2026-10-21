---
id: L20
name: "Paradox of the Active User"
source: https://lawsofux.com/paradox-of-the-active-user/
origin: "John M. Carroll & Mary Beth Rosson (1987), 'Paradox of the Active User', in Interfacing Thought: Cognitive Aspects of Human-Computer Interaction."
category: interaction
summary: "Assume nobody reads instructions first: teach inside the interface at the moment of need, and make experimenting safe."
applies_to: [onboarding, empty states, tooltips, inline help, forms, validation, error messages, feature discovery, undo, settings]
rules:
  - "Put help where the question arises: a one-sentence hint under the field, not a link to a help page."
  - "Replace upfront tours with contextual tips at first use of a feature: one at a time, always dismissible."
  - "Empty states teach: say what goes here, why it helps, and offer the one action that fills it."
  - "Keep submit buttons enabled. On submit, focus the first problem and say exactly what's missing."
  - "Prefer undo over confirmation dialogs for reversible actions, so trial and error is safe."
---

# Paradox of the Active User (L20)

## In plain words

People open software to get something done, right now. They skip the welcome tour, ignore the manual, and start clicking. It's a paradox because a few minutes of reading would often save them much more time later, yet the urge to produce something immediately wins almost every time. Carroll and Rosson also noted a second bias: people interpret a new system through what they already know, even when that knowledge misleads them, and they stick with the first method that works instead of finding a better one.

You can't fix this by writing better docs. The interface itself has to teach, at the moment a question comes up, and mistakes made while exploring must be cheap to undo.

## Why it matters in a UI

- **Upfront tours are skipped or forgotten.** A multi-screen carousel at first launch arrives before the user has any context, so even people who click through it retain little.
- **Help is read only at the moment of need.** A hint next to the field being filled gets read. The same text in a help center rarely does.
- **Fear of breaking things stops exploration.** If actions feel irreversible or confirmations sound scary, users stop trying things and never discover features.
- **Users settle on the first workable path.** If the efficient way (bulk edit, shortcut, template) isn't shown in context, it stays undiscovered.
- **Disabled controls explain nothing.** A greyed-out submit button signals that something is wrong but not what, so users hunt for the problem.

## Build it right

### Everywhere
1. **Inline hints next to the input.** A persistent hint under the label, linked with `aria-describedby`. One sentence covering format, constraint, or why you're asking. Placeholders vanish on typing, so they don't count.
2. **Empty states that teach.** First-run empty views get a one-line explanation, one primary action ("Create your first project"), and optionally a template or sample data. Never a blank pane or a bare "No items".
3. **Progressive onboarding.** Instead of a tour, show a single tip anchored to a feature the first time the user reaches it. One tip on screen at a time, dismissible, never shown again once dismissed or used.
4. **Tooltips on demand.** Explain icons and jargon in tooltips that open on hover *and* keyboard focus, plus a tappable "?" on touch. Essential information never lives only in a tooltip.
5. **Don't disable submit.** Keep it enabled. On submit, show a short error summary, put a specific message on each invalid field, and move focus to the first one.
6. **Undo over confirm.** For archive, delete, move, and similar: act immediately, then show a toast with "Undo" for 5–10 s that pauses while hovered or focused. Keep confirmation dialogs for actions that truly cannot be reversed.
7. **Surface the better path in context.** Show shortcuts in tooltips and menu items ("Archive  E"). When a user repeats the same single-item action several times, suggest the bulk version.

### Mobile
- There is no hover. Tooltips need a 44px tap target ("?" or "Info") that opens a popover or bottom sheet.
- Coach marks must not cover the control they explain. Keep them to one line and dismiss them on any tap.
- Teach gestures with visible affordances (a peek of the next card, a drag handle on sheets) and always offer a button for any swipe-only action.
- Skip the intro carousel. Land users in the product and ask for permissions in context, such as the camera on the first tap of "Scan".

### Desktop
- Show keyboard shortcuts next to menu items and in tooltips. A command palette (Cmd/Ctrl+K) doubles as searchable, in-context help.
- Open tooltips after a short hover delay (around 300–500 ms) so they don't flicker during cursor travel, and immediately on keyboard focus.
- Empty states can offer more starting points: a template gallery, "Import from CSV", or a sample workspace for people who learn by poking around.

## Code patterns

```html
<!-- Persistent hint, announced with the field; not a vanishing placeholder -->
<label for="slug">Project URL</label>
<p id="slug-hint" class="hint">Lowercase letters, numbers, and dashes. You can change it later.</p>
<input id="slug" name="slug" aria-describedby="slug-hint">
```

```jsx
// Submit stays enabled; on click, explain what's missing and go there
function onSubmit(e) {
  e.preventDefault();
  const errors = validate(values);            // e.g. { email: "Enter your email address" }
  setErrors(errors);
  const first = Object.keys(errors)[0];
  if (first) return document.getElementById(first)?.focus();
  save(values);
}
// <button type="submit">Create account</button>   never disabled={!isValid}
```

```jsx
// Teaching empty state + undo instead of "Are you sure?"
{projects.length === 0 && (
  <section className="empty">
    <h2>No projects yet</h2>
    <p>Projects group your tasks and files. Start from scratch or from a template.</p>
    <button className="btn-primary" onClick={createProject}>New project</button>
    <a href="/templates">Browse templates</a>
  </section>
)}

function archive(item) {
  hide(item.id);                                // optimistic
  toast({ text: `Archived "${item.name}"`, action: { label: "Undo", onClick: () => unhide(item.id) }, ms: 8000 });
}
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Submit disabled until the form is valid | `lint: disabled-submit` | major | Enable it. Validate on submit, then list and focus the errors |
| Placeholder used as the only label or hint | `lint: placeholder-as-label` · `audit: unlabeled-input` | major | Visible label plus a persistent hint via `aria-describedby` |
| Multi-step tour or carousel blocking first use | manual: modal on first load; grep `tour`, `walkthrough`, `shepherd`, `intro.js` | major | Contextual tips at the first use of each feature, one at a time |
| Blank or bare "No data" empty states | manual: view each list, table, and dashboard with zero items | major | Explain, offer the primary action, add a template or sample |
| Confirmation dialog for reversible actions | `lint: native-dialog-interrupt` · manual: grep `confirm(` | minor | Act immediately and offer undo |
| Help reachable only by hovering | `lint: hover-only` | major | Open on focus too, tap-to-reveal on touch, essentials inline |
| Vague errors ("Invalid input", "Error") | manual: grep error strings; submit empty and malformed values | major | Say what's wrong and how to fix it, next to the field |
| Powerful features with no in-context discovery | manual: shortcuts or bulk actions documented but never hinted in the UI | minor | Shortcut hints in menus and tooltips, a command palette, usage-triggered tips |

## Tensions & trade-offs

- **vs. [Cognitive Load](cognitive-load.md):** too many hints, badges, and tips turn into noise. Show one at a time and retire each once the user has used the feature.
- **vs. [Jakob's Law](jakobs-law.md):** the best onboarding is needing none. Conventional patterns let users' prior knowledge work for you; every novel interaction is something you now have to teach.
- **vs. [Selective Attention](selective-attention.md):** floating announcement banners look like ads and get ignored. Anchor guidance to the task at hand.
- **Undo needs engineering ([Tesler's Law](teslers-law.md)):** soft deletes or delayed commits move complexity into the system. For truly irreversible, high-stakes actions (payments, sending to customers, deleting an account), a confirmation that names the consequence is still right.

## Quick test

Hand the screen to someone with a goal and no instructions. Where do they stall, and does the screen answer their question right there without sending them elsewhere?
