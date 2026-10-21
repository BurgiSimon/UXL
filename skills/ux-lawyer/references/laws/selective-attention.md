---
id: L25
name: "Selective Attention"
source: https://lawsofux.com/selective-attention/
origin: "E. Colin Cherry (1953), cocktail-party listening experiments; Donald Broadbent (1958), 'Perception and Communication'. Related: change blindness (Rensink, O'Regan & Clark, 1997), inattentional blindness (Mack & Rock, 1998), banner blindness (Benway & Lane, 1998)."
category: perception
summary: "Users skip whatever looks irrelevant or ad-like and miss changes outside their focus, so put key info and feedback in their path."
applies_to: [banners, alerts, notifications, toasts, form errors, carousels, video, animation, badges, overlays]
rules:
  - "Never style essential content like an ad: no banner-shaped boxes, right-rail placement, or promo framing for key info."
  - "Show messages next to their cause: errors under the field, confirmations by the button, status on the changed row."
  - "No autoplay. Motion lasting > 5s needs pause/stop (WCAG 2.2.2). Wrap all non-essential motion in prefers-reduced-motion."
  - "Make every change visible at the point of focus: inline update, brief highlight, and role=status for screen readers."
  - "Show one banner or overlay at a time. Badges only for counts the user can act on, cleared once seen."
---

# Selective Attention (L25)

## In plain words

People can't process everything on a screen, so they filter. Attention goes to whatever seems relevant to the current goal, and the rest is suppressed, often without the user noticing they did it. Anything shaped or placed like an ad gets skipped. Things that change outside the focus point go unseen. And anything that moves pulls the eye whether the user wants it to or not.

Three well-studied failures matter in UI. **Banner blindness** is ignoring anything that looks promotional. **Change blindness** is missing an update that happens away from where you're looking, or during a visual interruption. **Inattentional blindness** is failing to see an unexpected element while focused on a task. Design so the important thing sits in the user's path and nothing irrelevant competes with it.

## Why it matters in a UI

- **Ad-like means invisible.** Boxed image banners, right-rail placement, and promotional styling are filtered out by habit. Eye-tracking studies keep finding that users skip them, even when the box holds the answer they came for.
- **Updates far from the focus point go unseen.** The cart count changes in the header while the user looks at "Add to cart". An error summary appears at the top while they're at the submit button. They conclude nothing happened and click again.
- **Motion captures attention involuntarily.** Peripheral movement drags the eye off the task. Autoplay carousels, looping video, and tickers tax everyone, and can make a page unusable for people with ADHD, vestibular disorders, or cognitive disabilities.
- **Habituation erodes alerts.** When every screen has a banner, badge, or red dot, users learn to tune them all out, including the one that matters.
- **Screen-reader users get no visual cue at all.** A change that isn't announced through a live region doesn't exist for them.

## Build it right

### Everywhere
1. **Make key content look like content.** Use the page's own typography, grid, and main column for anything essential. Keep it out of ad shapes (wide leaderboard strips, 300×250-style boxes), the right rail, and stock-photo promo frames.
2. **Put messages next to their cause.** Field errors go under the field, "Added" next to the button, status on the row that changed. Reserve global banners for global state (offline, maintenance, billing failure).
3. **Signal every change at the point of focus.** Update inline and briefly highlight the changed element (300–600ms). Move focus for blocking errors. Announce with `role="status"` (polite) or `role="alert"` (urgent).
4. **Spend motion only on feedback.** Animate in response to user actions or to show a state change. No autoplay carousels or video. Anything that moves, blinks, or scrolls for more than 5s needs pause, stop, or hide (WCAG 2.2.2). Nothing flashes more than 3 times per second (WCAG 2.3.1).
5. **Quiet the periphery during focused tasks.** In checkout, sign-up, payment, and editors, remove promos, cross-sell pop-ups, auto-opening chat, and secondary nav. A stripped-down checkout header is normal and expected.
6. **Ration attention grabbers.** Show one banner at a time, make it dismissible, and remember the dismissal. Use badges only for actionable counts. No sound unless the user opted in. Audio that autoplays for more than 3s must be stoppable (WCAG 1.4.2).

