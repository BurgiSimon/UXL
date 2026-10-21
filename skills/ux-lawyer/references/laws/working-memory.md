---
id: L29
name: "Working Memory"
source: https://lawsofux.com/working-memory/
origin: "Alan Baddeley & Graham Hitch (1974), 'Working memory', in The Psychology of Learning and Motivation, Vol. 8. Capacity of about 4 chunks: Nelson Cowan (2001)."
category: cognition
summary: "Never make users carry information between screens in their heads; keep what they need visible at the moment they need it."
applies_to: [forms, checkout, comparison tables, search, filters, multi-step flows, breadcrumbs, data tables, settings]
rules:
  - "If step B needs info from step A, show it on step B as a summary, recap, or side panel. Never rely on 'as shown earlier'."
  - "Prefer recognition over recall: pickers, suggestions, and recent items instead of typing from memory."
  - "Every input keeps a visible label while typing. A placeholder is never the only label."
  - "Persist filters, sort, selections, and scroll position across Back, refresh, and shared links."
  - "Show location on every deep or multi-step page: a clear h1, breadcrumbs, and 'Step 2 of 4: Shipping'."
---

# Working Memory (L29)

## In plain words

Working memory is the mental scratchpad people use to hold information while they act on it: the price on the last screen, the code from the SMS, the filter they just set. It is tiny, about four meaningful items, and fragile. What it holds fades within seconds once attention moves, and an interruption can wipe it.

Interfaces that depend on users holding something in their heads across a page change, a scroll, a modal, or a tab switch fail in predictable ways. The fix is nearly always the same: put the information on screen where it's needed, so users *recognize* it instead of having to *recall* it.

## Why it matters in a UI

- **Page changes erase context.** Comparing products across two tabs, or remembering a plan's price on the payment step, means juggling memory and screen. Users flip back and forth, or guess.
- **Recall is much harder than recognition.** Spotting "Zurich (ZRH)" in a list is easy; typing the airport code from memory is not. Recognition over recall is one of Jakob Nielsen's ten usability heuristics for this reason.
- **Vanishing labels cause errors.** When a placeholder disappears on the first keystroke, users must remember what the field asked for, or delete their input to check.
- **The web is full of interruptions.** Notifications, slow loads, consent banners, and app switches on mobile can each wipe what the user was holding.
- **Lost state punishes users twice.** Filters or form input lost on Back force users to rebuild, from memory, decisions they had already made.

## Build it right

### Everywhere
1. **Carry context forward.** In multi-step flows, show a running summary (plan, price, address) on later steps. The review step lists every value with an inline "Edit" link.
2. **Recognition over recall.** Offer pickers, autocomplete, recent searches, recently viewed items, and saved addresses. Set `autocomplete` tokens so the browser remembers for the user.
3. **Persistent labels.** A visible `<label>` that stays while typing. Floating labels are acceptable only if they stay readable after moving. Format hints go in helper text, not the placeholder.
4. **Keep state through navigation.** Put filters, sort, page, and active tab in the URL query so Back, refresh, and shared links restore them. Save form drafts against accidental navigation.
5. **Show selections, not counts.** Applied filters appear as removable chips above results. Bulk selections list what is selected. The row the user acted on stays highlighted afterward.
6. **Show location.** Breadcrumbs for hierarchies three or more levels deep, an `<h1>` that matches the link the user clicked, and named steps in flows.
7. **Compare side by side.** Pricing tiers and product specs belong in one table with aligned rows, not on separate pages or tabs.

### Mobile
- Less screen means less visible context, so compress it into persistent UI: a sticky summary bar ("2 items · €48.00") or a collapsible order summary at the top of checkout.
- Switching apps to copy a code is a memory trap. Use `autocomplete="one-time-code"` so iOS and Android offer the SMS code above the keyboard, and accept a pasted full code in split inputs.
- Comparison tables: scroll horizontally inside the table and pin the first column (`position: sticky; left: 0`) so row labels stay visible.
- Open filters in a bottom sheet that leaves results partly visible, and show the live result count on the apply button ("Show 128 results").

