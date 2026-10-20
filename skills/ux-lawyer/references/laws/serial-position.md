---
id: L26
name: "Serial Position Effect"
source: https://lawsofux.com/serial-position-effect/
origin: "Hermann Ebbinghaus (1885), 'Über das Gedächtnis' (Memory). Primacy and recency curves measured by Bennet B. Murdock Jr. (1962), 'The serial position effect of free recall'."
category: cognition
summary: "People recall the first and last items in a sequence best, so put the most important items at the start and end, never the middle."
applies_to: [navigation, tab bars, menus, lists, search results, onboarding, link text, notifications, footers, settings]
rules:
  - "Rank items by importance before ordering them. Put #1 first, #2 last, and the least critical in the middle."
  - "Mobile tab bars: 3–5 tabs, with Home or the main destination first and Account or Profile last."
  - "Front-load labels: the first 1–2 words of a link, heading, button, or notification must carry the meaning."
  - "End every multi-step flow with a recap of what happened and what comes next. The last screen is what users carry away."
  - "Reorder in the DOM, not with CSS order or row-reverse, so visual, tab, and screen-reader order match."
---

# Serial Position Effect (L26)

## In plain words

In a list, people remember the first items (primacy) and the last items (recency) much better than those in the middle. Early items get more rehearsal and settle into long-term memory. The final items are still in working memory when the list ends. The middle gets neither advantage.

In a UI, a "list" is anything in sequence: a nav bar, a menu, search results, onboarding steps, the actions in a toolbar, even the words in a link. Position is a priority signal. Spend the first and last slots on what matters most, and let the middle hold what can afford to be forgotten.

## Why it matters in a UI

- **Returning users navigate from memory.** They recall the first and last nav items and look there first. A key section in the middle of the bar gets "lost" even though it's visible.
- **Attention fades down a list.** Users read the first items carefully and skim the rest, so the top of a results list or menu collects most of the clicks. People often pick the first plausible option.
- **Recency is fragile.** A short distraction of tens of seconds wipes it out. Anything needed at the end of a flow, like an order number or the next step, must be on screen at the end, not shown earlier.
- **The first item frames the rest.** The first onboarding screen or first result sets expectations for everything after it ([Cognitive Bias](cognitive-bias.md): anchoring).
- **The middle is cheap real estate.** It's fine for low-priority items and fatal for a feature you need people to find.

## Build it right

