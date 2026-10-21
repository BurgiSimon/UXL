---
id: L15
name: "Law of Similarity"
source: https://lawsofux.com/law-of-similarity/
origin: "Max Wertheimer (1923), 'Untersuchungen zur Lehre von der Gestalt II', Psychologische Forschung (the Gestalt grouping laws)."
category: perception
summary: "Make things that behave alike look alike and things that behave differently look different, and enforce it with design tokens."
applies_to: [links, buttons, navigation, icons, form controls, status badges, tables, charts, design tokens, component libraries]
rules:
  - "Same look means same behavior: one style per role (primary, secondary, link, destructive), reused everywhere."
  - "Underline links in running text. Color-only links need ≥ 3:1 against body text plus a hover and focus cue."
  - "Never give non-interactive text a link or button look: no accent color, underline, or pill shape on static content."
  - "One meaning per visual channel. If color means status, it doesn't also mean category."
  - "Take every color, size, radius, and shadow from tokens. A one-off value creates an unintended new group."
---

# Law of Similarity (L15)

## In plain words

Elements that share visual traits (color, shape, size, weight, icon, orientation, motion) are seen as belonging together and as doing the same kind of thing. Users don't learn an interface one control at a time. They learn a visual vocabulary ("blue underlined text goes somewhere", "the filled button does the main thing", "a red pill means trouble") and apply it everywhere.

That turns consistency into a contract. Each time a style is reused for a different behavior, or one behavior gets several styles, the vocabulary breaks and users have to poke at things to find out what they do.

## Why it matters in a UI

- **Affordance comes from resemblance.** Users spot clickable things by their likeness to other clickable things. A link styled like body text goes unseen, and bold accent-colored text gets clicked and does nothing.
- **Look-alikes are scanned and compared as a set.** Matching rows and cards let users skim a list. One row styled differently implies a different status, whether you meant it or not.
- **Style drift multiplies meanings.** Three slightly different blues read either as three meanings or as sloppiness. Both cost trust ([Aesthetic-Usability](aesthetic-usability.md)).
- **Similarity groups across distance.** Every red item on a page forms a set even when scattered. That is powerful for status and harmful when accidental.
- **Color alone excludes people.** Roughly 1 in 12 men has some color vision deficiency, so a group defined only by hue is invisible to many users. Pair it with shape, icon, or text.

## Build it right

### Everywhere
1. **Role-based vocabulary.** Primary button (filled accent), secondary (outline or neutral), tertiary (text-only), link (accent + underline), destructive (danger color). One component per role, used everywhere, and one primary per view region ([Von Restorff](von-restorff.md)).
2. **Links look like links.** Underline them in running text (`text-underline-offset: 0.2em`). In navigation the underline can go, because placement and layout already signal links. Add a visited style on content-heavy sites.
3. **No fake affordances.** Static labels and tags are flat and neutral. Filter chips that toggle look raised or outlined and change on selection. Never give static text the accent color.
4. **Look-alikes behave alike.** If one card in a grid is clickable, all are. Otherwise, style the static ones differently (no hover lift, no chevron). The same icon triggers the same action everywhere: a pencil always edits, a trash can always deletes.
5. **Element follows behavior, style follows role.** Navigation is `<a href>`, actions are `<button>`. A link styled as a button is fine if every such link navigates.
6. **Tokens, not values.** Colors, type sizes, spacing, radii, shadows, and durations are CSS custom properties or theme tokens with semantic names (`--color-action`, `--color-danger`, `--color-text-muted`), so one change updates the whole group.
7. **Differentiate real differences with ≥ 2 cues.** Selected vs. unselected, read vs. unread, disabled vs. enabled: use weight, fill, icon, or border in addition to color. Status is color + icon + text.

### Mobile
- **No hover, so the resting style carries the affordance.** Underlined links, chevrons on navigable rows, filled or outlined buttons. Never rely on a hover color to reveal that something is tappable.
- **Navigable rows are consistent.** Every row that opens something has the same chevron and touch feedback. Static rows have neither.
- **Native-like controls stay consistent.** Use switches for settings that take effect immediately and checkboxes for selections submitted with a form, the same way on every screen. Don't mix platform styles for the same meaning.
- **Tab bar icons share one style:** outline when inactive, filled when active, same size, same label treatment.

