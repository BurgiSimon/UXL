# UXL runtime audit

**3** page renders · **5** findings (**0** critical, **2** major, **3** minor) · heuristic score **86/100**

Each finding cites the Law of UX it violates (lawsofux.com). Measurements are heuristics. Confirm visually in the annotated screenshots.

## without-uxl/index.html · small

- Targets: 34 interactive, 1 undersized · Body text: 17px · Font sizes: 11 · Families: mona sans
- Paint: FCP 112ms · LCP 112ms · CLS 0.012 · Filled CTAs in first screen: 0 · h1: 1
- Screenshots: `screens/a-small.png` (first screen), `screens/a-small-annotated.png` (annotated)

| Severity | Rule | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|---|
| major | `tap-target-size` | §L07 Fitts's Law | 1 of 34 interactive targets are smaller than 44×44px | div#page > header.topbar > button.dial-toggle "0° Glass , open the chapter index" 41×44 | min-height/min-width 44px, or expand the hit area with ::after (inset: -10px). |
| minor | `font-sprawl` | §L15 Law of Similarity, §L14 Law of Prägnanz, §L01 Aesthetic-Usability Effect | 11 distinct font sizes in use | 12, 13, 14, 15, 16, 17, 18, 20, 32, 36, 62.64 | Use a type scale of ~6-8 sizes and at most 2 font families. |

## without-uxl/index.html · mobile

- Targets: 34 interactive, 1 undersized · Body text: 17px · Font sizes: 11 · Families: mona sans
- Paint: FCP 164ms · LCP 164ms · CLS 0.000 · Filled CTAs in first screen: 0 · h1: 1
- Screenshots: `screens/a-mobile.png` (first screen), `screens/a-mobile-annotated.png` (annotated)

| Severity | Rule | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|---|
| major | `tap-target-size` | §L07 Fitts's Law | 1 of 34 interactive targets are smaller than 44×44px | div#page > header.topbar > button.dial-toggle "0° Glass , open the chapter index" 41×44 | min-height/min-width 44px, or expand the hit area with ::after (inset: -10px). |
| minor | `font-sprawl` | §L15 Law of Similarity, §L14 Law of Prägnanz, §L01 Aesthetic-Usability Effect | 11 distinct font sizes in use | 12, 13, 14, 15, 16, 17, 18, 20, 32, 36, 67.86 | Use a type scale of ~6-8 sizes and at most 2 font families. |

## without-uxl/index.html · desktop

- Targets: 39 interactive, 0 undersized · Body text: 17px · Font sizes: 11 · Families: mona sans
- Paint: FCP 124ms · LCP 124ms · CLS 0.026 · Filled CTAs in first screen: 0 · h1: 1
- Screenshots: `screens/a-desktop.png` (first screen), `screens/a-desktop-annotated.png` (annotated)

| Severity | Rule | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|---|
| minor | `font-sprawl` | §L15 Law of Similarity, §L14 Law of Prägnanz, §L01 Aesthetic-Usability Effect | 11 distinct font sizes in use | 12, 13, 14, 15, 16, 17, 18, 20, 24.0005, 63.9994, 160 | Use a type scale of ~6-8 sizes and at most 2 font families. |

---

Not measurable at runtime (review manually): §L04 Cognitive Bias, §L12 Law of Common Region, §L16 Law of Uniform Connectedness, §L19 Occam's Razor, §L20 Paradox of the Active User, §L21 Pareto Principle, §L22 Parkinson's Law, §L23 Peak-End Rule, §L27 Tesler's Law, §L30 Zeigarnik Effect