### Desktop
- Use the width for context: a sticky order summary beside checkout, and list + detail split views so users don't lose their place.
- Open details in a side panel, or restore the list's scroll position on Back.
- Tooltips vanish when the pointer moves. Never make them the only home for information users need to act on.
- Make headers sticky on long tables (`thead th { position: sticky; top: 0 }` when the page scrolls) so users don't have to remember which column is which.

## Code patterns

```html
<!-- Label stays visible; the format hint lives outside the placeholder -->
<label for="dob">Date of birth</label>
<p id="dob-hint" class="hint">For example, 27 03 1990</p>
<input id="dob" name="bday" autocomplete="bday" inputmode="numeric" aria-describedby="dob-hint">

<!-- Breadcrumbs: where am I, and how do I get back up? -->
<nav aria-label="Breadcrumb">
  <ol class="breadcrumbs">
    <li><a href="/shop">Shop</a></li>
    <li><a href="/shop/shoes">Shoes</a></li>
    <li><a href="/shop/shoes/running" aria-current="page">Running</a></li>
  </ol>
</nav>
```

```jsx
// Filters live in the URL, so Back, refresh, and share restore them. Chips show what's applied.
const [params, setParams] = useSearchParams();
const active = [...params.entries()].filter(([key]) => key !== "page");
const remove = (k, v) => { const next = new URLSearchParams(params); next.delete(k, v); setParams(next); };

<ul aria-label="Active filters" className="flex flex-wrap gap-2">
  {active.map(([k, v]) => (
    <li key={`${k}=${v}`}>
      <button onClick={() => remove(k, v)} aria-label={`Remove filter ${v}`}>{v} ×</button>
    </li>
  ))}
</ul>
```

```css
/* Mobile comparison table: row labels stay put while columns scroll */
.compare { overflow-x: auto; }
.compare th[scope="row"] { position: sticky; left: 0; background: var(--surface); }
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Placeholder used as the only label | `lint: placeholder-as-label` · `audit: unlabeled-input` | major | Visible `<label>`; hints in helper text |
| Inputs with no accessible label at all | `lint: input-unlabeled` · `audit: unlabeled-input` | critical | `<label for>` or a wrapping `<label>` |
| Later steps don't restate earlier choices (plan, price, address) | manual: walk the flow; on the final step, can you see every value you entered? | major | Running summary; review step with inline Edit |
| Filters, sort, or form input lost on Back or refresh | manual: filter, open an item, press Back; check that state is in the URL query | major | State in URL; restore scroll; persist drafts |
| Users must retype codes or values shown elsewhere | `lint: autocomplete-missing` · manual: OTP without `one-time-code`; grep `onPaste` + `preventDefault` | major | Autofill, allow paste, pickers, recent items |
| Comparison split across pages, or table headers scroll out of view | manual: screenshots of pricing/spec pages at 390px and 1440px | minor | One table; sticky header and first column |
| Deep page with no breadcrumbs or no `<h1>` | `audit: no-h1` · manual: 3+ levels deep with no `aria-label="Breadcrumb"` nav | minor | Breadcrumbs and a descriptive `<h1>` |
| Selections shown only as a count ("3 selected") | manual | minor | List or chip each selected item, each removable |

## Tensions & trade-offs

- **vs. [Cognitive Load](cognitive-load.md):** summaries, chips, and breadcrumbs add elements. Keep them compact and quiet; they should be glanced at, not read.
- **vs. [Chunking](chunking.md):** splitting a flow into steps lowers per-screen load but opens a gap between screens. Every split needs a carried-forward summary.
- **vs. [Occam's Razor](occams-razor.md):** labels hidden in icons or tooltips look cleaner but turn recognition into recall. Keep text labels for anything not universal.
- **Persistence vs. privacy:** remembered searches and drafts help memory but expose data on shared devices. Store drafts locally, offer "Clear", and never persist card data.

## Quick test

At each step, ask: "What does the user need to know right now that isn't on this screen?" If the answer is anything but "nothing", put it on the screen.
