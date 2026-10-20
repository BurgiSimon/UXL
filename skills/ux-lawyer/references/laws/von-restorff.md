---
id: L28
name: "Von Restorff Effect"
source: https://lawsofux.com/von-restorff-effect/
origin: "Hedwig von Restorff (1933), 'Über die Wirkung von Bereichsbildungen im Spurenfeld'. Also called the isolation effect."
category: perception
summary: "Make the one thing users should notice or do next clearly different from its surroundings, and keep everything else consistent."
applies_to: [buttons, calls to action, pricing tables, badges, alerts, navigation, consent banners, data tables, focus states]
rules:
  - "One primary (filled) action per view, or per independent region such as a dialog. Everything else is secondary or tertiary."
  - "Isolate with at least two cues (fill, size, weight, border, icon, space). Never color alone (WCAG 1.4.1)."
  - "Emphasize at most one item per group. When three things shout, none of them is heard."
  - "Emphasized controls keep 4.5:1 text contrast and 3:1 against adjacent colors, in light and dark themes."
  - "Highlight what helps the user, never a decoy: equal weight for Accept and Reject, no fake 'Most popular' badges."
---

# Von Restorff Effect (L28)

## In plain words

When one item clearly differs from the items around it, people notice it first and remember it longer. The effect is relative. A single orange button stands out on a calm page, but on a page full of orange it disappears. Distinctiveness is a budget you spend, not a style you apply everywhere.

In a UI, this is how you answer "what should I do here?" at a glance. Make the most likely next step the one thing that breaks the pattern, and keep everything else consistent so the exception is unmistakable.

## Why it matters in a UI

