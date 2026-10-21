# UXL runtime audit

**3** page renders · **8** findings (**0** critical, **3** major, **5** minor) · heuristic score **80/100**

Each finding cites the Law of UX it violates (lawsofux.com). Measurements are heuristics. Confirm visually in the annotated screenshots.

## http://127.0.0.1:8765/ · small

- Targets: 25 interactive, 0 undersized · Body text: 14px · Font sizes: 9 · Families: mona sans
- Paint: FCP 100ms · LCP 100ms · CLS 0.000 · Filled CTAs in first screen: 0 · h1: 1
- Screenshots: `127.0.0.1-8765-small.png` (first screen), `127.0.0.1-8765-small-annotated.png` (annotated)

| Severity | Rule | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|---|
| major | `contrast` | §L01 Aesthetic-Usability Effect, §L25 Selective Attention | 12 text elements below WCAG AA contrast (12 below 3:1) | h1#light-title "Light, held." 1.00:1 (needs 3:1); div.hero-copy > div.hero-action > a.btn.btn-primary "Reserve a Cube" 1.00:1 (needs 4.5:1); h2#turn-title "Turn it yourself." 1.00:1 (needs 3:1); section#turn > div.ch-head.wrap > p.lede "Drag or swipe the Cube, or use the arrow" 1.00:1 (needs 4.5:1); | Text contrast >= 4.5:1 (>= 3:1 for >= 24px or >= 18.7px bold). |
| minor | `text-too-small` | §L01 Aesthetic-Usability Effect, §L05 Cognitive Load | Most body text renders at 14px on mobile | 32% of characters | Body text >= 16px on mobile; nothing below 12px. |
| minor | `font-sprawl` | §L15 Law of Similarity, §L14 Law of Prägnanz, §L01 Aesthetic-Usability Effect | 9 distinct font sizes in use | 12, 14, 15, 16, 17, 18, 22, 36, 56 | Use a type scale of ~6-8 sizes and at most 2 font families. |

## http://127.0.0.1:8765/ · mobile

- Targets: 25 interactive, 0 undersized · Body text: 14px · Font sizes: 9 · Families: mona sans
- Paint: FCP 128ms · LCP 128ms · CLS 0.000 · Filled CTAs in first screen: 0 · h1: 1
- Screenshots: `127.0.0.1-8765-mobile.png` (first screen), `127.0.0.1-8765-mobile-annotated.png` (annotated)

| Severity | Rule | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|---|
| major | `contrast` | §L01 Aesthetic-Usability Effect, §L25 Selective Attention | 12 text elements below WCAG AA contrast (12 below 3:1) | h1#light-title "Light, held." 1.00:1 (needs 3:1); div.hero-copy > div.hero-action > a.btn.btn-primary "Reserve a Cube" 1.00:1 (needs 4.5:1); h2#turn-title "Turn it yourself." 1.00:1 (needs 3:1); section#turn > div.ch-head.wrap > p.lede "Drag or swipe the Cube, or use the arrow" 1.00:1 (needs 4.5:1); | Text contrast >= 4.5:1 (>= 3:1 for >= 24px or >= 18.7px bold). |
| minor | `text-too-small` | §L01 Aesthetic-Usability Effect, §L05 Cognitive Load | Most body text renders at 14px on mobile | 32% of characters | Body text >= 16px on mobile; nothing below 12px. |
| minor | `font-sprawl` | §L15 Law of Similarity, §L14 Law of Prägnanz, §L01 Aesthetic-Usability Effect | 9 distinct font sizes in use | 12, 14, 15, 16, 17, 18, 22, 36, 56 | Use a type scale of ~6-8 sizes and at most 2 font families. |

## http://127.0.0.1:8765/ · desktop

- Targets: 30 interactive, 0 undersized · Body text: 18.72px · Font sizes: 13 · Families: mona sans
- Paint: FCP 124ms · LCP 124ms · CLS 0.001 · Filled CTAs in first screen: 0 · h1: 1
- Screenshots: `127.0.0.1-8765-desktop.png` (first screen), `127.0.0.1-8765-desktop-annotated.png` (annotated)

| Severity | Rule | Law | Finding | Evidence | Remedy |
|---|---|---|---|---|---|
| major | `contrast` | §L01 Aesthetic-Usability Effect, §L25 Selective Attention | 12 text elements below WCAG AA contrast (12 below 3:1) | h1#light-title "Light, held." 1.00:1 (needs 3:1); div.hero-copy > div.hero-action > a.btn.btn-primary "Reserve a Cube" 1.00:1 (needs 4.5:1); h2#turn-title "Turn it yourself." 1.00:1 (needs 3:1); section#turn > div.ch-head.wrap > p.lede "Drag or swipe the Cube, or use the arrow" 1.00:1 (needs 4.5:1); | Text contrast >= 4.5:1 (>= 3:1 for >= 24px or >= 18.7px bold). |
| minor | `font-sprawl` | §L15 Law of Similarity, §L14 Law of Prägnanz, §L01 Aesthetic-Usability Effect | 13 distinct font sizes in use | 12, 13, 14, 15, 16, 17, 18.72, 20, 20.96, 23, 27.9994, 63.9994, 158.4 | Use a type scale of ~6-8 sizes and at most 2 font families. |

---

Not measurable at runtime (review manually): §L04 Cognitive Bias, §L12 Law of Common Region, §L16 Law of Uniform Connectedness, §L19 Occam's Razor, §L20 Paradox of the Active User, §L21 Pareto Principle, §L22 Parkinson's Law, §L23 Peak-End Rule, §L27 Tesler's Law, §L30 Zeigarnik Effect