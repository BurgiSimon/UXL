---
id: L06
name: "Doherty Threshold"
source: https://lawsofux.com/doherty-threshold/
origin: "Walter J. Doherty & Ahrvind J. Thadani (1982), 'The Economic Value of Rapid Response Time' (IBM). Builds on Robert B. Miller (1968), 'Response time in man-computer conversational transactions'."
category: interaction
summary: "Acknowledge every input at once and respond in under 400ms; when you can't, show progress and keep the UI usable."
applies_to: [buttons, forms, search, navigation, data loading, images, animations, file uploads, lists, page load]
rules:
  - "Show visual feedback for every input within 100ms, and aim to complete the response within 400ms."
  - "Over ~1s, show a loading indicator. Over ~4–10s, show real progress (%, steps) and let people keep working."
  - "Use optimistic UI for actions that almost always succeed, and roll back with a clear message on failure."
  - "Meet Core Web Vitals at p75: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Reserve space for every image and embed."
  - "Never block input. Keep UI motion at 150–300ms and honor prefers-reduced-motion."
---

# Doherty Threshold (L06)

## In plain words

When a system answers quickly, people stay in a conversation with it: they try something, see the result, and try the next thing. When it hesitates, their attention drifts, they lose the thread, and they start to doubt whether the click registered. Doherty and Thadani's IBM work argued that bringing system response time under roughly 400ms lets users keep working at the speed of their own thinking instead of pausing between steps, and that this pays off in output.

The threshold is about *perceived* speed as much as measured speed. You can't always make the server faster, but you can always acknowledge the input immediately, show what's coming, and keep the interface usable while the real work finishes.

## Why it matters in a UI

- **Perception comes in bands.** Up to ~100ms a response feels instant and directly caused by the user. Under ~400ms people stay engaged. Around 1s they notice the wait and their train of thought starts to break. Past ~10s attention is gone and they switch tasks.
- **Silence looks like failure.** A button that shows nothing for 600ms gets clicked again: double submits, duplicate orders, extra requests.
- **Layout shift turns waiting into errors.** Content that jumps as images, fonts, or ads arrive moves targets under the finger, and people tap the wrong thing.
- **Slow input handling feels broken.** Laggy typing or a menu that opens 300ms after the tap makes the whole product feel heavy, even if pages load fast. INP measures exactly this.
- **Real devices are slower than yours.** A mid-range phone on a cellular network can be several times slower than a developer laptop on Wi-Fi. Budget for it.

## Build it right

### Everywhere
1. **Budget by band.** Acknowledge input (pressed state, focus, spinner start) within 100ms. Finish the interaction within 400ms where possible. Over 1s: loading indicator. Over ~4–10s: determinate progress (percent, step count, time remaining), plus cancel and the ability to keep working.
2. **Optimistic UI.** For actions that almost always succeed (like, star, rename, reorder, send a message), update the UI immediately and sync in the background. On failure, revert and say so, with a retry.
3. **Skeletons for content, spinners for actions.** Skeleton screens shaped like the real content (same dimensions) make the page feel underway and prevent shifts when data lands. Use small inline spinners for short, action-scoped waits.
4. **Start work early.** Prefetch likely next pages on hover, focus, or `pointerdown`. Give the LCP image `fetchpriority="high"`, `preconnect` to critical origins, and cache aggressively.
5. **Reserve space.** Every `<img>`, `<video>`, `<iframe>`, and ad slot gets `width`/`height` or `aspect-ratio`. Never insert banners above existing content after load. Use `font-display` and size-matched fallback fonts to limit text reflow.
6. **Never block input.** Debounce search-as-you-type by ~150–300ms, cancel stale requests with `AbortController`, and keep the field editable while fetching. Break JavaScript tasks longer than 50ms into chunks or move them to a Web Worker.
7. **Use motion that clarifies.** Transitions of 150–300ms (up to ~400ms for large surfaces) make state changes legible and can make short waits feel shorter. Never pad a fast result with fake delay, and wrap non-essential motion in `prefers-reduced-motion: no-preference`.

### Mobile
- Test with DevTools CPU 4× slowdown and a "Slow 4G" profile, or on a real mid-range Android phone. That is closer to many real users than your laptop.
- Keep the `width=device-width` viewport meta (`lint: viewport-missing`). It removes the legacy tap delay. Add `:active` styles so every tap shows a response at once.
- Touch has no hover: prefetch on `pointerdown` / `touchstart`, or when a link scrolls into view.
- Phone uploads are slow: show per-file determinate progress and let users keep filling the form while files upload.
- Infinite lists: append skeleton rows before data arrives, and restore scroll position on back navigation.

