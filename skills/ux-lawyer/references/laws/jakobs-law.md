---
id: L11
name: "Jakob's Law"
source: https://lawsofux.com/jakobs-law/
origin: "Jakob Nielsen (2000), 'End of Web Design' (Alertbox column), observing that users spend most of their time on other sites."
category: strategy
summary: "Users expect your site to work like the sites they already use, so follow established conventions and put originality into style."
applies_to: [headers, navigation, search, links, buttons, forms, checkout, icons, mobile navigation, redesigns]
rules:
  - "Logo top-left links home, search sits in the header, account and cart top-right. Mirror for RTL; never relocate them."
  - "Use native semantics: <a href> to navigate, <button> to act, underlined links in body text, real form inputs."
  - "Never break browser behavior: back button, Cmd/Ctrl-click, pinch zoom, find in page, text selection, native scroll."
  - "Be conventional in structure and interaction, distinctive in visual style and voice."
  - "Roll out big redesigns gradually: opt-in preview, staged release, temporary switch-back, hints only where things moved."
---

# Jakob's Law (L11)

## In plain words

People form their expectations of how a website works from all the other sites and apps they use, which is where they spend nearly all their time. When your site behaves like those, users carry their knowledge over and get on with the task. When it deviates, they have to stop and learn, and they usually blame the product rather than themselves.

Conventions are a shared vocabulary of placement, appearance, and behavior. This law is about patterns *across* products. How users understand *your* product's concepts and terms is [Mental Model](mental-model.md).

## Why it matters in a UI

- **Conventions are free usability.** A logo in the top-left, a magnifier for search, and a cart in the top-right need zero learning. Users look in those spots before they read anything.
- **Breaking one costs twice.** The user fails to find the thing, then starts distrusting the rest of the interface and slows down everywhere.
- **The browser and OS are conventions too.** Back, Cmd/Ctrl-click to open a new tab, pinch zoom, find in page, autofill, and copy link all work automatically with real elements. Custom JavaScript replacements usually break some of them.
- **Assistive tech depends on convention.** Semantic elements come with known roles and keys: Enter and Space on buttons, arrow keys in menus, Esc to close dialogs.
- **Your own old UI is a convention.** Regular users have habits on your product. A big-bang redesign breaks them all at once, even when the new design is better.

## Build it right

### Everywhere
1. **Header layout.** Logo top-left (top-right in RTL) linking to `/`. Primary nav across the top or down the left. Search in the header, as a visible input on content-heavy and e-commerce sites. Account, then cart with an item-count badge, top-right.
2. **Links look like links, buttons look like buttons.** Underline links in body text, with a distinct visited state where it helps. Buttons have fill or border and padding. Navigation is `<a href>`, actions are `<button>`.
3. **Standard forms.** Labels above fields, errors under the field, and mark the optional fields (or the required ones) consistently. Use proper `type` and `autocomplete` so autofill and password managers work. The primary button sits at the end. Checkout goes cart → shipping → payment → review.
4. **Standard icons, standard meanings.** Magnifier = search, × = close, gear = settings, trash = delete, three lines = menu, heart or star = favorite. Don't repurpose them, and label any icon less universal than these.
5. **Leave the browser alone.** Back returns to the previous view, including filters and full-page overlays (keep them in the URL). Deep links work, scrolling is native, zoom is allowed, Esc closes dialogs.
6. **Be conventional in structure, distinctive in style.** Put the brand into type, color, illustration, voice, and micro-interactions, not into where things live or how they behave.
7. **Change gradually.** For redesigns: offer an opt-in preview, then a staged rollout behind flags (e.g. 5% → 25% → 100%), then a time-limited "switch back" option, plus contextual hints only where things moved. Redirect old URLs, keep keyboard shortcuts, and compare task success before and after.

### Mobile
- **Bottom tab bar or hamburger?** Use a bottom tab bar (3–5 items) for app-like products where users switch sections often. A hamburger menu is acceptable on content sites with many sections and occasional navigation. Hidden navigation gets used less, so keep the top tasks visible on the page as well. Label the icon "Menu" if your audience is less tech-savvy.
- **Follow the host platform.** iOS users expect a back chevron top-left, edge-swipe back, and action sheets from the bottom. Android users expect the system back gesture to close the topmost sheet or dialog. In web apps and PWAs, push a history entry for full-screen overlays so system back closes them instead of leaving the page.
- **Native inputs.** Users expect the right keyboard and one-tap autofill: `type="email"`, `inputmode="numeric"`, `autocomplete="one-time-code"`.
- Pull-to-refresh belongs in feeds. A sticky header that hides on scroll down and returns on scroll up is a familiar, accepted pattern.

