---
id: L22
name: "Parkinson's Law"
source: https://lawsofux.com/parkinsons-law/
origin: "C. Northcote Parkinson (1955), 'Parkinson's Law', an essay in The Economist; expanded into the book Parkinson's Law (1957)."
category: motivation
summary: "Cut every task to its shortest honest path with autofill, defaults, and fewer steps, and say up front how long it takes."
applies_to: [forms, checkout, sign-up, autofill, defaults, payments, surveys, onboarding, time estimates, reorder]
rules:
  - "Set autocomplete tokens on every personal, address, and payment field so the browser can fill them in one tap."
  - "Pre-select the most common safe, reversible option. Never pre-tick consent, add-ons, or a pricier plan."
  - "Offer express checkout (wallets, saved card) above the manual payment form."
  - "State a realistic duration up front ('Takes about 2 minutes', '5 questions') and keep it true."
  - "No fake time pressure: no countdowns that reset on reload, no invented 'only 2 left'."
---

# Parkinson's Law (L22)

## In plain words

Parkinson's observation, made about government offices, was that work expands to fill whatever time is allotted to it. Interfaces see the same dynamic. If a task has no visible end, many optional fields, or open choices with no defaults, users spend the slack deliberating, wandering, and putting it off. If they can't tell how long something will take, they assume it's long and come back "later", which often means never.

The design response is to shrink the task itself and make its size explicit. Remove what isn't needed, fill in what the system already knows, decide what can safely be decided for the user, and state honestly how short the remaining work is. The goal is to beat users' expectation of effort, not to rush them.

## Why it matters in a UI

- **Every field and step is time.** Typing an address on a phone is slow and error-prone. Autofill does it in one tap.
- **Open-ended tasks drift.** A form or survey with no visible end invites postponement, and postponed tasks are often abandoned.
- **Perceived length controls the start.** A small, stated estimate lowers the barrier to begin. If the estimate turns out false, trust drops for every future one.
- **Deciding costs time too.** A choice with no default (shipping method, plan, quantity) stretches the task. A good default turns a decision into a glance ([Hick's Law](hicks-law.md)).
- **Slow responses inflate felt duration.** A task that waits on the system feels longer than its steps suggest ([Doherty Threshold](doherty-threshold.md)).

## Build it right

### Everywhere
1. **Cut fields.** For each field, ask whether you need it to deliver the service *now*. If not, remove it or ask later. Derive what you can: city from postcode, card brand from the number, country from locale.
2. **Make autofill work.** Use standard `autocomplete` tokens (`name`, `email`, `tel`, `street-address`, `postal-code`, `cc-number`, `one-time-code`) on native inputs with sensible `name` attributes. Custom split fields often break autofill.
3. **Sensible defaults.** Pre-select what most users choose (standard shipping, their country, quantity 1) when it's harmless and easy to change. Remember the last choice for returning users.
4. **One-tap shortcuts.** "Buy again", "Use saved address", "Billing same as shipping" checked by default, passkeys or magic links instead of password creation.
5. **Express paths first.** Wallet buttons and saved cards sit above the manual form. Guest checkout is allowed, with account creation offered *after* purchase.
6. **Honest time estimates.** Put "Takes about 2 minutes" or "5 questions" on the entry CTA or the first screen. Base it on measured median completion time and round up, not down.
7. **No fake urgency.** Real deadlines (a sale end, a seat hold) are fine when true and stated precisely. Resetting countdowns, invented stock counts, and made-up "12 people viewing" banners are dark patterns and can breach consumer-protection law.

### Mobile
- Typing is the expensive part. Lean on wallets via the Payment Request API, SMS one-time-code autofill, and the right `inputmode` so users never switch keyboards by hand.
- Short, single-column forms. Use radios or segmented controls for 2–5 options instead of a dropdown. Default the country from locale and let users type to filter.
- A sticky bottom CTA keeps the next step one tap away, with no scrolling back to find it.
- Use the camera where it saves typing: card scanning, QR codes, document capture.

### Desktop
- Keyboard flow: logical Tab order, Enter submits, autofocus the first field on dedicated form pages (not on pages where a focus jump would surprise).
- Use the width for a live order summary beside the form, so users never leave to check totals.
- Prefer inline editing over separate edit pages, and bulk actions over repeating the same task row by row.
- Address type-ahead turns five fields into one search, with manual entry as a fallback.

## Code patterns

```html
<form>
  <p class="estimate">Takes about 2 minutes</p>

  <label for="name">Full name</label>
  <input id="name" name="name" autocomplete="name" required>

  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required>

  <fieldset>
    <legend>Delivery</legend>
    <label><input type="radio" name="ship" value="standard" checked> Standard, free (3–5 days)</label>
    <label><input type="radio" name="ship" value="express"> Express, $9 (next day)</label>
  </fieldset>

  <label><input type="checkbox" name="billing_same" checked> Billing address same as delivery</label>
  <button type="submit">Pay $42.00</button>
</form>
```

```js
// Show express checkout first when the browser can pay with a stored method
async function initExpressCheckout(methods, details) {
  if (!("PaymentRequest" in window)) return;
  const req = new PaymentRequest(methods, details);
  if (await req.canMakePayment()) document.querySelector("#express").hidden = false;
}
```

Wallet support varies by browser and device, so the manual form stays as the always-available fallback directly below the express block.

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Long form with fields not needed right now | `lint: form-long` · `audit: form-load` | major | Remove, defer until later, or derive from other data |
| Missing or wrong `autocomplete` tokens | `lint: autocomplete-missing` | major | Standard tokens on native inputs so autofill fills everything |
| Generic text inputs for email, phone, and numbers | `lint: input-type-generic` | minor | `type="email"`, `type="tel"`, matching `inputmode` |
| No default on common choices (delivery, country, quantity) | manual: radio groups and selects with nothing pre-selected | minor | Default to the most common harmless option, remember last choice |
| Account creation forced before checkout | manual: walk checkout as a brand-new visitor | major | Guest checkout, offer an account after purchase |
| Returning users re-enter payment and address | manual: place a second order with the same account | minor | Saved methods, wallet buttons, "Buy again" |
| Task length unknown (no estimate, no step count) | manual: surveys and multi-step flows without "N questions" or "~X min" | minor | Honest estimate at entry, step counter ([Goal-Gradient](goal-gradient.md)) |
| Fake countdowns or invented scarcity | manual: grep `countdown`, timers that reset on reload, hard-coded "only N left" | critical | Remove. Show only real, precise deadlines and real stock |

## Tensions & trade-offs

- **vs. [Postel's Law](postels-law.md):** fewer fields must not mean stricter fields. Short *and* forgiving.
- **Defaults and ethics ([Cognitive Bias](cognitive-bias.md)):** defaults work because most people keep them. Default only to what serves the user; never to marketing consent, insurance add-ons, or a more expensive tier.
- **vs. [Chunking](chunking.md) / [Goal-Gradient](goal-gradient.md):** splitting a form into steps can make it feel shorter, but each step adds a load and a click. Split only where the steps are meaningful.
- **Speed vs. care:** for consequential decisions (contracts, medical, money transfers), don't compress reflection time. Keep a clear review step before the final commit.

## Quick test

Time yourself completing the task as a returning user on a phone. Which seconds went to typing or deciding something the system already knew or could have guessed?
