---
id: L14
name: "Law of Prägnanz"
source: https://lawsofux.com/law-of-pragnanz/
origin: "Gestalt psychology: Max Wertheimer (1923), 'Untersuchungen zur Lehre von der Gestalt II'; classic statement in Kurt Koffka (1935), 'Principles of Gestalt Psychology'."
category: perception
summary: "Build screens from simple, regular shapes on shared alignments so users read the layout as one obvious structure at a glance."
applies_to: [layout grids, icons, logos, cards, illustrations, charts, skeleton screens, carousels, dashboards, navigation]
rules:
  - "Align to one grid (4 columns mobile, 12 desktop). Keep distinct left edges per viewport to about 3–4."
  - "Items of one kind share size, aspect ratio, and radius. Vary shape only where the meaning differs."
  - "Icons are simple silhouettes from one family on a 24px grid, still recognizable at 16px."
  - "Skeleton screens match the final layout block for block, so content fills a shape users already parsed."
  - "If a chart needs a legend to be decoded, simplify first: ≤ 5–7 series, direct labels, no 3D."
---

# Law of Prägnanz (L14)

## In plain words

When the eye meets something complex or ambiguous, it settles on the simplest reading available. A square drawn with gaps in its outline is still seen as a square. A shape partly hidden behind a card is assumed to continue in the most regular way. Perception favors order, symmetry, and closed, regular forms because they are cheap to process and easy to remember.

Users will simplify your layout into a structure whether you designed one or not. If the layout really is simple (a few aligned columns, repeated shapes, clear silhouettes), their simplified picture is correct. If it is irregular, they guess, and the guess is often wrong.

## Why it matters in a UI

- **Layout is parsed before content.** A page that resolves into a few clean blocks feels understandable before anything is read. A ragged one feels "busy" at first sight.
- **Simple forms survive small sizes.** Icons, logos, and favicons with clean silhouettes stay recognizable at 16–24px. Detailed ones turn to mush.
- **Irregularity looks like meaning.** One card slightly taller, a block 3px off the alignment, an odd shape: each invites "is this different?". That is noise posing as signal ([Similarity](similarity.md), [Von Restorff](von-restorff.md)).
- **Charts get simplified too.** Users take away the dominant shape. If that shape doesn't match the chart's message, they leave with the wrong conclusion.
- **Closure lets you use less ink.** Aligned edges imply lines without drawing them, and a partly visible card implies more content offscreen.

## Build it right

### Everywhere
1. **One grid, few edges.** Use a column grid (4 columns mobile, 8 tablet, 12 desktop) and start text, images, and controls on the same lines. Fewer distinct x-positions means a simpler perceived structure.
2. **Repeat shapes.** Thumbnails share one `aspect-ratio`, cards in a row share one height (grid rows stretch by default), controls share one radius. Change shape only to signal a real difference.
3. **Simple, familiar icons.** One family on a 24px grid with a 1.5–2px stroke. Pick the most familiar metaphor, test it at 16px, and label anything that isn't universal.
4. **Clear silhouettes for controls.** Buttons are solid-filled or clearly outlined rectangles or pills. Avoid ghost buttons that dissolve into the background and irregular shapes that don't read as controls.
5. **One message per chart.** One dominant shape, ≤ 5–7 series, direct labels instead of a distant legend, no 3D, light or no gridlines. Use small multiples instead of one tangled chart.
6. **Load in shapes.** Skeletons repeat the final layout's blocks at the same sizes and positions. Content then fills a structure users already understood, with no layout shift.
7. **Use closure on purpose.** In horizontal scrollers, let the next item peek (about 15–20% visible) to signal more. Let aligned edges replace explicit borders and dividers.

### Mobile
- **A single column is the simplest form.** Use it. Keep multi-column only for compact, regular grids such as 2-up thumbnails of identical shape.
- **Tab bar icons carry more weight.** At most 5 tabs, each a simple outline icon that becomes filled when active, always with a text label.
- **Scrollers:** show a peek of the next item and snap with `scroll-snap-type` so the row reads as a continuing strip.
- **Avoid ragged reflow.** A lone orphan card in the last row breaks the pattern. Use a full-width last item or switch to a list.

