---
id: L03
name: "Chunking"
source: https://lawsofux.com/chunking/
origin: "George A. Miller (1956), 'The magical number seven, plus or minus two' (introduced 'chunks'); William G. Chase & Herbert A. Simon (1973), 'Perception in chess'."
category: cognition
summary: "Group related information into small, labeled units so users can scan, understand, and finish each piece before moving on."
applies_to: [forms, multi-step flows, checkout, long-form content, cards, settings, lists and feeds, number inputs, dashboards]
rules:
  - "Group related fields in a <fieldset> with a <legend>, one topic per group (contact, address, payment)."
  - "Split long forms into steps by topic, not by field count. Name each step and show progress ('Step 2 of 4: Delivery')."
  - "Put a descriptive heading every few paragraphs. Paragraphs run 2–4 sentences, one idea each."
  - "Format long numbers as users type (cards and IBANs in 4s) and accept pasted input with or without spaces."
  - "Every card in a set shares one anatomy: title, key fact, supporting detail, one primary action."
---

# Chunking (L03)

## In plain words

Chunking means grouping separate pieces of information into larger units that each carry meaning. Experts do it without thinking: chess masters recall real board positions as familiar patterns rather than as individual pieces, which is why they remember them far better than novices do. An interface can do this grouping for users by collecting related content, labeling each group, and separating groups visually.

A chunked screen lets people process one unit, set it aside, and move to the next. An unchunked one (a wall of text, a 25-field form, an undivided list) makes users do the grouping themselves, every time.

## Why it matters in a UI

- **Scanning needs anchors.** Most users scan before they read. Headings, labeled groups, and whitespace give the eye places to stop. A wall of text has none, so users skim past what they came for.
- **Groups make forms feel shorter.** Ten fields in three labeled groups read as three small tasks. The same ten in one column read as a chore, and users can't tell how far along they are.
- **Chunks are units of progress.** Finishing a section or step is a natural checkpoint. It feeds the [Goal-Gradient Effect](goal-gradient.md) and makes interruptions recoverable.
- **Structure is accessibility.** Screen-reader users navigate by headings, landmarks, and fieldset legends. Grouping shown only by spacing or borders doesn't exist for them.

## Build it right

