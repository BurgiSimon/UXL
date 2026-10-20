# Changelog

## 1.0.0 (2026-10-20)

First release.

Eval-driven refinements, from two skill-creator iterations (with vs. without skill, 3 tasks):
- Verification is proportionate: scan, fix, re-scan once, and exercise the main flow (happy path plus one failure). In fix mode the case file goes into the hand-off. Scanner findings are evidence, not verdicts.
- Target sizing follows the input type (`pointer: coarse`) rather than screen width. Labels must fit at 360px. Persisted UI state must not cause flashes or hydration mismatches. The hand-off respects the requested format and length.
- Scanner accuracy: grouped navigation counts one choice per group; a repeated identical CTA is not competition; focus rings drawn via `:focus-within` and transitions are recognised; honeypot fields are ignored; postal codes are not forced to a numeric keyboard; icons inside buttons are not counted as targets. New optional 360px `small` viewport.
- Fair trigger evaluator (`evals/trigger_eval.py`): 20/20 correct.

- `ux-lawyer` Agent Skill with Build, Audit & Fix and Consult modes, plus the UXL statutes (numeric defaults backed by the laws).
- 30 law references (one per Law of UX). Each has build rules for desktop and mobile, code patterns, an audit table and trade-offs.
- Component playbook covering 25 patterns, mobile and desktop platform guides, design tokens, law tensions, the audit workflow, a pre-ship checklist and a case-file template.
- `uxl_lint.py`: a static linter with 31 rules mapped to laws. Stdlib only. Handles HTML, CSS, JSX/TSX, Vue, Svelte, Astro and Tailwind.
- `uxl_audit.mjs`: a Playwright runtime auditor with 19 checks at mobile and desktop viewports, plus annotated screenshots.
- Claude Code plugin and marketplace with `/uxl:build`, `/uxl:audit`, `/uxl:fix`, `/uxl:law` and the `ux-auditor` agent.
- Generated adapters for AGENTS.md, Cursor, GitHub Copilot and Windsurf; a Gemini CLI extension manifest; `install.sh`.
