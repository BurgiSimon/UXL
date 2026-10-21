## UXL static scan

**1** files scanned · **4** findings (**0** critical, **0** major, **4** minor) · heuristic score **94/100**

### Minor (4)

| Location | Rule | Law | Finding | Remedy |
|---|---|---|---|---|
| `docs/lumenvale/without-uxl/index.html:558` | `slow-animation` | §L06 Doherty Threshold, §L08 Flow | transition: fill 1.2s var(--ease-theme) | Use 150-300ms for UI transitions (enter ~200-250ms ease-out, exit ~150ms). |
| `docs/lumenvale/without-uxl/index.html:563` | `slow-animation` | §L06 Doherty Threshold, §L08 Flow | transition: transform 1.2s var(--ease-out-expo) 0.2s | Use 150-300ms for UI transitions (enter ~200-250ms ease-out, exit ~150ms). |
| `docs/lumenvale/without-uxl/index.html:519` | `tiny-text` | §L01 Aesthetic-Usability Effect, §L05 Cognitive Load | font-size: 0.6875rem on `.rail a` | Body text >= 16px; captions/labels >= 12px. |
| `docs/lumenvale/without-uxl/index.html:545` | `tiny-text` | §L01 Aesthetic-Usability Effect, §L05 Cognitive Load | font-size: 0.625rem on `.rail a` | Body text >= 16px; captions/labels >= 12px. |

Laws implicated: §L06×2, §L08×2, §L01×2, §L05×2
Not statically checkable (review manually): §L12 Law of Common Region, §L16 Law of Uniform Connectedness, §L19 Occam's Razor, §L21 Pareto Principle, §L26 Serial Position Effect, §L30 Zeigarnik Effect
Heuristic scan: verify each finding in context. Pair with uxl_audit.mjs for rendered measurements.
