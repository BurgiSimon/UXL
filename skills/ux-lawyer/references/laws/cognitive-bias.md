---
id: L04
name: "Cognitive Bias"
source: https://lawsofux.com/cognitive-bias/
origin: "Amos Tversky & Daniel Kahneman (1974), 'Judgment under Uncertainty: Heuristics and Biases', Science. Loss aversion: Kahneman & Tversky (1979), 'Prospect Theory'. 'Dark patterns' coined by Harry Brignull (2010)."
category: cognition
summary: "Users decide with mental shortcuts; set defaults, framing, and anchors so they choose well, and never use them to trick."
applies_to: [pricing, plans, defaults, checkout, consent, cancellation, upsells, reviews, permission prompts, design reviews]
rules:
  - "Pre-select only what's best for most users. Paid add-ons, donations, and marketing or data consent start unchecked."
  - "Show the full price, including mandatory fees and taxes, from the first price the user sees."
  - "Make leaving as easy as joining: cancel online, in no more steps than it took to sign up."
  - "Back every urgency, scarcity, or social-proof claim with real, current data, or remove it."
  - "Decide what result would prove your design wrong before you test it."
---

# Cognitive Bias (L04)

## In plain words

People don't evaluate every option from scratch. They take mental shortcuts: they lean on the first number they see, keep whatever is pre-selected, weigh a loss more heavily than an equal gain, and follow what others did. These shortcuts are usually efficient, but they skew decisions in predictable directions.

Every interface triggers them whether you plan for it or not. Something is always the default, something is shown first, every option is worded somehow. Your job is to make those unavoidable choices serve the user's goal. Using the same knowledge against users is a dark pattern, and it is off-limits. Designers are biased too, so apply the same scepticism to your own decisions.

## Why it matters in a UI

- **Anchoring:** the first number shown becomes the reference. Plan order, a "most popular" badge, or a struck-through "was" price shapes how every later price feels.
- **Defaults (status quo bias):** most people keep what is pre-selected. Defaults are the strongest lever on a form, for good (secure settings, correct units) or bad (pre-ticked upsells).
- **Framing and loss aversion:** "Keep your 3 projects" and "Delete 3 projects" describe the same choice but feel different. Losses loom larger than gains, so loss framing pushes harder; reserve it for real consequences.
- **Social proof:** ratings, review counts, and customer logos reduce uncertainty when they are real and relevant to the user's situation.
- **Confirmation bias, yours:** teams notice evidence that their design works and discount what doesn't. A test designed to pass will pass.

## Build it right

### Everywhere
1. **Choose defaults deliberately.** For every pre-selected control ask: "Would most users pick this if they thought about it?" Default to free and privacy-protective options.
2. **Anchor honestly.** List plans in a stable order with a genuine recommendation ("Best for teams of 5–50"). No decoy tier that exists only to make another look cheap. Show a "was" price only if it was really charged.
3. **Frame for clarity.** Describe both options in neutral, concrete terms: "Delete project (can't be undone)" / "Keep project". Use loss framing only for real losses, such as unsaved work.
4. **Use real social proof.** Actual review counts, averages with distribution, and recent dates. Testimonials from real, identifiable customers.
5. **De-bias your own process.** Write success criteria before testing, test with real users rather than colleagues, look at drop-offs and complaints alongside conversions, and have someone argue against the design.
6. **Dark-pattern blacklist: never ship these.** Check every flow that touches money, consent, or cancellation.
   - **Fake scarcity and countdowns:** timers that reset on reload, "Only 2 left!" not tied to inventory, "Offer ends soon" with no real end.
   - **Confirmshaming:** decline options that guilt the user ("No thanks, I don't like saving money").
   - **Pre-checked upsells and consent:** insurance, donations, newsletters, or data sharing ticked by default. Under GDPR, pre-ticked boxes are not valid consent.
   - **Roach-motel cancellation:** one-click sign-up online, but cancelling needs a phone call, a chat, or a maze of retention screens.
   - **Hidden costs:** fees, taxes, or shipping that first appear at the last step.
   - **Disguised ads:** ads styled as content, fake download buttons, or fake system dialogs; sponsored results without a clear label.
   - Also: trick questions (double-negative opt-outs), items slipped into the cart, and prompts that won't take no. EU regulators (including under the Digital Services Act) and the US FTC treat many of these as unlawful.

