---
id: L05
name: "Cognitive Load"
source: https://lawsofux.com/cognitive-load/
origin: "John Sweller (1988), 'Cognitive load during problem solving: Effects on learning', Cognitive Science."
category: cognition
summary: "Strip out every bit of mental effort the interface adds on top of the task, so users spend their attention on their goal."
applies_to: [forms, onboarding, dashboards, settings, navigation, content pages, typography, checkout, error messages]
rules:
  - "Remove before you rearrange: every banner, duplicate link, field, or decoration must serve the screen's one task or go."
  - "Show the essentials first. Put advanced or rare options behind progressive disclosure, one level deep."
  - "Pre-fill a sensible default for every setting most users would accept unchanged."
  - "Label actions with verb + object ('Save draft', 'Delete 3 files'), never a bare 'OK', 'Submit', or unlabeled icon."
  - "Body text ≥ 16px, line-height 1.5, prose width 45–75ch (aim for ~65ch)."
---

# Cognitive Load (L05)

## In plain words

Every screen makes the brain work: read, interpret, compare, remember, decide. Part of that work comes from the task itself, like choosing a flight or configuring a server. That is *intrinsic* load. You reduce it only by simplifying the task. The rest is *extraneous* load created by presentation: cryptic labels, visual noise, inconsistent layouts, things to remember, text that is hard to read. Extraneous load is pure waste, and you control it.

Working memory is small and shared. Whatever the interface uses up is no longer available for the user's actual goal, so they slow down, make mistakes, or give up.

## Why it matters in a UI

- **Overload shows up as errors and abandonment, not complaints.** Users rarely say "this is too much". They skip fields, pick the wrong plan, or leave checkout.
- **Load stacks.** A hard task plus a noisy page plus an interruption (a toast, a modal, a cookie banner) exceeds capacity even when each alone would be fine.
- **Capacity varies.** Stress, fatigue, distraction, small screens, reading in a second language, and cognitive disabilities all shrink the budget. Design for a tired user on a phone, not an expert at a desk.
- **Reading is effort.** Small type, long lines, and tight leading cause re-reading and skipped lines, which burns attention before any decision is made.

## Build it right

