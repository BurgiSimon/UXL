---
id: L27
name: "Tesler's Law"
source: https://lawsofux.com/teslers-law/
origin: "Larry Tesler, Xerox PARC (mid-1980s); also known as the Law of Conservation of Complexity."
category: strategy
summary: "Every task has complexity that can't be removed, only moved; make the system carry it so users don't have to."
applies_to: [forms, addresses, dates and time zones, payments, search, settings, onboarding, imports, error handling]
rules:
  - "Never ask for what you can detect or derive: timezone, locale, currency, card brand, city from postcode."
  - "Give every personal, address, and payment field the correct autocomplete token."
  - "Accept input in any reasonable format and normalize it in code; never make users match your format."
  - "Default every setting to what most users need. Offer overrides, not blank choices."
  - "Never simplify by hiding meaning: keep units, timezones, totals, and consequences explicit."
---

# Tesler's Law (L27)

## In plain words

Every task has a core of complexity that no design can remove. Sending money needs a recipient, an amount, and a currency. Scheduling a meeting needs a time *and* a timezone. The only question is who deals with that complexity: the system (designers, engineers, code) or the user, every time they use it.

Tesler's argument was that an engineer spending extra effort once beats every user spending extra effort forever. So when you simplify an interface, check where the complexity went. If it moved into code, good. If it moved into the user's head, a support ticket, or an ambiguous result, you only hid it.

## Why it matters in a UI

- **Users pay per use; you pay once.** A field the system could have filled costs every user time on every visit. The code to fill it is written once.
- **Complexity pushed onto users becomes bad data.** Making people convert timezones, format phone numbers, or guess which address line is which produces errors you later have to clean up.
- **Over-simplification creates ambiguity.** A time without a timezone, a price without currency or tax status, a lone "Sync" button that might overwrite something: the UI looks simpler, but users must guess, and guessing is load ([Cognitive Load](cognitive-load.md)).
- **Removing a needed capability doesn't remove the need.** Users build workarounds such as spreadsheets, screenshots, and duplicate accounts. The complexity reappears outside your product.

## Build it right

### Everywhere
1. **Detect, then confirm.** Timezone from `Intl.DateTimeFormat().resolvedOptions().timeZone`, language and number format from `navigator.language`, currency from the user's region. Show the detected value with a way to change it.
2. **Autofill and look up.** Correct `autocomplete` tokens let browsers and password managers fill identity, address, and payment. Offer address lookup (type-ahead, or postcode to address) with a manual-entry fallback.
3. **Derive instead of asking.** Card brand from the first digits, city from the postcode where the mapping is reliable, country from the phone prefix, and "Billing same as delivery" pre-checked.
4. **Normalize liberal input.** Accept "15/03", "March 15", or a picker; phone numbers with spaces or dashes; amounts with or without a currency symbol. Normalize in code ([Postel's Law](postels-law.md)).
5. **Smart defaults over blank choices.** Pre-fill the likeliest value (today's date, the last-used option, the most common plan) and keep it easy to change.
6. **Keep essential complexity visible.** Show units, timezones ("15:00 CEST"), totals with tax status, and an action's scope ("Replace 12 files in Drive"). Simplify the *effort*, never the *meaning*.
7. **Absorb system failures.** Retry transient errors, keep input when a submit fails, and ignore duplicate submits. Don't make users diagnose your problems.

### Mobile
- Use device capabilities at the moment of need, with permission: geolocation for "Use my location", the camera for card or document scanning, `autocomplete="one-time-code"` for SMS codes. Always keep a manual path.
- Bring up the right keyboard so users don't hunt for symbols: `type="email"`, `type="tel"`, and `inputmode="numeric"`, `"decimal"`, or `"url"`.
- Passkeys (WebAuthn) move sign-in complexity from the user's memory to the device.

### Desktop
- Power users accept complexity they control. Offer bulk actions, CSV import with column mapping, keyboard shortcuts, and paste-to-parse (paste a whole address or a list of emails).
- Show detected values with a quiet override instead of a mandatory picker: "Times shown in Europe/Zurich · Change".
- Advanced configuration can live on a full settings page, but every advanced setting needs a sensible default so most users never visit it.

## Code patterns

```js
// Detect, display with the zone label, allow override
const tz = userPrefs.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone; // "Europe/Zurich"
const fmt = new Intl.DateTimeFormat(navigator.language, {
  weekday: "short", day: "numeric", month: "short",
  hour: "numeric", minute: "2-digit", timeZone: tz, timeZoneName: "short",
});
fmt.format(new Date("2026-10-20T13:00:00Z")); // en-GB: "Tue 20 Oct, 15:00 CEST"
```

```html
<!-- Lookup fills the fields; they stay editable, and manual entry always works -->
<label for="postcode">Postcode</label>
<input id="postcode" name="postcode" autocomplete="postal-code">
<button type="button" id="find-address">Find address</button>

<label for="addr1">Address line 1</label>
<input id="addr1" name="addr1" autocomplete="address-line1">
<label for="city">Town or city</label>
<input id="city" name="city" autocomplete="address-level2">
<label for="tel">Phone</label>
<input id="tel" name="tel" type="tel" autocomplete="tel">
```

Tip: don't combine `dateStyle`/`timeStyle` with `timeZoneName` in `Intl.DateTimeFormat`; it throws. Use individual fields as above.

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Personal, address, or payment fields without autofill | `lint: autocomplete-missing` | major | Correct `autocomplete` token on every field |
| Asking for derivable data (card type, country next to phone prefix, city after postcode) | manual: list each field and ask "could code know this?" | major | Detect or derive; show it with "Change" |
| Strict formats forced on users (no spaces in phone, one date format) | `lint: strict-pattern` · `lint: input-type-generic` | major | Accept liberally, normalize in code |
| Times without a timezone, or in the server's timezone | manual: grep date formatting with no `timeZone`; bare times or "UTC" in user-facing UI | major | User's detected zone, with a zone label |
| Prices without currency or tax status | manual: screenshots of cart, pricing, and invoices | major | Currency, "incl. VAT" or "+ tax", itemized total |
| One-button "simplifications" with unclear effect ("Sync", "Fix", "Optimize") | `lint: generic-button-label` · manual: results not predictable from the label | major | Name effect and scope; preview or undo |
| Address forms with many free-text fields and no lookup | `lint: form-long` · `audit: form-load` | minor | Type-ahead or postcode lookup, plus manual fallback |
| Failures pushed onto users ("Error 500", input lost on retry) | manual: go offline mid-submit; check input survives and retry is offered | major | Auto-retry, keep input, plain explanation |

## Tensions & trade-offs

- **vs. [Occam's Razor](occams-razor.md):** a surface that only *looks* simpler isn't better. Remove unnecessary complexity, move essential complexity into the system, and never hide it so results become ambiguous.
- **vs. [Cognitive Bias](cognitive-bias.md):** defaults absorb complexity but also nudge. Default to what serves the user, and keep the default visible and changeable.
- **vs. [Paradox of the Active User](active-user-paradox.md):** users won't read settings before starting, which is exactly why defaults must be right out of the box.
- **Automation vs. control:** wrong detection (a VPN-based country, a shared device) is worse than asking. Always show what was detected and offer a one-click override.

## Quick test

For each field and choice on the screen, ask: "Could the system know or reasonably guess this?" If yes, it should, and the user should only confirm.
