#!/usr/bin/env python3
"""Generate compact UXL rule files for agents that don't load Agent Skills.

Source of truth: skills/ux-lawyer/SKILL.md (statutes) + references/laws/*.md (frontmatter).
Outputs (committed):
  adapters/AGENTS.md                              AGENTS.md-style (Codex, Jules, Amp, OpenCode, Zed, …)
  adapters/cursor/ux-lawyer.mdc                   Cursor project rule
  adapters/copilot/ux-lawyer.instructions.md      GitHub Copilot path-specific instructions
  adapters/windsurf/ux-lawyer.md                  Windsurf / Devin Desktop rule
  adapters/claude-ai/ux-lawyer.zip              Skill zip for claude.ai upload (built by --zip)

Usage: python3 tools/build_adapters.py [--check] [--zip]
  --check  exit 1 if generated files are out of date (CI)
"""

import os
import re
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILL = os.path.join(ROOT, "skills", "ux-lawyer")
LAWS = os.path.join(SKILL, "references", "laws")
OUT = os.path.join(ROOT, "adapters")
REPO = "https://github.com/BurgiSimon/UXL"
UI_GLOBS = ["**/*.html", "**/*.css", "**/*.scss", "**/*.jsx", "**/*.tsx", "**/*.vue", "**/*.svelte", "**/*.astro"]


def law_entries():
    entries = []
    for f in os.listdir(LAWS):
        text = open(os.path.join(LAWS, f), encoding="utf-8").read()
        fm = re.match(r"---\n(.*?)\n---\n", text, re.S).group(1)
        get = lambda k: re.search(rf"^{k}:\s*\"?(.*?)\"?\s*$", fm, re.M).group(1)  # noqa: E731
        rules = re.findall(r"^\s+-\s+\"(.*)\"\s*$", fm, re.M)
        entries.append({"id": get("id"), "name": get("name"), "summary": get("summary"), "source": get("source"),
                        "category": get("category"), "rules": rules, "file": f})
    return sorted(entries, key=lambda e: e["id"])


def statutes():
    text = open(os.path.join(SKILL, "SKILL.md"), encoding="utf-8").read()
    start = text.index("## The statutes")
    end = text.index("## Build mode")
    block = text[start:end].strip()
    block = re.sub(r"`references/laws/([\w-]+)\.md`", rf"`{REPO}/blob/main/skills/ux-lawyer/references/laws/\1.md`", block)
    block = block.replace("`references/design-tokens.md`", f"`{REPO}/blob/main/skills/ux-lawyer/references/design-tokens.md`")
    block = block.replace("`assets/uxl-tokens.css`", f"`{REPO}/blob/main/skills/ux-lawyer/assets/uxl-tokens.css`")
    return block


def body(laws):
    lines = [
        "# UXL: UX Lawyer rules",
        "",
        f"> Generated from the [UXL skill]({REPO}) by `tools/build_adapters.py`. Do not edit by hand.",
        "> The full skill (deep references per law, component playbook, tokens, static and Playwright audit scripts)",
        f"> works natively in agents that support Agent Skills: `npx skills add BurgiSimon/UXL` or see {REPO}#install.",
        "",
        "When you create or change any user-facing UI (websites, web apps, pages, flows, components) for desktop **and** mobile,",
        "act as UX counsel: every decision should be defensible by one of the 30 Laws of UX (https://lawsofux.com, by Jon Yablonski).",
        "Cite laws as `§L07 Fitts's Law`. Build mode: brief (critical tasks, primary action per screen), structure, tokens,",
        "mobile-first composition, all states (loading/empty/error/success), journey polish, then verify against the checklist.",
        "Audit mode: scope critical flows, gather evidence, rank findings critical → major → minor with §-citation, evidence, impact, remedy; then fix root causes first.",
        "End UI work with a short \"UX decisions\" list (≤ 8 bullets, each citing its law).",
        "",
        statutes(),
        "",
        "## The 30 laws: rules to apply",
        "",
    ]
    for e in laws:
        lines.append(f"### §{e['id']} {e['name']}: {e['summary']}")
        lines += [f"- {r}" for r in e["rules"]]
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def write(path, content, check, stale):
    full = os.path.join(OUT, path)
    if check:
        if not os.path.exists(full) or open(full, encoding="utf-8").read() != content:
            stale.append(path)
        return
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as fh:
        fh.write(content)


def build_zip():
    os.makedirs(os.path.join(OUT, "claude-ai"), exist_ok=True)
    target = os.path.join(OUT, "claude-ai", "ux-lawyer.zip")
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(SKILL):
            for f in sorted(files):
                if "__pycache__" in root or f.endswith(".pyc"):
                    continue
                p = os.path.join(root, f)
                z.write(p, os.path.join("ux-lawyer", os.path.relpath(p, SKILL)))
    print("wrote", os.path.relpath(target, ROOT))


def main():
    check = "--check" in sys.argv
    laws = law_entries()
    assert len(laws) == 30, f"expected 30 laws, found {len(laws)}"
    content = body(laws)
    stale = []
    write("AGENTS.md", content, check, stale)
    write("cursor/ux-lawyer.mdc",
          "---\ndescription: UX Lawyer (UXL): apply the 30 Laws of UX when building, reviewing or fixing web UI for desktop and mobile\n"
          f"globs: {','.join(UI_GLOBS)}\nalwaysApply: false\n---\n\n" + content, check, stale)
    write("copilot/ux-lawyer.instructions.md",
          f"---\napplyTo: \"{','.join(UI_GLOBS)}\"\ndescription: UX Lawyer (UXL): the 30 Laws of UX for web UI\n---\n\n" + content, check, stale)
    write("windsurf/ux-lawyer.md",
          f"---\ntrigger: glob\nglobs: {','.join(UI_GLOBS)}\ndescription: UX Lawyer (UXL): the 30 Laws of UX for web UI\n---\n\n" + content, check, stale)
    if check:
        if stale:
            print("Out of date (run python3 tools/build_adapters.py):", ", ".join(stale))
            return 1
        print("adapters up to date")
        return 0
    if "--zip" in sys.argv:
        build_zip()
    size = len(content.encode("utf-8"))
    print(f"wrote adapters ({size / 1024:.1f} KiB of rules, {len(laws)} laws)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
