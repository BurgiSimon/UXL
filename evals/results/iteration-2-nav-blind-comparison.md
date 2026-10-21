# AppShell comparison (eval-3, iteration 2, blind-style)

**A** is `with_skill/run-1/outputs/AppShell.tsx` (1108 lines). **B** is `without_skill/run-1/outputs/AppShell.tsx` (936 lines). I judged them on the code, plus A's own screenshots in `_scratch/shots/`. B has no renders.

Both files type-check with 0 diagnostics. The check used TypeScript 5.6.3 with `strict`, `noUnusedLocals`, `noUnusedParameters` and `isolatedModules`, against @types/react 18.3.12 and lucide-react 0.460.0, run in memory. Both pass all 7 manual assertions; B's grades are in its own `manual_grades.json`. The differences are in execution, not in the checklist.

## Information architecture

The two designs share almost the same IA:

| | A | B |
|---|---|---|
| Top | Dashboard (unlabelled) | Dashboard (unlabelled) |
| Groups | Work · People · Time & billing | Work · People · Time & money |
| Pinned bottom | Integrations, Settings, Help | Integrations, Settings, Help |
| Mobile tabs | Dashboard, Projects, Tasks, Messages + More | identical |

Where they differ:

- **Wayfinding.**
  - On desktop, B has a top bar with a breadcrumb, "Time & money › Invoices" (L755-769). A has no desktop top bar, so the sidebar highlight is the only shell cue.
  - On mobile it's the other way round. A shows section › page (L612-617). B hides the section below 768px (`hidden md:inline`, L763) and shows only the page name.
- **Search.**
  - Both have a Cmd/Ctrl+K palette with synonym matching.
  - A adds subsequence typo matching (L156-158), a grouped browse view (L1025-1044), a polite "N pages found" live region (L1009-1011) and an empty state that suggests words to try (L1014-1017).
  - B adds a "/" shortcut (L506) and section labels on results.
- **Extension points.**
  - A builds in a user/profile area.
  - B exposes a `headerActions` slot (L461, L797), which is more flexible for a real app.

## Mobile pattern

- **Breakpoint.** A switches at 1024px (`lg`, L178/L601/L651), so phones and tablets get the tab bar. B switches at 768px (`md`, L681/L813).
- **Tab bar.**
  - A's tabs are 56px (`min-h-14`, L744), with an accent bar on the active tab. Tapping the active tab again scrolls to the top (L665-672).
  - B's tabs are 64px (`h-16`, L627), with a Material-style pill behind the active icon.
- **More sheet.**
  - A's sheet is a native `<dialog>` with 2-column, 48px tiles and 16px labels. It closes on Esc, Back, a backdrop tap or a swipe down (L770-792). In `mobile-more-sheet.png` all 10 pages fit at 390px.
  - B's sheet is a custom div with 3-column, 76px tiles and 12px labels, plus a "Jump to page…" button (L883-890). It is titled "All pages" but lists only the 10 non-tab pages (L870).
- **Label fit.**
  - A's active "Dashboard" tab truncates to "Dashbo…" at 360px (`mobile-360-dashboard.png`). The cause is `px-1` on both the grid and the tab (L655, L744) combined with the semibold active weight.
  - B's columns are about 72px with no padding, so I estimate "Dashboard" fits there. That isn't verified, because there are no renders of B.

## Accessibility

| Topic | A | B |
|---|---|---|
| Modals | Native `showModal()`. The background is inert, focus is contained, Esc and Android Back work (L195-211). | Hand-written Tab trap plus `aria-modal` and a body overflow lock (L191-237). Sound, but the background is not inert. |
| Route change | Focus moves to the new page's `<h1>` and the page scrolls to the top (L327-340). | Polite live region says "X page" (L526-533, L910-912). |
| More-tab context | sr-only ", current page: X" when the active page is inside More (L704). | Visual only (L831, L837). |
| Collapse toggle | Swaps its sr-only label; no `aria-expanded` (L587-595). | `aria-expanded` plus `aria-label` (L728-729). B is better here. |
| Focus styles | 2px teal outline with offset on every control (L172). The palette input gets a focus-within underline (L973). | `ring-2 indigo` (L135). The palette input is `outline-none` with no replacement (L386). |
| Palette options | `<a href role="option">` (L936-947), so Cmd-click opens a new tab. | `<li role="option" onClick>` (L403-409). |
| Headings | Sidebar group `<h2>`s come before the page `<h1>` in DOM order (L478-484). Small heading-order nit. | `role="group"` with `<p>` labels (L296-305), which keeps the heading outline clean. |
| Touch targets (phone) | All ≥ 44px. The runtime audit found 0 undersized. | All ≥ 44px. Tabs are 64px and tiles 76px. |
| Touch targets (tablet) | Below 1024px tablets get the tab bar. From 1024px, rows are `min-h-11` on coarse pointers and drop to 36px only under `@media(pointer:fine)` (L456-457, L536). | Sidebar from 768px with fixed `h-9` (36px) rows (L603). The collapse button (L732) and header search (L778) are also 36px. |

