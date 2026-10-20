---
id: L09
name: "Goal-Gradient Effect"
source: https://lawsofux.com/goal-gradient-effect/
origin: "Clark L. Hull (1932), 'The goal-gradient hypothesis and maze learning', Psychological Review. Consumer evidence: Kivetz, Urminsky & Zheng (2006)."
category: motivation
summary: "Show people how close they are to done, and keep the remaining distance short and real, so effort speeds up toward the end."
applies_to: [multi-step forms, checkout, onboarding, steppers, progress bars, checklists, loyalty programs, uploads, profile setup]
rules:
  - "Every flow longer than 2 steps shows position and total ('Step 2 of 4') or a labeled stepper."
  - "Keep flows to 3–5 steps, and never let the count shown at the start grow mid-flow."
  - "Give credit for real work already done (account created = item 1 checked). Never invent progress."
  - "Onboarding checklists have 3–6 items, and the first can be completed in under a minute."
  - "On mobile, use a compact stepper ('2/4' plus a thin bar) instead of a full row of labeled steps."
---

# Goal-Gradient Effect (L09)

## In plain words

Motivation isn't flat across a task. The closer people believe they are to finishing, the harder and faster they push. Hull saw it in rats running faster as they neared the food at the end of a maze. Kivetz and colleagues saw it in coffee-shop customers, who bought more often as their loyalty card filled up.

The key word is *believe*: behavior follows perceived distance to the goal. An interface that makes progress visible and shows that the end is near turns the last stretch into the fastest one. One that hides progress makes every step feel like the first.

## Why it matters in a UI

- **Invisible progress feels endless.** A multi-page form with no indicator gives users no reason to think the next page is the last, so they quit at the first moment of doubt.
- **The start is the steepest part.** Distance to the goal is greatest at the beginning. Showing genuine progress that already exists shortens it. In a car-wash study by Nunes and Drèze (2006), a 10-stamp card with 2 stamps already filled was completed more often than an 8-stamp card starting empty, even though both required 8 purchases.
- **Friction near the end hits hardest.** Users are moving fastest and most committed near the finish, so a surprise step, upsell, or account wall at 90% does the most damage.
- **Lying about progress backfires.** A bar that leaps to 90% and stalls, or a step count that grows, teaches users to distrust every indicator you show afterward.

## Build it right

### Everywhere
1. **Show position and total.** Multi-step flows display "Step 2 of 4" with step names, or a stepper. Mark the current step with `aria-current="step"`.
2. **Keep the count short and fixed.** Aim for 3–5 steps. Know all of them up front. If a branch adds a step, show it the moment the branch is chosen, not afterward.
3. **Easy steps first, nothing new at the end.** Quick wins early build momentum. Never insert a surprise step (upsell, sign-up, survey) just before completion.
4. **Honest head start.** Count genuine prior work: signed up = item 1 done, imported contacts = item 2 done. Don't tick anything that didn't actually happen.
5. **Onboarding checklists.** 3–6 concrete tasks, each linking straight to where it's done, auto-checked on completion, with a visible "3 of 5 done". Let users dismiss the list.
6. **Frame by whichever is smaller.** Early on, emphasize what's done; near the end, emphasize what's left ("2 fields left", "$8 away from free shipping"). Koo and Fishbach (2012) found motivation is higher when attention is on the smaller of the two.
7. **Determinate progress for long operations.** Uploads, imports, and exports show a percentage or "12 of 40 files", with time remaining when it's reliable. Spinners are only for short waits ([Doherty Threshold](doherty-threshold.md)).

### Mobile
- Use a compact stepper: "2/4" text plus a thin (2–4px) bar at the top. A full row of labeled steps doesn't fit at 390px and wraps badly.
- Make the step name the screen heading ("Delivery · 2 of 4") so context survives scrolling.
- One step per screen with a sticky "Continue" in the thumb zone. Back must keep everything already entered.
- Respect `prefers-reduced-motion` on progress fills and completion animations.

