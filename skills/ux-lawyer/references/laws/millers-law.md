---
id: L18
name: "Miller's Law"
source: https://lawsofux.com/millers-law/
origin: "George A. Miller (1956), 'The magical number seven, plus or minus two: Some limits on our capacity for processing information'. Revised to about 4 chunks by Nelson Cowan (2001), 'The magical number 4 in short-term memory'."
category: cognition
summary: "People hold only a few chunks in mind at once, so group anything they must remember, verify, or retype into small, familiar units."
applies_to: [phone numbers, card numbers, verification codes, reference numbers, API keys, navigation, data tables, forms]
rules:
  - "Budget about 4 chunks for anything users must hold in mind, not 7±2. Fewer under stress, distraction, or on mobile."
  - "Display long numbers and codes in groups of 3–4: '482 913', '4242 4242 4242 4242', '+44 20 7946 0018'."
  - "Group by structure users already know (country code, area code, card blocks), not arbitrary splits."
  - "Don't cap visible menus at 7 citing Miller: visible items are recognized, not memorized. That is Hick's Law territory."
  - "Codes people read or retype are short and unambiguous: no 0/O or 1/I/l, ideally ≤ 8 characters."
---

# Miller's Law (L18)

## In plain words

In 1956 George Miller observed that people can hold and reliably distinguish only a handful of items at once, and named it "seven, plus or minus two". The more useful part of his paper is *chunking*: people stretch the limit by grouping items into meaningful units, so "FBI CIA NASA" is three chunks, not eleven letters.

Later work, notably Nelson Cowan's 2001 review, puts the real capacity closer to **about four chunks** when people can't rehearse or regroup. Treat the number as a reason to group information and to avoid making people memorize at all, not as a layout constant.

## Why it matters in a UI

- **Transcription is a memory task.** Copying an OTP from SMS, a booking reference from email, or an IBAN from a PDF means holding characters across an app or window switch. Long, ungrouped strings cause typos and repeated glances back.
- **Verification depends on grouping.** Users check a card or phone number by comparing chunks. `4242424242424242` is almost impossible to check at a glance; `4242 4242 4242 4242` is easy.
- **The number is widely misused.** Capping navigation at 7 items "because of Miller" confuses memory with perception. Menu items stay on screen; users scan and recognize them. Menu length is governed by [Hick's Law](hicks-law.md), [Choice Overload](choice-overload.md), and grouping, not by memory span.
- **Real conditions shrink capacity.** Distraction, stress, multitasking, and small screens all reduce how much people can hold, so design for the low end.

## Build it right

### Everywhere
1. **Group long numbers for display.** Card numbers 4-4-4-4 (Amex 4-6-5), IBANs in blocks of 4, OTPs as 3-3, phone numbers in national format. Store the raw value and format only for display.
2. **Group by known structure.** A familiar pattern (country code, area code, card block) is one chunk; an arbitrary split is several. "415 555 0132" reads as three chunks; "4155 550 132" makes users regroup in their heads.
3. **Design codes for humans.** Reference codes people read aloud or retype should be short (≤ 8 characters where possible), case-insensitive, free of look-alikes (0/O, 1/I/l), and grouped: "K7M-4QX". Crockford Base32 is a ready-made alphabet.
4. **Let people copy instead of memorize.** Put a "Copy" button beside codes, IDs, and keys. Render them as selectable text, never as an image.
5. **Group lists, don't truncate them.** A long nav or settings list is fine when split into a few labeled sections ([Chunking](chunking.md)). Don't cut useful options just to reach "7".
6. **Don't make users compare in their heads.** When users must weigh more than about 3–4 options on several attributes, give them a comparison table.

### Mobile
- One OTP input with `autocomplete="one-time-code"` and `inputmode="numeric"` lets the OS offer the SMS code, so the user holds nothing. If you render split boxes, group them 3 + 3 and accept a pasted full code.
- Phone fields: `type="tel"`, `autocomplete="tel"`, format into national grouping as users type or on blur, and show the country code as its own chunk (flag + "+44").
- Keep the code's source in view: show where it was sent on the entry screen ("Sent to •••• 0132").

### Desktop
- Users often transcribe between windows (email to app, PDF to banking form). Use `font-variant-numeric: tabular-nums` or a monospace font for codes and numbers so chunks align.
- In tables, chunk large numbers with thousands separators via `Intl.NumberFormat` and right-align numeric columns so magnitudes compare at a glance.
- Mask the middle of long API keys and tokens (`sk_live_••••4f2a`) with a copy button. Users only need to recognize the last few characters.

## Code patterns

```js
// Display-only grouping; submit and store the raw value
const group = (s, size = 4) =>
  s.replace(/\s+/g, "").replace(new RegExp(`(.{${size}})(?=.)`, "g"), "$1 ");

group("4242424242424242");                       // "4242 4242 4242 4242"
group("482913", 3);                              // "482 913"
new Intl.NumberFormat("en-US").format(1284930);  // "1,284,930"
```

```html
<!-- OS autofill from SMS. No maxlength or pattern: a pasted "482 913" must work; strip spaces before verifying -->
<label for="otp">Verification code</label>
<input id="otp" name="otp" autocomplete="one-time-code" inputmode="numeric" class="code">
<p class="hint">Sent to •••• 0132</p>
```

```css
.code, .card-number, .iban { font-variant-numeric: tabular-nums; letter-spacing: 0.05em; }
td.num { text-align: end; font-variant-numeric: tabular-nums; }
```

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Long numbers or codes shown ungrouped (card, IBAN, booking ref, OTP) | manual: grep templates for raw `{cardNumber}`, `{iban}`, `{code}`; screenshots with 8+ unbroken digits | major | Group in 3–4 for display |
| Code or number inputs that reject spaces or dashes users type | `lint: strict-pattern` | major | Accept separators, strip them in code ([Postel's Law](postels-law.md)) |
| OTP field without OS autofill, or split boxes that block paste | `lint: autocomplete-missing` · manual: no `one-time-code`; paste handled only per box | major | Single `one-time-code` field, or split boxes that take a full paste |
| Phone or card input as plain `type="text"` with no `inputmode` | `lint: input-type-generic` | minor | `type="tel"`, `inputmode="numeric"`, `autocomplete="cc-number"` |
| Human-facing codes with look-alike characters or excess length | manual: inspect the code generator's alphabet and length | minor | Crockford Base32, ≤ 8 chars, grouped |
| User must remember a value from another screen or app | manual: walk the flow and note every "go back and check" moment | major | Show it again, add Copy, autofill ([Working Memory](working-memory.md)) |
| Useful nav items cut or buried in "More" to hit 7±2 | manual: comments or specs citing Miller; key destinations hidden | minor | Restore them and group into labeled sections |
| Long flat nav or settings list with no grouping | `lint: nav-overload` · `audit: nav-overload` | major | Labeled sections ([Chunking](chunking.md)) |

## Tensions & trade-offs

- **vs. [Hick's Law](hicks-law.md):** Hick's covers choosing among visible options; Miller's covers holding things in mind. Don't use one to answer the other's question.
- **vs. [Postel's Law](postels-law.md):** display formatting must not leak into validation. Show "4242 4242", but accept "4242-4242", "42424242", or a paste with spaces.
- **Chunk size vs. count:** bigger chunks mean fewer of them, but only when the grouping matches a pattern users know. Otherwise users re-chunk mentally, and the formatting adds load.

## Quick test

Read a code or number from the screen, look away, and type it somewhere else. If you had to look back more than once, group it or remove the need to carry it.