- **It directs the first glance.** Users scan before they read, and the isolated element gets looked at first. It should be the action or fact that matters most.
- **Emphasis is zero-sum.** Each extra highlight weakens the others. Two primary buttons turn a glance into a decision ([Hick's Law](hicks-law.md)).
- **Color alone is unreliable.** About 1 in 12 men has some red-green color vision deficiency. Glare, cheap screens, grayscale modes, and Windows forced-colors mode (which replaces author colors) all erase a color-only difference.
- **Isolation aids memory.** A distinct price, deadline, or warning is easier to recall later. That same power makes a misleading highlight effective, which is why it's a dark-pattern favorite.
- **Manipulative emphasis has consequences.** European data-protection regulators have criticized consent banners that make "Accept" bright and bury "Reject". Users who feel tricked stop trusting every highlight you show them.

## Build it right

### Everywhere
1. **One primary per view.** The filled, highest-contrast button is the most likely next step. Secondary actions are outline or tonal, tertiary ones are text-style. A dialog or a clearly separate card may have its own primary.
2. **Stack cues.** Change at least two of: fill, size, weight, border, icon, elevation, whitespace, position. Color alone fails WCAG 1.4.1, forced-colors mode, and grayscale.
3. **Use space as an isolator.** Extra whitespace around an element, or placing it alone at the end of a form, isolates it without adding another color.
4. **Check contrast.** Text on the emphasized element ≥ 4.5:1. Its boundary ≥ 3:1 against the background (WCAG 1.4.11). Check both light and dark themes.
5. **Show restraint.** One recommended plan, one "New" badge per menu, one accent color for actions. Remove "New" badges once the user opens the feature, or after a few weeks.
6. **Reserve semantic colors.** Red means error or destructive, green means success. Reusing error red for a promo makes users read it as a problem.
7. **Emphasize honestly.** The highlighted option should be the best choice for most users, not the most profitable one. Equal choices get equal weight (Accept/Reject, Keep/Cancel subscription). No fake scarcity or popularity labels.

### Mobile
- The natural isolate is a single full-width primary button at the end of the flow or in a sticky footer. A second action is outline or text. Never stack two filled full-width buttons.
- Small screens show fewer elements, so subtle shade differences get lost. Isolate with fill plus size (≥ 48px tall, full width) rather than a slightly different tint.
- Outdoor glare washes out color. Rely on shape, fill, and weight to carry the difference.

### Desktop
- Wide layouts show many regions at once. Cards and dialogs may each have a primary, but the page as a whole still needs one dominant action.
- Hover must not make a secondary button look primary. Keep hover a small shift (shade, underline), not a fill swap.
- Keyboard focus is isolation too. While tabbing, the focus ring should be the most distinct thing on screen (≥ 2px, 3:1 contrast).
- In dashboards and tables, color only the anomalies. If most cells are colored, none of them stand out.

## Code patterns

```css
/* Three tiers: primary differs by fill, weight, AND border, not by hue alone */
.btn          { min-height: 44px; padding-inline: 1rem; border: 1px solid var(--border);
                background: transparent; color: var(--text); font-weight: 500; }
.btn-primary  { background: var(--action); border-color: var(--action);
                color: var(--on-action); font-weight: 700; }
.btn-tertiary { border-color: transparent; text-decoration: underline; }

/* Forced colors drop the fill, so keep a heavier outline for the primary */
@media (forced-colors: active) {
  .btn-primary { border: 3px solid ButtonText; }
}
```

```jsx
// Pricing: one recommended plan, isolated by border, elevation, AND a text badge
{plans.map((p) => (
  <article key={p.id}
    className={p.recommended ? "rounded-xl border-2 border-action shadow-lg p-6"
                             : "rounded-xl border border-gray-300 p-6"}>
    {p.recommended && <p className="badge">Best for most teams</p>}
    <h3>{p.name}</h3>
    <a href={`/signup?plan=${p.id}`} className={p.recommended ? "btn btn-primary" : "btn"}>
      Choose {p.name}
    </a>
  </article>
))}
```

```html
<!-- Consent: equal choices get equal weight -->
<div class="consent-actions">
  <button class="btn">Reject all</button>
  <button class="btn">Accept all</button>
  <button class="btn-tertiary">Choose cookies</button>
</div>
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| More than one primary button in a view | `lint: multiple-primary-cta` · `audit: cta-competition` | major | Keep one primary, demote the rest to secondary or tertiary |
| Primary distinguished by color only | manual: grayscale screenshot or forced-colors emulation; diff primary vs. secondary CSS | major | Add fill plus weight, size, or border; forced-colors outline |
| Emphasized element fails contrast | `audit: contrast` | major | ≥ 4.5:1 text, ≥ 3:1 component boundary, both themes |
| Accents everywhere: colored cards, badges, highlights | `lint: color-sprawl` · `audit: color-sprawl` | minor | One accent per group; remove stale "New" badges |
| Emphasis on the wrong action ("Cancel" filled, "Save" outline) | manual: does the highlighted button match the most likely next step? | major | Swap the styles |
| Manipulative isolation: bright "Accept all" vs. grey "Reject", decoy plan, fake "Most popular" | manual: compare button styles in consent, upgrade, and cancellation flows | critical | Equal weight for equal choices; truthful labels |
| Status colors reused as decoration (error red on a promo) | manual: grep danger/error tokens outside error and destructive states | minor | Separate accent tokens from status tokens |
| Focus indicator not distinct | `audit: focus-invisible` · `lint: focus-outline-removed` | major | `:focus-visible` outline ≥ 2px at 3:1 contrast |

## Tensions & trade-offs

- **vs. [Selective Attention](selective-attention.md):** push isolation too far (boxed, bright, animated) and it reads as an ad and gets skipped. Be distinct within the page's own visual language.
- **vs. [Law of Similarity](similarity.md):** consistent component styles build similarity, and isolation is the deliberate exception. Keep the rest uniform so the exception reads.
- **vs. [Jakob's Law](jakobs-law.md):** the standout primary must still look like a button. Make it distinct, not unrecognizable.
- **vs. [Aesthetic-Usability](aesthetic-usability.md):** brand palettes with several saturated accents compete with each other. Pick one action color and hold it.

## Quick test

Blur or grayscale a screenshot. Does exactly one thing stand out, and is it what most users should do next?
