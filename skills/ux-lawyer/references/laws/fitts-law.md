---
id: L07
name: "Fitts's Law"
source: https://lawsofux.com/fittss-law/
origin: "Paul M. Fitts (1954), 'The information capacity of the human motor system in controlling the amplitude of movement'. Shannon formulation by I. Scott MacKenzie (1992)."
category: interaction
summary: "The time to reach a target grows with its distance and shrinks with its size, so important targets should be big and close."
applies_to: [buttons, links, icon buttons, navigation, forms, checkboxes, menus, mobile, touch, toolbars]
rules:
  - "Touch targets are at least 44x44 CSS px. 24x24 is the absolute floor (WCAG 2.5.8)."
  - "Keep at least 8px between adjacent targets so neighbors don't get hit by mistake."
  - "Put the primary action where the pointer or thumb already is: at the end of the task, in the thumb zone on mobile."
  - "Grow the hit area, not only the visual: wrap labels around controls, make whole rows and cards clickable."
  - "Keep destructive actions away from frequent ones. Distance is deliberate friction."
---

# Fitts's Law (L07)

## In plain words

How long it takes to point at something depends on two things: how far away it is and how big it is. Small, distant targets are slow to hit and easy to miss. Large, nearby targets are fast and forgiving. Every button, link, and control is a target, so its size and position are usability decisions, not only visual ones.

The usual model is `MT = a + b · log2(D / W + 1)`, where *D* is the distance to the target and *W* is its width along the direction of movement. Doubling the distance costs roughly as much as halving the size.

## Why it matters in a UI

- **Touch is imprecise.** A fingertip covers about 8–10 mm, or 40–57 CSS px. A 24 px icon button on a phone gets hit by accident, or missed, all the time.
- **Misses cost more than time.** A miss can trigger the *wrong* action, such as "Delete" instead of "Edit". Users then hesitate on every later tap, which breaks [Flow](flow.md).
- **Distance adds up.** Primary actions placed far from where the task ends, like "Save" at the top of a long mobile form, force a scroll-and-aim round trip every time.
- **Screen edges and corners are special on desktop.** The pointer stops at the edge, which makes edge targets effectively infinite in depth. Web pages rarely benefit, but sticky bars do.

## Build it right

### Everywhere
1. **Size floor.** Interactive elements get `min-height: 44px`. Icon-only buttons keep a small icon and get a 44×44 hit area.
2. **Spacing floor.** Leave ≥ 8px between separate targets. In dense toolbars, use 4px gaps only when each target is already ≥ 44px.
3. **Grow hit areas without growing visuals.** Wrap checkbox and radio inputs in their `<label>`. Make the whole card or list row clickable when it has one primary destination. Extend small icons with a pseudo-element.
4. **Shorten the path.** Put the next action where attention already is: "Continue" directly under the last field, inline "Edit" next to the value, row actions on the row.
5. **Size by importance.** The primary action is the largest target in its region. Secondary actions can be smaller but never below the floor.
6. **Separate danger.** Destructive actions (Delete, Cancel subscription) go farther from the primary action, are styled quieter, and are backed by undo or confirmation.

### Mobile
- **Design for the thumb zone.** Most phone use is one-handed or cradled. The bottom-center of the screen is easiest to reach and the top corners are hardest. Put primary actions and main navigation at the bottom: a bottom tab bar, a sticky bottom CTA, bottom sheets.
- **Full-width primary buttons.** On narrow screens, `width: 100%` primary buttons, ≥ 48px tall, at the end of the flow or in a sticky footer that respects `env(safe-area-inset-bottom)`.
- Avoid targets hugging the screen edges where system gestures live (iOS home indicator, Android back swipe). Keep about 16px of side padding.

### Desktop
- Cursor travel matters more than finger size. Keep related controls close together (toolbar next to the content it acts on) and put contextual actions next to their objects (hover or row actions, with a keyboard alternative).
- Dropdown and mega menus: make the trigger generous, open on click (or hover with intent delay), and keep a "safe triangle" so diagonal movement toward a submenu doesn't close it.
- Sticky headers and side rails exploit edge targets. Keep their hit areas tall (≥ 40px) because they're used constantly.

## Code patterns

```css
:root { --uxl-target: 44px; --uxl-target-gap: 8px; }

button, [role="button"], .btn, input[type="submit"] {
  min-height: var(--uxl-target);
  padding-inline: 1rem;
  touch-action: manipulation;           /* no double-tap-zoom delay */
}

/* Small icon, big hit area */
.icon-btn { position: relative; inline-size: 24px; block-size: 24px; }
.icon-btn::after { content: ""; position: absolute; inset: -10px; } /* = 44px */

/* Mobile sticky primary action in the thumb zone */
@media (max-width: 640px) {
  .action-bar {
    position: sticky; bottom: 0;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    background: var(--surface);
  }
  .action-bar .btn-primary { width: 100%; min-height: 48px; }
}
```

```html
<!-- The whole label is the target, not only the 16px box -->
<label class="check"><input type="checkbox" name="terms"> I agree to the terms</label>
```

```jsx
// Whole card clickable via a stretched link (keeps one tab stop, real <a>)
<article className="card relative">
  <h3><a href={href} className="after:absolute after:inset-0">{title}</a></h3>
  <p>{summary}</p>
</article>
```

Tailwind: `min-h-11 min-w-11` = 44px, `h-12` = 48px. Avoid `h-6`, `h-8`, or `p-1` on anything clickable.

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Touch targets < 44px on mobile (< 24px is critical) | `audit: tap-target-size` · `lint: small-target` | major / critical | `min-height: 44px`, padding, or `::after` hit-area expansion |
| Adjacent targets < 8px apart | `audit: tap-target-spacing` | major | Add `gap`, or merge into one larger control |
| Checkbox or radio where only the box is clickable | manual: `<input type=checkbox>` without wrapping `<label>` or `for=` | minor | Wrap in `<label>` or connect with `for`/`id` |
| Primary action far from task end (top of a long form, off-screen on mobile) | manual / screenshots | major | Place after the last field, or a sticky bottom action bar |
| Tiny "×" close buttons on modals and toasts | `audit: tap-target-size` | major | 44px hit area, plus Esc and backdrop click |
| Destructive action next to primary, same styling | manual | major | Separate, de-emphasize, add undo or confirm |
| Hover-only menus that collapse on diagonal travel | manual | minor | Click to open, or hover intent delay + safe triangle |
| Small text links as the only way to do a key task | manual | minor | Promote to a button-sized control |

## Tensions & trade-offs

- **vs. [Occam's Razor](occams-razor.md) / [Aesthetic-Usability](aesthetic-usability.md):** big targets can look clunky. Expand the *hit area* invisibly and keep the visual compact.
- **vs. [Hick's Law](hicks-law.md):** a screen full of big, equal buttons is quick to hit but slow to choose from. Size by importance and keep one dominant action ([Von Restorff](von-restorff.md)).
- **Intentional friction:** for irreversible actions, *less* Fitts-efficiency is correct. Distance, smaller size, and confirmation protect users.

## Quick test

Hold a phone in one hand and use only your thumb. Can you hit every action on the first try without stretching? On desktop, do you ever slow down to aim?
