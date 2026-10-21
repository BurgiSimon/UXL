---
id: L08
name: "Flow"
source: https://lawsofux.com/flow/
origin: "Mihaly Csikszentmihalyi (1975), 'Beyond Boredom and Anxiety'; popularized in 'Flow: The Psychology of Optimal Experience' (1990)."
category: interaction
summary: "Keep people absorbed in the task: strip out interruptions, keep feedback instant, and match the challenge to their skill."
applies_to: [onboarding, forms, editors, checkout, modals, notifications, keyboard shortcuts, validation, autosave, mobile inputs]
rules:
  - "Nothing interrupts before value: no modal on load, no native alert(), no forced sign-up before people try the product."
  - "Validate on blur, then live once a field is invalid. Never on the first keystroke, and never wipe input on error."
  - "Autosave work, show a quiet 'Saved' status, and make leaving and coming back lossless."
  - "Desktop: offer keyboard shortcuts (Esc, Enter, /, ⌘K) and show them in tooltips and menus."
  - "Mobile: input, select, and textarea font-size ≥ 16px so iOS doesn't zoom on focus. Keep pinch-zoom enabled."
---

# Flow (L08)

## In plain words

Flow is the state of full absorption in an activity: attention locked on the task, a sense of control, and time passing unnoticed. Csikszentmihalyi found it tends to appear when the challenge roughly matches the person's skill, the goal is clear, and feedback is immediate. Too hard and people get anxious; too easy and they get bored.

An interface can't force flow, but it can easily destroy it. Every pop-up, unexpected reload, lost draft, nagging error, or wait pulls the user out of the work and makes them think about the tool instead. Design for continuity: let people start fast, keep going without detours, and pick up exactly where they left off.

## Why it matters in a UI

- **Interruptions are expensive.** After a pop-up or context switch, people need time to rebuild where they were. Newsletter modals, cookie walls, chat widgets, and permission prompts on load all land at the worst moment: first contact.
- **Clear next steps keep momentum.** Users who know what to do next and see the effect of each action keep going. Ambiguity makes them stop and study the interface.
- **Mismatch kills engagement both ways.** Newcomers dropped into a dense pro UI give up; experts forced through hand-holding wizards get bored and irritated.
- **Lost work ends flow for good.** A form that wipes on error, or an editor that drops unsaved changes, teaches users to work cautiously, and cautious users don't flow.
- **Small mechanical frictions add up.** iOS zooming into a field, a layout jump, a menu that closes when the pointer drifts: each one pulls attention to the tool.

## Build it right

### Everywhere
1. **Value before commitment.** Let people try the core task (configure, explore, edit a sample) before asking for an account. Ask to sign up at the moment it's needed: to save, share, or check out.
2. **Don't interrupt on load.** No modals, newsletter pop-ups, or permission requests (notifications, location, camera) on page load. Ask in context, right after an action that makes the request make sense.
3. **Replace native dialogs.** `alert()`, `confirm()`, and `prompt()` freeze the page, can't be styled, and offer no undo. Use inline messages, toasts with undo, or an accessible `<dialog>`.
4. **Validate politely.** Check a field on blur, or after ~500ms of no typing for remote checks like username availability. Once a field is invalid, re-check on every input so the error clears the moment it's fixed. Keep values on error and keep submit enabled.
5. **Autosave and resume.** Save drafts continuously (debounced) to the server or local storage, show "Saved" quietly, and use `beforeunload` only when unsaved changes truly exist. Restore scroll, filters, and form state on back navigation.
6. **Balance challenge and skill.** Newcomers get templates, sensible defaults, and empty states that suggest a first step. Experts get shortcuts, bulk actions, and dense views. Reveal advanced features as people grow into them.
7. **Keep feedback instant.** Every action shows its result right away ([Doherty Threshold](doherty-threshold.md)), and the next step is always visible.

### Mobile
- **Prevent zoom-on-focus.** iOS Safari zooms in when a focused input's font-size is under 16px, and the page stays zoomed. Set `font-size: 16px` or more on `input`, `select`, and `textarea`. Don't "fix" it with `maximum-scale=1` or `user-scalable=no`; that blocks zoom for people who need it.
- **Right keyboard first time.** Use `type="email"`, `inputmode="numeric"`, `autocomplete="one-time-code"`, and `enterkeyhint="next"` so nobody has to switch keyboards mid-task.
- Make sure sticky headers, footers, and cookie bars never cover the focused field when the on-screen keyboard is open. Test on a real device.
- No autoplaying carousels or media that move content under the thumb while people read.
- Replace full-screen interstitials ("Get the app", newsletter) with a small, dismissible banner that doesn't block content.

