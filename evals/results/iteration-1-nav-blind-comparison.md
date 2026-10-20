# AppShell comparison (eval-3, blind-style)

**Design A** is `with_skill/run-1/outputs/AppShell.tsx` (1703 lines). **Design B** is `without_skill/run-1/outputs/AppShell.tsx` (936 lines). I judged them only on the code. Both compile cleanly with `tsc --strict --noUnusedLocals` against @types/react 18.3 and lucide-react 0.460, and both pass every manual assertion.

## Information architecture
- **A:** an unlabelled core tier of 5 pages (Dashboard, Tasks, Projects, Calendar, Messages), then 2 labelled groups that can be folded ("Time & billing", "Workspace"), then Settings and Help pinned to the bottom. This is a priority-tiered model. A folded group still shows the current page and a dot for badges, but folding hides pages, which could bring back some "where did it go?" moments.
- **B:** Dashboard alone at the top, then "Work", "People" and "Time & money", with "Settings & help" (including Integrations) pinned to the bottom. The groups are smaller and evenly sized but there are more headings to scan. "Messages" under "People" is a debatable choice.
- **Desktop wayfinding:** B has a desktop top bar with a breadcrumb ("Time & money › Invoices"). A shows section and page only in the mobile top bar; on desktop the sidebar highlight is the only cue.
- **Search:** both have a Cmd/Ctrl+K palette that matches synonyms. A adds typo matching, recent pages, actions and role-based `hiddenPages`.

## Mobile pattern
- **Shared pattern:** both use 4 tabs plus More (Dashboard, Projects/Tasks, Messages), and More opens a bottom sheet that reuses the desktop groups.
- **Breakpoint:** A switches at 1024px, so tablets get the thumb-friendly tab bar. B switches at 768px.
- **Sheet layout:** A shows 2-column horizontal tiles with 16px labels. B shows 3-column stacked tiles with 12px labels.
- **Tab bars:** both put an icon and a label on every tab, at 56px (A) and 64px (B). A also scrolls back to the top when you tap the tab you're already on.

## Accessibility
- **Dialogs:** A uses native `<dialog showModal>`, so the page behind is really inert and Esc and Android Back work. B uses a hand-written focus trap with `role=dialog aria-modal`, which is sound but only Tab-trapped, not inert.
- **Focus after navigation:** A moves focus to the new page's `<h1>` and keeps `document.title` in sync. B announces page changes in a polite live region.
- **Touch targets:** A keeps 44px rows for touch and drops to 36px only under `pointer:fine`. B's sidebar rows are a fixed 36px (`h-9`) at 768px and up, including touch tablets. B's NOTES claim "touch targets ≥ 44px", which isn't true there.
- **Collapsed rail:** B starts collapsed below 1280px, so tablets and small laptops see an icon-only rail by default, and its tooltips appear only on hover or focus, not on tap. A starts expanded.
- **Shared basics:** both have a skip link, `aria-current="page"`, labelled `nav` landmarks, badge text for screen readers, and `focus-visible` styles on every control.

## Polish
- **A:** dark mode, design tokens in one `tone` object, tooltips with a hover delay that can be dismissed and hovered (WCAG 1.4.13), a scroll-shadow on the sidebar footer, and reduced-motion handling. The cost is a large API and code size (about 1.8× B), which is some scope creep for "app shell navigation".
- **B:** leaner and easier to read. It includes an `AppShellDemo` preview and the desktop breadcrumb, but has no dark mode.

## Bugs noticed
- **B, SSR hydration mismatch:** the file is marked `"use client"`, but `useState(readCollapsedPreference)` (L475) reads localStorage and `matchMedia` during the first client render. The server renders the sidebar expanded, so in Next.js the client markup won't match. (B handles `isMac` correctly in an effect, so the two are inconsistent.)
- **B, palette details:** palette options are `<li onClick>`, so Cmd-click to open a new tab isn't possible from the palette. The palette input has `outline-none` and no replacement focus cue.
- **A, More sheet closes by accident:** between 576 and 1023px wide, the sheet's content is `max-w-xl` and centred inside a full-width white `<dialog>`. A tap on the white side margins counts as a backdrop click (`e.target === dialog`), so the sheet closes unexpectedly.
- **A, layout shift on load:** the remembered rail and folded-group state is read after mount (SSR-safe), so people who collapsed the sidebar see it expanded for one frame before it collapses.
- **Both:** both `nav` landmarks are labelled "Main". This is harmless because only one is displayed at each breakpoint.

## Verdict
I'd ship **A**, with three small changes:
1. Make the sheet's inner wrapper full-width, or check the click position against the content box.
2. Add a desktop breadcrumb like B's.
3. Consider dropping the folding groups.

A's problems are minor interaction glitches. B's problems hit the brief's main audiences: an SSR hydration bug, 36px targets on touch tablets, and an icon-only rail by default below 1280px. A's tablet handling, native modal semantics, focus management and SSR-safe state make it the more robust shell. If code size or maintenance cost matters more than those, B is a reasonable, simpler fallback once its hydration bug and tablet target sizes are fixed.
