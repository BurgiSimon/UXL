# When laws conflict

The laws describe forces, not commandments, and they sometimes pull in opposite directions. Name the tension, pick the resolution that serves the user's *primary task*, and say which law you favored and why.

| Tension | What goes wrong | Resolution |
|---|---|---|
| **Hick's Law** (fewer choices) vs **power users / Pareto** (features they need) | Hiding features frustrates experts; showing all overwhelms newcomers | Progressive disclosure: show the top 20% ([§L21](laws/pareto-principle.md)), put the rest in "More", settings, or a ⌘K command palette; keyboard shortcuts for experts |
| **Fitts's Law** (big targets) vs **Occam / density** (compact UI) | Huge buttons waste space in data tools; tiny ones fail on touch | Expand hit areas invisibly (`::after`), 44px on touch, 32px dense mode only for pointer-only desktop; offer a density toggle |
| **Jakob's Law** (conventions) vs **brand distinctiveness / Von Restorff** | Novel layouts confuse; generic ones are forgettable | Conventional skeleton, distinctive skin: standard structure and interactions, unique type/color/imagery/motion |
| **Aesthetic-Usability** (polish) vs **Occam's Razor** (simplicity) | Decoration competes with content; or bare UI feels untrustworthy | Polish that serves hierarchy (type, spacing, one accent); remove decoration that doesn't help the user see what matters |
| **Chunking / Goal-Gradient** (split into steps) vs **Parkinson / Occam** (fewer clicks) | Too many steps feel slow; one giant form feels endless | One page for ≤ 6–8 related fields; steps (3–5) when topics differ or it's longer; show progress; offer express paths (wallets, saved data) |
| **Postel's Law** (accept liberally) vs **security & data quality** | Lax parsing lets garbage or attacks through | Accept flexible *formats* (spaces, dashes, case), normalize, then validate *meaning*; always re-validate on the server |
| **Tesler's Law** (absorb complexity) vs **Occam's Razor** (simplify) | Over-simplified UI hides choices users genuinely need (timezone, units, tax) | Default intelligently (detect, infer) but keep the essential choice visible and editable |
| **Doherty Threshold** (speed) vs **Aesthetic-Usability** (motion) | Long animations make the app feel slow | 150–300ms, transform/opacity only, never block input; motion should make things *feel* faster |
| **Von Restorff** (make it stand out) vs **Selective Attention** (banner blindness) | Highlighting many things trains users to ignore all of them, and loud boxes look like ads | One emphasis per view; emphasize with hierarchy (size, weight, position), not banners and flashing |
| **Zeigarnik / Goal-Gradient** (show what's unfinished) vs **Flow** (don't interrupt) | Nagging completion prompts interrupt the task at hand | Surface progress at natural breakpoints (after success, on the dashboard), never mid-task; make prompts dismissible |
| **Mental Model** (familiar) vs **innovation** | New paradigms violate expectations | Map new concepts to familiar metaphors; teach in context while users act ([§L20](laws/active-user-paradox.md)); keep an escape hatch |
| **Serial Position** (importance order) vs **Mental Model** (alphabetical/logical order) | Importance-ordered long lists are hard to scan; alphabetical nav buries key items | Short lists (nav, tabs, ≤ 7): order by importance, key items first/last. Long known sets (countries, brands): alphabetical + search |
| **Choice Overload** (recommend) vs **Cognitive Bias** ethics | "Most popular" badge used as a manipulation | Recommend only what genuinely fits most users and say why ("Best for teams of 5–50"); never a fake badge or decoy |
| **Peak-End** (delight) vs **Occam** (no extras) | Confetti everywhere becomes noise | Spend delight only at the peak (value moment) and the end (success); keep it short and respect reduced motion |
| **Working Memory** (keep context visible) vs **Cognitive Load** (less on screen) | Showing everything clutters; hiding forces recall | Show *the context needed for the current decision* (summary, selections, comparison); collapse the rest |
| **Paradox of the Active User** (learn by doing) vs **Cognitive Load** (don't overwhelm) | Throwing users into a complex tool with no guidance | Empty states with one clear first action, contextual tips one at a time, sensible defaults and sample data |

## Tie-breakers

When you still can't decide:
1. **Accessibility and honesty win.** Never trade WCAG basics or ethics ([§L04](laws/cognitive-bias.md)) for anything.
2. **The critical task wins** ([§L21](laws/pareto-principle.md)): optimize the path the most users take most often.
3. **Convention wins on structure, brand wins on style** ([§L11](laws/jakobs-law.md)).
4. **Measure if it matters:** propose an A/B test or usability check, and ship the safer, more conventional option meanwhile.