### Mobile
- The viewport *is* the focus area. A cookie bar, app-install banner, newsletter modal, and chat bubble stacked on a 390×844 screen can hide most of the content. Show at most one overlay, and defer the rest until after the user's first task, or drop them.
- Avoid full-screen interstitials on entry. They block the content the user tapped for, and Google Search has treated intrusive mobile interstitials as a negative signal since 2017.
- The on-screen keyboard covers the lower half of the screen. Bottom toasts and snackbars vanish behind it during form entry, so validate inline next to the field and scroll the invalid field into view.

### Desktop
- Wide screens push corners and the right rail into peripheral vision. Corner toasts are easy to miss while the user reads the main column, so use them only for non-critical confirmations. Anything that needs action stays inline or in a dialog.
- Peripheral motion pulls harder on large monitors. Keep animated sidebars, live tickers, and animated promos away from reading and form areas.
- When work finishes while the user is in another tab, update `document.title` (e.g. "(2) Inbox") or the favicon rather than playing a sound.

## Code patterns

```css
/* Motion is opt-in: animate only when the user hasn't asked for less */
@keyframes uxl-flash { from { background: var(--highlight); } to { background: transparent; } }

@media (prefers-reduced-motion: no-preference) {
  .just-updated { animation: uxl-flash 600ms ease-out; }   /* class added on change, removed after */
}
@media (prefers-reduced-motion: reduce) {
  .just-updated { outline: 2px solid var(--highlight); outline-offset: 2px; } /* static cue instead */
  html { scroll-behavior: auto; }
}
```

```jsx
// Feedback where the eyes already are, plus an announcement for screen readers.
// The live region is always rendered (empty), so the update is announced when the text changes.
<button onClick={addToCart}>Add to cart</button>
<p role="status" className="text-sm">{added ? `Added. Your cart has ${count} items.` : ""}</p>
```

```html
<!-- Media waits for the user: no autoplay, real controls, a poster frame -->
<video controls preload="metadata" poster="/demo-poster.jpg" width="1280" height="720">
  <source src="/demo.mp4" type="video/mp4">
</video>
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Autoplay carousel or background video | `lint: autoplay-carousel` · `audit: autoplay-media` | major | Static content, user-started media, visible pause control |
| Animation with no reduced-motion fallback | `lint: reduced-motion-missing` | major | Wrap in `@media (prefers-reduced-motion: no-preference)` |
| Essential info styled or placed like an ad | manual: boxed image banners in the right rail or between sections; ask "would I skip this?" | major | Restyle as page content in the main column, near the related task |
| Async result with no visible change where the user acted | `lint: async-no-feedback` · manual: no `role="status"` / `aria-live` near dynamic content | major | Inline confirmation, brief highlight, live region |
| Form errors shown only at the top or in a toast | manual: submit an invalid form at 390px and check what's in view | major | Error under each field, focus the first invalid field, linked summary |
| Several overlays stacked on mobile first load | manual: first-load screenshot at 390×844; count `position: fixed/sticky` layers | major | One at a time; defer or inline the rest |
| Content jumping under the user as things load | `audit: layout-shift` | major | Reserve space with dimensions or skeletons |
| Badges and red dots on most nav items | manual: count badges in the nav and tab bar | minor | Badge only actionable counts; clear when viewed |

## Tensions & trade-offs

- **vs. [Von Restorff](von-restorff.md):** isolation draws the eye, but push it too far (bright boxed panel, animation) and it reads as an ad and gets skipped. Make it distinct within the page's own visual language.
- **vs. [Aesthetic-Usability](aesthetic-usability.md):** hero videos and animated backgrounds look premium but cost attention, performance, and accessibility. Offer a play button instead.
- **vs. [Doherty Threshold](doherty-threshold.md):** short motion makes feedback feel fast. Keep it brief, tied to user actions, and reduced-motion safe.
- **vs. [Goal-Gradient](goal-gradient.md) / [Zeigarnik](zeigarnik-effect.md):** progress nudges and "unfinished" badges also compete for attention. Ration them like any alert.

## Quick test

If the user ignored everything that looks like an ad or moves on its own, would they still find what they came for and notice what just changed?
