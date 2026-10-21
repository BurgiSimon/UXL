# Design tokens & visual polish

Concrete values behind the UXL statutes, how to map them onto an existing system, and how to make an interface look *stunning* without breaking the laws. Drop-in files: `assets/uxl-tokens.css` (plain CSS custom properties + base layer) and `assets/uxl-theme.tailwind.css` (Tailwind v4 `@theme`).

**Rule zero:** if the project already has a design system, Tailwind config, or component library, *use it*. Map the statutes onto its existing tokens and only add what's missing (usually focus styles, target sizes, motion and states). Two competing token systems violate [§L15 Similarity](laws/similarity.md).

## Contents
1. Spacing
2. Typography
3. Targets & density
4. Color
5. Shape, depth, iconography
6. Motion & feedback timing
7. Layout & breakpoints
8. Mapping onto existing systems (Tailwind v3/v4, shadcn/ui, MUI, CSS-in-JS)
9. Making it stunning without breaking the law

---

## 1. Spacing ([§L13 Proximity](laws/proximity.md), [§L12 Common Region](laws/common-region.md))

Base unit **4px**. Allowed values: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 96 (128 for hero air).

| Relationship | Mobile | Desktop | Why |
|---|---|---|---|
| Icon ↔ its label | 4–8 | 4–8 | One unit |
| Label ↔ its input; heading ↔ its paragraph | 8 | 8 | Tightest grouping = strongest relation |
| Field ↔ next field; list item ↔ item | 16 | 16–20 | Siblings |
| Group ↔ group (fieldsets, card sections) | 24–32 | 32 | Separate groups clearly |
| Section ↔ section (page level) | 48–64 | 80–128 | Chapters of the page |
| Page gutter | 16 | 24–32 | Thumb room / breathing room |

Rule: **space inside a group is always smaller than space between groups.** If two things need a border to look separate, the spacing is wrong first.

## 2. Typography ([§L05 Cognitive Load](laws/cognitive-load.md), [§L14 Prägnanz](laws/pragnanz.md), [§L01](laws/aesthetic-usability.md))

- **Body:** 16px minimum (17–18px for long-form/marketing), line-height 1.5–1.6, measure 45–75ch (`max-width: 65ch`).
- **Scale:** ratio ~1.2 (apps, dense UI) or ~1.25–1.333 (marketing). 6–8 sizes total. UXL default: 12 · 14 · 16 · 18 · 20 · 24 · 30 · 36–44 · 40–60 (fluid hero via `clamp()`).
- **Headings:** line-height 1.05–1.25, `text-wrap: balance`, tighter letter-spacing on large display sizes (`-0.01em` to `-0.03em`).
- **Weights:** 400 body, 500–600 UI labels/buttons, 600–700 headings. Avoid 300 for body text on screens.
- **Families:** max 2 (one sans for UI + optionally one serif or display for headlines). Use `font-display: swap` and preload the primary weight to protect [§L06](laws/doherty-threshold.md).
- **Numbers:** `font-variant-numeric: tabular-nums` in tables, prices, timers.
- **Inputs:** ≥ 16px on mobile, always (iOS zooms otherwise, [§L08](laws/flow.md)).
- **Floor:** nothing below 12px; secondary text ≥ 14px on desktop, ≥ 14–15px on mobile.

