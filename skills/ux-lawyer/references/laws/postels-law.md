---
id: L24
name: "Postel's Law"
source: https://lawsofux.com/postels-law/
origin: "Jon Postel (1980), the robustness principle in early Internet protocol specs (RFC 760, RFC 761), restated in RFC 793 (TCP, 1981)."
category: interaction
summary: "Accept input in any reasonable form, normalize it yourself, and always show it back in one clean, consistent format."
applies_to: [forms, text inputs, phone numbers, dates, payment fields, search, paste, viewport, input methods, validation]
rules:
  - "Strip spaces, dashes, and dots from numeric fields before validating. Never reject '4242 4242 4242 4242'."
  - "Trim whitespace and compare emails case-insensitively. Stray spaces and capitals are noise, not errors."
  - "Never block paste or pinch-zoom. Each is an input method someone depends on."
  - "Every control works by touch, mouse, keyboard, and screen reader, at any width from 320px up."
  - "Display values in one canonical format everywhere, and re-validate everything on the server."
---

# Postel's Law (L24)

## In plain words

Be tolerant about what comes in and strict about what goes out. People type phone numbers with spaces, paste card numbers with dashes, write dates in their local order, and leave a trailing space after their email address. The intent is perfectly clear; only the formatting is messy. Tidying it up is the interface's job, not something to bounce back as an error.

The other half matters just as much. Whatever the system displays, stores, or sends onward should be predictable: one date format per locale, one way of writing a phone number, consistent casing. Postel wrote the principle for network software that had to interoperate with implementations it couldn't control. In a UI, the user is that unpredictable other side.

## Why it matters in a UI

- **Rejecting clear intent feels hostile.** "Invalid card number" for a number typed exactly as it's printed on the card costs a retry, erodes trust, and is a classic reason people abandon checkout.
- **Input arrives from many sources.** Typing, browser autofill, password managers, paste from an email or spreadsheet, voice dictation, and assistive tech each produce slightly different strings: non-breaking spaces, en dashes, full-width digits, trailing newlines.
- **Devices and abilities vary.** Users arrive on a 320px phone, a 4K monitor, keyboard-only, with a switch device, or at 200% zoom. A UI that assumes one input method or one viewport shuts everyone else out.
- **Inconsistent output creates doubt.** If the review screen shows a date differently from the form, users wonder whether it was saved correctly.

## Build it right

### Everywhere
1. **Normalize before validating.** Apply Unicode NFKC, trim, collapse inner whitespace, and strip separators (spaces, dashes, dots, parentheses) from numeric values. Validate the cleaned value, never the raw string.
2. **Validate meaning, not shape.** Accept anything that maps to a real value: a Luhn-valid card regardless of grouping, a phone number a library like `libphonenumber` can parse, an IBAN with or without spaces. Avoid `pattern` regexes that hard-code one formatting.
3. **Let people paste.** Never block paste on password, email-confirmation, or one-time-code fields. Avoid `maxlength` on fields where a pasted value with separators may be longer than the bare digits.
4. **Format gently.** If you add separators as the user types, keep the caret stable and accept pasted values in any format. Formatting on `blur` is simpler and rarely fights the user.
5. **Be conservative in output.** Use one shared formatter (`Intl.DateTimeFormat`, `Intl.NumberFormat`) for every screen, email, and export, so the same value always looks the same.
6. **Accept every input method.** Native `<button>`, `<a href>`, and `<input>` work with mouse, touch, keyboard, and screen readers out of the box. Custom widgets need roles, focus, and key handling.
7. **Validate on the server anyway.** Client-side leniency is a usability feature, not a trust boundary. The server re-normalizes, bounds-checks, and rejects impossible or malicious values (injection, oversized input, lookalike characters).

### Mobile
- Never disable zoom: no `maximum-scale=1`, no `user-scalable=no`. To stop iOS zooming on focus, give inputs a font size of at least 16px.
- `inputmode="numeric"`, `"tel"`, `"email"`, or `"decimal"` brings up the right keyboard, but still accept the spaces, letters, or punctuation that dictation and paste can add.
- Respond to any viewport, from 320px to tablet, portrait and landscape, with no horizontal scroll. Use `dvh`/`svh` instead of assuming a fixed screen height.
- One-time codes: a single input with `autocomplete="one-time-code"` accepts typing, paste, and SMS autofill. If you must split into boxes, spread a pasted code across all of them.