### Everywhere
1. **Group form fields by topic.** A `<fieldset>` with a `<legend>` per group: Contact details, Delivery address, Payment. Short related fields can share a row (city + postcode, expiry + CVC).
2. **Cut multi-step flows by meaning.** One topic per step, in the order users think about it. Name steps, don't just number them. Back must keep input, and the flow ends on a review step ([Working Memory](working-memory.md)).
3. **Chunk content for scanning.** Descriptive `h2`/`h3` headings every few paragraphs, paragraphs of 2–4 sentences, bullets for parallel items, bold for the key phrase only. Put the important words first in headings and links.
4. **Format long numbers in place.** Insert spaces while users type card numbers (4-4-4-4, Amex 4-6-5) and IBANs (blocks of 4). Accept paste with or without separators and strip them before validating. For grouping long values for display, see [Miller's Law](millers-law.md).
5. **Give cards a fixed anatomy.** Every card in a set uses the same order: optional media, title, one or two key facts, one primary action. Users can then compare across cards instead of re-parsing each one.
6. **Separate chunks visibly.** Use more space between groups than within them ([Proximity](proximity.md)), or a shared container ([Common Region](common-region.md)). Pick one device per level, not borders on everything.
7. **Group long lists and feeds** by a key that matters to users (date: "Today", "Last week"; status; category; A–Z) with headers that stay visible.

### Mobile
- One chunk per screen: each step or fieldset becomes its own screen with a sticky "Continue". Aim for each step to fit above the open keyboard.
- Accordions suit long reference content (FAQs, specs). Keep the first section open, and never hide required form fields in a collapsed section.
- Sticky group headers (`position: sticky; top: 0`) keep the current chunk's label visible while scrolling long lists.
- Single-column forms. Pair fields side by side only when both are genuinely short (expiry + CVC).

### Desktop
- Wide screens can show a whole chunked flow at once: a step list in a sidebar, or every settings section on one page with an in-page table of contents that tracks scroll position.
- Keep each chunk in one column. A form that zig-zags across columns breaks reading order; independent sections in two columns are fine.
- Card grids: 3–4 columns at 1440px with equal card heights and actions aligned to the bottom, so the eye can scan across a row.

## Code patterns

```html
<form>
  <fieldset>
    <legend>Delivery address</legend>
    <label for="street">Address line 1</label>
    <input id="street" name="street" autocomplete="address-line1">
    <div class="row">
      <div><label for="city">City</label><input id="city" name="city" autocomplete="address-level2"></div>
      <div><label for="zip">Postcode</label><input id="zip" name="zip" autocomplete="postal-code"></div>
    </div>
  </fieldset>
  <fieldset>
    <legend>Payment</legend>
    <label for="cc">Card number</label>
    <input id="cc" name="cc" autocomplete="cc-number" inputmode="numeric">
  </fieldset>
</form>
```

```js
// Group card digits while typing: 4-4-4-4(-3), Amex 4-6-5. Paste with any separators works.
// Production: restore the caret position after reformatting, or use a tested masking library.
cc.addEventListener("input", (e) => {
  const digits = e.target.value.replace(/\D/g, "").slice(0, 19);
  const sizes = /^3[47]/.test(digits) ? [4, 6, 5] : [4, 4, 4, 4, 3];
  const out = []; let i = 0;
  for (const n of sizes) { if (i >= digits.length) break; out.push(digits.slice(i, (i += n))); }
  e.target.value = out.join(" ");
});
```

```css
/* More space between chunks than within them */
fieldset { border: 0; padding: 0; margin: 0 0 2rem; }
legend { font-weight: 600; margin-bottom: 0.75rem; }
.list-group > h3 { position: sticky; top: 0; background: var(--surface); }
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Long single-page form with no grouping | `lint: form-long` · `audit: form-load` | major | Fieldsets by topic; split into named steps |
| Visual groups with no semantic structure | manual: forms without `<fieldset`/`<legend`; groups built only from `div` + border | minor | `<fieldset>` + `<legend>`, or `role="group"` + `aria-labelledby` |
| Wall of text: long paragraphs, no subheads for a full screen | manual: screenshot at 390px; any viewport-height of text with no heading, list, or break | major | Headings, 2–4 sentence paragraphs, bullets |
| Missing or skipped heading levels | `audit: no-h1` · manual: `h2` → `h4` jumps; styled `div`s posing as headings | minor | One `h1`, then `h2`/`h3` in order |
| Long-number inputs that reject separators or don't format | `lint: strict-pattern` · `lint: input-type-generic` | major | Format while typing; strip spaces and dashes |
| Cards in one set with different anatomy or several competing actions | manual: compare cards in a grid screenshot; count buttons per card | minor | One card template; one primary action |
| Long list or feed with no grouping | manual: dozens of items with no group headers | minor | Group by date, status, or category; sticky headers |
| Steps cut by field count, mixing unrelated topics | manual: a step that combines, say, password and shipping | minor | Re-cut steps by topic |

## Tensions & trade-offs

- **vs. [Working Memory](working-memory.md):** every step boundary hides what came before. Carry a summary forward and end with a review.
- **vs. [Goal-Gradient](goal-gradient.md) and [Doherty Threshold](doherty-threshold.md):** many tiny steps feel like a long road, especially when each one loads. Prefer a few meaningful steps with instant transitions.
- **vs. [Common Region](common-region.md):** boxing every chunk produces nested-border clutter. Use spacing first; add containers only at the top level.
- **Collapsed content vs. find-in-page:** content hidden with `display: none` is invisible to Ctrl+F. Prefer `<details>` or `hidden="until-found"`, which some browsers expand on find, and keep reference content open on desktop.

## Quick test

Blur a screenshot of the screen. Can you count the groups and name each in two or three words? If you see one undivided mass, or a group you can't name, chunk it.
