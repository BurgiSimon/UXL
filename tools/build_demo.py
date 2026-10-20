#!/usr/bin/env python3
"""Assemble the UXL demo (docs/) from two headless Claude Code sessions.

Each session directory holds the session's output (index.html) and its transcript
(session.jsonl from `claude -p ... --output-format stream-json --verbose`).

  python3 tools/build_demo.py --without <dir> --with <dir> [--prompt PROMPT.txt] [--slug fernwheel]

Writes into docs/<slug>/ (default docs/fernwheel/):
  without-uxl/index.html, with-uxl/index.html      the two pages, unmodified
  screens/<a|b>-<viewport>[-annotated].png          uxl_audit renders
  reports/<a|b>-audit.md, <a|b>-lint.md             scanner reports
  data.json                                         scores, counts, findings, session stats
"""

import argparse
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS = os.path.join(ROOT, "skills", "ux-lawyer", "scripts")
OUT = os.path.join(ROOT, "docs", "fernwheel")  # overridden by --slug
LAWS = ["Aesthetic-Usability", "Choice Overload", "Chunking", "Cognitive Bias", "Cognitive Load", "Doherty", "Fitts",
        "Flow", "Goal-Gradient", "Hick", "Jakob", "Common Region", "Proximity", "Prägnanz", "Similarity",
        "Uniform Connectedness", "Mental Model", "Miller", "Occam", "Active User", "Pareto", "Parkinson", "Peak-End",
        "Postel", "Selective Attention", "Serial Position", "Tesler", "Von Restorff", "Working Memory", "Zeigarnik"]


def session_stats(path):
    tools, skills, agents, result, text = [], [], [], {}, ""
    for line in open(path, encoding="utf-8"):
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        if ev.get("type") == "assistant":
            for c in ev["message"].get("content", []):
                if c.get("type") == "tool_use":
                    tools.append(c["name"])
                    if c["name"] == "Skill":
                        skills.append(c.get("input", {}).get("skill", ""))
                    if c["name"] in ("Agent", "Task"):
                        agents.append(c.get("input", {}).get("subagent_type", "general-purpose"))
        elif ev.get("type") == "result":
            result = ev
            text = ev.get("result", "") or ""
    usage = result.get("usage", {}) or {}
    return {
        "tool_calls": len(tools),
        "skills_used": skills,
        "agents_used": agents,
        "duration_s": round((result.get("duration_ms") or 0) / 1000),
        "turns": result.get("num_turns"),
        "cost_usd": result.get("total_cost_usd"),
        "output_tokens": usage.get("output_tokens"),
        "final_message": text,
        "laws_cited": sorted({law for law in LAWS if law.lower() in text.lower()}),
    }


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--without", required=True)
    ap.add_argument("--with", dest="with_", required=True)
    ap.add_argument("--prompt", default=None)
    ap.add_argument("--slug", default="fernwheel", help="output folder under docs/")
    args = ap.parse_args()
    global OUT
    OUT = os.path.join(ROOT, "docs", args.slug)

    for d in ("screens", "reports"):
        os.makedirs(os.path.join(OUT, d), exist_ok=True)
    data = {"prompt": open(args.prompt, encoding="utf-8").read().strip() if args.prompt else "", "exhibits": {}}

    for key, label, src in (("a", "without-uxl", args.without), ("b", "with-uxl", args.with_)):
        page_src = os.path.join(src, "index.html")
        if not os.path.exists(page_src):
            sys.exit(f"missing {page_src}")
        dest_dir = os.path.join(OUT, label)
        os.makedirs(dest_dir, exist_ok=True)
        shutil.copy(page_src, os.path.join(dest_dir, "index.html"))
        page = os.path.join(dest_dir, "index.html")

        lint = json.loads(run([sys.executable, os.path.join(SCRIPTS, "uxl_lint.py"), page, "--format", "json", "--max-per-rule", "0"]).stdout)
        lint_md = run([sys.executable, os.path.join(SCRIPTS, "uxl_lint.py"), page, "--format", "md"]).stdout
        open(os.path.join(OUT, "reports", f"{key}-lint.md"), "w", encoding="utf-8").write(lint_md.replace(OUT + "/", ""))

        audit_dir = os.path.join(OUT, f".audit-{key}")
        shutil.rmtree(audit_dir, ignore_errors=True)
        run(["node", os.path.join(SCRIPTS, "uxl_audit.mjs"), page, "--viewports", "small,mobile,desktop", "--out", audit_dir])
        audit = json.load(open(os.path.join(audit_dir, "report.json"), encoding="utf-8"))
        md = open(os.path.join(audit_dir, "report.md"), encoding="utf-8").read().replace("file://" + OUT + "/", "")
        md = md.replace(f"`{label}-index-", f"`screens/{key}-")  # match the renamed screenshots
        open(os.path.join(OUT, "reports", f"{key}-audit.md"), "w", encoding="utf-8").write(md)
        for f in os.listdir(audit_dir):
            if f.endswith(".png"):  # uxl_audit names renders <label>-index-<viewport>[-annotated].png
                name = f.replace(label + "-index-", "")
                shutil.copy(os.path.join(audit_dir, f), os.path.join(OUT, "screens", f"{key}-{name}"))
        shutil.rmtree(audit_dir, ignore_errors=True)

        per_vp = {p["viewport"]: {"findings": p["findings"], "metrics": p["metrics"]} for p in audit["pages"]}
        data["exhibits"][key] = {
            "label": label,
            "lint": {"score": lint["score"], "counts": lint["counts"],
                     "findings": [{k: f[k] for k in ("rule", "severity", "message", "citation", "line")} for f in lint["findings"]]},
            "audit": {"score": audit["score"], "counts": audit["counts"],
                      "viewports": {vp: {"findings": [{k: f[k] for k in ("rule", "severity", "message", "evidence", "citation")} for f in v["findings"]],
                                         "metrics": v["metrics"]} for vp, v in per_vp.items()}},
            "session": session_stats(os.path.join(src, "session.jsonl")),
            "bytes": os.path.getsize(page),
        }

    json.dump(data, open(os.path.join(OUT, "data.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    for key in ("a", "b"):
        e = data["exhibits"][key]
        print(f"{key} {e['label']:12} lint {e['lint']['score']:>3} {e['lint']['counts']}  audit {e['audit']['score']:>3} {e['audit']['counts']}  "
              f"tools {e['session']['tool_calls']} skills {e['session']['skills_used']} {e['session']['duration_s']}s laws {len(e['session']['laws_cited'])}")


if __name__ == "__main__":
    main()