### Desktop
- **Keyboard shortcuts for power users.** Esc closes, Enter submits, `/` focuses search, ⌘K / Ctrl+K opens a command palette, `?` lists shortcuts. Show them in tooltips and menus so people learn them. Don't override browser or screen-reader keys, and ignore single-key shortcuts while focus is in a text field.
- **Manage focus.** After closing a dialog, return focus to its trigger. After adding an item, focus the new item or the next input. Keep `:focus-visible` styles obvious.
- Prefer inline editing and list-plus-detail layouts, so people move through items without leaving context.
- Batch notifications and offer a way to pause them in tools built for deep work.

## Code patterns

```css
/* iOS zooms into inputs under 16px. Fix the font size; never disable zoom in the viewport meta */
input, select, textarea { font-size: max(16px, 1rem); }
```

```jsx
// Inline validation: quiet until blur, then live until fixed. Value is never cleared
function EmailField() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const error = touched && !/^\S+@\S+\.\S+$/.test(value) ? "Enter an email like name@example.com" : "";
  return (<>
    <label htmlFor="email">Email</label>
    <input id="email" type="email" autoComplete="email" value={value}
      onChange={e => setValue(e.target.value)} onBlur={() => setTouched(true)}
      aria-invalid={!!error} aria-describedby="email-err" />
    <p id="email-err" aria-live="polite">{error}</p>
  </>);
}
```

```jsx
// Autosave: debounced, quiet status, no Save button to remember
useEffect(() => {
  const t = setTimeout(async () => {
    setStatus("Saving…");
    try { await saveDraft(doc); setStatus("Saved"); }
    catch { setStatus("Not saved yet. Retrying…"); retryLater(doc); }
  }, 800);
  return () => clearTimeout(t);
}, [doc]);
// <span role="status" className="text-sm text-muted">{status}</span>
```

Tailwind: use `text-base` (16px) on form controls. Avoid `text-sm` or `text-xs` on inputs that render on mobile.

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Modal, pop-up, or permission prompt on page load | manual: open in a private window; grep for `showModal()`, `Notification.requestPermission`, or `getCurrentPosition` in mount effects | major | Trigger after a relevant user action, or drop it |
| Native `alert()`, `confirm()`, or `prompt()` | `lint: native-dialog-interrupt` | major | Inline message, toast with undo, or `<dialog>` |
| Inputs under 16px zoom the page on iOS focus, or zoom disabled to hide it | `lint: input-font-small` · `audit: input-zoom` · `lint: zoom-disabled` | major / critical (zoom disabled) | `font-size: 16px` on form controls; remove `maximum-scale` and `user-scalable=no` |
| Forced sign-up before any value | manual: walk first run; is account creation the first screen? | major | Let people try first; ask for an account to save or share |
| Errors on the first keystroke, or values wiped after a failed submit | manual: type slowly into each field; submit with an error and check values persist | major | Validate on blur, re-validate on input once invalid, preserve values |
| Autoplaying carousels or media | `lint: autoplay-carousel` · `audit: autoplay-media` | minor | Static content or user-started playback with pause controls |
| Main task impossible or awkward without a mouse | `audit: focus-invisible` · `lint: focus-outline-removed` · manual: do the core task with the keyboard only | major | Visible `:focus-visible`, logical focus order, shortcuts for frequent actions |
| Long-form editor or form with no autosave | manual: type, reload, see what survived | major | Debounced autosave and restore on return |

## Tensions & trade-offs

- **vs. [Hick's Law](hicks-law.md) / [Occam's Razor](occams-razor.md):** shortcuts and expert features add surface. Keep them discoverable but out of the way: a command palette and a `?` sheet, not more toolbar buttons.
- **Engagement vs. exploitation:** don't engineer "flow" to trap people (autoplay next episode, endless feeds, streak guilt). Reminders built on the [Zeigarnik Effect](zeigarnik-effect.md) or [Goal-Gradient](goal-gradient.md) should help users finish, not keep them hooked.
- **Intentional friction:** irreversible or costly actions deserve a pause. Breaking flow there is correct ([Fitts's Law](fitts-law.md)).
- **vs. strict validation:** accept flexible formats (spaces in card numbers, dashes in phone numbers) so validation doesn't stop people ([Postel's Law](postels-law.md)).

## Quick test

Do the core task end to end. Did anything make you stop and deal with the interface (a pop-up, a lost value, a zoom, a wait) instead of the work itself?