### Desktop
- **Hover confirms, it doesn't reveal.** Links are already distinguishable at rest. Hover adds a thicker underline or a background tint.
- **Tables:** one alignment and format per data type (numbers right-aligned with `font-variant-numeric: tabular-nums`, dates in one format). Clickable cells use link style so columns scan as sets.
- **One focus style.** The same `:focus-visible` ring on every interactive element. It must not look like the selected state.
- **Charts:** a series or category keeps the same color in every chart on the page and across the product.

## Code patterns

```css
:root {
  /* Semantic tokens: style by role, so a role always looks the same */
  --color-text: #1b1f24;  --color-text-muted: #59636e;
  --color-action: #0a58ca; --color-action-hover: #084298;
  --color-danger: #b42318; --radius-control: 8px;
}
a:where(:not([class])) {               /* links in running text */
  color: var(--color-action);
  text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em;
}
a:where(:not([class])):hover { text-decoration-thickness: 2px; }
.btn           { min-height: 44px; border-radius: var(--radius-control); font-weight: 600; }
.btn-primary   { background: var(--color-action); color: #fff; }
.btn-secondary { background: transparent; color: var(--color-action); border: 1px solid currentColor; }
.btn-danger    { background: var(--color-danger); color: #fff; }
:focus-visible { outline: 2px solid var(--color-action); outline-offset: 2px; }
```

```jsx
// One component per role. Never restyle a button ad hoc on a single screen.
const variants = {
  primary:   "bg-action text-white hover:bg-action-hover",
  secondary: "border border-action text-action hover:bg-action/5",
  danger:    "bg-danger text-white hover:bg-danger/90",
};
export const Button = ({ variant = "secondary", className = "", ...props }) => (
  <button className={`inline-flex min-h-11 items-center rounded-control px-4 font-semibold ${variants[variant]} ${className}`} {...props} />
);

// Status: color + icon + text, never color alone
<span className="badge badge-danger"><AlertIcon aria-hidden="true" /> Overdue</span>
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Links in running text not underlined and < 3:1 against body text | manual: grep `text-decoration: none` or `no-underline` on prose links; compare link and text colors | major | Underline, or ≥ 3:1 vs. text plus a hover and focus cue |
| Static text styled like a link or button | manual: accent-colored `<span>`/`<p>` with no handler; badges shaped like buttons | major | Neutral color for static text, flat style for labels |
| Clickable `<div>`/`<span>` that looks like a control but lacks keyboard behavior | `lint: div-button` | critical | Real `<button>` or `<a href>` via the shared component |
| Look-alikes that behave differently (some cards clickable, same icon doing different things) | manual: click every member of a repeated set | major | Make behavior uniform, or make the styles differ |
| Several near-identical colors or sizes for one role | `lint: color-sprawl` · `lint: font-size-sprawl` · `audit: color-sprawl` · `audit: font-sprawl` | minor | Consolidate into semantic tokens |
| Several buttons styled as primary in one view | `lint: multiple-primary-cta` · `audit: cta-competition` | major | One primary, demote the rest |
| Meaning carried by color alone (badges, chart series, validation) | manual: grayscale screenshot; do the groups still separate? | major | Add icon, text, pattern, or shape |
| Hard-coded values bypassing tokens (`#3b82f6`, `13px`) | `lint: spacing-off-scale` · manual: grep hex/rgb literals outside token files | minor | Replace with tokens; forbid literals in review |

## Tensions & trade-offs

- **vs. [Von Restorff](von-restorff.md):** similarity builds the pattern, Von Restorff breaks it for emphasis. Break it only for the one thing that matters most. Accidental differences dilute both.
- **vs. [Jakob's Law](jakobs-law.md):** internal consistency isn't enough if the vocabulary itself is unusual. Links that look nothing like links elsewhere on the web still confuse newcomers, however consistent.
- **vs. [Proximity](proximity.md) and [Common Region](common-region.md):** cues must agree. An item styled like group A but placed inside group B's box leaves users unsure which group it belongs to.
- **Marketing vs. product:** landing pages may vary layout and imagery, but buttons, links, and form controls must match the app exactly.

## Quick test

Make the screenshot grayscale and point at everything that looks clickable. Is each one clickable, does it do what its look-alikes do, and did you miss anything that is?