### Everywhere
1. **Rank before you order.** List nav items, menu options, and actions by importance, using analytics and top tasks ([Pareto Principle](pareto-principle.md)). Put #1 first and #2 last. The middle gets the rest.
2. **Front-load every label.** The first 1–2 words carry the meaning: "Shipping rates", not "Information about our shipping rates". This applies to headings, link text, buttons, email subjects, and notification titles.
3. **Order lists by relevance or frequency,** not by internal ID or creation date. The first 3 results should be the best matches. Show recently used items first in pickers and command palettes.
4. **Bookend long flows.** State the key promise at the start, and end with a recap (what happened, what's next, how to undo or get help). The ending is also the "end" users judge the whole experience by ([Peak-End Rule](peak-end-rule.md)).
5. **Shrink the middle.** Keep top-level nav to about 5–7 items. Split long lists into labeled groups ([Chunking](chunking.md)) so each group gets its own first and last positions.
6. **Order in the source.** Change the DOM or the data array, not CSS `order` or `row-reverse`. Visual, keyboard, and screen-reader order must match (WCAG 1.3.2, 2.4.3).
7. **Menus:** most-used actions at the top. Destructive actions at the bottom, separated by a divider.

### Mobile
- **Bottom tab bars hold 3–5 tabs** (both Apple and Material guidance). Home or the main destination goes first (leftmost), Account or Profile last (rightmost), which matches both memory and convention ([Jakob's Law](jakobs-law.md)). The center slot is easy to reach but least memorable. If a "Create" action lives there, isolate it visually ([Von Restorff](von-restorff.md)).
- **Drawers and hamburger menus** show only the first few items without scrolling. Key destinations go at the top, never below promos or account banners.
- **Onboarding:** aim for 3 screens or fewer. Put the core value on screen 1, because many users skip after it. Put the action (sign up, allow notifications) on the last one, and keep "Skip" always visible.
- **Push notifications and SMS truncate.** Put the key noun, number, or verb in the first few words.

### Desktop
- **Top nav:** the slot right after the logo gets the most important section. The far right is the "end" slot for the primary CTA and account. Utility items (blog, careers, press) go in the middle or the footer.
- **App sidebars:** most-used destinations at the top. Settings and Help sit at the bottom of the rail, which is both conventional and recency-friendly.
- **The footer is the page's recency slot.** Repeat the key CTA and the help/contact links there.
- **Tables:** users read the first columns most. Put the identifier and the key metric first and row actions last. In long settings pages, most-changed settings go first and the danger zone last.

## Code patterns

```jsx
// Order is a product decision: keep it in one ranked array, not scattered in markup.
const tabs = [
  { href: "/",        label: "Home",    icon: HomeIcon },   // first: primacy + convention
  { href: "/search",  label: "Search",  icon: SearchIcon },
  { href: "/orders",  label: "Orders",  icon: BoxIcon },    // middle: frequent, still easy to find
  { href: "/account", label: "Account", icon: UserIcon },   // last: recency + convention
]; // 3–5 tabs. Anything else goes under Account or a "More" tab.
```

```html
<nav aria-label="Main">
  <ul class="nav">
    <li><a href="/product">Product</a></li>                         <!-- #1: first slot -->
    <li><a href="/customers">Customers</a></li>
    <li><a href="/blog">Blog</a></li>                               <!-- lowest priority: middle -->
    <li><a href="/pricing">Pricing</a></li>                         <!-- #2: last text slot -->
    <li><a href="/signup" class="btn btn-primary">Start free</a></li> <!-- the end slot -->
  </ul>
</nav>
```

```css
/* Avoid: moves items visually but not for keyboard or screen-reader users */
.nav { display: flex; flex-direction: row-reverse; }
.nav .pricing { order: -1; }
/* Do: change the source order (or the ranked array) instead */
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Most-used destination buried in the middle of a long nav | `audit: nav-overload` · `lint: nav-overload` · manual: compare nav order with analytics | major | Rank by usage: #1 first, #2 last, trim to about 7 |
| Mobile tab bar with > 5 items, or Home not first | manual: count tabs at 390px; check the first and last items | major | 3–5 tabs, Home first, Account last, overflow into "More" |
| Visual order differs from DOM order | manual: grep `order:`, `row-reverse`, `column-reverse`; tab through the page | major | Reorder in the source |
| Labels that open with filler ("Click here to…", "Learn more about…") | `lint: generic-button-label` · manual: grep link text starting "Click", "Learn", "Read" | minor | Front-load the noun or verb |
| Long dropdown in arbitrary order | `lint: select-overload` | minor | Common options first, then alphabetical, or a searchable combobox |
| Onboarding with the key value mid-sequence, or > 5 slides | manual: walk the flow | minor | ≤ 3 screens: value first, action last, "Skip" visible |
| Flow ends without a recap (order number, next step) | manual: complete the flow and inspect the final screen | major | Confirmation page with summary and next action |
| Key items below promos in the mobile drawer | manual: open the menu at 390×844 and check what's visible without scrolling | major | Key destinations at the top of the drawer |

## Tensions & trade-offs

- **vs. [Fitts's Law](fitts-law.md):** on a bottom bar, the center is the easiest thumb target but the least memorable slot. It suits a high-frequency action that is also visually isolated ([Von Restorff](von-restorff.md)).
- **vs. [Jakob's Law](jakobs-law.md):** convention fixes some positions (logo first, account and cart last). Keep them, and place your ranked items around them.
- **vs. [Hick's Law](hicks-law.md) / [Miller's Law](millers-law.md):** reordering only helps up to a point. A long list has a big forgettable middle, so cut or group items rather than endlessly shuffling them.

## Quick test

Glance at the nav or list for 3 seconds, look away, and name what you saw. Are the items users need most among the ones you remembered?