### Mobile
- Bottom-sheet upsells mid-checkout are easy to accept by accident. Make "No thanks" an equal-size, clearly labeled button, not a faint link.
- Native permission prompts are often one-shot. Ask in context, after explaining the benefit, with an honest pre-prompt users can decline. Never imitate a system dialog.
- Sticky "Buy" bars show the total price, not the base price.

### Desktop
- Pricing tables: align features in rows so users compare like with like. Highlight the plan that fits most users, and keep every price visible without hover.
- Exit-intent modals: at most once per session, with Esc, ×, and backdrop click to close, and no shaming copy.
- Cookie banners: "Reject all" is as prominent and one-click as "Accept all", as EU data-protection regulators expect.

## Code patterns

```html
<!-- Honest defaults: add-on and marketing unchecked, total includes fees, neutral decline -->
<label><input type="checkbox" name="insurance"> Add travel insurance (+€12.00)</label>
<label><input type="checkbox" name="marketing"> Email me product news (about twice a month)</label>

<dl class="price">
  <dt>Ticket</dt><dd>€120.00</dd>
  <dt>Service fee</dt><dd>€16.00</dd>
  <dt>Total incl. VAT</dt><dd><strong>€136.00</strong></dd>
</dl>
<button type="submit" class="btn-primary">Pay €136.00</button>
<a href="/cart" class="btn-secondary">Back to cart</a>
```

```jsx
// Scarcity only when true, computed from live inventory, never hardcoded or randomized
{stock > 0 && stock <= 5 && <p className="stock-low">Only {stock} left in stock</p>}

// Decline is a real, equal-weight choice with neutral wording
<div className="flex gap-3">
  <button onClick={accept}>Add Pro for €4/month</button>
  <button onClick={decline}>No thanks</button>
</div>
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Pre-checked paid add-on, donation, or marketing/data consent | `lint: dark-pattern-precheck` · manual: grep `checked`, `defaultChecked`, `checked: true` near price or consent copy | critical | Unchecked by default; explicit opt-in |
| Countdown or scarcity not backed by real data | `lint: dark-pattern-urgency` · manual: grep `countdown`, `setInterval`, `left in stock`, `Math.random`; reload and watch for reset | critical | Remove, or bind to a real deadline or inventory |
| Confirmshaming decline copy | `lint: dark-pattern-confirmshaming` · manual: read every dismiss and "no" label for guilt or sarcasm | major | Neutral wording: "No thanks", "Not now" |
| Cancellation harder than sign-up | manual: count steps and channels to cancel vs. subscribe; look for "call us to cancel" | critical | Online cancel, ≤ sign-up steps, at most one retention offer |
| Fees, taxes, or shipping first shown at the final step | manual: compare the first price displayed with the checkout total | critical | All-in price from the start; itemize early |
| Decline or reject option visually suppressed | `audit: contrast` (faint decline links) · manual: compare size and weight of Accept vs. Reject | major | Equal-weight choices for consent and upsells |
| Ads or sponsored items not clearly labeled | manual: screenshots; promoted items with no "Ad"/"Sponsored", fake download buttons | major | Visible label and distinct styling |
| Design validated only by the people who built it | manual: no test with outside users; success metric chosen after seeing results | major | Pre-set criteria; test with real users |

## Tensions & trade-offs

- **vs. [Von Restorff](von-restorff.md):** highlighting the plan that fits most users is legitimate. Highlighting the priciest plan as "recommended" when it isn't is manipulation.
- **vs. [Tesler's Law](teslers-law.md):** smart defaults absorb complexity, but every default is a nudge. Default to what serves the user and keep it visible and easy to change.
- **vs. [Goal-Gradient](goal-gradient.md), [Zeigarnik](zeigarnik-effect.md), [Peak-End](peak-end-rule.md):** the same ethical line applies. Help users finish what *they* want; never invent pressure to finish what *you* want.
- **Conversion vs. trust:** dark patterns can lift short-term conversion while raising refunds, chargebacks, churn, and legal risk. Track those alongside conversion.

## Quick test

Would this screen still work if the user fully understood how it was designed? If explaining the design would make them feel tricked, change it.