## Polish

- **A.**
  - Stone and teal palette. The active row has a tint, an accent bar and bold text, so colour is not the only cue.
  - The rail has group dividers. Its tooltips fire only for a mouse (`pointerType === "mouse"`, L406) or for focus-visible (L408).
  - It has a profile footer.
  - **Load-time flash.** The collapse preference is read in an effect (L348-355), and the sidebar has a width transition (L509). A returning user who collapsed the sidebar sees it open and then animate shut on every page load.
- **B.**
  - Slate and indigo palette, a blurred sticky top bar, the breadcrumb, pill badges and the pill-style tab indicator. B looks a little more "finished" on desktop.
  - Its tooltips use `mouseenter`, which touch emulation also triggers.

## Bugs and risks

**B**

1. **SSR hydration mismatch (high).**
   - `useState(readCollapsedPreference)` (L475) reads `localStorage` and `matchMedia` during render (L168-178). On the server it returns `false`.
   - On the client it returns `true` whenever the viewport is below 1280px and nothing is saved, which covers every phone, tablet and small laptop. It also returns `true` when the saved preference is "1".
   - The first client render then differs from the server HTML: the aside width (L683), the content padding (L754), the sr-only classes (L611, L688), the collapse `aria-label` (L729) and the "Collapse" text node (L738).
   - React logs hydration errors and re-renders the root on the client.
   - The file starts with `"use client"` (L1), so it is clearly meant for Next.js App Router, where client components are server-rendered.
2. **Touch tablets get an icon-only, 36px nav (high for this brief).**
   - iPads at 768–1279px get the sidebar (L681).
   - With nothing saved, it starts as an icon rail (L177), and its rows are 36px.
   - Labels appear only in hover tooltips. That reintroduces the "users get lost" problem on exactly the devices in between phone and desktop.
3. The sheet is titled "All pages" but shows 10 of the 14 (L870).
4. `metaKey || ctrlKey` for K (L502) also takes over Ctrl+K on a Mac, which is "delete to end of line" in text fields. Minor.

**A**

1. **Tab label truncation.** The active "Dashboard" tab shows "Dashbo…" at 360px, a very common Android width.
2. **Collapse flash.** This is the SSR-safe trade-off described under Polish. Fix it with a cookie the server can read, or by skipping the width transition on mount.
3. **API footgun.** If you pass `currentPath` without `onNavigate`, `navigate()` calls `history.pushState` (L308-310) behind the app router's back. The URL changes but the page doesn't. B requires `currentPath` (L452) and falls back to full page loads (L540, L548-551), which is safer.
4. **Hybrid laptops.** A touchscreen laptop whose primary pointer is fine gets 36px rows, because of the `pointer:fine` gating. Minor.
5. **Unverified claims.**
   - NOTES and RESPONSE say "Tailwind v3.4+ or v4 (checked with both)". `_scratch` only has a Tailwind v4 build (`package.json` lists `tailwindcss ^4.3.3`).
   - RESPONSE claims React 19 types also pass. I only verified React 18.
   - The class names used do require v3.4+: `size-*`, `min-h-11`, `min-h-dvh` and arbitrary `@media` variants.

**SSR safety.** A is hydration-safe by construction. Every browser read happens in an effect (L288-297, L349-355, L414-415, L430-435), and the initial state is the same on server and client.

## Verdict: ship A

The IA is a wash: both made the same grouping and tab choices. A wins on what breaks in production:

- No hydration mismatch.
- Tablets handled correctly: the tab bar below 1024px, 44px rows on coarse pointers from 1024px, and labels by default because the rail is opt-in.
- Real modal semantics from native `<dialog>`.
- Focus moves to the page heading after navigation.
- A stronger palette.

B's two main bugs are structural. The hydration mismatch and the 36px icon-only tablet rail would each need a redesign of the collapse logic and the breakpoints.

A's issues are small fixes to make before shipping:

1. Make the active tab label fit at 360px. Drop one of the `px-1` paddings, or keep the bold weight from changing the label's width.
2. Stop the collapse flash.
3. Either require `onNavigate` whenever `currentPath` is passed, or fall back to full page loads.

Worth porting from B: the desktop breadcrumb top bar, `aria-expanded` on the collapse toggle, the `/` shortcut and the `headerActions` slot.
