---
id: L01
name: "Aesthetic-Usability Effect"
source: https://lawsofux.com/aesthetic-usability-effect/
origin: "Masaaki Kurosu & Kaori Kashimura (1995), 'Apparent usability vs. inherent usability', CHI '95. Replicated by Noam Tractinsky (1997); Tractinsky, Katz & Ikar (2000), 'What is beautiful is usable'."
category: perception
summary: "Make the UI look deliberate with a strict type, space, and color system, then judge usability by watching behavior, not opinions."
applies_to: [landing pages, marketing sites, dashboards, onboarding, empty states, cards, typography, color, imagery, motion]
rules:
  - "Use one type scale (ratio 1.2–1.333, 5–7 sizes), one 4/8px spacing scale, and one accent color on top of neutrals."
  - "Use one radius family and one shadow ramp of 2–3 levels across every component."
  - "Give content room: 45–75 character lines, 1.5 body line height, section gaps 2–4x component gaps."
  - "Skip the default AI look: purple-blue gradients, emoji as icons, everything centered, identical 3-up card grids."
  - "Measure task success, errors, and time. 'Looks great' feedback is not evidence: polish hides friction in tests."
---

# Aesthetic-Usability Effect (L01)

## In plain words

People decide how easy a product is before they have used it, and that early verdict leans heavily on how it looks. A coherent, carefully finished interface is assumed to be capable and simple. A cluttered or inconsistent one is assumed to be hard, even when the flows underneath are identical. The verdict then colors everything after it: people stick with an interface they believe in and give up early on one they don't.

In UI, "beautiful" mostly means *ordered*: a consistent type scale, an even spacing rhythm, a restrained palette, matching shapes, real content, calm motion. All of that can be specified as tokens and rules. This file gives you those rules, plus how to avoid the template look that untouched defaults produce.

## Why it matters in a UI

- **Credibility is judged visually and fast.** On landing, pricing, sign-up, and checkout pages, visual quality stands in for trustworthiness. A sloppy page makes people doubt the product, the company, and the payment form.
- **Perceived ease buys patience.** In a well-crafted UI, a slow response or an awkward step is more often retried than abandoned. That patience is credit, not a fix. The friction is still there.
- **It distorts feedback.** Attractive prototypes collect praise in reviews and test sessions, and participants under-report the problems they hit. Opinions about a polished mock-up are weak evidence.
- **Default-assembled UIs read as low effort.** The look of unedited templates and AI-generated pages (purple gradients, emoji icons, centered everything) now signals "nobody designed this" and loses the trust advantage.
- **Most ugliness is inconsistency, not missing decoration.** Nine font sizes, a dozen grays, three radii, and arbitrary gaps look worse than a plain UI with strict tokens.

## Build it right

