#!/usr/bin/env python3
"""Grade UXL eval runs with the UXL scanners (objective assertions).

Layout (skill-creator workspace):
  <iteration>/eval-<id>-<name>/<config>/run-<n>/outputs/...

For every run this writes <run>/grading.json with the automated assertions graded and
manual assertions marked as pending (passed=false, evidence "PENDING manual review"),
unless a <run>/manual_grades.json exists ({"<assertion id>": {"passed": bool, "evidence": str}}).

Usage: python3 evals/grade.py <iteration-dir> [--evals evals/evals.json] [--no-audit]
"""

import argparse
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS = os.path.join(ROOT, "skills", "ux-lawyer", "scripts")
DELIVERABLES = {1: ["index.html"], 2: ["checkout.html", "styles.css"], 3: ["AppShell.tsx"]}
SEV = {"minor": 0, "major": 1, "critical": 2}


def run_lint(files):
    files = [f for f in files if os.path.exists(f)]
    if not files:
        return None
    out = subprocess.run([sys.executable, os.path.join(SCRIPTS, "uxl_lint.py"), *files, "--format", "json", "--max-per-rule", "0"],
                         capture_output=True, text=True)
    return json.loads(out.stdout)


def run_audit(html, out_dir):
    if not os.path.exists(html):
        return None
    subprocess.run(["node", os.path.join(SCRIPTS, "uxl_audit.mjs"), html, "--out", out_dir], capture_output=True, text=True, timeout=300)
    p = os.path.join(out_dir, "report.json")
    return json.load(open(p)) if os.path.exists(p) else None


def lint_hits(lint, rules):
    return [f for f in (lint or {}).get("findings", []) if f["rule"] in rules]


def audit_hits(audit, rules, viewport=None, sev_min=None):
    hits = []
    for page in (audit or {}).get("pages", []):
        if viewport and page["viewport"] != viewport:
            continue
        for f in page.get("findings", []):
            if f["rule"] in rules and (sev_min is None or SEV[f["severity"]] >= SEV[sev_min]):
                hits.append(f)
    return hits


def describe(hits, n=3):
    return "; ".join(f"{h['rule']} ({h['severity']}{', ' + h.get('viewport', '') if h.get('viewport') else ''}): "
                     f"{h['message']}" + (f" @ {os.path.basename(h['file'])}:{h['line']}" if h.get("file") else "") for h in hits[:n])


def grade_assertion(a, lint, audit):
    t = a["type"]
    if t == "manual":
        return None
    if t == "lint":
        if lint is None:
            return False, "Deliverable missing"
        hits = lint_hits(lint, a["rules"])
        return (not hits), ("uxl_lint: none of " + ", ".join(a["rules"])) if not hits else "uxl_lint: " + describe(hits)
    if t == "lint-severity":
        if lint is None:
            return False, "Deliverable missing"
        n = lint["counts"][a["severity"]] + (lint["counts"]["critical"] if a["severity"] == "major" else 0)
        hits = [f for f in lint["findings"] if SEV[f["severity"]] >= SEV[a["severity"]]]
        return n <= a["max"], f"uxl_lint: {n} finding(s) at >= {a['severity']} (max {a['max']})" + (f": {describe(hits)}" if hits else "")
    if t == "audit":
        if audit is None:
            return False, "Runtime audit could not run (no HTML deliverable)"
        hits = audit_hits(audit, a["rules"], a.get("viewport"), a.get("severity_at_least"))
        scope = f"{a.get('viewport', 'all viewports')}" + (f", >= {a['severity_at_least']}" if a.get("severity_at_least") else "")
        return (not hits), (f"uxl_audit ({scope}): none of " + ", ".join(a["rules"])) if not hits else f"uxl_audit ({scope}): " + describe(hits)
    if t == "lint+audit":
        hits = lint_hits(lint, a["rules"]) + audit_hits(audit, a["rules"])
        return (not hits), "uxl_lint+uxl_audit: none of " + ", ".join(a["rules"]) if not hits else describe(hits)
    if t == "audit-score":
        if audit is None:
            return False, "Runtime audit could not run"
        return audit["score"] >= a["min"], f"uxl_audit score {audit['score']}/100 (min {a['min']}); counts {audit['counts']}"
    return False, f"unknown assertion type {t}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("iteration")
    ap.add_argument("--evals", default=os.path.join(ROOT, "evals", "evals.json"))
    ap.add_argument("--no-audit", action="store_true")
    args = ap.parse_args()
    evals = {e["id"]: e for e in json.load(open(args.evals))["evals"]}

    for eval_dir in sorted(d for d in os.listdir(args.iteration) if d.startswith("eval-")):
        eid = int(eval_dir.split("-")[1])
        ev = evals[eid]
        for config in sorted(os.listdir(os.path.join(args.iteration, eval_dir))):
            cdir = os.path.join(args.iteration, eval_dir, config)
            if not os.path.isdir(cdir):
                continue
            for run in sorted(d for d in os.listdir(cdir) if d.startswith("run-")):
                rdir = os.path.join(cdir, run)
                outs = os.path.join(rdir, "outputs")
                files = [os.path.join(outs, f) for f in DELIVERABLES[eid]]
                lint = run_lint(files)
                audit = None
                html = files[0] if files[0].endswith(".html") else None
                if html and not args.no_audit:
                    adir = os.path.join(rdir, "grader-audit")
                    shutil.rmtree(adir, ignore_errors=True)
                    audit = run_audit(html, adir)
                    # surface the renders in the review viewer
                    base = os.path.splitext(os.path.basename(html))[0]
                    for vp in ("mobile", "desktop"):
                        for suffix in ("", "-annotated"):
                            src = [f for f in os.listdir(adir) if f.endswith(f"-{vp}{suffix}.png")] if os.path.isdir(adir) else []
                            if src:
                                shutil.copy(os.path.join(adir, src[0]), os.path.join(outs, f"zz-render-{vp}{suffix}.png"))
                manual = {}
                mpath = os.path.join(rdir, "manual_grades.json")
                if os.path.exists(mpath):
                    manual = json.load(open(mpath))
                expectations = []
                for a in ev["assertions"]:
                    res = grade_assertion(a, lint, audit)
                    if res is None:
                        m = manual.get(a["id"])
                        res = (bool(m["passed"]), m["evidence"]) if m else (False, "PENDING manual review")
                    expectations.append({"text": a["text"], "passed": bool(res[0]), "evidence": res[1]})
                passed = sum(e["passed"] for e in expectations)
                grading = {
                    "expectations": expectations,
                    "summary": {"passed": passed, "failed": len(expectations) - passed, "total": len(expectations),
                                "pass_rate": round(passed / len(expectations), 2)},
                    "uxl": {"lint_score": (lint or {}).get("score"), "lint_counts": (lint or {}).get("counts"),
                            "audit_score": (audit or {}).get("score"), "audit_counts": (audit or {}).get("counts")},
                }
                tpath = os.path.join(rdir, "timing.json")
                if os.path.exists(tpath):
                    grading["timing"] = json.load(open(tpath))
                json.dump(grading, open(os.path.join(rdir, "grading.json"), "w"), indent=2)
                print(f"{eval_dir:34} {config:14} {run}: {passed}/{len(expectations)}  lint={grading['uxl']['lint_score']} audit={grading['uxl']['audit_score']}")


if __name__ == "__main__":
    main()
