# Desktop web

Desktop users have a precise pointer, a keyboard, wide screens and often several windows and tabs. Use that for speed and density without losing the clarity a first-time visitor needs. Component specs are in [component-playbook.md](component-playbook.md), and the mobile counterpart is [platform-mobile.md](platform-mobile.md). The laws most at stake are [§L07 Fitts's Law](laws/fitts-law.md) (pointer travel), [§L11 Jakob's Law](laws/jakobs-law.md) (desktop conventions), [§L05 Cognitive Load](laws/cognitive-load.md) (density), [§L08 Flow](laws/flow.md) (keyboard speed) and [§L29 Working Memory](laws/working-memory.md) (context kept on screen).

**Contents:** [Layout](#layout-grids-and-max-widths) · [Horizontal space](#use-horizontal-space) · [Density](#information-density) · [Hover and tooltips](#hover-states-and-tooltips) · [Shortcuts and ⌘K](#keyboard-shortcuts-and-command-palette) · [Focus](#focus-management-and-tab-order) · [Context menus](#context-menus-optional) · [Drag and drop](#drag-and-drop) · [Menus](#mega-menus-and-dropdowns) · [Wide tables](#wide-data-tables) · [Multi-window](#multi-window-and-tab-workflows) · [Cursors](#cursor-affordances) · [Forms](#desktop-forms) · [QA](#desktop-qa-checklist)

## Layout grids and max widths

- Use a 12-column grid at ≥ lg (1024 px), with 24 px gutters (32 px at ≥ xl) and side padding of `clamp(16px, 4vw, 48px)`.
- Center content in a 1200–1440 px container. Reading text keeps a 60–75 character measure (`max-width: 68ch`) at any screen width (§L05).
- On 1920–2560 px screens, let app chrome and data views (side nav, tables, boards, maps) use the space, and keep text columns and forms capped. Never stretch paragraphs, forms or a lone button across the full width.
- Test at 1280×800, 1440×900, 1920×1080 and 2560×1440. Also test at 200% and 400% browser zoom: at 400% a 1280 px window is 320 CSS px wide and must reflow to the mobile layout without horizontal scroll.

```css
.container { width: min(100% - 2 * clamp(16px, 4vw, 48px), 1280px); margin-inline: auto; }
.prose { max-width: 68ch; }
.app { display: grid; grid-template-columns: 260px minmax(0, 1fr); min-height: 100dvh; }
@media (min-width: 1280px) { .app.has-aside { grid-template-columns: 260px minmax(0, 1fr) 320px; } }
```

## Use horizontal space

Don't just scale the mobile column up. A single 1440 px column of giant cards wastes eye and pointer travel (§L07).
- **Side navigation** (≥ lg): 240–280 px, collapsible to a 64–72 px icon rail with tooltips. Persist the user's choice.
- **Master-detail:** a 320–400 px list beside a detail pane. Selecting a row updates the URL (`/inbox/123`) and the pane, and ↑/↓ or j/k move between items. Below lg, collapse to list → detail page with Back.
- **Persistent filters:** a 240–280 px left column at ≥ lg instead of a sheet. Use **three panes** (nav, list, detail) only at ≥ xl (1280 px).
- **Side panels and inline editing:** a 400–480 px drawer from the right, or edit-in-place, keeps the list visible instead of navigating away (§L29).
- Use spare width for context the user would otherwise have to remember: an order summary beside checkout, a live preview beside a form, a sticky table of contents beside an article.

## Information density

- There are two audiences. First-timers need clear hierarchy, labels and guidance. Daily power users want more on screen and fewer clicks. Default to comfortable and let experts opt in to more ([§L21 Pareto](laws/pareto-principle.md)).
- Offer a density toggle (Comfortable / Compact) for tables and lists: rows go from 44–48 px to 32–36 px and cell text from 16 to 14 px. Compact is a stated, opt-in deviation from the 44 px statute for fine pointers only, and it never goes below 24 px (§L07).
- Add accelerators that don't clutter the screen for novices: keyboard shortcuts, a command palette, bulk select, saved views, inline edit and context menus ([§L20 Active User](laws/active-user-paradox.md)).
- Put advanced options behind "More options" or in a details panel, off the main path (§L05).
- Keep the 4/8 px spacing scale when dense. Tighten spacing inside groups and keep the space between groups larger ([§L13 Proximity](laws/proximity.md)).

## Hover states and tooltips

- On desktop, hover is an enhancement. Every hover reveal has a focus equivalent (`:focus-visible`, `:focus-within`) and works on touch-screen laptops (`lint: hover-only`). Hover feedback appears within 100 ms, with 150–200 ms transitions.
- Tooltips hold ≤ 1 short sentence of supplementary information, never the only copy of essential content. Show them after ~300–500 ms of hover and immediately on keyboard focus. Make them dismissible with Esc and hoverable (the pointer can move onto them without closing them), and keep them visible until the user moves away.
- Every icon-only button gets an `aria-label` and a tooltip with the same label plus its shortcut ("Archive · E").
- Disabled buttons fire no pointer events, so a tooltip on them never shows. To explain why something is unavailable, use `aria-disabled="true"` and handle the click instead of `disabled`.

```css
.tip { visibility: hidden; opacity: 0; transition: opacity 150ms, visibility 0s 150ms; }
@media (hover: hover) { .has-tip:hover .tip { visibility: visible; opacity: 1; transition-delay: 400ms; } }
.has-tip:focus-visible .tip { visibility: visible; opacity: 1; transition-delay: 0s; }
/* JS: Esc hides the open tooltip; link it with aria-describedby */
```

## Keyboard shortcuts and command palette

- **⌘K / Ctrl+K** opens a command palette: one input that searches pages, records and actions. Also put a visible trigger in the header ("Search or jump to… ⌘K") so non-experts find it (§L20).
- Palette spec: top-center, ~20% from the top, 560–640 px wide, with the input focused. Results are grouped (Recent, Pages, Actions), fuzzy-matched, ≤ ~8–10 visible, with shortcut hints right-aligned. ↑/↓ and Enter pick a result, and Esc closes and restores focus.
- `?` opens a shortcut cheat sheet. Show shortcuts in tooltips and menus so people learn them while working.
- Follow conventions (§L11): ⌘/Ctrl+S saves, ⌘/Ctrl+Z undoes, Esc closes, `/` focuses search, Enter opens, j/k step through lists. Never override browser shortcuts (⌘/Ctrl + T, W, L, R, N).
- Single-key shortcuts must not fire while the user types in a field, and users must be able to turn them off or remap them (WCAG 2.1.4). Display ⌘ on Mac and Ctrl elsewhere.

```js
const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
document.addEventListener('keydown', (e) => {
  const t = e.target;
  const typing = t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); return; }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === '/') { e.preventDefault(); focusSearch(); }
  else if (e.key === '?') openShortcutHelp();
});
```

## Focus management and tab order

- DOM order, visual order and tab order match. Never use a positive `tabindex`, and check that CSS `order`, `grid-area` or `row-reverse` hasn't scrambled them.
- The first focusable element is a "Skip to main content" link that appears on focus.
- Focus is visible everywhere: a 2–3 px outline, 2 px offset, ≥ 3:1 contrast. Never `outline: none` without a replacement (`lint: focus-outline-removed`, `audit: focus-invisible`). Focused elements must not hide under sticky headers, so set `scroll-padding-top`.
- On an SPA route change, move focus to the new `<h1 tabindex="-1">` and update `document.title`.
- A dialog takes focus on open, keeps it inside and returns it to the trigger on close. Menus, toolbars, tabs and grids use a roving `tabindex`: one tab stop, with arrow keys inside.
- After deleting an item, focus the next item or the list heading, never `<body>`.

```css
:focus-visible { outline: 2px solid var(--focus, #2563eb); outline-offset: 2px; }
html { scroll-padding-top: 72px; }                                  /* = sticky header height */
```

## Context menus (optional)

- A context menu is only a shortcut. Every action in it also lives in a visible "⋯" button or the toolbar (§L20).
- Open it on right-click, Shift+F10 and the Menu key. Position it at the pointer and flip it to stay on screen. Arrow keys and Enter choose, and Esc closes.
- Keep it to ≤ ~7–10 items in groups separated by dividers, with destructive items last and in red.
- Don't replace the browser menu on links, images or selectable text, where people expect copy, "open in new tab" and save.

## Drag and drop

- Show a drag handle (⋮⋮, a 24 px visual in a 44 px hit area) with `cursor: grab`, switching to `grabbing` while dragging. Lift the item with a shadow and show a clear insertion line or a highlighted drop zone.
- Every drag has a non-drag alternative (WCAG 2.5.7): "Move up/down", a "Move to…" menu, or keyboard control where Space picks up, the arrows move, Space drops and Esc cancels. Announce the result in a live region ("Moved 'Design review' to position 3 of 8").
- Auto-scroll the container when the pointer nears its edge, and offer Undo after the drop (§L23).
- A file drop zone always has a "Choose files" button. It highlights on `dragenter` (2 px dashed border, tinted background) and states the accepted types and size limit up front.
- Prefer a maintained library with keyboard support (such as dnd-kit) over raw HTML5 drag events, which have no keyboard model.

## Mega-menus and dropdowns

- The trigger is a `<button aria-expanded aria-controls>` that opens on click. If it also opens on hover, add a ~150 ms intent delay and a ~300 ms close delay (§L07).
- Add a safe triangle, a hidden hit area or direction check that keeps the panel open while the pointer moves diagonally toward it. The close delay below is the minimal version.
- Content: ≤ 4 columns, each a labeled group of ≤ 7 links, with at most one featured item ([§L10 Hick](laws/hicks-law.md), [§L03 Chunking](laws/chunking.md)).
- Keyboard: Enter or Space opens, Tab moves through the links, and Esc closes and returns focus to the trigger. Site navigation uses the disclosure pattern, not `role="menu"`, which is for application command menus. The panel also closes on outside click, focus leaving and route change.
- Use a native `<select>` for single choices from up to ~10 options, and a searchable combobox beyond that ([§L02 Choice Overload](laws/choice-overload.md)).

```js
let closeTimer;
for (const item of nav.querySelectorAll('.has-panel')) {
  const btn = item.querySelector('button');
  btn.addEventListener('click', () => toggle(item));
  item.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') closeTimer = setTimeout(() => close(item), 300); });
  item.addEventListener('pointerenter', () => clearTimeout(closeTimer));
  item.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(item); btn.focus(); } });
}
```

## Wide data tables

- The table scrolls inside its own container, never the page. Keep the header row and the first (identifier) column sticky, with an edge shadow while scrolled.
- Column resizing uses an 8–12 px handle on the header edge with `cursor: col-resize` and double-click to auto-fit. Add a keyboard alternative (focus the handle, ←/→ by 10 px) and sensible minimum widths. Persist width, order and visibility per user.
- Add a "Columns" chooser to show, hide and pin columns. Right-align numbers with `tabular-nums`. Make a totals row sticky at the bottom when it matters.
- Editable grids follow the ARIA grid pattern: arrows move between cells, Enter edits and Esc cancels. Virtualize beyond a few hundred rows while keeping column widths stable.

```css
.grid-wrap { overflow: auto; max-height: calc(100dvh - 200px); }
.grid-wrap thead th { position: sticky; top: 0; z-index: 2; background: var(--surface); }
.grid-wrap tbody th[scope="row"] { position: sticky; left: 0; z-index: 1; background: var(--surface); }
.grid-wrap thead th:first-child { left: 0; z-index: 3; }                  /* the corner cell sits above both */
.grid-wrap .num { text-align: right; font-variant-numeric: tabular-nums; }
```

## Multi-window and tab workflows

- Every meaningful view is a URL: tab, filters, sort, page, query, selected item and open panel. Refresh, Back, bookmarks and shared links restore it exactly (§L29).
- Navigation uses real `<a href>`, so ⌘/Ctrl-click, middle-click and "Open in new tab" work. No clickable `<div>`s (`lint: div-button`).
- Use `pushState` for changes people would expect Back to undo (opening an item, switching tabs) and `replaceState` for transient tweaks (typing in a filter).
- `document.title` names the content first ("Invoice #1042 · Acme Billing") so people can tell tabs apart.
- Sync sign-out, theme and data changes across tabs with `BroadcastChannel` or the `storage` event. Detect stale edits with a version check instead of silently overwriting.
- Use `beforeunload` only while there are unsaved changes, and autosave drafts so the warning rarely appears. Open links in a new tab only when leaving would lose work, and say so.

```js
const params = new URLSearchParams(location.search);
params.set('sort', 'price-asc'); params.set('page', '1');
history.replaceState(null, '', `${location.pathname}?${params}`);
```

## Cursor affordances

| Element | Cursor |
|---|---|
| Links, clickable cards and rows | `pointer` |
| Buttons | `pointer` or `default`, one choice app-wide (§L15). Tailwind v4's preflight uses `default`, so add `button:not(:disabled) { cursor: pointer; }` if you choose pointer |
| Drag handles | `grab`, then `grabbing` while dragging |
| Column or pane resizers | `col-resize` / `row-resize` |
| Disabled controls | `not-allowed` |
| Background work while the UI stays usable | `progress`. Use `wait` only when the UI is truly blocked |

A `pointer` cursor is a promise that something will happen, so never show it on an element that does nothing on click.

## Desktop forms

- Single column stays the default even on wide screens, with the form column capped at ~480–640 px ([§L05](laws/cognitive-load.md)).
- Use two columns only for short fields people think of as one unit: first and last name, city and postcode, expiry and CVC, start and end date. Never pair unrelated fields to fill space.
- Field widths hint at the expected input: a postcode is ~8ch, a CVC ~5ch, a phone ~16ch. Labels go above fields. Left-aligned labels (a ~160–200 px label column) suit only long, read-mostly settings forms.
- Enter submits, Tab follows the visual order, and ⌘/Ctrl+Enter submits multi-line fields such as comments and messages.
- Autofocus the first field only on pages whose whole purpose is the form (login, search).

```css
.form { max-width: 560px; display: grid; gap: 16px; }
.form .pair { display: grid; gap: 16px; }
@media (min-width: 640px) { .form .pair { grid-template-columns: 2fr 1fr; } }      /* City | Postcode */
```

## Desktop QA checklist

Run `node <skill-dir>/scripts/uxl_audit.mjs <url>` (1440×900) and view the screenshots, then check by hand.

- [ ] Content sits in a 1200–1440 px container, and text stays ≤ 75 characters per line at 1920 and 2560 px
- [ ] Top-level nav has ≤ 7 items and the logo links home (`audit: nav-overload`). One primary action per view (`audit: cta-competition`)
- [ ] Every hover reveal has a focus equivalent, and tooltips dismiss with Esc (`lint: hover-only`)
- [ ] The whole app works by keyboard: logical tab order, a skip link and visible focus (`audit: focus-invisible`)
- [ ] Focus is never hidden under sticky bars, and dialogs contain focus and return it
- [ ] Menus open on click, survive diagonal pointer travel and close on Esc
- [ ] Drag and drop has a keyboard or button alternative
- [ ] Wide tables scroll inside their container with a sticky header and first column
- [ ] Views deep-link: refresh, Back and ⌘/Ctrl-click restore the same state
- [ ] Shortcuts don't fire while typing and don't override browser shortcuts
- [ ] Cursors match behavior, and forms are single-column apart from related short pairs
- [ ] The layout reflows at 200% and 400% zoom without horizontal page scroll
