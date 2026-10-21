---
id: L17
name: "Mental Model"
source: https://lawsofux.com/mental-model/
origin: "Kenneth Craik (1943), 'The Nature of Explanation'. Applied to design by Donald A. Norman (1988), 'The Psychology of Everyday Things' (later 'The Design of Everyday Things')."
category: cognition
summary: "Design around how users believe the product works: use their words, match their cause-and-effect expectations, show what's clickable."
applies_to: [navigation, labels, buttons, toggles, settings, information architecture, icons, gestures, hover states, feedback]
rules:
  - "Name things in users' words, taken from search logs, support tickets, and interviews, not internal or database names."
  - "Make affordances visible: buttons look pressable, links look like links, draggable items show a grip handle."
  - "Never require hover. Hover-revealed content and actions also need a tap, focus, and keyboard path."
  - "Switches apply immediately; checkboxes and fields in a form wait for Save. Don't mix the two models in one form."
  - "Show the result of every action (Saved, Sent, Archived, Deleted forever) so the user's model stays in sync."
---

# Mental Model (L17)

## In plain words

A mental model is the user's internal picture of how a system works: what things are called, where they live, and what will happen when they act. People act on that picture, not on your architecture. When the UI matches it, the product feels obvious. When it doesn't, users make "mistakes" that are really design mismatches.

There are three models in play: the designer's model of how it works, the user's model of how they *think* it works, and the interface in between. Users never see your database schema or org chart. They only see labels, layout, signifiers, and feedback, so the interface is the only tool you have to shape their model.

## Why it matters in a UI

- **Vocabulary mismatch breaks findability.** Users search, scan, and navigate with their own words. A nav labeled with internal terms ("Entities", "Fulfillment", "Workspaces") fails even when the layout is clean.
- **Signifiers set expectations.** Something that looks clickable but isn't, or is clickable but looks like plain text, makes users wrong about what they can do.
- **Users predict outcomes before acting.** Does this switch apply now? Will closing the tab lose my draft? Is "Delete" permanent? Wrong predictions cause data loss, repeated actions, and support tickets.
- **Input modality changes the model.** Touch users have no hover. A UI that reveals actions only on hover simply lacks those actions for them.
- **Metaphors carry baggage.** Cart, folder, trash, and inbox each bring expectations. A "Trash" that deletes instantly, or a "Cart" that empties on reload, breaks a model users trusted.

## Build it right

### Everywhere
1. **Learn the users' words.** Mine site-search queries, support tickets, reviews, and interviews. Use the most common user term in nav, headings, and buttons ("Orders", not "Fulfillment objects").
2. **Structure by the users' model.** Run an open card sort (about 15+ participants is a common minimum) to see how users group content, then validate the proposed nav with a tree test before you build it.
3. **Make affordances visible.** Buttons have fill or border and padding, links are underlined, inputs have visible borders, draggable items show a grip and `cursor: grab`, and scrollable rows show a partly cut-off item at the edge.
4. **Label actions by outcome.** "Delete project", "Send invoice", "Save address". Not "Submit", "OK", or "Process".
5. **Match the control to the commit model.** A switch applies immediately and confirms ("Saved"). Checkboxes and radios in a form wait for an explicit Save. Never put a switch inside a form that needs Save.
6. **Keep state visible and consequences explicit.** Show "Draft", "Saved 2s ago", "Archived (can be restored)" vs. "Deleted permanently". Explain what an irreversible action will do before it happens.
7. **Keep metaphors honest.** If you call it Trash, make it restorable. If you call it a cart, keep its items across sessions.

### Mobile
- **No hover.** Every hover tooltip and hover-revealed action needs a tap or always-visible equivalent (a "⋯" button, an info button, inline helper text). Gate hover-only styling with `@media (hover: hover) and (pointer: fine)`.
- **Gestures are invisible.** Swipe-to-delete, long-press menus, and pull actions are accelerators only. Always provide a visible control for the same action.
- **Same product, same names.** Don't rename or relocate features between mobile and desktop layouts. Users switch devices and expect one model.
- Touch users expect tapping a card to open it, tapping a switch to change it now, and system back to close the topmost layer.