### Desktop
- Full keyboard support: logical Tab order, Enter submits, Esc closes, arrow keys inside composite widgets. Hover must never be the only way to reveal an action.
- Uploads accept drag-and-drop, a file picker, *and* paste (Ctrl/Cmd+V for images and files).
- Date fields allow typing a date directly. A calendar picker is a helper, not the only way in.
- The layout survives 200–400% browser zoom and very wide windows. Cap line length with `max-width` instead of fixing the page width.

## Code patterns

```js
// Liberal in: normalize first, then validate meaning
const clean = {
  digits: (s) => s.normalize("NFKC").replace(/[\s\-–—.()/]/g, ""),
  email:  (s) => s.normalize("NFKC").trim().toLowerCase(),   // for comparison and lookup
  text:   (s) => s.normalize("NFKC").trim().replace(/\s+/g, " "),
};

function isValidCard(raw) {
  const d = clean.digits(raw);
  if (!/^\d{12,19}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;                       // Luhn check
}
```

```html
<!-- Zoom stays available -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Right keyboard and autofill; no strict pattern, no maxlength that truncates a pasted "4242 4242 …" -->
<label for="cc">Card number</label>
<input id="cc" name="cc" inputmode="numeric" autocomplete="cc-number">

<label for="otp">Verification code</label>
<input id="otp" name="otp" inputmode="numeric" autocomplete="one-time-code">
```

```js
// Conservative out: one formatter shared by form, review, confirmation, and email
export const fmt = {
  date:  (d) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(d),
  money: (n, cur) => new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(n),
  card:  (digits) => `•••• ${digits.slice(-4)}`,
};
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Pinch-zoom disabled in the viewport meta | `lint: zoom-disabled` · `lint: viewport-missing` | critical | Remove `maximum-scale` and `user-scalable=no`. Use ≥ 16px input text to avoid focus zoom |
| Strict pattern rejects spaces or dashes in card, phone, IBAN, postcode | `lint: strict-pattern` · manual: grep `pattern=` and `/^\d+$/` applied to raw input | major | Normalize first, then validate meaning (Luhn, `libphonenumber`) |
| Paste blocked on password, email, or code fields | manual: grep `onpaste`, `"paste"` listeners calling `preventDefault` | major | Remove the block. Split code boxes distribute pasted digits |
| Email rejected or login fails for capitals or a trailing space | manual: sign up with `User@Mail.com `, then log in with `user@mail.com` | major | Trim, and compare case-insensitively on client and server |
| Control works with only one input method (hover-only menu, clickable `div`) | `lint: hover-only` · `lint: div-button` · `audit: focus-invisible` | major | Native elements, keyboard handlers, visible focus |
| Layout breaks at narrow widths or high zoom | `audit: horizontal-overflow` · manual: test 320px and 200% zoom | major | Fluid layout, `min-width: 0` on flex children, wrap long strings |
| Same value formatted differently across screens and emails | manual: compare form, review, confirmation, and receipt email | minor | One shared `Intl.*` formatter everywhere |
| Lenient client with no server-side validation | manual: check API handlers re-parse and bounds-check input | critical | Normalize and validate on the server. Never trust client input |

## Tensions & trade-offs

- **Leniency vs. guessing:** an ambiguous value like `03/04/2026` (March or April?) should not be silently interpreted. Echo the parsed value back ("Fri, 3 Apr 2026") or use an unambiguous control. Liberal means forgiving of format, not guessing at meaning.
- **vs. [Tesler's Law](teslers-law.md):** normalization moves complexity from the user into your code. That is the right direction, but it is real work and needs tests.
- **vs. security:** protocol designers have since warned (RFC 9413, 2023) that unchecked tolerance hides bugs and invites abuse. Be liberal with humans at the UI edge, strict between your own services, and always strict about safety.
- **vs. [Jakob's Law](jakobs-law.md):** familiar input masks help, but masks that reformat on every keystroke often break paste and caret position. Prefer format-on-blur.

## Quick test

Paste values as messy as a real person would (spaces, dashes, capitals, a trailing space) into every field, then complete the form keyboard-only at 320px and at 200% zoom. Does anything get rejected that a human clerk would have accepted?
