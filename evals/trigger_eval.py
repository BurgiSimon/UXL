#!/usr/bin/env python3
"""Measure how reliably a skill description triggers in Claude Code (`claude -p`).

Unlike a first-tool-call check, this counts a run as triggered when the agent consults
the skill (Skill tool or a Read of its SKILL.md) at any point *before it writes code*
(first Write/Edit/MultiEdit/NotebookEdit) or within the first N tool calls. Agents often
read the target file and load the skill in parallel, so "first tool call only" under-counts.

The skill is installed for real (as .claude/skills/<probe>/SKILL.md) in an isolated
scratch project, so the measurement matches how users experience it.

Usage:
  python3 evals/trigger_eval.py --eval-set evals/trigger-evals.json --skill skills/ux-lawyer \
      [--description "..."] [--runs 2] [--workers 8] [--timeout 60] [--model claude-opus-5-5]
"""

import argparse
import json
import os
import re
import select
import shutil
import subprocess
import tempfile
import time
import uuid
from concurrent.futures import ThreadPoolExecutor

WRITE_TOOLS = {"Write", "Edit", "MultiEdit", "NotebookEdit"}


def read_description(skill_dir):
    text = open(os.path.join(skill_dir, "SKILL.md"), encoding="utf-8").read()
    m = re.search(r'^description:\s*"(.*)"\s*$', text, re.M) or re.search(r"^description:\s*(.*)$", text, re.M)
    return m.group(1).replace('\\"', '"')


def run_one(query, description, skill_dir, timeout, model, max_tools):
    project = tempfile.mkdtemp(prefix="uxl-trigger-")
    name = f"ux-lawyer-probe-{uuid.uuid4().hex[:6]}"
    sdir = os.path.join(project, ".claude", "skills", name)
    shutil.copytree(skill_dir, sdir)
    skill_md = os.path.join(sdir, "SKILL.md")
    text = open(skill_md, encoding="utf-8").read()
    text = re.sub(r"^name:.*$", f"name: {name}", text, count=1, flags=re.M)
    text = re.sub(r"^description:.*$", "description: " + json.dumps(description, ensure_ascii=False), text, count=1, flags=re.M)
    open(skill_md, "w", encoding="utf-8").write(text)
    cmd = ["claude", "-p", query, "--output-format", "stream-json", "--verbose"]
    if model:
        cmd += ["--model", model]
    env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, cwd=project, env=env)
    tools, triggered, buf, start = [], False, "", time.time()
    try:
        while time.time() - start < timeout and proc.poll() is None:
            ready, _, _ = select.select([proc.stdout], [], [], 1.0)
            if not ready:
                continue
            chunk = os.read(proc.stdout.fileno(), 65536)
            if not chunk:
                break
            buf += chunk.decode("utf-8", errors="replace")
            done = False
            while "\n" in buf and not done:
                line, buf = buf.split("\n", 1)
                try:
                    ev = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if ev.get("type") == "result":
                    done = True
                if ev.get("type") != "assistant":
                    continue
                for c in ev["message"].get("content", []):
                    if c.get("type") != "tool_use":
                        continue
                    tools.append(c["name"])
                    inp = json.dumps(c.get("input", {}))
                    if (c["name"] == "Skill" and name in inp) or (c["name"] == "Read" and name in inp):
                        triggered, done = True, True
                        break
                    if c["name"] in WRITE_TOOLS or len(tools) >= max_tools:
                        done = True
                        break
            if done:
                break
    finally:
        if proc.poll() is None:
            proc.kill()
            proc.wait()
        shutil.rmtree(project, ignore_errors=True)
    return triggered, tools[:6]


def evaluate(evals, description, skill_dir, runs, workers, timeout, model, max_tools):
    jobs = [(i, e) for i, e in enumerate(evals) for _ in range(runs)]
    results = {i: [] for i in range(len(evals))}
    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = {ex.submit(run_one, e["query"], description, skill_dir, timeout, model, max_tools): i for i, e in jobs}
        for f, i in futs.items():
            results[i].append(f.result())
    rows, tp, fp, tn, fn = [], 0, 0, 0, 0
    for i, e in enumerate(evals):
        rate = sum(t for t, _ in results[i]) / len(results[i])
        hit = rate >= 0.5
        if e["should_trigger"]:
            tp, fn = tp + hit, fn + (not hit)
        else:
            fp, tn = fp + hit, tn + (not hit)
        rows.append({"query": e["query"], "should_trigger": e["should_trigger"], "trigger_rate": rate,
                     "correct": hit == e["should_trigger"], "first_tools": results[i][0][1]})
    n = len(evals)
    summary = {"accuracy": round((tp + tn) / n, 3), "recall": round(tp / max(1, tp + fn), 3),
               "precision": round(tp / max(1, tp + fp), 3), "tp": tp, "fp": fp, "tn": tn, "fn": fn}
    return summary, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eval-set", required=True)
    ap.add_argument("--skill", required=True)
    ap.add_argument("--description", default=None)
    ap.add_argument("--runs", type=int, default=2)
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--timeout", type=int, default=60)
    ap.add_argument("--max-tools", type=int, default=8)
    ap.add_argument("--model", default=None)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    evals = json.load(open(args.eval_set))
    desc = args.description or read_description(args.skill)
    summary, rows = evaluate(evals, desc, os.path.abspath(args.skill), args.runs, args.workers, args.timeout, args.model, args.max_tools)
    for r in rows:
        mark = "ok  " if r["correct"] else "MISS"
        print(f"{mark} {'+' if r['should_trigger'] else '-'} rate={r['trigger_rate']:.2f}  {r['query'][:80]}  {r['first_tools']}")
    print(json.dumps(summary))
    if args.out:
        json.dump({"description": desc, "summary": summary, "rows": rows}, open(args.out, "w"), indent=2)


if __name__ == "__main__":
    main()
