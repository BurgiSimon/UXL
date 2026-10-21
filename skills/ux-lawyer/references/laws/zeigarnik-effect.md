---
id: L30
name: "Zeigarnik Effect"
source: https://lawsofux.com/zeigarnik-effect/
origin: "Bluma Zeigarnik (1927), 'Über das Behalten von erledigten und unerledigten Handlungen' (On the retention of completed and uncompleted actions), Psychologische Forschung."
category: motivation
summary: "Keep unfinished work saved, visible, and one tap from resuming, without turning incompleteness into a nag."
applies_to: [drafts, autosave, multi-step forms, onboarding checklists, profile completion, carts, resume prompts, course progress, notifications, dashboards]
rules:
  - "Autosave drafts about 1 s after the last edit and show a visible 'Saved' status with time."
  - "On return, offer 'Continue where you left off' that opens the exact step, values, and scroll position."
  - "Completion meters list each missing item with a direct link, show counts, and can be dismissed."
  - "Never invent incompleteness: no meters that can't reach 100%, no fake unread badges, no guilt copy."
  - "Always offer closure: discard a draft, leave a flow, or hide a checklist in one action, with undo."
---

# Zeigarnik Effect (L30)

## In plain words

An interrupted task leaves a small mental itch. Working in Kurt Lewin's lab, Zeigarnik found that people recalled tasks they had been stopped partway through better than tasks they had finished. Later replications of the memory claim are mixed, but the closely related urge to go back and finish an interrupted task (studied by Maria Ovsiankina in 1928) holds up well enough to design around.

Products are full of unfinished work: half-filled forms, drafts, abandoned carts, partial setup. The design job is to respect that pull. Keep the user's work safe, show clearly what's left, and make picking it back up effortless. Don't manufacture incompleteness to drag people back.

## Why it matters in a UI

- **Interruption is the norm, especially on mobile.** Calls, notifications, app switches, and closed tabs cut tasks off midway. If the work is lost, the itch turns into frustration and often abandonment.
- **A visible open loop is a reason to return.** "2 steps left" or a nearly full ring pulls people back far better than a generic "We miss you!" message.
- **Specific beats vague.** "Add a profile photo" can be closed in one action. "Profile 70% complete" with no list is just a nag.
- **Lost work is a lasting negative memory** ([Peak-End Rule](peak-end-rule.md)). Users who lose a long form once will hesitate to start it again.
- **Manufactured loops erode trust.** Meters that never reach 100% or badges that invent unfinished tasks exploit the itch and teach users to ignore every indicator you show.

## Build it right

### Everywhere
1. **Autosave drafts.** Debounce around 1 s after the last edit. Save to the server for signed-in users and to `localStorage` or IndexedDB otherwise. Show "Saving…" / "Saved 10:42" in a `role="status"` region.
2. **Resume exactly.** Store the step, field values, and scroll position. On return, show "Continue where you left off" with specifics ("Your application, step 3 of 5"), next to a "Start over" option.
3. **Make what's left concrete.** Completion meters list each missing item as a link to where it's done, with a count ("2 of 5 done"), not only a percentage.
4. **Persist carts and selections** across sessions and devices for signed-in users, and locally for guests.
5. **Close loops visibly.** When something is finished, mark it done and remove it from "In progress". Meters can be hidden and drafts discarded in one action, with undo.
6. **Remind sparingly and specifically.** If you send a reminder about unfinished work, send one or two at most, name the task, deep-link to the exact step, and honor opt-outs.
7. **Ethics.** No artificial open loops: no nagging "incomplete profile" for optional data you want for marketing, no unread counts that aren't real, no guilt copy about broken streaks.

### Mobile
- Assume the tab or app will be killed. Save on `visibilitychange` when the page becomes hidden and on `pagehide`. `beforeunload` is unreliable on mobile.
- Restore form state when the OS reloads a backgrounded tab, and keep pages eligible for the back/forward cache (no `unload` handlers).
- Put a compact "Continue" card at the top of the home screen. Notification deep links land on the exact unfinished step.
- Don't persist sensitive values (card numbers, passwords, one-time codes) in drafts. Clear local drafts on sign-out.

