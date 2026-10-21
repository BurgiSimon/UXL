---
id: L12
name: "Law of Common Region"
source: https://lawsofux.com/law-of-common-region/
origin: "Stephen E. Palmer (1992), 'Common region: A new principle of perceptual grouping', Cognitive Psychology."
category: perception
summary: "Put things that belong together inside one shared container (card, panel, tinted area) and keep unrelated things outside it."
applies_to: [cards, panels, forms, fieldsets, tables, list rows, sidebars, modals, settings pages, pricing tables]
rules:
  - "One container holds one object or one task. If a card mixes two unrelated things, split it."
  - "Use the lightest boundary that works: background tint first, 1px border second, shadow only for floating layers."
  - "Show at most 2 levels of visible containers inside the page. Separate deeper sub-groups with spacing or a divider."
  - "Pad containers 16–24px, at least as much as the gaps inside them, and space containers apart by at least as much again."
  - "Put a group's actions inside its container. Actions outside every box read as page-level."
---

# Law of Common Region (L12)

## In plain words

Elements that sit inside the same boundary are perceived as one group. The boundary can be a border, a background fill, a raised surface, or a band across the page. This cue is strong enough to beat spacing and styling: two items at opposite ends of a card still feel related, while two items a few pixels apart but in different cards feel separate.

Stephen Palmer showed in 1992 that enclosure groups elements even when proximity pulls the other way. That strength makes containers the most dependable way to show structure, and also the easiest one to overuse.

## Why it matters in a UI

- **It rescues dense layouts.** When there isn't room for big gaps (dashboards, long forms, settings), a container states the grouping that spacing alone can't.
- **Containers define scope.** A button inside a card is read as acting on that card. A "Save" inside a settings panel is read as saving that panel. Put the boundary in the wrong place and users predict the wrong effect, for example "Delete" removing the whole list instead of one row.
- **Containers are scanning units.** Users skim card by card and row by row. On mobile, a card is also a natural tap target and scroll unit.
- **Overuse turns into box soup.** Borders around everything, nested three or four deep, cancel each other out. Nothing groups and the page looks heavy and dated.
- **Visual and semantic groups should match.** Screen reader users get structure from `<fieldset>`, `<section>`, and lists, not from borders, so a visual group without markup is invisible to them.

## Build it right

### Everywhere
1. **Cut containers along the data model.** One card per object (order, product, user), one panel per task or settings group. Put the group's heading inside the region, at the top.
2. **Choose the lightest cue.** A tinted background (e.g. gray-50 on white) for large regions. A 1px border for cards on a same-colored background. A shadow only for layers that float above the page: menus, popovers, dialogs, dragged items. Don't stack all three on one element.
3. **Limit nesting.** Page > section > card is enough. Inside a card, separate sub-groups with spacing or a single divider, not another bordered box.
4. **Padding vs. gaps.** Card padding 16–24px, items inside 8–12px apart, cards 16–24px apart. If inner gaps exceed the padding, content looks loose inside its box ([Proximity](proximity.md)).
5. **Keep actions in scope.** Row actions on the row, card actions in the card footer, the form's submit right after its last group. Page-level actions go in the header or a sticky bar, outside every card.
6. **Match semantics.** `<fieldset><legend>` for field groups, `<section aria-labelledby>` for panels, `<ul>/<li>` for card lists, `<article>` for self-contained cards.
7. **Show state on the region.** A selected row gets a tint, a selected card gets a 2px accent border. A checkmark far away from the item is easy to misattribute.

