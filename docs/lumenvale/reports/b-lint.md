## UXL static scan

**1** files scanned · **2** findings (**0** critical, **1** major, **1** minor) · heuristic score **94/100**

### Major (1)

| Location | Rule | Law | Finding | Remedy |
|---|---|---|---|---|
| `docs/lumenvale/with-uxl/index.html:212` | `multiple-primary-cta` | §L28 Von Restorff Effect, §L10 Hick's Law | 6 primary-styled actions (5 different) in one file/view | Keep one primary action per view; demote the rest to secondary/tertiary styles. |

### Minor (1)

| Location | Rule | Law | Finding | Remedy |
|---|---|---|---|---|
| `docs/lumenvale/with-uxl/index.html:154` | `slow-animation` | §L06 Doherty Threshold, §L08 Flow | transition: background-color .9s var(--ease-theme),  | Use 150-300ms for UI transitions (enter ~200-250ms ease-out, exit ~150ms). |

Laws implicated: §L28×1, §L10×1, §L06×1, §L08×1
Not statically checkable (review manually): §L12 Law of Common Region, §L16 Law of Uniform Connectedness, §L19 Occam's Razor, §L21 Pareto Principle, §L26 Serial Position Effect, §L30 Zeigarnik Effect
Heuristic scan: verify each finding in context. Pair with uxl_audit.mjs for rendered measurements.
