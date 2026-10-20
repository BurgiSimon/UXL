# Changelog

## 1.0.0 (2026-10-20)

First release.

- `ux-lawyer` Agent Skill with Build, Audit & Fix and Consult modes, plus the UXL statutes (numeric defaults backed by the laws).
- 30 law references (one per Law of UX). Each has build rules for desktop and mobile, code patterns, an audit table and trade-offs.
- Component playbook covering 25 patterns, mobile and desktop platform guides, design tokens, law tensions, the audit workflow, a pre-ship checklist and a case-file template.
- `uxl_lint.py`: a static linter with 31 rules mapped to laws. Stdlib only. Handles HTML, CSS, JSX/TSX, Vue, Svelte, Astro and Tailwind.
- `uxl_audit.mjs`: a Playwright runtime auditor with 19 checks at mobile and desktop viewports, plus annotated screenshots.
- Claude Code plugin and marketplace with `/uxl:build`, `/uxl:audit`, `/uxl:fix`, `/uxl:law` and the `ux-auditor` agent.
- Generated adapters for AGENTS.md, Cursor, GitHub Copilot and Windsurf; a Gemini CLI extension manifest; `install.sh`.
