#!/usr/bin/env python3
"""Validate the UXL skill: frontmatter, the 30 law files, links and check-id references.

Run from the repo root: python3 tools/validate_skill.py
Exits non-zero on any error. Stdlib only.
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILL = os.path.join(ROOT, "skills", "ux-lawyer")
LAWS_DIR = os.path.join(SKILL, "references", "laws")

EXPECTED_LAWS = {
    "L01": "aesthetic-usability", "L02": "choice-overload", "L03": "chunking", "L04": "cognitive-bias",
    "L05": "cognitive-load", "L06": "doherty-threshold", "L07": "fitts-law", "L08": "flow", "L09": "goal-gradient",
    "L10": "hicks-law", "L11": "jakobs-law", "L12": "common-region", "L13": "proximity", "L14": "pragnanz",
    "L15": "similarity", "L16": "uniform-connectedness", "L17": "mental-model", "L18": "millers-law",
    "L19": "occams-razor", "L20": "active-user-paradox", "L21": "pareto-principle", "L22": "parkinsons-law",
    "L23": "peak-end-rule", "L24": "postels-law", "L25": "selective-attention", "L26": "serial-position",
    "L27": "teslers-law", "L28": "von-restorff", "L29": "working-memory", "L30": "zeigarnik-effect",
}
LAW_KEYS = ["id", "name", "source", "origin", "category", "summary", "applies_to", "rules"]
LAW_SECTIONS = ["## In plain words", "## Why it matters in a UI", "## Build it right", "### Everywhere", "### Mobile",
                "### Desktop", "## Code patterns", "## Audit: violations to look for", "## Tensions & trade-offs", "## Quick test"]
CATEGORIES = {"perception", "cognition", "decision", "interaction", "motivation", "strategy"}

errors, warnings = [], []


def err(msg):
    errors.append(msg)


def frontmatter(text):
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    return m.group(1) if m else None


def fm_value(fm, key):
    m = re.search(rf"^{key}:\s*(.*)$", fm, re.M)
    return m.group(1).strip().strip('"') if m else None


def check_ids():
    """Collect rule ids defined by the two scripts."""
    lint = open(os.path.join(SKILL, "scripts", "uxl_lint.py"), encoding="utf-8").read()
    audit = open(os.path.join(SKILL, "scripts", "uxl_audit.mjs"), encoding="utf-8").read()
    lint_ids = set(re.findall(r'Rule\("([a-z0-9-]+)"', lint))
    audit_block = audit[audit.index("const RULES = {"): audit.index("};", audit.index("const RULES = {"))]
    audit_ids = set(re.findall(r'"([a-z0-9-]+)":\s*\{\s*laws', audit_block))
    return lint_ids, audit_ids


def check_skill_md():
    path = os.path.join(SKILL, "SKILL.md")
    text = open(path, encoding="utf-8").read()
    fm = frontmatter(text)
    if not fm:
        return err("SKILL.md: missing frontmatter")
    name = fm_value(fm, "name")
    desc = fm_value(fm, "description")
    if name != os.path.basename(SKILL):
        err(f"SKILL.md: name '{name}' must match directory '{os.path.basename(SKILL)}'")
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name or "") or len(name) > 64:
        err("SKILL.md: invalid name")
    if not desc or len(desc) > 1024:
        err(f"SKILL.md: description length {len(desc or '')} (must be 1..1024)")
    if "<" in (desc or "") and ">" in (desc or ""):
        err("SKILL.md: description must not contain XML tags")
    body_lines = text.count("\n")
    if body_lines > 500:
        warnings.append(f"SKILL.md is {body_lines} lines (guideline: < 500)")
    return text


def check_links(path, text):
    base = os.path.dirname(path)
    for m in re.finditer(r"\]\(([^)#\s]+)(#[^)]*)?\)", text):
        target = m.group(1)
        if re.match(r"[a-z]+:", target):
            continue
        if not os.path.exists(os.path.normpath(os.path.join(base, target))):
            err(f"{os.path.relpath(path, ROOT)}: broken link -> {target}")
    for m in re.finditer(r"`((?:references|assets|scripts)/[\w./-]+)`", text):
        p = m.group(1).rstrip(".")
        if "<" in p or "*" in p:
            continue
        cand = [os.path.join(SKILL, p), os.path.join(base, p)]
        if not any(os.path.exists(c) for c in cand):
            err(f"{os.path.relpath(path, ROOT)}: missing referenced file `{p}`")


def check_laws(lint_ids, audit_ids):
    files = sorted(f for f in os.listdir(LAWS_DIR) if f.endswith(".md"))
    expected_files = {v + ".md" for v in EXPECTED_LAWS.values()}
    for missing in expected_files - set(files):
        err(f"laws: missing {missing}")
    for extra in set(files) - expected_files:
        err(f"laws: unexpected file {extra}")
    for f in files:
        path = os.path.join(LAWS_DIR, f)
        text = open(path, encoding="utf-8").read()
        fm = frontmatter(text)
        rel = os.path.relpath(path, ROOT)
        if not fm:
            err(f"{rel}: missing frontmatter")
            continue
        for k in LAW_KEYS:
            if not re.search(rf"^{k}:", fm, re.M):
                err(f"{rel}: frontmatter missing '{k}'")
        lid = fm_value(fm, "id")
        if EXPECTED_LAWS.get(lid) + ".md" != f if lid in EXPECTED_LAWS else True:
            err(f"{rel}: id {lid} does not match file name")
        if fm_value(fm, "category") not in CATEGORIES:
            err(f"{rel}: bad category")
        if not (fm_value(fm, "source") or "").startswith("https://lawsofux.com/"):
            err(f"{rel}: source must link lawsofux.com")
        summary = fm_value(fm, "summary") or ""
        if len(summary) > 140:
            err(f"{rel}: summary > 140 chars")
        rules = re.findall(r"^\s+-\s+\"(.*)\"\s*$", fm, re.M)
        if not 3 <= len(rules) <= 5:
            err(f"{rel}: expected 3-5 rules, got {len(rules)}")
        pos = -1
        for sec in LAW_SECTIONS:
            i = text.find("\n" + sec + "\n")
            if i < 0:
                err(f"{rel}: missing section '{sec}'")
            elif i < pos:
                err(f"{rel}: section '{sec}' out of order")
            pos = max(pos, i)
        if f"({lid})" not in text.split("\n## ")[0]:
            err(f"{rel}: H1 should end with ({lid})")
        check_links(path, text)
        check_refs(rel, text, lint_ids, audit_ids)


def check_refs(rel, text, lint_ids, audit_ids):
    for kind, ids in (("lint", lint_ids), ("audit", audit_ids)):
        for m in re.finditer(rf"\b{kind}:\s*([a-z0-9][a-z0-9-]*(?:\s*,\s*[a-z0-9][a-z0-9-]*)*)", text):
            for rid in re.split(r"\s*,\s*", m.group(1)):
                if rid and rid not in ids and rid not in ("lint", "audit"):
                    err(f"{rel}: unknown {kind} check '{rid}'")


def check_plugin():
    for name in ("plugin.json", "marketplace.json"):
        p = os.path.join(ROOT, ".claude-plugin", name)
        try:
            json.load(open(p, encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            err(f".claude-plugin/{name}: {e}")
    for d in ("commands", "agents"):
        for f in os.listdir(os.path.join(ROOT, d)):
            text = open(os.path.join(ROOT, d, f), encoding="utf-8").read()
            if not frontmatter(text) or "description:" not in frontmatter(text):
                err(f"{d}/{f}: needs frontmatter with description")


def main():
    lint_ids, audit_ids = check_ids()
    text = check_skill_md()
    if text:
        check_links(os.path.join(SKILL, "SKILL.md"), text)
    for f in os.listdir(os.path.join(SKILL, "references")):
        if f.endswith(".md"):
            p = os.path.join(SKILL, "references", f)
            t = open(p, encoding="utf-8").read()
            check_links(p, t)
            check_refs(os.path.relpath(p, ROOT), t, lint_ids, audit_ids)
    for f in os.listdir(os.path.join(SKILL, "assets")):
        if f.endswith(".md"):
            p = os.path.join(SKILL, "assets", f)
            t = open(p, encoding="utf-8").read()
            check_refs(os.path.relpath(p, ROOT), t, lint_ids, audit_ids)
    check_laws(lint_ids, audit_ids)
    check_plugin()
    for w in warnings:
        print("warning:", w)
    for e in errors:
        print("error:", e)
    print(f"{len(errors)} error(s), {len(warnings)} warning(s); lint rules: {len(lint_ids)}, audit rules: {len(audit_ids)}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