### Mobile
- **Don't stack padding.** A 16px page gutter + 24px card padding + 16px inner box leaves little room at 390px. Use full-bleed sections with background bands, or cards with 12–16px padding.
- **Long, uniform lists:** edge-to-edge rows with inset dividers aligned to the text beat floating cards. Use cards when items are rich or varied.
- **Sheets and dialogs are regions.** Give them a distinct surface, a grabber on bottom sheets, and a scrim so the group is obvious.
- When the region *is* the object, make the whole region the tap target ([Fitts's Law](fitts-law.md)).

### Desktop
- **Structure the app shell with regions.** Tinted sidebar, plain main content, separate inspector panel. Chrome and content should never share a surface.
- **Dense tables:** row hover tint or zebra striping creates a temporary row region that keeps the eye on track across wide rows. Keep the header in its own sticky region.
- **Settings pages:** one card per independent group, each with its own heading and, if it saves separately, its own save button inside the card.
- Hover-revealed boundaries must also appear on `:focus-within`, and the resting layout must still group without hover.

## Code patterns

```html
<form class="checkout">
  <fieldset class="panel">
    <legend>Shipping address</legend>
    <!-- fields -->
  </fieldset>
  <fieldset class="panel">
    <legend>Payment</legend>
    <!-- fields -->
  </fieldset>
  <button type="submit" class="btn-primary">Place order</button>
</form>
```

```css
.panel {
  padding: 20px 24px 24px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
}
.panel > * + * { margin-top: 12px; }   /* inside a region: 12px */
.panel + .panel { margin-top: 24px; }  /* between regions: 24px */
.panel legend { padding-inline: 4px; font-weight: 600; }
.row:hover, .row:focus-within { background: var(--surface-hover); }  /* temporary row region */
```

```jsx
// Selection lives on the region; the card's actions stay inside it
<li className={`rounded-xl border p-4 ${selected ? "border-2 border-accent bg-accent/5" : "border-gray-200"}`}>
  <h3 className="font-medium">{plan.name}</h3>
  <p className="mt-1 text-sm text-gray-600">{plan.price}</p>
  <div className="mt-4 flex gap-2"><button>Edit</button><button>Remove</button></div>
</li>
```

Tailwind: prefer `bg-gray-50` bands and `border` over `shadow-lg` for in-page groups. Reserve shadows for overlays.

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Related items split across boxes, or unrelated items sharing one | manual: in a screenshot, can each box be named as one thing ("shipping", "this order")? | major | Re-cut containers along the data model |
| Box soup: 3+ nested bordered or shadowed levels | manual: grep nested `.card .card`, `border` inside `border`; count visible boundaries in a screenshot | minor | Flatten inner levels to spacing or one divider |
| Actions outside the region they affect | manual: for each button, check that its container matches its scope | major | Move into the container; page actions to header or sticky bar |
| Inputs with no visible boundary (borderless, or border < 3:1 against its background) | manual: compare computed `border-color` with the background (WCAG 1.4.11) | major | 1px border at ≥ 3:1, or tinted fill plus bottom border |
| Visual groups with no semantic grouping | manual: grouped fields not in `<fieldset>` or `role="group"`; card lists not in `<ul>` | minor | `<fieldset><legend>`, `<section aria-labelledby>`, lists |
| Inner gaps larger than container padding, or off-scale values | `lint: spacing-off-scale` · manual: compare padding with inner gaps | minor | Padding ≥ inner gap, snapped to the scale |
| Stacked padding squeezes or overflows content on mobile | `audit: horizontal-overflow` · manual: content width at 390px | minor | Full-bleed sections, or 12–16px card padding |
| Selection shown far from the selected item | manual | minor | Indicate selection on the region: tint + accent border |

## Tensions & trade-offs

- **vs. [Proximity](proximity.md):** a box overrides spacing, so the two must agree. If spacing already groups clearly, skip the box ([Prägnanz](pragnanz.md)).
- **vs. [Aesthetic-Usability](aesthetic-usability.md):** every border and shadow adds visual weight. Prefer tints over lines and keep shadows for real elevation.
- **vs. [Uniform Connectedness](uniform-connectedness.md):** use a region for "these belong together" and a connector for "this leads to that". Merging sequential steps into one box hides their order.
- **vs. [Chunking](chunking.md):** regions are visual chunks. Too many tiny regions fragment the page as badly as none.

## Quick test

Blur the screenshot. Does every visible box match exactly one thing a user would name, and does every button sit inside the box it acts on?
