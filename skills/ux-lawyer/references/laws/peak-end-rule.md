---
id: L23
name: "Peak-End Rule"
source: https://lawsofux.com/peak-end-rule/
origin: "Daniel Kahneman, Barbara Fredrickson, Charles Schreiber & Donald Redelmeier (1993), 'When more pain is preferred to less: Adding a better end', Psychological Science."
category: motivation
summary: "Design the best and the last moment of every journey on purpose, and soften the worst one, because those are what users remember."
applies_to: [success screens, confirmation pages, error states, 404 pages, loading states, micro-interactions, checkout, onboarding, cancellation, emails]
rules:
  - "Every completed flow ends on a success screen: what happened, proof (number, email), and one next action."
  - "Errors get plain language, cause, fix, and a way forward. Never a dead end, never lost input."
  - "Keep delight short and earned: celebrations ≤ 1 s, at real milestones only, honoring prefers-reduced-motion."
  - "Nothing stands between users and their confirmation: no upsell walls, surveys, or sign-up prompts."
  - "404 and 500 pages keep the site nav, offer search and likely links, and speak like a person."
---

# Peak-End Rule (L23)

## In plain words

People don't remember an experience as the sum or average of its moments. They judge it mostly by how it felt at its most intense point and at its end. In the 1993 study, participants who had experienced both a short unpleasant trial and a longer one (the same trial plus a slightly less unpleasant extension) more often chose to repeat the longer one, because it ended less badly. How long it lasted barely registered.

For product design, this means the moments users recall, and retell, are few and predictable: the best one, the worst one, and the last one. Invest disproportionately in those. A smooth flow that ends in a vague toast is remembered as forgettable. A decent flow with one lost-data error is remembered as that error.

## Why it matters in a UI

- **Endings drive what happens next.** The confirmation screen, the receipt email, and what follows "Submit" shape whether users come back, recommend you, or churn.
- **Negative peaks dominate.** One failed payment, lost form, or dead end can define the memory of an otherwise good session, because bad moments weigh more than equally good ones.
- **Waits are latent negative peaks.** An unexplained freeze while paying feels like failure even when the payment succeeds.
- **Small, well-placed delight is cheap and lasting.** A specific, warm success state at the right moment costs little and colors the whole memory.
- **The rule cuts both ways.** Peaks can be engineered to distract, such as a cheerful celebration that hides a fee or an auto-renewal. Design peaks that reflect real value to the user.

## Build it right

### Everywhere
1. **Map peaks and ends.** For each key flow (sign-up, checkout, publish, first success), name the high point, the likely low point (error, wait, rejection), and the final screen. Design those three deliberately, worst one first.
2. **Make the end a destination.** State the outcome specifically ("Order 4821 confirmed, arrives Thu 22 Oct"), confirm what was sent (receipt, email), and offer one clear next step. A toast that vanishes in 3 s is not an ending.
3. **Design the worst moments.** Say what happened in plain words, whether the user's data is safe, and exactly what to do next. Keep their input, offer retry, and give a human contact for money or account problems. No raw stack traces, no bare "Something went wrong".
4. **Make waits feel looked after.** Use skeletons, staged progress text ("Confirming with your bank…"), and optimistic UI where safe. While a request is in flight, show a busy state (`aria-busy`, "Paying…") so nobody double-submits.
5. **Earn the delight.** Celebrate real milestones (first project published, goal reached) with one short micro-interaction under 1 s, such as a checkmark drawing in. Do it once per milestone, not on every click.
6. **Respect exits.** Cancelling, unsubscribing, and deleting an account are endings too. Make them quick, confirm them clearly, and skip the guilt-trip copy (no confirmshaming). A clean exit leaves the door open.
7. **Follow through after the screen.** Confirmation emails, the first notification, and delivery updates belong to the ending. Keep them consistent with the success screen.

### Mobile
- Success states take the full screen or a bottom sheet with a large status and the next action in the thumb zone, clear of `env(safe-area-inset-bottom)`.
- Flaky networks are common: queue the action offline and say it'll send when the connection returns, instead of showing a failure.
- Short haptics can mark success where supported (e.g. `navigator.vibrate(20)` on Android browsers). Treat them as enhancement only.
- Keep the confirmation retrievable (order history, "View receipt") because users switch apps and lose the screen.

