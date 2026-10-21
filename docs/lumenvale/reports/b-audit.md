# UXL runtime audit

**3** page renders · **3** findings (**0** critical, **0** major, **3** minor) · heuristic score **96/100**

Each finding cites the Law of UX it violates (lawsofux.com). Measurements are heuristics. Confirm visually in the annotated screenshots.

## with-uxl/index.html · small

- Targets: 27 interactive, 0 undersized · Body text: 17px · Font sizes: 11 · Families: public sans, hubot sans
- Paint: FCP 164ms · LCP 164ms · CLS 0.000 · Filled CTAs in first screen: 1 · h1: 1
- Screenshots: `screens/b-small.png` (first screen), `screens/b-small-annotated.png` (annotated)

| Severity | Rule | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|---|
| minor | `font-sprawl` | §L15 Law of Similarity, §L14 Law of Prägnanz, §L01 Aesthetic-Usability Effect | 11 distinct font sizes in use | 12, 14, 15, 17, 18, 20, 22, 28, 36, 40, 52 | Use a type scale of ~6-8 sizes and at most 2 font families. |

## with-uxl/index.html · mobile

- Targets: 27 interactive, 0 undersized · Body text: 17px · Font sizes: 11 · Families: public sans, hubot sans
- Paint: FCP 160ms · LCP 160ms · CLS 0.000 · Filled CTAs in first screen: 1 · h1: 1
- Screenshots: `screens/b-mobile.png` (first screen), `screens/b-mobile-annotated.png` (annotated)

| Severity | Rule | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|---|
| minor | `font-sprawl` | §L15 Law of Similarity, §L14 Law of Prägnanz, §L01 Aesthetic-Usability Effect | 11 distinct font sizes in use | 12, 14, 15, 17, 18, 20, 22, 28, 36, 40, 52 | Use a type scale of ~6-8 sizes and at most 2 font families. |

## with-uxl/index.html · desktop

- Targets: 33 interactive, 0 undersized · Body text: 14px · Font sizes: 12 · Families: public sans, hubot sans
- Paint: FCP 200ms · LCP 200ms · CLS 0.000 · Filled CTAs in first screen: 1 · h1: 1
- Screenshots: `screens/b-desktop.png` (first screen), `screens/b-desktop-annotated.png` (annotated)

| Severity | Rule | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|---|
| minor | `font-sprawl` | §L15 Law of Similarity, §L14 Law of Prägnanz, §L01 Aesthetic-Usability Effect | 12 distinct font sizes in use | 12, 14, 15, 17, 18, 20, 20.9995, 28, 31.9997, 87.9998, 110, 150 | Use a type scale of ~6-8 sizes and at most 2 font families. |

---

Not measurable at runtime (review manually): §L04 Cognitive Bias, §L12 Law of Common Region, §L16 Law of Uniform Connectedness, §L19 Occam's Razor, §L20 Paradox of the Active User, §L21 Pareto Principle, §L22 Parkinson's Law, §L23 Peak-End Rule, §L27 Tesler's Law, §L30 Zeigarnik Effect