### Desktop
- **Hover is expected as a preview.** Clickables change the cursor, icon-only buttons show a tooltip after a short delay (~300–500ms), and table rows can reveal actions on hover. All of it must also appear on keyboard focus.
- **App-like UIs invite desktop habits.** Where the UI looks like a file manager, editor, or board, users try right-click menus, double-click to open, drag-and-drop, and Shift/Cmd multi-select. Support them there, with keyboard equivalents. On content pages, leave the native context menu alone.
- **Keyboard users build their model from focus order.** Tab order follows the visual layout, and focus is always visible.

## Code patterns

```html
<!-- System model (what the database calls it) vs. user model (what people search for) -->
<nav aria-label="Main">
  <!-- Avoid: <a href="/entities">Entities</a> <a href="/fulfillment">Fulfillment</a> -->
  <a href="/customers">Customers</a>
  <a href="/orders">Orders</a>
</nav>
```

```css
/* Row actions: always visible on touch, revealed on hover/focus only where hover exists */
.row-actions { opacity: 1; }
@media (hover: hover) and (pointer: fine) {
  .row-actions { opacity: 0; }
  .row:hover .row-actions,
  .row:focus-within .row-actions { opacity: 1; }
}
```

```jsx
// A switch means "applies now", so save immediately and confirm. No Save button.
<label className="flex items-center justify-between gap-4 min-h-11">
  <span>Email me when someone comments</span>
  <input type="checkbox" role="switch" checked={on}
         onChange={(e) => save({ commentEmails: e.target.checked })} />
</label>
<p role="status" className="text-sm">{status === "saving" ? "Saving…" : status === "saved" ? "Saved" : ""}</p>
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Content or actions available only on hover | `lint: hover-only` | major | Always visible on touch; reveal on `:hover` and `:focus-within` only where hover exists |
| Clickable elements that don't look clickable | `lint: div-button` · manual: elements with click handlers but plain-text styling | major | Real `<button>`/`<a>` with button or link styling |
| Vague action labels ("Submit", "OK", "Click here") | `lint: generic-button-label` | minor | Name the outcome: "Send invoice", "Delete project" |
| Internal jargon in nav and labels | manual: compare nav labels with top site-search queries and support-ticket wording | major | Rename to the users' most common term; validate with a tree test |
| Switch that waits for Save, or checkbox that saves instantly | manual: toggle each setting, reload, and see what persisted | major | Switches commit immediately; form controls commit on Save |
| Action with no visible result | `lint: async-no-feedback` | major | Show pending, then success or failure, where the user acted |
| Disabled submit with no explanation of what's missing | `lint: disabled-submit` | major | Keep it enabled and explain errors on submit, or list what's missing |
| Gesture-only feature (swipe, long-press) with no visible control | manual: grep `touchstart`, swipe/gesture libraries; look for the matching button | major | Add a visible button or menu item for the same action |

## Tensions & trade-offs

- **vs. [Jakob's Law](jakobs-law.md):** conventions are a model shared across products. For domain tools (spreadsheets, IDEs, design apps), the domain's own model beats general web habits.
- **vs. [Tesler's Law](teslers-law.md):** a simplified model can hide real complexity (sync, permissions, billing). Surface it exactly where users' predictions would otherwise fail.
- **vs. [Occam's Razor](occams-razor.md):** stripping labels and borders for minimalism (icon-only buttons, flat text buttons) erodes the signifiers users rely on.
- **vs. [Paradox of the Active User](active-user-paradox.md):** users won't read docs to fix their model. Labels, signifiers, and feedback have to teach it in place.

## Quick test

Before they click, ask a newcomer what each nav item contains and what each button will do. Every wrong guess is a model mismatch to fix.
