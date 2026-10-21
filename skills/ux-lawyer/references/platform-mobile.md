# Mobile and responsive web

Build for a 360–430 px phone held in one hand, on a mid-range CPU, over a connection that drops. Then enhance for larger screens. Component specs are in [component-playbook.md](component-playbook.md), and the numbers follow the statutes in [SKILL.md](../SKILL.md). The laws most at stake are [§L07 Fitts's Law](laws/fitts-law.md) (reach, target size), [§L06 Doherty Threshold](laws/doherty-threshold.md) (speed on real phones), [§L11 Jakob's Law](laws/jakobs-law.md) (platform conventions), [§L05 Cognitive Load](laws/cognitive-load.md) (small screens hold less) and [§L24 Postel's Law](laws/postels-law.md) (messy input, flaky networks).

**Contents:** [Breakpoints](#breakpoint-strategy) · [Viewport meta](#viewport-meta-tag) · [Thumb zone](#thumb-zone-and-reachability) · [Navigation](#navigation-bottom-tab-bar-or-hamburger) · [Sticky CTA and safe areas](#sticky-bottom-cta-and-safe-areas) · [Sheets](#bottom-sheets-vs-modals) · [Targets](#touch-targets-and-spacing) · [Hover](#no-hover-dependence) · [Keyboards](#keyboards-input-types-and-autocomplete) · [dvh](#viewport-height-100dvh-vs-100vh) · [Virtual keyboard](#virtual-keyboard-covering-inputs) · [Scroll](#scroll-and-overscroll) · [Gestures](#gestures) · [Performance](#performance-on-real-phones) · [Offline](#offline-and-flaky-networks) · [PWA](#pwa-basics-optional) · [Tables](#responsive-tables) · [Typography](#typography-on-small-screens) · [QA](#mobile-qa-checklist)

## Breakpoint strategy

- Build mobile-first. Base styles target a 360–390 px viewport, and `min-width` queries add layout as space grows. Desktop-first `max-width` overrides pile up and leave phones with leftovers.
- Use the breakpoints **sm 640 · md 768 · lg 1024 · xl 1280** (the Tailwind defaults). Test at 360, 390 and 430 px wide, then at 768, 1024, 1280 and 1440.
- Let components respond to their container: use container queries for cards and widgets that appear in slots of different widths.
- A breakpoint changes layout, not meaning. Keep the same content, order of importance and labels at every size (§L15, §L11).

```css
.layout { display: grid; gap: 16px; padding-inline: 16px; }                       /* phone */
@media (min-width: 768px)  { .layout { grid-template-columns: 1fr 1fr; gap: 24px; padding-inline: 24px; } }
@media (min-width: 1024px) { .layout { grid-template-columns: 260px minmax(0, 1fr); } }
.slot { container-type: inline-size; }
@container (min-width: 480px) { .card { display: grid; grid-template-columns: 160px 1fr; } }
```

## Viewport meta tag

`<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`

- Include it on every page (`lint: viewport-missing`). Without it, phones render a ~980 px desktop layout shrunk to fit.
- Never add `user-scalable=no` or `maximum-scale=1` (`lint: zoom-disabled`). Low-vision users depend on pinch zoom. Fix iOS input zoom with 16 px fonts instead ([Keyboards](#keyboards-input-types-and-autocomplete)).
- Add `viewport-fit=cover` only when content should extend under the notch and home indicator, and then pad with `env(safe-area-inset-*)`. Optional: `interactive-widget=resizes-content` makes Android Chromium and Firefox shrink the layout when the keyboard opens. iOS Safari ignores it.

## Thumb zone and reachability

- Most phone use is one-handed or cradled, with the thumb doing the tapping (Steven Hoober's field observations, 2013). On 6–7 inch phones the bottom-center is easy to reach, the middle is fine, and the top corners need a stretch or a second hand (§L07).
- Put primary actions and main navigation low on the screen: a tab bar, a sticky CTA, bottom sheets, or a floating button for the single most frequent "create" action. Put rare and destructive controls higher up or behind a menu, where distance is useful friction.
- Keep interactive elements ≥ 16 px from the left and right edges, where browser and OS back-swipe gestures live.
- In deep flows, don't rely on a top-left Back alone. Browser Back must work (history entries), and the next step sits at the bottom.

## Navigation: bottom tab bar or hamburger

| Situation | Use |
|---|---|
| App with 3–5 frequently used top-level destinations | Bottom tab bar, always visible, icon + label on every tab (§L11, §L10) |
| Marketing or content site, > 5 sections, visited occasionally | Header with logo, primary CTA and a labeled "Menu" button that opens a drawer |
| App with 6+ destinations | Tab bar for the top 4 plus "More", or a drawer for secondary items. Never bury the top 4 |
| Single-task flow (checkout, onboarding) | No global nav: logo, an exit link and a sticky bottom CTA |

```css
.tabbar { position: fixed; inset: auto 0 0 0; z-index: 20; display: grid;
  grid-template-columns: repeat(var(--tabs, 4), 1fr); padding-bottom: env(safe-area-inset-bottom);
  background: var(--surface); border-top: 1px solid var(--border); }
.tabbar a { min-height: 56px; display: grid; place-items: center; align-content: center; gap: 2px;
  font-size: 12px; }                       /* platform norm for tab labels; never smaller */
.tabbar a[aria-current="page"] { color: var(--accent); font-weight: 600; }
body:has(.tabbar) main { padding-bottom: calc(56px + env(safe-area-inset-bottom)); }
@media (min-width: 1024px) { .tabbar { display: none; } }          /* side nav takes over */
```

A drawer menu is a `<button aria-expanded aria-controls>` with the visible text "Menu". It opens full height, moves focus to the first link, closes on Esc or with a 44 px close button, and locks background scroll.

## Sticky bottom CTA and safe areas

Use a sticky CTA for the one primary action of a long screen ("Add to cart", "Continue", "Pay $48.20"). Allow only one sticky bar per screen, so hide the tab bar inside flows. With `viewport-fit=cover`, content draws under the notch, the rounded corners and the home indicator, so pad anything fixed or edge-to-edge. Test in landscape, where the notch side gains an inset.

```css
.cta-bar { position: sticky; bottom: 0; z-index: 10;          /* sticky stays in flow: nothing hides behind it */
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: var(--surface); box-shadow: 0 -1px 0 var(--border); }
.cta-bar .btn-primary { width: 100%; min-height: 48px; }
@media (min-width: 640px) { .cta-bar { position: static; padding: 24px 0 0; box-shadow: none; }
                            .cta-bar .btn-primary { width: auto; } }
.site-header { padding-top: env(safe-area-inset-top); }
.page { padding-inline: max(16px, env(safe-area-inset-left)) max(16px, env(safe-area-inset-right)); }
```

## Bottom sheets vs modals

| Need | Pattern |
|---|---|
| Pick an option, filters, share, item actions | Bottom sheet (partial height, snaps to half or full) |
| Multi-field form, compose, editor | Full-screen view with a "Cancel · Title · Save" top bar |
| Short blocking confirmation ("Discard draft?") | Small centered dialog or action sheet |
| Information that doesn't block | Inline message or toast, not a modal (§L08) |

- A sheet has `max-height` ~90dvh, rounded top corners, a grab handle **and** a visible Close or Done button, because dragging is never the only way out. Pin its primary action to the bottom, above the safe-area inset.
- Content scrolls inside the sheet with `overscroll-behavior: contain`, and the page behind stays inert.
- Android Back should close the sheet. Native `<dialog>` handles this in current Chrome; for custom sheets, push a history entry on open.

```css
dialog.sheet { margin: auto 0 0; width: 100%; max-width: 100%; max-height: 90dvh; padding: 0; border: 0;
  border-radius: 16px 16px 0 0; }
dialog.sheet[open] { display: flex; flex-direction: column; }
dialog.sheet .body { overflow-y: auto; overscroll-behavior: contain; padding: 16px; }
html:has(dialog[open]) { overflow: hidden; }                                       /* lock page scroll */
```

## Touch targets and spacing

- Every target is ≥ 44×44 px and primary buttons are 48 px, with ≥ 8 px between neighbors. 24 px is the absolute floor (§L07, `audit: tap-target-size`, `audit: tap-target-spacing`).
- Make whole list and settings rows tappable, and wrap checkboxes and radios in their `<label>`. Inline links in paragraphs are exempt, but keep `line-height` ≥ 1.5.
- Acknowledge every tap within 100 ms with an `:active` style (§L06). If you remove `-webkit-tap-highlight-color`, replace it. `touch-action: manipulation` removes the double-tap delay without blocking pinch zoom.

```css
.list-row { min-height: 48px; display: flex; align-items: center; gap: 12px; padding-inline: 16px; }
.btn, .list-row { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.btn:active { transform: scale(.98); } .list-row:active { background: var(--surface-pressed); }
```

## No hover dependence

- Touch has no hover. Anything revealed on hover (row actions, menus, tooltips, card details) must also be reachable by tap and by keyboard focus (`lint: hover-only`). On touch, tooltips become a tappable info button or inline text.
- Gate hover styles so they don't stick after a tap. Hybrid devices (touch laptops, tablets with a trackpad) need both inputs to work.

```css
.row-actions { opacity: 1; }                                  /* touch default: always visible */
@media (hover: hover) and (pointer: fine) {
  .row-actions { opacity: 0; transition: opacity 150ms; }
  .row:hover .row-actions, .row:focus-within .row-actions { opacity: 1; }
}
```

## Keyboards: input types and autocomplete

The right attributes raise the right keyboard and let the browser autofill. That's the system doing the work, not the user (§L22, §L27).

| Field | Markup |
|---|---|
| Email | `type="email" autocomplete="email" spellcheck="false"` |
| Phone | `type="tel" autocomplete="tel"` |
| One-time code | `type="text" inputmode="numeric" autocomplete="one-time-code"` |
| Card number / expiry / CVC | `inputmode="numeric"` + `autocomplete="cc-number"` / `"cc-exp"` / `"cc-csc"` |
| Postcode | `autocomplete="postal-code"`. Add `inputmode="numeric"` only for digit-only countries, since UK and CA codes contain letters |
| Money amount | `type="text" inputmode="decimal"` |
| Search | `type="search" enterkeyhint="search"` |
| Name | `autocomplete="name"` (or `given-name` / `family-name`), `autocapitalize="words"` |
| Password | `type="password"` + `autocomplete="current-password"` (login) or `"new-password"` (sign-up) |
| Date of birth | `autocomplete="bday"`. Use three short fields or one text field with a format hint, because spinner pickers are slow for distant dates |

- Never use `type="number"` for card numbers, codes, postcodes or phones. It drops leading zeros, adds spinners and accepts `e`. Keep it for small quantities.
- `enterkeyhint` labels the Return key: `next` between fields, `done` or `go` on the last one, `search`, or `send` in chat. Add `autocapitalize="off"` to usernames and codes.
- **16 px or iOS zooms.** iOS Safari zooms in when a focused control's font is below 16 px and doesn't zoom back. Set `input, select, textarea { font-size: max(16px, 1rem); }` (`lint: input-font-small`, `audit: input-zoom`). Never "fix" it with `maximum-scale=1`.

## Viewport height: 100dvh vs 100vh

- On mobile, `100vh` is the *largest* viewport (toolbars hidden). A `100vh` element is taller than the visible area while the toolbars show, so bottom content and CTAs get cut off.
- `svh` is the smallest viewport, `lvh` the largest, and `dvh` follows the current state as toolbars move. Use `svh` for heroes and splash sections, which then stay stable and are never cut off. Use `dvh` for app shells, full-screen sheets and chat layouts that must fit exactly. Declare `vh` first as a fallback.
- None of these units shrink for the on-screen keyboard by default (see the next section).

```css
.app-shell { height: 100vh; height: 100dvh; }
.hero      { min-height: 100vh; min-height: 100svh; }         /* or simply let content size it */
```

## Virtual keyboard covering inputs

The keyboard covers roughly 40% of a phone screen. The browser scrolls the focused field into view, but sticky or fixed bars can still cover it.
- Keep the submit button in the flow at the end of the form, not only in a fixed bar. Give inputs `scroll-margin-block` equal to your sticky bars.
- Un-stick bottom bars while a field has focus: `body:has(:is(input, textarea, select):focus) .cta-bar { position: static; }`.
- Don't autofocus inputs on page load on mobile, because the keyboard then covers the content. A dedicated search screen is the exception.
- For composers that ride above the keyboard, use `visualViewport`. Chromium's `navigator.virtualKeyboard` plus `env(keyboard-inset-height)` is a progressive enhancement.

```js
const vv = window.visualViewport;
const sync = () => document.documentElement.style.setProperty(
  '--kb', `${Math.max(0, window.innerHeight - vv.height - vv.offsetTop)}px`);
vv?.addEventListener('resize', sync); vv?.addEventListener('scroll', sync);
// .composer { position: fixed; inset-inline: 0; bottom: var(--kb, 0px); }
```

## Scroll and overscroll

- Use one vertical scroller per screen, because nested scroll areas trap the thumb. `overscroll-behavior: contain` on sheets, drawers, chat logs and long dropdowns stops scroll chaining into the page and accidental pull-to-refresh.
- Set `scroll-padding-top` to the sticky header height so anchor jumps and focused fields don't land under it. Restore scroll position on Back, especially in long lists.
- Don't hijack scrolling (custom physics, full-page snap, scroll-bound parallax). Smooth scrolling only under `prefers-reduced-motion: no-preference` (§L08).
- The page never scrolls sideways at 360 px (`audit: horizontal-overflow`). The usual culprits are fixed widths, long URLs, wide tables and `100vw`, which includes the scrollbar.

```css
html { scroll-padding-top: 64px; }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
.rail { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding-inline: 16px; }
.rail > * { flex: 0 0 85%; scroll-snap-align: start; }        /* the 15% peek signals "more" */
```

## Gestures

- Every gesture needs a visible alternative. Swipe-to-delete pairs with a "⋯" menu or Edit mode. Pull-to-refresh pairs with a Refresh button or auto-refresh. Swipeable tabs are also tappable. A pinch-zoom map has +/− buttons.
- Leave the screen edges to the browser and OS (back and forward swipes). Gestures that destroy data need Undo (§L23). Long-press is invisible, so use it only as a shortcut to something that is also in a menu (§L20).
- Never block pinch zoom, and never put `touch-action: none` on large areas, because it kills scroll and zoom there.

## Performance on real phones

Speed is §L06, and your dev laptop hides the problem. Test with Chrome DevTools at 4× CPU slowdown and "Slow 4G" throttling, or on a real mid-range Android phone.
- Meet the Core Web Vitals "good" thresholds on mobile: LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1 (`audit: slow-paint`, `audit: layout-shift`).
- Images: serve AVIF/WebP sized to the slot with `srcset` + `sizes`, and always set `width`/`height` (`lint: image-no-dimensions`). Lazy-load below the fold (`loading="lazy" decoding="async"`), and never lazy-load the LCP image.
- JavaScript: ship less. Split code per route, defer third-party scripts, and break up tasks over 50 ms so taps get a response in < 100 ms.
- Fonts: WOFF2, ≤ 2 families, `font-display: swap`, a preloaded body font, and metric-matched fallbacks (`size-adjust`) so the swap doesn't shift layout. Virtualize long lists, or use `content-visibility: auto`.

```html
<img src="/img/hero-800.avif" srcset="/img/hero-480.avif 480w, /img/hero-800.avif 800w, /img/hero-1600.avif 1600w"
     sizes="(min-width: 1024px) 50vw, 100vw" width="1600" height="900"
     alt="Dashboard showing this month's sales" fetchpriority="high">
```

## Offline and flaky networks

- Treat slow and failed requests as normal. Time out after ~10–15 s (`fetch(url, { signal: AbortSignal.timeout(12_000) })`) and show an error with Retry, never an endless spinner.
- Show connection state in a non-blocking banner (`role="status"`): "You're offline. Showing saved data; changes will sync." Listen for `online`/`offline`, but trust failed requests over `navigator.onLine`, which reports true behind captive portals.
- Queue writes and sync them on reconnect, with idempotency keys so retries never double-submit. Back off exponentially with jitter (1 s, 2 s, 4 s…), then stop and tell the user.
- Persist form drafts in localStorage or IndexedDB so a dropped connection or a reload never erases typing (§L29). Mark cached content as possibly stale ("Last updated 10:42").

## PWA basics (optional)

- A PWA is worth it for apps people use often, not for one-off marketing sites. You need HTTPS, a manifest (`name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color`, 192 and 512 px icons plus a separate `"purpose": "maskable"` icon), `<link rel="apple-touch-icon">`, and a service worker that caches the app shell and recent data so launch works offline.
- Ask to install only after engagement: a custom button driven by `beforeinstallprompt` in Chromium. On iOS, explain Share → Add to Home Screen.
- Standalone mode has no browser Back button or URL bar. Provide in-app Back and a "Copy link" action, detected with `@media (display-mode: standalone)`.

## Responsive tables

Choose by the shape of the data (§L05):
- **Record lists** (orders, users): below md, render a card list. Each card has a title field, 2–4 label/value pairs and its primary action. Render a real list component, because changing `display` on table elements can strip table semantics in some browsers.
- **Comparison grids** (plan features, specs): keep the table and scroll it inside a labeled wrapper with a sticky first column.
- **Many columns of mixed priority:** hide low-priority columns below md and add a "Columns" toggle.

```html
<div class="table-scroll" role="region" aria-label="Plan comparison" tabindex="0"><table>…</table></div>
<style>
  .table-scroll { overflow-x: auto; overscroll-behavior-x: contain; }   /* the wrapper scrolls, never the page */
  .table-scroll :is(th, td):first-child { position: sticky; left: 0; z-index: 1; background: var(--surface); }
</style>
```

## Typography on small screens

- Body text is ≥ 16 px (17–18 px for reading-heavy pages) with a line-height of 1.5. At 360 px a line holds ~35–45 characters. That's fine; don't shrink text to fit more (§L05). Nothing goes below 12 px (`audit: text-too-small`).
- Size headings fluidly: an h1 is ~28–32 px on phones and wraps to ≤ 3 lines. No all-caps paragraphs.
- Stop iOS from inflating text in landscape with `text-size-adjust: 100%`. Never use `none`, which can block user text zoom. Break long words and URLs in user content with `overflow-wrap: anywhere`.

```css
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
h1 { font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem); line-height: 1.15; text-wrap: balance; }
.ugc { overflow-wrap: anywhere; hyphens: auto; }               /* hyphens need a correct lang attribute */
```

## Mobile QA checklist

Run `node <skill-dir>/scripts/uxl_audit.mjs <url>` (390×844), view the screenshots, then check on a real phone if you can.

- [ ] Viewport meta is present and pinch zoom works (`lint: viewport-missing`, `lint: zoom-disabled`)
- [ ] No horizontal page scroll at 360 px (`audit: horizontal-overflow`)
- [ ] Every target ≥ 44 px with ≥ 8 px gaps (`audit: tap-target-size`, `audit: tap-target-spacing`)
- [ ] The primary action is in thumb reach (sticky or at the end of the flow) and clear of the home indicator
- [ ] Nav is a 3–5 tab bar with labels, or a labeled "Menu" with the primary CTA outside it
- [ ] Nothing important is hover-only (`lint: hover-only`), and every gesture has a visible alternative
- [ ] Inputs are 16 px, raise the right keyboard and autofill (`audit: input-zoom`, `lint: autocomplete-missing`)
- [ ] Focused fields aren't hidden by the keyboard or sticky bars
- [ ] Full-height layouts use `svh`/`dvh`, and safe areas are respected in portrait and landscape
- [ ] Dialogs become sheets or full-screen views, close by button, Esc and Back, and the page behind doesn't scroll
- [ ] LCP ≤ 2.5 s and CLS ≤ 0.1 on a throttled mid-range profile (`audit: slow-paint`, `audit: layout-shift`)
- [ ] Offline and slow paths show Retry, no spinner runs forever, and drafts survive a reload
- [ ] Body text ≥ 16 px with contrast ≥ 4.5:1 (`audit: text-too-small`, `audit: contrast`)
- [ ] Tables become cards or scroll inside a labeled region