### Everywhere
1. **Separate intrinsic from extraneous.** Write down the one task each screen serves. Anything that doesn't serve it (promo banners, secondary nav, duplicate links, decorative motion) is a removal candidate.
2. **Progressive disclosure.** Show what most users need on every visit. Put advanced, rare, or expert options behind "Advanced settings", a `<details>` element, or a secondary screen. Keep it one level deep; nested disclosure hides things twice.
3. **Sensible defaults.** Pre-select the option most users would choose: standard shipping, metric or imperial from locale, recommended notification settings. Each default is one less decision. For having the system do the work, see [Tesler's Law](teslers-law.md).
4. **Labels that need no decoding.** Visible text labels on inputs, buttons named for their outcome ("Create invoice", not "Submit"), plain words instead of internal jargon, and text next to icons unless the icon is universal (search, close, menu).
5. **Consistency.** Same component, same behavior, same place. Every inconsistency forces re-learning. Reuse conventions ([Jakob's Law](jakobs-law.md)) so users can apply their existing [Mental Models](mental-model.md).
6. **Readable typography.** Body ≥ 16px (1rem), `line-height: 1.5`, prose `max-width` 45–75ch, ≥ 1em between paragraphs, left-aligned rather than justified. One or two typefaces and a short type scale.
7. **Self-explaining errors.** Say what is wrong and how to fix it, next to the field: "Enter a date after today" beats "Invalid input".

### Mobile
- One primary task per screen. Split complex flows into steps ([Chunking](chunking.md)) instead of shrinking everything to fit.
- Never drop body text below 16px to fit more. At 390px wide with 16px side gutters, 16px text gives lines of roughly 40–50 characters, which is comfortable.
- Inputs need a font size of at least 16px. Otherwise iOS Safari zooms on focus, which disorients users mid-task.
- The on-screen keyboard covers about half the viewport. Keep the active field's label and error message visible above it.
- For secondary choices, prefer bottom sheets over full-screen modals. They keep part of the original context visible.

### Desktop
- Wide viewports tempt full-width text. Cap prose at ~65ch and use the spare width for whitespace or one supporting rail, not more content.
- Dashboards: lead with a few key metrics and move the rest into drill-downs. Every extra chart competes for attention ([Selective Attention](selective-attention.md)).
- Hover-revealed row actions can reduce clutter, but never hide the primary action behind hover, and always provide a keyboard path.
- Keyboard shortcuts and a command palette lower load for experts without adding visible chrome.

## Code patterns

```css
:root { --text-body: 1rem; --leading-body: 1.5; --measure: 65ch; }

body { font-size: var(--text-body); line-height: var(--leading-body); }
.prose { max-width: var(--measure); }          /* stays within 45–75ch */
.prose p + p { margin-top: 1em; }
.prose :is(h2, h3) { line-height: 1.25; margin-top: 2em; }
input, select, textarea { font-size: max(16px, 1rem); } /* no iOS focus zoom */
```

```html
<!-- Progressive disclosure: essentials visible, rare options one click away -->
<label for="name">Project name</label>
<input id="name" name="name" value="my-app">

<details>
  <summary>Advanced settings</summary>
  <label for="region">Region</label>
  <select id="region" name="region">
    <option value="auto" selected>Automatic (closest to you)</option>
    <option value="eu-west">EU West</option>
  </select>
</details>

<button type="submit">Create project</button>
```

Tailwind: `text-base leading-normal max-w-prose` gives 16px, 1.5, and 65ch. Avoid `text-xs` and `text-sm` for body copy, and `leading-tight` on paragraphs.

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Body text < 16px, or many near-identical font sizes | `audit: text-too-small` · `lint: tiny-text` · `lint: font-size-sprawl` | major | 16px body on a short type scale |
| Prose lines over ~75ch, full-width text on desktop | manual: at 1440px, find paragraphs with no `max-width`; count characters per line | minor | `max-width: 65ch` on text containers |
| Tight leading on body text (< 1.4) | manual: grep `line-height:\s*1(\.[0-3][0-9]*)?\s*[;}]` or `leading-tight`/`leading-none` on `p` | minor | `line-height: 1.5` |
| Long form showing optional, rare, and advanced fields at once | `lint: form-long` · `audit: form-load` | major | Remove, default, or disclose; split into steps |
| Vague action labels ("Submit", "OK", "Click here") | `lint: generic-button-label` | minor | Verb + object |
| Visual noise: too many colors, fonts, or competing primary actions | `audit: color-sprawl` · `audit: font-sprawl` · `audit: cta-competition` | major | One accent color, 1–2 typefaces, one primary action |
| Autoplaying carousels or media pulling attention | `lint: autoplay-carousel` · `audit: autoplay-media` | major | Static content; playback the user starts |
| Errors that give no fix ("Invalid", "Error 422", "Something went wrong") | manual: grep error strings for `invalid`, `error \d+`, `went wrong` | major | Name the problem and the fix, next to the field |

## Tensions & trade-offs

- **vs. [Tesler's Law](teslers-law.md):** intrinsic complexity can only be moved, not deleted. Cutting a needed option shifts load to workarounds and support tickets. Remove *extraneous* load; move intrinsic load into the system.
- **vs. [Occam's Razor](occams-razor.md):** icon-only, menu-heavy minimalism lowers visual load but raises recall load ([Working Memory](working-memory.md)). Visible text labels are worth their pixels.
- **Disclosure vs. discoverability:** hidden things are rarely found. Hide only what few users need. If many users dig for it, promote it ([Pareto Principle](pareto-principle.md)).
- **Experts vs. novices:** experts want density. Offer it as an option (compact mode, shortcuts) instead of making it the default.

## Quick test

State the screen's one task in a sentence, then point at each element: does it serve that sentence? Anything that doesn't, and any text you had to read twice, is load you can remove.