### Desktop
- Use a `beforeunload` warning only when changes are genuinely unsaved. If autosave is working, don't nag.
- Dashboards get an "In progress" or "Recent" section near the top listing open drafts with last-edited time.
- Drafts started on desktop should be resumable on a phone and vice versa, which means saving them on the server.

## Code patterns

```js
// Autosave a draft: debounced, plus a flush when the page is hidden or closed
let timer;
function saveDraft() {
  try { localStorage.setItem("draft:post", JSON.stringify(getFormState())); } catch {}
  status.textContent = `Saved ${new Date().toLocaleTimeString([], { timeStyle: "short" })}`;
}
form.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(saveDraft, 1000); });
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") { clearTimeout(timer); saveDraft(); }
});
```

```jsx
// Resume prompt with a clean way out
{draft && (
  <aside className="resume" aria-label="Unfinished application">
    <p>You have an unfinished application: step {draft.step} of 5, saved {draft.savedAgo}.</p>
    <a className="btn-primary" href={`/apply?step=${draft.step}`}>Continue</a>
    <button type="button" onClick={discardDraft}>Discard</button>
  </aside>
)}
```

```jsx
// Completion meter that names what's missing and can be dismissed
<section aria-labelledby="profile-progress">
  <h2 id="profile-progress">Finish your profile · {done} of {items.length}</h2>
  <ul>{items.filter((i) => !i.done).map((i) => <li key={i.id}><a href={i.href}>{i.label}</a></li>)}</ul>
  <button type="button" onClick={hideMeter}>Not now</button>
</section>
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Long form or editor loses input on reload, back, or app switch | manual: fill halfway, reload or background the app, return | critical | Debounced autosave and restore, flush on `visibilitychange` |
| Multi-step flow restarts from step 1 after leaving | manual: leave at step 3, return via home and via an email link | major | Persist step and values, offer "Continue where you left off" |
| Completion meter shows a percentage without listing what's missing | manual: profile or setup widgets with only a bar or ring | minor | List missing items with direct links and counts |
| Meter or badge that can't be dismissed or never reaches 100% | manual: complete every item and try to hide the widget | major | Allow dismissal, reach 100%, then retire the widget |
| Fabricated or repeated nags about unfinished tasks | manual: review reminder cadence, badge sources, and copy for guilt or fake counts | critical | One or two specific reminders with opt-out, real counts only |
| Autosave with no visible status | `lint: async-no-feedback` · manual: no "Saving / Saved" text near the editor | minor | `role="status"` indicator with last-saved time |
| `beforeunload` warning even though the content is saved | manual: grep `beforeunload`, close a tab after autosave | minor | Warn only when changes are genuinely unsaved |
| Cart or draft cleared when the session ends | manual: add to cart, close the browser, come back | major | Persist server-side for accounts, locally for guests |

## Tensions & trade-offs

- **vs. [Goal-Gradient Effect](goal-gradient.md):** incompleteness motivates most when the remaining gap is small and real. A meter stuck at 20% on optional data motivates nobody.
- **vs. [Cognitive Load](cognitive-load.md):** too many open loops (badges, drafts, checklists) become clutter and low-grade anxiety. Show the top 1–3 and let users clear the rest.
- **vs. [Peak-End Rule](peak-end-rule.md):** closing a loop is an ending. Mark it clearly so the relief registers.
- **Privacy:** autosaved drafts on a shared device can expose sensitive content. Store sensitive drafts server-side behind sign-in, never persist payment or credential fields, and clear local drafts on sign-out.

## Quick test

Close the tab halfway through the task and come back tomorrow on another device. Is your work still there, and does the screen tell you exactly what's left without nagging you?