### Everywhere
1. **Type scale.** Body 16px, line height 1.5. Derive headings from one ratio: about 1.2 for dense app UI, 1.25–1.333 for marketing pages. Use 5–7 sizes, at most 2 families (one is often enough), and 2–3 weights. Large headings get tighter leading (1.1–1.2) and slightly negative tracking (−0.01 to −0.025em).
2. **Whitespace rhythm.** Take every gap from a 4/8px scale and make each grouping level clearly larger than the one inside it ([Proximity](proximity.md)): about 8–16px inside components, 24–32px between components, 64–128px between desktop page sections. Generous, *consistent* space reads as premium. Uneven space reads as broken.
3. **Restrained palette, one accent.** Neutrals carry most of the UI: a 9–11 step gray ramp, lightly tinted toward the brand hue. One accent color goes to primary actions, links, focus, and selection, and nowhere else. Success, warning, and danger colors appear only for status. Body text contrast stays ≥ 4.5:1.
4. **One shape language.** One radius family (e.g. 6px controls, 12px cards, full for pills and avatars; a nested radius = outer radius − padding). One shadow ramp of 2–3 soft, low-opacity elevations with a consistent light direction, kept for things that float. One 1px border token.
5. **Quality imagery.** Real product screenshots and purposeful photography beat generic stock and abstract blobs. Keep one aspect ratio and treatment per set, set explicit `width`/`height`, and serve AVIF/WebP with `srcset`. Use one icon family at one stroke width, sized to adjacent text (16/20/24px).
6. **Subtle motion.** 150–250ms for UI transitions, ease-out on enter, animate only `transform` and `opacity`, and honor `prefers-reduced-motion`. Motion explains cause and effect. It never loops on an idle screen.
7. **Distinct skin, conventional skeleton.** Keep structure familiar ([Jakob's Law](jakobs-law.md)): logo top-left, standard nav, standard forms. Make the visual layer specific: a typeface chosen on purpose, an accent derived from the brand (not the framework's default indigo or violet), left-aligned body text, a real icon set, and layouts where size follows importance. Avoid the generic AI look: purple-to-blue gradients on heroes and buttons, gradient headline text, emoji as icons or bullets, every block centered, three identical icon-title-blurb cards, sparkle glyphs, glassmorphism on everything.

### Mobile
- **Scale the headings, not the body.** Body stays 16px (smaller text in inputs also triggers iOS zoom). Shrink headings with `clamp()`: an H1 of about 28–32px on phones against 40–56px on desktop.
- **Cut outer space first.** Use 16px side gutters and 48–64px between sections, and keep the inner tiers intact so the rhythm survives.
- **Art-direct images.** Use `<picture>` to swap in a crop that suits a portrait screen. A wide dashboard screenshot shrunk to 358px is illegible, so show a cropped detail instead.
- **Lighter elevation.** Shadows look heavy on small bright screens, so separate list items with dividers or tinted surfaces. In `prefers-color-scheme: dark`, use near-black surfaces (not `#000`), show elevation with lighter surfaces instead of shadows, and slightly desaturate the accent.

### Desktop
- **Constrain the measure.** Text at 65–75ch, containers at 1200–1440px. Never stretch content across a 2560px display.
- **Use the width for hierarchy.** A split layout on a 12-column grid with one dominant element per section beats a narrow centered column with empty sides.
- **Calm hover states.** A background tint or one elevation step over 100–150ms, with no layout shift.
- **Check at 1440 and 1920px.** Big canvases expose misaligned edges, mismatched radii, and blurry upscaled images.

## Code patterns

```css
:root {
  --font-sans: "Source Sans 3", system-ui, sans-serif;   /* chosen, not defaulted */
  /* Type: 1.25 ratio from 16px */
  --text-sm: 0.8rem; --text-base: 1rem; --text-lg: 1.25rem; --text-xl: 1.563rem;
  --text-2xl: 1.953rem; --text-3xl: clamp(1.953rem, 1.5rem + 2vw, 3.052rem);
  /* Space: 4/8 scale */
  --space-2: 8px; --space-4: 16px; --space-6: 24px; --space-8: 32px; --space-16: 64px;
  /* Color: tinted neutrals + ONE brand-derived accent */
  --gray-50: #f6f8f7; --gray-200: #dfe5e2; --gray-600: #56625c; --gray-900: #151b18;
  --accent: #0b6e4f;
  /* Shape: one radius family, one shadow ramp */
  --radius-sm: 6px; --radius-lg: 12px;
  --shadow-1: 0 1px 2px rgb(16 24 20 / .06), 0 1px 3px rgb(16 24 20 / .10);
  --shadow-2: 0 2px 4px rgb(16 24 20 / .06), 0 8px 16px rgb(16 24 20 / .08);
  --ease-out: cubic-bezier(.2, .8, .2, 1);
}
body { font: 400 var(--text-base)/1.5 var(--font-sans); color: var(--gray-900); background: #fff; }
h1, h2, h3 { line-height: 1.15; letter-spacing: -0.02em; text-wrap: balance; }
p { max-width: 68ch; text-wrap: pretty; }
.card { border-radius: var(--radius-lg); box-shadow: var(--shadow-1);
        transition: box-shadow 200ms var(--ease-out), transform 200ms var(--ease-out); }
.card:hover { box-shadow: var(--shadow-2); transform: translateY(-1px); }
@media (prefers-reduced-motion: reduce) { .card { transition: none; } .card:hover { transform: none; } }
```

```jsx
// Generic: <section className="text-center bg-gradient-to-r from-purple-600 to-indigo-600"><h1>🚀 Supercharge…
// Deliberate: conventional structure, specific skin, real product image
<section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 md:grid-cols-[5fr_7fr]">
  <div>
    <h1 className="text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">Close the books in two days</h1>
    <p className="mt-4 max-w-prose text-lg text-gray-600">Reconcile every account automatically and see what's left.</p>
    <a href="/signup" className="mt-8 inline-flex h-12 items-center rounded-md bg-accent px-6 font-medium text-white">Start free trial</a>
  </div>
  <img src="/ledger.avif" width="1400" height="900" alt="Ledger with reconciled accounts" className="h-auto w-full rounded-xl shadow-2" />
</section>
```

Tailwind: put these tokens in the theme (`colors.accent`, `boxShadow`, `borderRadius`) and treat arbitrary values like `text-[17px]`, `bg-[#7c3aed]`, or `rounded-[10px]` as review flags.

## Audit: violations to look for

| Violation | How to detect | Severity | Remedy |
|---|---|---|---|
| Too many font sizes or families | `lint: font-size-sprawl` · `audit: font-sprawl` | major | Collapse onto 5–7 scale tokens and ≤ 2 families |
| Near-duplicate grays and several competing accents | `lint: color-sprawl` · `audit: color-sprawl` | major | Map to one neutral ramp + one accent + status colors |
| Spacing off the scale (13px, 17px, 22px) | `lint: spacing-off-scale` | minor | Snap to 4/8 tokens |
| Mixed radii and shadows on similar components | manual: grep `border-radius`, `rounded-`, `box-shadow`, `shadow-`; > 3 distinct values is a smell | minor | One radius family, 2–3 shadow tokens |
| Generic AI look: default purple/indigo gradients, gradient text, emoji icons, everything centered, identical card grid | manual: grep `from-purple`, `from-indigo`, `bg-clip-text`, emoji in headings and buttons; screenshot is a centered column over a uniform 3-up grid | minor / major | Brand-derived accent, real icon set, left-aligned text, size by importance |
| Images unsized, stretched, or cropped inconsistently | `lint: image-no-dimensions` · `audit: layout-shift` | major | `width`/`height` or `aspect-ratio`, `object-fit: cover`, one crop style |
| Decorative, slow, or looping motion | `lint: slow-animation` · `lint: reduced-motion-missing` | minor | 150–250ms, transform/opacity only, `prefers-reduced-motion` |
| "Elegant" light-gray body text | `audit: contrast` | major | ≥ 4.5:1; build hierarchy with size and weight, not paleness |

## Tensions & trade-offs

- **vs. usability testing:** polish masks problems. Test behavior (completion rate, errors, time on task, drop-off), not opinions. Run an early round on grayscale or low-fidelity screens so looks can't carry the session.
- **vs. [Jakob's Law](jakobs-law.md):** be distinctive in the skin (type, color, imagery), conventional in the skeleton (navigation, forms, controls). Novel structure costs more than it impresses.
- **vs. [Doherty Threshold](doherty-threshold.md):** webfonts, hero images, and animation cost load time. Budget for them: ≤ 2 font files with `font-display: swap`, AVIF, lazy-load below the fold.
- **vs. [Von Restorff](von-restorff.md):** restraint is what makes the single accent work. When everything is accent-colored, nothing stands out.

## Quick test

Blur or squint at the screen: is there a clear hierarchy, one accent, and an even rhythm? Then hide the logo: could this page belong to any of a thousand template startups?