### Desktop
- Error pages keep the header and navigation, add search, suggest likely destinations based on the URL, and link to support.
- For long jobs (exports, deploys, uploads), signal the end even if the user switched tabs: update the tab title, send a browser notification if they opted in, or email for very long jobs.
- Toasts are fine for minor endings, but keep them in a consistent position, visible for at least 5 s, and paused on hover or focus.

## Code patterns

```jsx
// A real ending: specific outcome, proof, one next step, focus moved for screen readers
function OrderConfirmed({ order }) {
  const heading = useRef(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <main className="success">
      <svg className="check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
      <h1 ref={heading} tabIndex={-1}>Order {order.number} confirmed</h1>
      <p>Arrives {order.eta}. We sent the receipt to {order.email}.</p>
      <a className="btn-primary" href={`/orders/${order.id}`}>Track your order</a>
    </main>
  );
}
```

```css
/* Short, earned delight that respects motion preferences */
.check path { fill: none; stroke: currentColor; stroke-width: 2; stroke-dasharray: 24; stroke-dashoffset: 24; }
@media (prefers-reduced-motion: no-preference) {
  .check path { animation: draw 400ms ease-out forwards; }
}
@media (prefers-reduced-motion: reduce) { .check path { stroke-dashoffset: 0; } }
@keyframes draw { to { stroke-dashoffset: 0; } }
```

```html
<!-- A 404 that helps instead of dead-ending -->
<main>
  <h1>We can't find that page</h1>
  <p>The link may be old or mistyped. Search, or try one of these:</p>
  <form role="search" action="/search"><label for="q">Search</label> <input id="q" name="q" type="search"></form>
  <ul><li><a href="/">Home</a></li><li><a href="/help">Help center</a></li></ul>
</main>
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Flow ends with a vanishing toast or a redirect home, no confirmation | manual: complete each key flow and screenshot the last screen | major | Dedicated success screen with specifics and a next step |
| Generic or technical error messages | manual: grep "Something went wrong", raw codes, stack traces; force 4xx, 5xx, offline | major | Plain cause, data status, fix, retry, contact |
| Input lost after a server error or session timeout | manual: submit while the API returns 500, then go back | critical | Preserve input in state or a draft, re-render with errors |
| Default framework 404 or 500 page | manual: visit `/this-does-not-exist` at both viewports | minor | Branded page with nav, search, and likely links |
| No feedback during a critical wait (payment, publish) | `lint: async-no-feedback` · `audit: slow-paint` | major | Busy state with stage text, skeletons, optimistic UI |
| `alert()` used for success or error | `lint: native-dialog-interrupt` | minor | In-page message with `role="status"` or `role="alert"` |
| Celebrations too long or ignoring reduced motion | `lint: slow-animation` · `lint: reduced-motion-missing` | minor | Under 1 s, once per milestone, motion-safe |
| Upsell, survey, or guilt-trip copy at the end or in the cancel flow | manual: inspect the last screen and the cancel path for blocking modals and confirmshaming | major | Move offers after confirmation. Neutral, respectful copy |

## Tensions & trade-offs

- **vs. [Doherty Threshold](doherty-threshold.md):** the best wait is no wait. Making a slow step feel cared for is the fallback, not the fix.
- **vs. [Aesthetic-Usability Effect](aesthetic-usability.md):** a charming success screen can hide a broken middle in testing. Fix the worst moment first, then polish the end.
- **vs. [Von Restorff Effect](von-restorff.md):** delight everywhere stops being a peak and becomes noise. Reserve it for the moments that matter.
- **Ethics ([Cognitive Bias](cognitive-bias.md)):** never use a feel-good peak to distract from a hidden fee, an auto-renewal, or a data grab. Managing memory is not a license to manipulate it.

## Quick test

What is the last thing users see in this flow, and what is the worst thing that can happen in it? Would you be happy if those two moments were all they remembered?
