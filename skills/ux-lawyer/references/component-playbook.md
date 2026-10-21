# Component playbook

Law-backed specs for the components and patterns you build most often. Each section lists the **Laws** that matter most, a numeric **Spec**, and the **Common failures** agents ship. In Build mode, read the section before writing the component. In Audit mode, use it as the checklist. Numbers follow the statutes in [SKILL.md](../SKILL.md). If the project's design system defines a value, use that value unless it breaks a statute, and say so (§L11 Jakob's Law).

Breakpoints are sm 640, md 768, lg 1024 and xl 1280. "Mobile" means below 640 px and "desktop" means 1024 px and up, unless a section says otherwise. Platform depth lives in [platform-mobile.md](platform-mobile.md) and [platform-desktop.md](platform-desktop.md).

## Contents

1. [Global navigation](#global-navigation)
2. [Hero and above the fold](#hero-and-above-the-fold)
3. [Calls to action and button hierarchy](#calls-to-action-and-button-hierarchy)
4. [Forms](#forms)
5. [Sign-up, login and auth](#sign-up-login-and-auth)
6. [Checkout and payment](#checkout-and-payment)
7. [Pricing page](#pricing-page)
8. [Search and autocomplete](#search-and-autocomplete)
9. [Filters and sorting](#filters-and-sorting)
10. [Data tables](#data-tables)
11. [Dashboards and analytics](#dashboards-and-analytics)
12. [Cards and grids](#cards-and-grids)
13. [Modals, dialogs and bottom sheets](#modals-dialogs-and-bottom-sheets)
14. [Toasts and notifications](#toasts-and-notifications)
15. [Onboarding and first run](#onboarding-and-first-run)
16. [Empty states](#empty-states)
17. [Errors](#errors)
18. [Loading states](#loading-states)
19. [Settings pages](#settings-pages)
20. [Multi-step wizards](#multi-step-wizards)
21. [Landing page section order](#landing-page-section-order)
22. [Footer](#footer)
23. [Content and article pages](#content-and-article-pages)
24. [Media and carousels](#media-and-carousels)
25. [Destructive actions](#destructive-actions)

---

## Global navigation

**Laws:** [§L11 Jakob's Law](laws/jakobs-law.md) · [§L10 Hick's Law](laws/hicks-law.md) · [§L07 Fitts's Law](laws/fitts-law.md) · [§L26 Serial Position](laws/serial-position.md)

**Spec**
- Header: put the logo top-left and link it home. Use ≤ 7 top-level items, with search, account and cart top-right and one CTA ("Sign up") rightmost. Height 56–64 px, which can stay sticky.
- Order items by importance: the most-used destination first and the second most important last (§L26). Label them in the user's words ("Pricing", not "Monetization").
- Mark the current page with `aria-current="page"` plus a cue that isn't color (underline, weight, indicator bar). Add breadcrumbs for hierarchies deeper than 2 levels. Make "Skip to main content" the first focusable element.
- App sidebar (≥ lg): 240–280 px expanded or a 64–72 px collapsed rail. Group items under ≤ 5 headings. Collapsed icons get a tooltip and an `aria-label`. Persist the collapse state.
- Mobile app: a bottom tab bar with 3–5 destinations, an icon **and** a text label on every tab, 56 px tall plus `env(safe-area-inset-bottom)`. Re-tapping the active tab scrolls to the top.
- Hamburger: use it for content and marketing sites with > 5 sections, or for secondary items. Label it "Menu", and keep the primary CTA and search outside it. Open a full-height drawer with contained focus, Esc to close and a 44 px close button.
- Desktop dropdowns open on click (or on hover with an intent delay) and work by keyboard. See [platform-desktop.md](platform-desktop.md#mega-menus-and-dropdowns).

**Common failures**
- 8–12 top-level items, or vague buckets ("Solutions", "Platform", "Resources") hiding the two pages people want (`lint: nav-overload`, `audit: nav-overload`).
- A hamburger at 1440 px hiding everything, icon-only tab bars, or a "More" tab hiding a core feature.
- Hover-only menus that do nothing on touch (`lint: hover-only`), or a logo that doesn't link home.
- A sticky header, cookie bar and promo banner that together cover a quarter of a 390×844 screen.

## Hero and above the fold

**Laws:** [§L25 Selective Attention](laws/selective-attention.md) · [§L28 Von Restorff](laws/von-restorff.md) · [§L05 Cognitive Load](laws/cognitive-load.md) · [§L06 Doherty Threshold](laws/doherty-threshold.md) · [§L17 Mental Model](laws/mental-model.md)

**Spec**
- Within 5 seconds a first-time visitor must know what this is, who it's for and what to do next. Write a headline of ≤ ~10 words about the outcome and a subhead of 1–2 sentences (≤ ~25 words) about how.
- Show one primary CTA (accent fill) and at most one quieter secondary ("See how it works"). Both must be visible without scrolling at 390×844 and at 1440×900.
- Show the real product (a screenshot, short demo or live widget), not abstract stock art.
- Headline `font-size: clamp(2rem, 1.2rem + 3.5vw, 4rem)`, ≤ 3 lines on mobile. Subhead 18–20 px.
- Mobile: put text and CTA first, with the visual below or cropped. Don't force `height: 100vh`, which pushes the CTA down and jumps as browser toolbars hide. Let content set the height, or use `100svh`.
- The hero image is usually the LCP element. Give it `fetchpriority="high"`, never `loading="lazy"`, set `width`/`height`, and serve AVIF/WebP via `srcset`. Target LCP ≤ 2.5 s on a mid-range phone.
- Text over imagery needs ≥ 4.5:1 contrast. Add a scrim (`linear-gradient(rgb(0 0 0 / .55), transparent)`) or keep text off the image.
- Put a trust strip directly below (customer logos, rating, real usage numbers only), muted so it doesn't compete.

**Common failures**
- A clever but vague headline ("Reimagine what's possible"), or three or more equal CTAs (`audit: cta-competition`, `lint: multiple-primary-cta`).
- A rotating hero slider (`lint: autoplay-carousel`), or background video with no pause control.
- A hero image without dimensions that shifts the layout (`lint: image-no-dimensions`, `audit: layout-shift`), or text baked into images.

## Calls to action and button hierarchy

**Laws:** [§L28 Von Restorff](laws/von-restorff.md) · [§L10 Hick's Law](laws/hicks-law.md) · [§L07 Fitts's Law](laws/fitts-law.md) · [§L15 Law of Similarity](laws/similarity.md) · [§L17 Mental Model](laws/mental-model.md)

**Spec**
- Use four levels consistently: **primary** (solid accent, one per view), **secondary** (outline or tonal), **tertiary** (text button) and **destructive** (red, kept apart from the primary).
- Write labels as a verb plus an object, 1–3 words, naming the outcome: "Create project", "Pay $48.20", "Save changes". Never "Submit", "OK" or "Click here" (`lint: generic-button-label`).
- Size: `min-height: 44px` and `padding-inline: 16px–24px`. On mobile, a primary that ends a flow is full-width and 48 px tall.
- Order: pick one and keep it everywhere. On desktop, right-align dialog and form actions with the primary rightmost, unless the design system says otherwise. On mobile, stack full-width with the primary nearest the thumb (the bottom of a sticky bar).
- States: default, hover (pointer devices only), a `:focus-visible` ring, pressed within 100 ms, loading (spinner inside the button, label "Saving…", width locked, repeat presses ignored), success, and rarely disabled.
- Use `<button>` for actions and `<a href>` for navigation (`lint: div-button`). The label needs 4.5:1 contrast and the button edge 3:1 against its background.
- Give the same action the same label across the page and the flow ("Start free trial" everywhere).

**Common failures**
- Two or more solid accent buttons side by side, or a destructive action styled exactly like the primary.
- No pending state, so users double-submit (`lint: async-no-feedback`). A disabled submit used as validation (`lint: disabled-submit`).
- Ghost buttons on photos with < 3:1 edge contrast (`audit: contrast`).

## Forms

**Laws:** [§L24 Postel's Law](laws/postels-law.md) · [§L22 Parkinson's Law](laws/parkinsons-law.md) · [§L27 Tesler's Law](laws/teslers-law.md) · [§L03 Chunking](laws/chunking.md) · [§L29 Working Memory](laws/working-memory.md)

**Spec**
- Single column with labels above inputs. Spacing: 4–8 px from label to input, 16–24 px between fields, 32–48 px between `<fieldset>` groups (each with a `<legend>`).
- Inputs ≥ 44 px tall (48 px is comfortable on mobile) with `font-size` ≥ 16 px. On desktop, width hints the expected length (a postcode is ~8ch wide). On mobile, inputs are full-width.
- Ask only what the task needs. Mark the minority: "(optional)" when most fields are required.
- Every field gets a correct `type`, `inputmode`, `autocomplete` and `name`. See the [keyboard table](platform-mobile.md#keyboards-input-types-and-autocomplete). Normalize spaces, dashes and case yourself, and avoid rigid `pattern`. Help text stays below the label (`aria-describedby`), and placeholders show an example only.
- Validate on blur, once the user has typed, or on submit. Once a field shows an error, re-validate on input so the message clears as soon as it's fixed.
- On a submit with errors, keep every value. Show a summary at the top (`role="alert"`, linking to each field) and move focus to it or to the first invalid field.
- Put the submit button directly after the last field, with a verb label. Never disable it, and let Enter submit.
- More than ~6–8 fields means steps ([Multi-step wizards](#multi-step-wizards)). Save drafts of long forms to localStorage or the server.

**Common failures**
- Placeholder used as the label (`lint: placeholder-as-label`, `audit: unlabeled-input`), or two-column layouts for unrelated fields.
- An error on the first keystroke ("Invalid email" after "s"), or the form wiped after a server error.
- Missing `autocomplete` or a generic `type="text"` (`lint: autocomplete-missing`, `lint: input-type-generic`), or 14 px inputs that zoom on iOS (`audit: input-zoom`).
- A long form with no steps (`lint: form-long`, `audit: form-load`).

## Sign-up, login and auth

**Laws:** [§L22 Parkinson's Law](laws/parkinsons-law.md) · [§L27 Tesler's Law](laws/teslers-law.md) · [§L11 Jakob's Law](laws/jakobs-law.md) · [§L24 Postel's Law](laws/postels-law.md) · [§L23 Peak-End Rule](laws/peak-end-rule.md)

**Spec**
- Sign-up asks for the minimum: email plus password, or a passkey, magic link or SSO. Collect name, company and role after the user has seen value.
- SSO ("Continue with Google / Apple / Microsoft") comes first, full-width and equal-sized, following each provider's brand rules. Then an "or" divider, then email.
- Email: `type="email" autocomplete="email"`. Trim and lowercase before comparing, and suggest fixes for typos ("Did you mean gmail.com?").
- Passwords: `autocomplete="new-password"` on sign-up and `current-password` on login. Add a 44 px show/hide toggle, show the requirements as a live checklist before typing, allow paste, and skip the "confirm password" field. Follow NIST SP 800-63B: length over composition rules, allow ≥ 64 characters, and check against breached-password lists.
- Login: the identifier field is `autocomplete="username"` (`username webauthn` for passkey autofill). Put "Forgot password?" next to the password label, not after the button. Keep the email filled after a failed attempt.
- One-time codes: use one input with `autocomplete="one-time-code" inputmode="numeric"`. Accept pasted codes with spaces, submit at full length, and offer "Resend" with a visible 30–60 s countdown.
- Cross-link the two screens ("Already have an account? Log in"). Errors read "Email or password is incorrect" (don't reveal which), and lockouts say when the user can try again.
- After sign-up, land on a first-run screen with one next step ([Onboarding](#onboarding-and-first-run)), not an empty dashboard.

**Common failures**
- "Confirm email" and "Confirm password" fields, blocked paste, or rules revealed only after a failure.
- Six separate OTP boxes that break paste and SMS autofill, or a CAPTCHA shown to everyone up front.
- Forced account creation before a purchase or before any value.

## Checkout and payment

**Laws:** [§L22 Parkinson's Law](laws/parkinsons-law.md) · [§L27 Tesler's Law](laws/teslers-law.md) · [§L09 Goal-Gradient](laws/goal-gradient.md) · [§L04 Cognitive Bias](laws/cognitive-bias.md) · [§L06 Doherty Threshold](laws/doherty-threshold.md) · [§L23 Peak-End Rule](laws/peak-end-rule.md)

**Spec**
- Guest checkout is the default. Offer "Save your details: set a password" on the confirmation page.
- Express wallets (Apple Pay, Google Pay, PayPal) go at the top. Then use ≤ 3 steps (Contact & shipping → Payment → Review) or one page of labeled sections, with "Step 2 of 3".
- Keep the order summary visible: a right column at ≥ lg. On mobile, a collapsible "Show order summary · $48.20" bar at the top plus a sticky bottom bar with the total and the primary action. Show the full total (shipping, tax, fees) as soon as you can calculate it, and never add a new charge on the last step.
- Address fields use section tokens (`autocomplete="shipping street-address"`, `shipping postal-code`, `shipping country`) and address lookup. "Billing same as shipping" is checked by default.
- Card: `inputmode="numeric" autocomplete="cc-number"`, auto-grouped as `4242 4242 4242 4242`, with the brand detected from the leading digits. Expiry is one `MM / YY` field (`cc-exp`), CVC is `cc-csc`. Prefer the processor's hosted fields, which keep autofill working.
- The pay button states the amount ("Pay $48.20"). On press, show the pressed state in < 100 ms, then a spinner with "Processing…". Block repeat presses and send an idempotency key.
- On a decline, say what happened, keep every other field, focus the payment section and suggest another method.
- Hide the promo code behind a quiet "Add promo code" link so people don't leave to hunt for codes.
- Confirmation shows the order number, the items, a delivery estimate, "Receipt sent to ana@…" and one next action ("Track order").

**Common failures**
- Forced registration, fees revealed on the last step, or pre-checked insurance or donation add-ons (§L04 dark pattern).
- A pay button that gives no feedback for 3+ seconds, or a cart or form cleared after a decline.
- Split card-number boxes that defeat autofill, or loud "secure" badges in place of a short plain note.

## Pricing page

**Laws:** [§L02 Choice Overload](laws/choice-overload.md) · [§L04 Cognitive Bias](laws/cognitive-bias.md) · [§L28 Von Restorff](laws/von-restorff.md) · [§L03 Chunking](laws/chunking.md) · [§L26 Serial Position](laws/serial-position.md)

**Spec**
- Offer 3–4 tiers, plus an optional "Enterprise · Contact sales" strip. Highlight exactly one as "Most popular" or "Recommended" with a badge, an accent border and a filled CTA. The other tiers get secondary CTAs.
- Each card follows this order: plan name, who it's for (one line), price with unit ("$12 /user/month"), billing note, CTA, then 4–6 differentiators under "Everything in Starter, plus:".
- Put the monthly/annual toggle next to the cards. Show the saving as a concrete figure ("Save $48 a year"). If annual is the default, put "billed annually ($144)" next to the price.
- Below the cards, add a full comparison table grouped into 4–8 categories, with a sticky plan header and ✓ / — marks that carry visually hidden text ("Included", "Not included").
- Add an FAQ of 5–8 items covering billing, trial, cancellation, refunds and data.
- Mobile: stack the cards in the desktop order, and keep the highlighted plan within the first two screens. The comparison table becomes a plan picker (segmented control) or a scroll container with a sticky feature column.
- Make the currency and tax treatment explicit ("excl. VAT").

**Common failures**
- 5+ tiers, every tier highlighted, or 15+ bullets per card.
- Invented "was $99" strikethroughs, countdown timers or "only 3 spots left" (§L04 dark pattern).
- Hidden annual billing, or a comparison table that overflows the page at 390 px (`audit: horizontal-overflow`).

## Search and autocomplete

**Laws:** [§L11 Jakob's Law](laws/jakobs-law.md) · [§L06 Doherty Threshold](laws/doherty-threshold.md) · [§L24 Postel's Law](laws/postels-law.md) · [§L29 Working Memory](laws/working-memory.md) · [§L10 Hick's Law](laws/hicks-law.md)

**Spec**
- Desktop: a visible field in the header, ≥ ~240 px wide, with a "/" or ⌘K hint.
- Mobile: a 44 px search icon opens a full-screen search view with the input focused, `type="search" enterkeyhint="search"`, and a "Cancel" button.
- Show suggestions after 1–2 characters, debounced by 150–250 ms. Abort stale requests (`AbortController`), and render within 400 ms. Show ≤ 8–10 suggestions, grouped (Products, Categories, Help), with the matching part emphasized.
- When focused and empty, show recent searches (clearable) and popular queries, so people recognize instead of recall (§L29).
- Follow the combobox ARIA pattern: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`. ↑/↓ move, Enter picks, Esc closes.
- Be forgiving with typos, plurals, synonyms, case, accents and extra spaces (§L24).
- Results page: keep the query in the input and the URL (`?q=`). Show the result count, sort and filters, and highlight matched terms.
- Zero results: repeat the query, offer "Did you mean …", relax filters in one tap, and show popular categories.

**Common failures**
- Icon-only search on desktop, or exact-match-only results.
- Late responses overwriting newer ones, or suggestions unreachable by keyboard.
- A blank page for zero results, or the query cleared after searching.

## Filters and sorting

**Laws:** [§L02 Choice Overload](laws/choice-overload.md) · [§L10 Hick's Law](laws/hicks-law.md) · [§L03 Chunking](laws/chunking.md) · [§L06 Doherty Threshold](laws/doherty-threshold.md) · [§L29 Working Memory](laws/working-memory.md)

**Spec**
- Desktop (≥ lg): a persistent filter column on the left, 240–280 px wide, with results to the right. Mobile: a sticky bar above the results with "Filters (2)" and "Sort" buttons that open a bottom or full-screen sheet.
- Order facets by use (category, price, size, brand…). Expand the top 3–5 and collapse the rest. A facet with > 10 values shows 5–8 of them, "Show all 32", and a search field inside the facet.
- Show the result count next to each option. Hide or disable options that return zero results.
- Desktop applies changes instantly: results update in < 400 ms, or the results area alone shows loading, and scroll position stays put. Mobile batches changes in the sheet and applies them with "Show 124 results" (a live count).
- Show applied filters as removable chips above the results, plus "Clear all".
- Price: two numeric inputs with an optional range slider. A slider alone is imprecise on touch.
- Sort: one control ("Sort: Relevance") with ≤ 6 options. Default to relevance or featured.
- Encode filters, sort and page in the URL so Back, refresh and shared links restore the view.

**Common failures**
- Back wipes the filters, or every checkbox triggers a full page reload.
- No summary of applied filters, so users forget why the results are thin.
- Zero-result combinations with no "Clear filters" way out, or desktop filters hidden behind a button.

## Data tables

**Laws:** [§L05 Cognitive Load](laws/cognitive-load.md) · [§L03 Chunking](laws/chunking.md) · [§L13 Law of Proximity](laws/proximity.md) · [§L15 Law of Similarity](laws/similarity.md) · [§L07 Fitts's Law](laws/fitts-law.md)

**Spec**
- Use a real `<table>` with `<th scope="col">` and a `<caption>` (it can be visually hidden). Left-align text. Right-align numbers with `font-variant-numeric: tabular-nums`, consistent decimals, and units in the header ("Revenue (USD)").
- Rows are 44–48 px. An opt-in compact density (32–36 px) is only for desktop pointer users and never goes below the 24 px floor.
- Make the header sticky. Sortable headers are buttons with `aria-sort` and a direction arrow.
- A row click opens the item. Secondary actions go in a "⋯" menu (44 px hit area) at the row end. Selecting rows reveals a bulk bar ("3 selected · Archive · Delete").
- Beyond ~50–100 rows, paginate (25 / 50 / 100 per page, with the total shown) or virtualize. Keep sort, filters and page in the URL.
- Truncate long text with an ellipsis and show the full value on hover and focus. Never truncate IDs or amounts.
- States: skeleton rows that match the columns, an empty state inside the table body, and an inline error with Retry.
- Below md (768 px), transform the table. For record lists, (a) use a card list with a title field and 2–4 label/value pairs. For comparison data, (b) scroll the table in a wrapper with a sticky first column. (c) Hide low-priority columns behind "Columns". The page body never scrolls sideways. See [mobile](platform-mobile.md#responsive-tables) and [desktop](platform-desktop.md#wide-data-tables).

**Common failures**
- `<div>` grids with no table semantics, or left-aligned numbers.
- A table overflowing the page at 390 px (`audit: horizontal-overflow`), or 12 px cell text (`audit: text-too-small`).
- Icon-only row actions without labels or tooltips.

## Dashboards and analytics

**Laws:** [§L21 Pareto Principle](laws/pareto-principle.md) · [§L18 Miller's Law](laws/millers-law.md) · [§L25 Selective Attention](laws/selective-attention.md) · [§L03 Chunking](laws/chunking.md) · [§L06 Doherty Threshold](laws/doherty-threshold.md)

**Spec**
- Design for the 1–3 questions users open the dashboard to answer. Lead with ≤ 4–5 KPI tiles. Each tile has a label, a value and a delta with its comparison period ("+12% vs prior 30 days"). Show direction with an arrow plus color, never color alone.
- Put the most important widget top-left, and push detail and long tables lower.
- Global controls (date range, segment, compare) go top-right and apply to every widget. Print the active range as text ("1–30 Sep 2026").
- One widget answers one question, and its title names that question or metric. Use lines for trends and bars for comparisons. No pie with > 5 slices, no 3D, and ≤ 5–7 series per chart. Label lines directly instead of using a distant legend.
- Format numbers for scanning (12.4k, $1.2M), with full precision on hover and focus. KPI tiles drill down into a filtered detail view, and filters live in the URL.
- Each widget loads, fails and retries on its own, with its own skeleton. Show "Updated 2 min ago".
- When there's no data, say what will appear and which action produces it ("Connect your store to see sales").
- Mobile: KPIs in a 2-column grid, then one key chart. Charts use tap-to-inspect instead of hover, and tables become lists.

**Common failures**
- 10+ KPI tiles of equal weight, or numbers with no comparison or period.
- One full-page spinner that waits for the slowest query.
- Hover-only tooltips (`lint: hover-only`), or a decorative rainbow palette (`audit: color-sprawl`).

## Cards and grids

**Laws:** [§L12 Law of Common Region](laws/common-region.md) · [§L13 Law of Proximity](laws/proximity.md) · [§L15 Law of Similarity](laws/similarity.md) · [§L14 Law of Prägnanz](laws/pragnanz.md) · [§L07 Fitts's Law](laws/fitts-law.md)

**Spec**
- One card holds one object, with the same anatomy across the grid: media, title, 1–2 meta lines and an optional action.
- Grid: `grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr))`, with a 16 px gap on mobile and 24 px on desktop. That gives roughly 1 column at 360 px, 2 at ≥ 640, 3 at ≥ 1024 and 4 at ≥ 1280.
- Card padding is 16 px on mobile and 24 px on desktop. Space inside a card is smaller than the gap between cards (§L13).
- Media uses a fixed `aspect-ratio` (16/9, 4/3 or 1/1) with `object-fit: cover`, plus `width` and `height` attributes.
- Clamp titles to 2 lines (`-webkit-line-clamp: 2`, or Tailwind `line-clamp-2`) so rows line up.
- A card with one destination is fully clickable through a stretched link (see [Fitts's Law](laws/fitts-law.md#code-patterns)). Nested buttons sit above it with `position: relative; z-index: 1` and their own 44 px hit areas.
- Use one boundary treatment: a border, a shadow or a tinted background, not all three.
- On desktop, hover gives a small lift or border-color change (150–200 ms), and the same cue appears on `:focus-visible`.

**Common failures**
- Cards that look clickable and aren't, or that are clickable only on the title.
- Cards nested in cards, or ragged heights from unclamped titles.
- Cards used for content that is really a list or prose.

## Modals, dialogs and bottom sheets

**Laws:** [§L08 Flow](laws/flow.md) · [§L07 Fitts's Law](laws/fitts-law.md) · [§L11 Jakob's Law](laws/jakobs-law.md) · [§L05 Cognitive Load](laws/cognitive-load.md)

**Spec**
- Use a modal only for a short, focused task or a decision that blocks progress. Everything else goes inline, in a side panel or on its own page.
- Prefer a native `<dialog>` opened with `showModal()`, which gives contained focus, Esc, the top layer and an inert background, or a library that behaves the same. Never `alert()` or `confirm()` (`lint: native-dialog-interrupt`).
- Content: an `<h2>` that states the purpose, ≤ 2 short paragraphs, and one primary plus one secondary action with explicit labels ("Discard draft" / "Keep editing").
- Width 400–560 px for confirmations and up to 720–800 px for forms. Set `max-height: 85dvh`. The body scrolls inside while the title and actions stay visible.
- Close with a visible × (44 px hit area), Esc or a backdrop click. If the user has typed something, ask before discarding instead of closing on the backdrop click.
- On open, focus moves to the first field or the title. On close, it returns to the trigger. Lock background scroll while open.
- Mobile: short tasks become bottom sheets with a grab handle **and** a close button. Long forms open full-screen with a top bar ("Cancel" · title · "Save"). Respect safe-area insets. Motion is 150–250 ms (fade plus an 8–16 px slide), and fade only under `prefers-reduced-motion`.
- Never stack modals, and never open one on page load. A newsletter prompt waits for real engagement and closes in one tap.

**Common failures**
- A tiny × with no Esc support (`audit: tap-target-size`), or focus left behind the overlay (`audit: focus-invisible`).
- A long form crammed into a centered modal on a 390 px screen.
- The page scrolling behind an open sheet (missing `overscroll-behavior: contain`).

## Toasts and notifications

**Laws:** [§L06 Doherty Threshold](laws/doherty-threshold.md) · [§L08 Flow](laws/flow.md) · [§L25 Selective Attention](laws/selective-attention.md) · [§L23 Peak-End Rule](laws/peak-end-rule.md)

**Spec**
- Toasts confirm a low-risk action the user just took ("Conversation archived · Undo"). Errors that need action go inline next to their cause, and system-wide problems use a persistent banner.
- Use one consistent placement. Desktop: bottom-left or bottom-right, ~24 px from the edges, 320–420 px wide. Mobile: bottom-center, full width minus 16 px margins, above the tab bar or sticky CTA.
- A text-only toast lasts ~5 s. One with an action such as Undo lasts ≥ 10 s or until dismissed. Pause the timer on hover and focus, and always include a close button (44 px hit area).
- Show one toast at a time and queue the rest, or stack ≤ 3.
- Use `role="status"` (polite) for confirmations, and `role="alert"` only for urgent messages. A toast never takes focus, but its action is reachable by keyboard.
- Notification center: a bell with an unread count (capped at "9+"), items grouped by day that each link to their object, and "Mark all as read".
- Ask for web push or other browser permissions only after a user action that shows the benefit, behind your own explanation. Never on first load.

**Common failures**
- Form errors shown only in a vanishing toast, or Undo toasts that disappear after 2 s.
- Toasts covering the primary action or the bottom nav.
- Permission prompts on page load.

## Onboarding and first run

**Laws:** [§L20 Paradox of the Active User](laws/active-user-paradox.md) · [§L09 Goal-Gradient](laws/goal-gradient.md) · [§L30 Zeigarnik Effect](laws/zeigarnik-effect.md) · [§L23 Peak-End Rule](laws/peak-end-rule.md) · [§L27 Tesler's Law](laws/teslers-law.md)

**Spec**
- Get to the first moment of value in ≤ 3 steps after sign-up. Defer profile questions, and ask at most 1–3 personalization questions, each skippable and visibly used.
- Teach while users act: sample data or templates, inline hints at the point of need, and empty states that offer an action. These beat slide carousels.
- If you add a tour, keep it to ≤ 3–5 steps, trigger it from context, show "2 of 4", put Skip on every step, and never replay it on every login.
- Setup checklist: 3–5 tasks with progress ("2 of 5 done"). Each task links to where it's done, and the checklist is dismissible and saved on the server so it follows the user across devices. Pre-check only steps that are really done ("Create account ✓").
- Mark the first real success (first project published, first invoice sent) with a short celebration (≤ 1 s, skipped under reduced motion) and a suggested next step.
- Ask for device permissions (notifications, location, camera) in context, at the moment they help.
- Coach marks point at real, visible targets and never cover the control they describe.

**Common failures**
- A 5–7 slide welcome carousel nobody reads, or a forced tour that can't be skipped.
- Ten questions before any value, or an empty dashboard straight after sign-up.
- Checklists that can't be dismissed, or that reset on another device.

## Empty states

**Laws:** [§L20 Paradox of the Active User](laws/active-user-paradox.md) · [§L17 Mental Model](laws/mental-model.md) · [§L23 Peak-End Rule](laws/peak-end-rule.md) · [§L09 Goal-Gradient](laws/goal-gradient.md)

**Spec**
- Design four kinds: first use (nothing yet), user-cleared (inbox zero), no results (search or filters) and blocked (no permission, or the feature is off).
- First use: a headline naming what lives here ("Your invoices will appear here"), one sentence of value and one primary action ("Create invoice"). Optionally add a secondary action (Import CSV, Use a template, a docs link).
- No results: repeat the query and active filters, and offer "Clear filters" plus spelling or broader suggestions.
- Cleared: short and positive ("All caught up"), with a sensible next place to go.
- Blocked: say why and who can grant access, with a "Request access" action.
- Keep the page chrome (title, tabs, filters, primary button) in place so users stay oriented. The empty state fills only the content region.
- Any illustration is optional and small (≤ ~160–200 px tall), so the action stays above the fold on mobile.

**Common failures**
- A blank area, or "No data" with no action.
- A table header over zero rows with no message.
- The empty state replacing the filters that caused it, so users can't undo them.

## Errors

**Laws:** [§L24 Postel's Law](laws/postels-law.md) · [§L23 Peak-End Rule](laws/peak-end-rule.md) · [§L05 Cognitive Load](laws/cognitive-load.md) · [§L17 Mental Model](laws/mental-model.md) · [§L29 Working Memory](laws/working-memory.md)

**Spec**
- Every message says what happened and how to fix it, in plain words and without blame. Error codes go in small print for support, never in the headline.
- Inline field errors sit below the field, with an icon, text and color (never color alone), plus `aria-invalid="true"` and `aria-describedby`. Be specific: "Enter a date after 1 Jan 2026", not "Invalid input".
- Submit errors: a summary at the top that links to each field, with focus moved to it. Keep all input.
- Widget or section failures stay local. The failed card says "Couldn't load sales · Retry" while the rest of the page keeps working (error boundaries).
- Connectivity or system problems get a persistent banner at the top ("You're offline. Changes will sync when you reconnect") with Retry.
- 404: return a real 404 status. Show "We can't find that page", a search field, links to the top 3–5 destinations and Home, and keep the header and footer.
- 500/503: a short apology that says it isn't the user's fault, a Retry button, a status page link and a support contact. A 503 sends `Retry-After`. Never show stack traces.
- Never throw away what the user typed. Restore drafts after a reload or re-authentication.

**Common failures**
- "Something went wrong" with no cause and no next step.
- An error toast that vanishes in 3 s while the form silently resets.
- Soft 404s served with status 200, or a whole form turning red after one mistake.

## Loading states

**Laws:** [§L06 Doherty Threshold](laws/doherty-threshold.md) · [§L08 Flow](laws/flow.md) · [§L09 Goal-Gradient](laws/goal-gradient.md) · [§L23 Peak-End Rule](laws/peak-end-rule.md)

**Spec**
- **0–100 ms:** every press shows a pressed or active state. This is mandatory.
- **Likely under ~400 ms:** show no indicator. Start a ~300 ms timer and show one only if the work is still running, so fast responses don't flash.
- **400 ms to ~10 s:** content with a known shape gets a skeleton that matches the final layout, at the same heights, so CLS stays ≤ 0.1. Actions get an inline spinner in the control with a verb ("Saving…"). Once an indicator appears, keep it for ≥ ~500 ms to avoid flicker.
- **Over ~10 s:** show determinate progress (a percentage, or "Step 3 of 5"), an estimate if you have one, and Cancel or "Continue in background". Notify when it's done.
- Use optimistic UI for low-risk actions that rarely fail (like, toggle, reorder, rename): update at once and roll back with an explanatory toast if the server rejects the change.
- Render the shell (nav, headings, filters) immediately and stream content into it. Never block the whole page for a partial update.
- Skeletons are neutral blocks with a shimmer cycle of ≥ 1 s, or static under `prefers-reduced-motion`. Set `aria-busy="true"` on the loading region.

**Common failures**
- A full-screen spinner for every fetch, or a spinner flickering on 50 ms responses.
- Skeletons that don't match the real layout, so content jumps (`audit: layout-shift`).
- An indeterminate spinner on a 40-second upload, or async buttons with no pending state (`lint: async-no-feedback`).

## Settings pages

**Laws:** [§L03 Chunking](laws/chunking.md) · [§L11 Jakob's Law](laws/jakobs-law.md) · [§L05 Cognitive Load](laws/cognitive-load.md) · [§L29 Working Memory](laws/working-memory.md) · [§L27 Tesler's Law](laws/teslers-law.md)

**Spec**
- Group settings into sections users recognize (Profile, Account, Notifications, Billing, Security, Integrations), ordered by how often people visit them.
- Desktop: a left sub-nav (≤ ~10 sections) and a content column ≤ 720 px wide. Mobile: a list of sections that drills into one page per section, with a Back control.
- Each setting shows its label, a one-line description of its effect and its current value.
- Use one save model per page. Toggles, radios and selects save at once, with "Saved" feedback in < 400 ms. Text forms use an explicit "Save changes": a sticky save bar appears after the first edit, and leaving with unsaved changes asks first. Never pair a toggle with a separate Save button.
- With more than ~30 settings, add search within settings.
- Give each section its own URL (`/settings/notifications`) so support and docs can link straight to it.
- Put the "Danger zone" last and visually separate it: delete account, transfer ownership ([Destructive actions](#destructive-actions)).
- Good defaults mean most users never need this page (§L27).

**Common failures**
- Mixed save models on one page, or no confirmation that anything was saved.
- One endless page of 60 settings, or internal jargon with no explanation ("Enable JIT provisioning").

## Multi-step wizards

**Laws:** [§L09 Goal-Gradient](laws/goal-gradient.md) · [§L30 Zeigarnik Effect](laws/zeigarnik-effect.md) · [§L03 Chunking](laws/chunking.md) · [§L29 Working Memory](laws/working-memory.md) · [§L22 Parkinson's Law](laws/parkinsons-law.md)

**Spec**
- Use a wizard when a form exceeds ~6–8 fields or has distinct phases. Aim for 3–5 steps (≤ 7), each with one theme and ~3–7 fields.
- Before step 1, say what's needed ("Takes about 5 minutes. Have your tax ID ready.").
- Progress reads "Step 2 of 4 · Payment". Desktop uses a labeled horizontal stepper. Mobile uses a compact "2/4" with a progress bar.
- Back is always available and keeps the data. Continue validates only the current step.
- Give each step a URL or history entry, so browser Back goes back one step instead of leaving the wizard.
- Save progress (on the server, or in localStorage for anonymous users) and offer "Pick up where you left off" on return.
- End with a review step that shows every answer with an Edit link per section, then a confirmation screen that says what happens next.
- The primary "Continue" ends each step: bottom-right on desktop, sticky and full-width on mobile.
- Put easy steps first for momentum. Never add surprise steps late, and never let the progress bar move backwards.

**Common failures**
- No progress indicator, or a step count that changes midway ("Step 3 of ?").
- Browser Back leaving the flow and losing data, or errors from step 1 surfacing at step 4.

## Landing page section order

**Laws:** [§L26 Serial Position](laws/serial-position.md) · [§L25 Selective Attention](laws/selective-attention.md) · [§L11 Jakob's Law](laws/jakobs-law.md) · [§L03 Chunking](laws/chunking.md) · [§L19 Occam's Razor](laws/occams-razor.md)

**Spec.** This is the default order for marketing sites. Cut any section that doesn't earn its place (§L19).
1. Header: logo, ≤ 5–7 links, primary CTA at the right.
2. Hero: an outcome headline, subhead, primary CTA and product visual ([Hero](#hero-and-above-the-fold)).
3. Proof strip: customer logos or a rating.
4. Benefits: 3 outcomes, each with an icon or image, a short heading and ≤ 2 lines.
5. How it works: 3 numbered steps.
6. Feature deep dives: 2–4 rows alternating text and visual.
7. Testimonials: real names, roles, photos and specific results.
8. Pricing, or a pricing teaser.
9. FAQ: 5–8 objections in an accordion.
10. A final CTA band that repeats the primary CTA, then the footer (§L26: the end is remembered).
- Use one primary CTA label for the whole page and repeat it in the hero, mid-page and at the end. Space sections 64–96 px apart on desktop and 48–64 px on mobile. Each section carries one idea, with a heading that still makes sense when skimmed.

**Common failures**
- Features before benefits, or a CTA only at the top.
- A different CTA label in every section, stock-photo heroes or walls of text.
- Invented testimonials or user counts (§L04).

## Footer

**Laws:** [§L11 Jakob's Law](laws/jakobs-law.md) · [§L03 Chunking](laws/chunking.md) · [§L26 Serial Position](laws/serial-position.md) · [§L07 Fitts's Law](laws/fitts-law.md)

**Spec**
- Contents: 3–5 labeled link groups (Product, Company, Resources, Legal) of ≤ 5–7 links each, plus contact, social, legal links (Privacy, Terms, Cookie settings, Imprint where required), copyright and a language/region switcher.
- Desktop uses columns. Mobile uses stacked groups or accordions, with each link padded to a 44 px tap height.
- An optional newsletter signup is one email field and a button, with a one-line promise ("One email a month. Unsubscribe anytime.").
- Link text is ≥ 14 px (16 px on mobile) with ≥ 4.5:1 contrast. Muted grey-on-grey footers often fail this.
- A page with a footer can't use pure infinite scroll. Use "Load more" or pagination so the footer can be reached.

**Common failures**
- 40+ links in one block, or links stacked too tightly to tap (`audit: tap-target-spacing`).
- Low-contrast footer text (`audit: contrast`), or infinite scroll that hides the footer.

## Content and article pages

**Laws:** [§L05 Cognitive Load](laws/cognitive-load.md) · [§L03 Chunking](laws/chunking.md) · [§L25 Selective Attention](laws/selective-attention.md) · [§L13 Law of Proximity](laws/proximity.md)

**Spec**
- Keep the measure at 60–75 characters (`max-width: 68ch`). Body text is 16–18 px on mobile and 18–20 px on desktop, with a line-height of 1.5–1.7 and ~1em between paragraphs. Left-align it and never justify.
- Add a heading every 3–5 paragraphs, written as an informative statement. Leave more space above a heading than below it (§L13).
- Use the inverted pyramid: the answer or summary first, details after. Put key words at the start of headings and first sentences.
- Use lists for 3+ parallel items and bold only a few key phrases. Underline body links and give them descriptive text.
- Pieces over ~1,500 words get a table of contents: a sticky sidebar at ≥ xl, or a collapsible block at the top on mobile. Set `scroll-padding-top` to the height of the sticky header.
- Show the byline, the published and updated dates, and the reading time.
- Images span the measure and have captions. Code blocks scroll horizontally inside themselves.
- No interstitials mid-read. Label ads and promos clearly and make them look different from the content (§L25).

**Common failures**
- Text running the full 1440 px width, or 14 px light-grey body text (`audit: text-too-small`, `audit: contrast`).
- Walls of text with no headings, or "click here" links.

## Media and carousels

**Laws:** [§L25 Selective Attention](laws/selective-attention.md) · [§L08 Flow](laws/flow.md) · [§L06 Doherty Threshold](laws/doherty-threshold.md) · [§L07 Fitts's Law](laws/fitts-law.md)

**Spec**
- No autoplaying carousels (`lint: autoplay-carousel`). Prefer a static grid or a CSS scroll-snap row.
- If a carousel is unavoidable, it's user-controlled, with ≤ 5–7 slides, ≥ 44 px prev/next buttons, a "3 / 7" position, swipe on touch and arrow keys on desktop. A 10–20% peek of the next slide shows there is more.
- Video never autoplays with sound. Muted decorative loops get a visible pause control (anything that moves for > 5 s must be pausable) and stop under `prefers-reduced-motion`. Add `playsinline`, a `poster`, and captions or a transcript for speech.
- Images get `width`/`height` or `aspect-ratio`, a responsive `srcset` + `sizes`, and AVIF/WebP. Use `loading="lazy"` below the fold and `fetchpriority="high"` on the LCP image.
- A gallery lightbox supports pinch zoom, swipe and Esc, has a visible close button, and returns focus on close.
- Content images need meaningful `alt` text. Decorative images get `alt=""`.

**Common failures**
- Hero sliders rotating every 3–5 s, with tiny dots as the only control.
- 3 MB hero PNGs on mobile (`audit: slow-paint`), images without dimensions (`lint: image-no-dimensions`), or autoplaying media (`audit: autoplay-media`).

## Destructive actions

**Laws:** [§L07 Fitts's Law](laws/fitts-law.md) · [§L04 Cognitive Bias](laws/cognitive-bias.md) · [§L23 Peak-End Rule](laws/peak-end-rule.md) · [§L28 Von Restorff](laws/von-restorff.md) · [§L11 Jakob's Law](laws/jakobs-law.md)

**Spec**
- For anything reversible, act immediately and offer Undo: a toast for ≥ 10 s, or a Trash that can be restored for e.g. 30 days. Confirm only actions that can't be undone or that affect other people.
- A confirmation names the object and the consequence: "Delete 'Q3 report'? 14 files will be removed for everyone. This can't be undone." The buttons are "Delete report" (destructive style) and "Cancel", with initial focus on Cancel.
- Severe, irreversible actions (deleting an account, workspace or repository) require typing the name to confirm, or re-authenticating.
- Keep destructive actions away from primary ones: the other side of the toolbar, an overflow menu, or a separate "Danger zone". Make them red, but not the loudest thing on the page.
- Bulk actions state the count ("Delete 12 items").
- After a deletion, confirm with a toast and land somewhere valid (the parent list), never on a 404.
- Cancel subscription: reachable from Settings → Billing in no more steps than sign-up took. Make at most one neutral retention offer (pause or downgrade), say when access ends, and send a confirmation email. No guilt-trip copy (§L04).

**Common failures**
- "Are you sure?" with Yes/No buttons, or Delete next to Save with the same styling.
- Cancellation only by phone or chat, or confirmshaming ("No thanks, I don't like saving money").
- Archive or bulk delete with no undo.