### Desktop
- Prefetch on hover after a short intent delay (~50–100ms) so you don't fetch every link the pointer crosses.
- Large tables: virtualize long lists, paginate or stream from the server, and render the first rows immediately.
- Long jobs (exports, imports, reports): run them in the background, show progress in a toast or status area, and notify when done. Don't lock the app behind a modal.
- Typing, shortcuts, and drag must feel instant. Input lag above ~100ms in an editor is noticeable and tiring.

## Code patterns

```jsx
// Optimistic toggle: respond now, sync later, roll back on failure
function LikeButton({ id, initial }) {
  const [liked, setLiked] = useState(initial);
  async function toggle() {
    const next = !liked;
    setLiked(next);                                  // instant feedback, no network wait
    try { await api.setLike(id, next); }
    catch { setLiked(!next); toast("Couldn't save your like. Try again."); }
  }
  return <button aria-pressed={liked} onClick={toggle}>{liked ? "Liked" : "Like"}</button>;
}
```

```html
<!-- Reserve space (CLS) and fetch the hero first (LCP) -->
<img src="/hero.avif" width="1200" height="600" alt="Team dashboard" fetchpriority="high">
<img src="/thumb.jpg" width="320" height="180" alt="Report preview" loading="lazy">
<div style="aspect-ratio: 16 / 9"><iframe src="https://example.com/embed" title="Product demo" loading="lazy"></iframe></div>
```

```css
/* Skeleton matches the real card's size; motion is short and optional */
.skeleton { block-size: 7.5rem; border-radius: 8px; background: var(--skeleton-bg); }
@media (prefers-reduced-motion: no-preference) {
  .skeleton { animation: pulse 1.2s ease-in-out infinite; }
  .panel { transition: transform 200ms ease-out, opacity 200ms ease-out; }
}
@keyframes pulse { 50% { opacity: .55; } }
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Async action with no pending state (button idle while the request runs) | `lint: async-no-feedback` | major | Pressed or loading state within 100ms; optimistic update where safe |
| Slow first paint, LCP > 2.5s | `audit: slow-paint` | major | Optimize the LCP image (size, format, `fetchpriority`), cut render-blocking CSS/JS, cache or server-render |
| Content shifts as images, fonts, or ads load (CLS > 0.1) | `audit: layout-shift` · `lint: image-no-dimensions` | major | `width`/`height` or `aspect-ratio`, reserved slots, size-matched font fallbacks |
| Routine transitions longer than ~400ms | `lint: slow-animation` | minor | 150–300ms; longer only for large surface changes |
| Animations ignore reduced-motion preference | `lint: reduced-motion-missing` | minor | Wrap in `@media (prefers-reduced-motion: no-preference)` |
| Long wait (> ~4s) with only a spinner and no way out | manual: throttle network; time uploads, exports, report generation | major | Determinate progress, background job, cancel button |
| Inputs frozen or disabled while fetching | manual: grep `disabled={loading}` on inputs; DevTools Performance shows long tasks > 50ms | major | Keep inputs live, debounce, abort stale requests, move work off the main thread |
| Full-page overlay spinner for a partial update | manual: trigger updates and look for overlays covering the whole page | minor | Skeleton or inline loader in the affected region only |

## Tensions & trade-offs

- **Optimistic UI vs. trust:** never fake success for payments, deletions, or anything irreversible. Show a real pending state there; a "Paid!" that later fails is the worst possible end ([Peak-End Rule](peak-end-rule.md)).
- **vs. [Occam's Razor](occams-razor.md):** skeletons, prefetching, and rollback logic add code. Apply them where waits are frequent or long, not to every interaction.
- **Instant can be invisible:** a change with no transition can go unnoticed. A short 150–300ms transition makes cause and effect clear, but motion must never become the wait ([Aesthetic-Usability](aesthetic-usability.md)).
- **vs. [Flow](flow.md):** speed alone doesn't create flow, but slowness reliably breaks it. Fix the waits users hit most often first ([Pareto Principle](pareto-principle.md)).

## Quick test

Throttle to Slow 4G with 4× CPU slowdown and use the main flow: does every tap visibly respond at once, and is there ever a moment where you wonder whether it worked?