### Desktop
- A horizontal labeled stepper above the form, or a vertical stepper in a side rail for long wizards. Completed steps stay clickable for review.
- Keep the onboarding checklist in a sidebar or panel that collapses to a "3/5" chip after first view.
- Show progress as content, not only as a count: a summary or preview that fills in as each step is completed.

## Code patterns

```html
<nav aria-label="Checkout progress">
  <ol class="stepper">
    <li class="done"><a href="/checkout/cart">Cart</a></li>
    <li aria-current="step">Delivery</li>
    <li>Payment</li>
    <li>Review</li>
  </ol>
</nav>

<!-- Compact version for small screens -->
<div class="stepper-compact">
  <p id="step-label">Delivery · Step 2 of 4</p>
  <div class="bar" role="progressbar" aria-labelledby="step-label"
       aria-valuemin="0" aria-valuemax="4" aria-valuenow="2"><span style="--pct: 50%"></span></div>
</div>
```

```css
.stepper-compact { display: none; }
.bar { block-size: 4px; background: var(--track); border-radius: 2px; }
.bar > span { display: block; block-size: 100%; inline-size: var(--pct); background: var(--accent); }
@media (max-width: 640px) {
  .stepper { display: none; }
  .stepper-compact { display: block; }
}
@media (prefers-reduced-motion: no-preference) {
  .bar > span { transition: inline-size 300ms ease-out; }
}
```

```jsx
// Checklist with an honest head start: item 1 is genuinely done at sign-up
const tasks = [
  { id: "account", label: "Create your account", done: true },
  { id: "invite",  label: "Invite a teammate",   href: "/invite",  done: user.hasInvited },
  { id: "project", label: "Create a project",    href: "/new",     done: user.projectCount > 0 },
];
const done = tasks.filter((t) => t.done).length;
// <h2>Get started · {done} of {tasks.length} done</h2>
// <progress value={done} max={tasks.length} />
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Multi-step flow with no position indicator | manual: wizard or checkout pages without "Step N of M" or a stepper | major | Stepper or "Step N of M" with step names |
| Step count grows mid-flow, or a surprise final step (upsell, account wall) | manual: walk the flow and compare the promised count with the real one | major | Declare all steps up front, move offers after completion |
| Fake progress (items pre-checked but not done, bar jumps then stalls) | manual: grep hard-coded `value=` or `%` widths; compare progress to real state | critical | Drive progress from real state; head start only for real work |
| Long single-page form with no sense of remaining length | `lint: form-long` · `audit: form-load` | minor | Group into named sections or 3–5 steps with a counter |
| Spinner only for long operations | `lint: async-no-feedback` · manual: uploads or imports over a few seconds | minor | Determinate progress, item counts, time remaining |
| Full labeled stepper overflowing on mobile | `audit: horizontal-overflow` | minor | Compact "2/4" plus a thin bar below 640px |
| Progress animations ignore reduced motion | `lint: reduced-motion-missing` | minor | Disable fills and celebrations under `prefers-reduced-motion` |
| Going back loses entered data | manual: fill step 2, go back to 1, return to 2 | major | Persist step state ([Zeigarnik Effect](zeigarnik-effect.md)) |

## Tensions & trade-offs

- **vs. [Parkinson's Law](parkinsons-law.md) / [Chunking](chunking.md):** steps make progress visible but add loads and clicks. Don't split a 4-field form into 4 steps just to have a stepper.
- **Ethics ([Cognitive Bias](cognitive-bias.md)):** an endowed head start is easy to fake. Count only real work, and never use "Almost there!" to push a purchase the user hasn't chosen.
- **vs. [Zeigarnik Effect](zeigarnik-effect.md):** visible incompleteness motivates, but a permanent 60% meter on a profile the user doesn't care about is a nag. Make it dismissible.
- **vs. [Peak-End Rule](peak-end-rule.md):** users accelerate into the end, so the final step must be the smoothest one, followed by an unmistakable "done".

## Quick test

At any point in the flow, can the user say how many steps are left, and is that number true?