### Desktop
- **Keep one dominant structure.** Sidebar + main, or 2–3 aligned columns. Avoid collage or masonry layouts for items people need to compare.
- **Dashboards:** snap widgets to the grid and standardize heights per row (multiples of one row unit) so the board reads as a tidy matrix.
- **Logos and favicons:** check the silhouette at 16×16 and 32×32 and ship a simplified small variant if the full mark breaks down.
- **Equal columns:** `repeat(auto-fill, minmax(260px, 1fr))` keeps card grids even at any width.

## Code patterns

```css
/* One grid, shared edges */
.page {
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px;
  max-width: 1200px; margin-inline: auto; padding-inline: 16px;
}
@media (max-width: 640px) { .page { grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 16px; } }

/* Repeated, regular shapes */
.thumb { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }

/* Scroller: the peeking item closes the "more" shape */
.rail {
  display: grid; grid-auto-flow: column; grid-auto-columns: 80%; gap: 12px;
  overflow-x: auto; scroll-snap-type: x mandatory;
}
.rail > * { scroll-snap-align: start; }
```

```jsx
// Skeleton mirrors the final card exactly: same box, same blocks, same sizes
const CardSkeleton = () => (
  <div className="card" aria-hidden="true">
    <div className="thumb bg-gray-200 motion-safe:animate-pulse" />
    <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
    <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
  </div>
);
// The list container gets aria-busy="true" while loading.
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Many distinct left edges, elements off-grid | manual: overlay a column grid on the screenshot; more than ~4 left edges per viewport is a smell | minor | Snap to the grid, remove stray offsets |
| Same-type items with mixed sizes or aspect ratios | `lint: image-no-dimensions` · manual: thumbnails of different heights in one row | minor | `aspect-ratio` + `object-fit: cover` |
| Detailed or mixed-family icons, unreadable at 16–20px | manual: grep icon imports from several sets (`lucide`, `heroicons`, `fa-`); mixed stroke widths | minor | One family, 24px grid, labels for uncommon icons |
| Skeleton doesn't match the final layout, page jumps on load | `audit: layout-shift` | major | Skeleton blocks at final dimensions; reserve space |
| Charts with many series, 3D, or legend-only decoding | manual: > 7 series, 3D options, legend far from the lines | major | Fewer series, direct labels, small multiples |
| Style noise: many sizes and colors with no meaning | `lint: font-size-sprawl` · `lint: color-sprawl` · `audit: font-sprawl` · `audit: color-sprawl` | minor | Collapse onto tokens |
| Controls with ambiguous silhouettes (ghost buttons that vanish, text that might be a button) | manual: in a screenshot, can you find every clickable thing within 3 seconds? | major | Solid fill or a ≥ 3:1 outline, one consistent control shape |
| Ragged grids and orphan last-row items | manual: resize from 390 to 1440px | minor | `auto-fill` grid, full-width last item, or a list |

## Tensions & trade-offs

- **vs. [Aesthetic-Usability](aesthetic-usability.md) and brand expression:** a strict grid can feel rigid. Break it once, on purpose, for the hero or one highlight ([Von Restorff](von-restorff.md)), never by accident.
- **vs. [Occam's Razor](occams-razor.md):** Prägnanz is about simple *form*, Occam about fewer *elements*. A tidy-looking screen can still carry too many features, and a minimal feature set can still look chaotic.
- **vs. expert density:** simplifying a chart can hide nuance experts need. Offer detail on demand (tooltips, drill-down, a data table) instead of one complex shape.
- **vs. [Jakob's Law](jakobs-law.md):** the simplest form is the familiar one. A clever minimal icon nobody has seen before is not simple to its users.

## Quick test

Squint until the text blurs. Do you see a few clean blocks on shared alignments, or a scatter of odd shapes? Could a user sketch the layout from memory after five seconds?