Type pairings with character (pick per brand, don't default to the same one every time):

| Mood | Headline | Body/UI |
|---|---|---|
| Crisp SaaS / developer | Geist, Inter Tight | Geist, Inter |
| Warm, human, editorial | Newsreader, Fraunces, Source Serif 4 | Inter, Public Sans |
| Technical / data | IBM Plex Sans, Space Grotesk | IBM Plex Sans |
| Friendly consumer | Manrope, DM Sans, Plus Jakarta Sans | same family |
| Premium / luxury | Instrument Serif, Cormorant | Inter, Satoshi |
System-font stacks are a perfectly good, fastest-possible choice for apps.

## 3. Targets & density ([§L07 Fitts](laws/fitts-law.md))

| Token | Value | Use |
|---|---|---|
| `--target-min` | 44px | Every touch target (buttons, links in nav, inputs, toggles) |
| `--target-lg` | 48px | Primary actions on mobile, sticky CTAs |
| `--target-dense` | 32px | Pointer-only, dense desktop tools (tables, toolbars). Never < 24px |
| `--target-gap` | 8px | Minimum gap between separate targets |

Offer density modes in data-heavy desktop apps ("Comfortable / Compact") rather than shipping compact as the only option. On `(pointer: coarse)`, force comfortable.

## 4. Color ([§L28 Von Restorff](laws/von-restorff.md), [§L15 Similarity](laws/similarity.md), [§L25](laws/selective-attention.md))

- **Roles, not hex codes:** `bg, surface, surface-2, border, border-strong, text, text-muted, text-subtle, accent, accent-contrast, accent-soft, danger, success, warning, focus`. Components reference roles only.
- **One accent.** The accent color is the visual promise "this is the action". Use it for the primary CTA, active nav state, links, focus/selection. Not for decoration. Roughly 60% neutral surfaces / 30% secondary neutrals and text / ≤ 10% accent.
- **Tinted neutrals:** nudge grays slightly toward the brand hue (warm or cool) so the palette feels designed rather than default.
- **Contrast:** body text ≥ 4.5:1, large text (≥ 24px or ≥ 18.7px bold) ≥ 3:1, UI component boundaries (input borders, focus rings, icons that convey meaning) ≥ 3:1. Check every pair you introduce.
- **Status colors** always paired with an icon or text: never meaning by color alone.
- **Dark mode:** don't invert; re-tune. Surfaces get *lighter* as they elevate, accents get lighter/less saturated, keep the same roles. Avoid pure #000 backgrounds and pure #fff text (halation); use ~#121212 / ~#f2f2f2.

## 5. Shape, depth, iconography ([§L14](laws/pragnanz.md), [§L15](laws/similarity.md), [§L12](laws/common-region.md))

- **One radius family:** e.g. 6 (inputs, small) / 10 (buttons, cards) / 16 (sheets, modals) / full (pills, avatars). Nested radii: inner = outer − padding.
- **Depth ramp of 2–3 shadows,** used to mean elevation (dropdowns > cards > page), not decoration. Prefer a 1px border + subtle shadow over heavy shadows.
- **Containers lightest-first:** whitespace → tinted background → border → shadow. Max two levels of nesting.
- **One icon set** (Lucide, Phosphor, Heroicons, Material Symbols), one stroke width, sized 16/20/24. Icons accompany labels; icon-only buttons need `aria-label` and a tooltip on desktop.

## 6. Motion & feedback timing ([§L06 Doherty](laws/doherty-threshold.md), [§L08 Flow](laws/flow.md), [§L25](laws/selective-attention.md))

| Situation | Response |
|---|---|
| Press / tap | Visual acknowledgement < 100ms (`:active`, pressed state) |
| Action result | < 400ms, or show pending state on the trigger (spinner/label "Saving…") |
| Content load 300ms–1s | Skeleton matching final layout (delay showing it ~150–300ms to avoid flashes) |
| Load > 1s | Skeleton or spinner + keep the rest of the UI usable |
| Job > ~4–10s | Determinate progress (%, steps), allow leaving and notify when done |
| Low-risk mutations | Optimistic UI + undo; reconcile on failure |

Durations: 100 (press), 150 (hover, exit), 200–250 (enter, expand), 300 (sheets/drawers). Enter with ease-out, exit with ease-in, faster exits than enters. Animate `transform`/`opacity` only. Always honor `prefers-reduced-motion` (replace movement with fades or nothing).

## 7. Layout & breakpoints

- Mobile-first. Design at **360–390px** first; breakpoints `640 / 768 / 1024 / 1280 / 1536`.
- Containers: content `65ch` for reading, app `1200px`, wide dashboards `1440px`; let backgrounds bleed, not text.
- Grid: 4 columns mobile, 8 tablet, 12 desktop; gutters 16 / 24 / 32.
- Sticky header ≤ 64px desktop, ≤ 56px mobile (it eats the viewport). Hide-on-scroll-down/show-on-scroll-up for content sites.
- Use `100dvh` (not `100vh`) for full-height mobile layouts; respect `env(safe-area-inset-*)`.

## 8. Mapping onto existing systems

**Tailwind v4:** import `assets/uxl-theme.tailwind.css` after `tailwindcss`. Utilities become `bg-accent`, `text-muted`, `min-h-target`, `tap-target`, `hit-area`, `measure`.

**Tailwind v3** (`tailwind.config.js`):
```js
theme: { extend: {
  colors: { accent: { DEFAULT: "var(--accent)", contrast: "var(--accent-contrast)" }, muted: "var(--text-muted)" },
  minHeight: { target: "44px" }, minWidth: { target: "44px" },
  transitionDuration: { fast: "150ms", base: "220ms" },
}}
```
Default Tailwind mappings: 44px = `h-11`/`min-h-11`, 48px = `h-12`; body `text-base`; inputs `text-base md:text-sm` (never bare `text-sm` on inputs).

**shadcn/ui:** keep its CSS variables (`--primary`, `--muted-foreground`, `--ring`…) and set them to the UXL roles. Bump `Button` default size to `h-11` on touch (`h-11 md:h-10`), icon size to `size-11 md:size-10`. Its `Input` already uses `text-base md:text-sm`. Good.

**MUI / Chakra / Mantine:** set theme spacing to 4 or 8, `shape.borderRadius`, palette roles, and component default sizes (`size="large"` on mobile CTAs). Disable ripple only if you replace it with another press state.

**CSS-in-JS:** export tokens as a typed object and generate CSS variables from it, so there's one source of truth.

## 9. Making it stunning without breaking the law ([§L01](laws/aesthetic-usability.md), [§L11](laws/jakobs-law.md))

**Conventional skeleton, distinctive skin.** Layout, navigation and interaction patterns stay familiar ([§L11](laws/jakobs-law.md)); personality lives in type, color, imagery, illustration, motion and copy.

Do:
- Pick a point of view: a typographic voice (e.g. a serif display face with a crisp sans UI), a signature accent, one memorable visual motif (grain, a shape language, a photographic style) used consistently.
- Create rhythm with generous, *consistent* whitespace and a strong type scale. Big confident headlines; restrained body.
- Use real content and real product imagery (screenshots, photos) instead of generic illustrations; crop with intent.
- Add depth sparingly: subtle borders, a soft shadow ramp, layered surfaces, a hint of texture or gradient *in the background*, not on text.
- Spend motion on meaning: entrance of key content, state changes, the success moment ([§L23](laws/peak-end-rule.md)).
- Polish the details users touch: hover/press/focus states, empty states, skeletons, form errors, the 404 page.

Avoid the generic "AI-generated UI" look:
- Default purple-to-blue gradients, gradient text on every heading, glassmorphism everywhere.
- Emoji as icons; random mixed icon sets.
- Everything centered; identical three-card feature grids repeated down the page.
- Overuse of pill badges, giant drop shadows, neon glows, 3–4 competing accent colors.
- Lorem ipsum, "Feature 1/2/3", stock-photo handshakes, vague hero copy ("Revolutionize your workflow").

Then check: does the polish make the primary action *more* obvious? If decoration competes with the CTA, it's breaking [§L28](laws/von-restorff.md) and [§L25](laws/selective-attention.md); remove it.
