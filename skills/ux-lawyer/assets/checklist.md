# UXL pre-ship checklist

Run through this for every screen you built or changed, at **390px mobile** and **1440px desktop**. Each line cites the law it enforces. Automated where marked: `lint` = `scripts/uxl_lint.py`, `audit` = `scripts/uxl_audit.mjs`.

## Purpose & structure
- [ ] The screen has one job, and its `<h1>` states it in the user's words. §L21 §L17 · `audit: no-h1`
- [ ] Exactly **one** visually dominant primary action. Secondary actions are quieter, destructive ones separated. §L28 §L10 · `lint: multiple-primary-cta` `audit: cta-competition`
- [ ] Top-level nav ≤ 7 (desktop), 3–5 primary destinations on mobile, most important first/last. §L10 §L18 §L26 · `lint/audit: nav-overload`
- [ ] Long option sets have search, filters, grouping or a recommended default. §L02 · `lint: select-overload`
- [ ] Nothing on the screen that doesn't earn its place. §L19
- [ ] Standard conventions: logo → home, search/account/cart where expected, links look like links. §L11 §L15

## Layout & perception
- [ ] Spacing from the 4/8 scale; space within groups < space between groups. §L13 · `lint: spacing-off-scale`
- [ ] Related things share a container; containers nest at most two levels. §L12
- [ ] Same-looking elements behave the same; one style per role (tokens, not ad-hoc values). §L15 · `lint: font-size-sprawl, color-sprawl` `audit: font-sprawl, color-sprawl`
- [ ] Steps, tabs and related controls are visibly connected to their content. §L16
- [ ] Layout reads at a squint: few alignment edges, simple shapes. §L14
- [ ] Key content is not styled like an ad; no autoplaying carousels or attention-grabbing motion. §L25 · `lint: autoplay-carousel` `audit: autoplay-media`
- [ ] Looks intentional and polished (type scale, palette with one accent, consistent radii/shadows), not generic. §L01

## Reading & memory
- [ ] Body text ≥ 16px, line-height ~1.5, line length 45–75ch; nothing < 12px. §L05 · `lint: tiny-text` `audit: text-too-small`
- [ ] Text contrast ≥ 4.5:1 (large ≥ 3:1); input borders and icons ≥ 3:1. §L01 §L25 · `audit: contrast`
- [ ] Content chunked: headings, short paragraphs, lists, formatted numbers. §L03 §L18
- [ ] Context the user needs is visible (selections, summary, previous answers); no remembering across screens. §L29

## Touch, pointer, keyboard
- [ ] Touch targets ≥ 44×44px with ≥ 8px gaps; icon buttons have expanded hit areas. §L07 · `lint: small-target` `audit: tap-target-size, tap-target-spacing`
- [ ] Primary action within thumb reach on mobile (end of flow or sticky bottom bar, safe-area aware). §L07
- [ ] No hover-only content or actions; touch and keyboard equivalents exist. §L17 · `lint: hover-only`
- [ ] Every interactive element is a real `<button>`/`<a>` (or has role + keyboard support). §L11 §L24 · `lint: div-button`
- [ ] Visible `:focus-visible` style everywhere; logical tab order. §L24 · `lint: focus-outline-removed` `audit: focus-invisible`
- [ ] Viewport meta present; pinch-zoom not disabled; no horizontal scrolling on mobile. §L24 §L11 · `lint: viewport-missing, zoom-disabled` `audit: horizontal-overflow`

## Forms
- [ ] Visible label on every field (placeholder = example only). §L29 §L05 · `lint: placeholder-as-label, input-unlabeled` `audit: unlabeled-input`
- [ ] Correct `type` / `inputmode` / `autocomplete` on every field. §L24 §L22 · `lint: input-type-generic, autocomplete-missing`
- [ ] Inputs ≥ 16px font on mobile. §L08 · `lint: input-font-small` `audit: input-zoom`
- [ ] Flexible formats accepted and normalized (spaces, dashes, case, paste). §L24 · `lint: strict-pattern`
- [ ] Single column; grouped with fieldsets; > 6–8 fields → steps with progress. §L03 §L09 · `lint: form-long` `audit: form-load`
- [ ] Validation on blur/submit; errors inline, specific, input preserved; focus moves to first error. §L20 §L23
- [ ] Submit stays enabled; action labels say what happens ("Create account", not "Submit"). §L20 §L17 · `lint: disabled-submit, generic-button-label`
- [ ] Only necessary fields; smart defaults; the system does the work it can. §L27 §L22

## Feedback & states
- [ ] Press feedback < 100ms; results < 400ms or a pending state on the trigger. §L06
- [ ] Every async view has loading (skeleton), empty (teaches next step), error (cause + recovery) and success states. §L06 §L20 §L23 · `lint: async-no-feedback`
- [ ] Space reserved for images/async content (no layout shift); LCP ≤ 2.5s, CLS ≤ 0.1. §L06 · `lint: image-no-dimensions` `audit: slow-paint, layout-shift`
- [ ] No native `alert()`/`confirm()`; undo preferred over confirmation for reversible actions. §L08 · `lint: native-dialog-interrupt`
- [ ] Transitions 150–300ms; `prefers-reduced-motion` honored. §L06 §L25 · `lint: slow-animation, reduced-motion-missing`

## Journey & motivation
- [ ] Multi-step flows show "Step n of m" and let users go back without losing data. §L09
- [ ] Long or interruptible tasks autosave and can be resumed. §L30
- [ ] The task is as short as possible: autofill, defaults, express paths, honest time estimates. §L22
- [ ] The peak and the end are designed: clear success screen with next step; errors and waits handled kindly. §L23
- [ ] First-time users can succeed without instructions; help is contextual. §L20

## Honesty
- [ ] No fake urgency/scarcity, pre-checked add-ons or consent, confirmshaming, hidden costs, or hard cancellation. §L04 · `lint: dark-pattern-urgency, dark-pattern-precheck, dark-pattern-confirmshaming`
- [ ] Defaults chosen in the user's interest; recommendations are genuine. §L04 §L02