### Desktop
- **Top horizontal nav** for websites, **left sidebar** for apps with many sections, mega menus for large catalogs.
- **Keyboard conventions.** Tab follows reading order, Enter submits a form, Esc closes, `/` or Cmd/Ctrl+K opens search or a command palette in apps, Cmd/Ctrl+S saves in editors. Never hijack Cmd/Ctrl+F, Cmd/Ctrl-click, or right-click on ordinary content.
- **Dialog button order differs by OS.** macOS puts the primary action on the right. Windows lists it first ("OK, Cancel"). On the web, pick one order and use it everywhere; primary at the end (right) is the most common.
- **Hover feedback is expected.** Show `cursor: pointer` on clickables and tooltips on icon-only buttons, and add a visible hover state to every interactive element.

## Code patterns

```html
<header class="site-header">
  <a href="/" class="logo"><img src="/logo.svg" alt="Acme home" width="120" height="32"></a>
  <nav aria-label="Main">…</nav>
  <form role="search" action="/search" class="search">
    <label for="q" class="sr-only">Search</label>
    <input id="q" name="q" type="search" placeholder="Search products">
  </form>
  <a href="/account">Account</a>
  <a href="/cart">Cart <span class="badge">3</span><span class="sr-only"> items</span></a>
</header>
```

```css
.site-header { display: flex; align-items: center; gap: 1rem; }
.site-header .search { margin-inline-start: auto; }  /* logical property: flips correctly in RTL */
.prose a { text-decoration: underline; text-underline-offset: 0.15em; }
.prose a:visited { color: var(--link-visited); }
```

```jsx
// Breaks Cmd/Ctrl-click, middle-click, "Copy link", and the status-bar URL preview
<div onClick={() => router.push(`/orders/${id}`)}>View order</div>

// Keeps every browser convention (Next.js <Link> renders a real <a href>)
<Link href={`/orders/${id}`}>View order</Link>
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Logo missing, not top-left, or not linked home | manual: header logo `<img>`/`<svg>` not wrapped in `<a href="/">` | minor | Wrap in a home link, place top-left (top-right in RTL) |
| Clickable `div`/`span` used for navigation or actions | `lint: div-button` | major | `<a href>` for navigation, `<button>` for actions |
| Body-text links distinguished by color only | manual: grep `text-decoration: none` on `a` inside content areas | major | Underline links in running text |
| Browser behavior hijacked (zoom blocked, scroll-jacking, back trap) | `lint: zoom-disabled` · manual: grep `wheel` + `preventDefault`, `popstate` handlers, `history.pushState` on load | critical | Remove the override; use native scroll, zoom, and history |
| Hover-only menus or actions | `lint: hover-only` | major | Open on click or tap; mirror with `:focus-within` |
| Fields that defeat autofill and the expected keyboard | `lint: input-type-generic` · `lint: autocomplete-missing` | major | Correct `type`, `inputmode`, `autocomplete` |
| Standard icons repurposed (heart = add to cart, gear = profile) | manual: compare icon meanings against the conventions above | minor | Use the conventional glyph, add a text label |
| Big-bang redesign with no transition path | manual: check release notes, feature flags, old URL redirects | major | Opt-in preview, staged rollout, switch-back period, redirects |

## Tensions & trade-offs

- **vs. novelty and [Aesthetic-Usability](aesthetic-usability.md):** a novel layout impresses in a pitch and costs users every day. Innovate where your product is genuinely different, not on universal patterns.
- **vs. [Mental Model](mental-model.md):** domain tools have their own conventions (spreadsheets, IDEs, design tools). When your users come from that domain, its conventions beat general web ones.
- **vs. [Paradox of the Active User](active-user-paradox.md):** users won't read an explanation of your new pattern. They will apply old habits, so a novel pattern has to survive that.
- **vs. [Von Restorff](von-restorff.md):** make the key action distinctive, but it must still look like a button.

## Quick test

Could a first-time visitor find home, search, account, and cart, and use the back button, without a moment's thought? Anything that needed that moment breaks a convention.
