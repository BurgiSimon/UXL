#!/usr/bin/env python3
"""UXL static linter: scan front-end source for violations of the Laws of UX.

Part of UXL (UX Lawyer), https://lawsofux.com laws applied by AI coding agents.
Pure standard library (Python 3.8+). Heuristic by design: every finding is a lead
to verify, cited with the law it violates and a concrete remedy.

Usage:
  python3 uxl_lint.py [PATH ...] [--format text|md|json] [--min-severity minor|major|critical]
                      [--ignore RULE[,RULE]] [--only RULE[,RULE]] [--fail-on major]
                      [--max-per-rule N] [--list-rules]

Suppress a finding with a comment on the same or previous line:
  uxl-ignore            (all rules)     uxl-ignore small-target,nav-overload
"""

from __future__ import annotations

import argparse
import bisect
import json
import math
import os
import re
import sys
from dataclasses import dataclass, field, asdict
from typing import Dict, Iterable, List, Optional, Tuple

VERSION = "1.0.0"

# --------------------------------------------------------------------------- laws

LAWS: Dict[str, str] = {
    "L01": "Aesthetic-Usability Effect", "L02": "Choice Overload", "L03": "Chunking",
    "L04": "Cognitive Bias", "L05": "Cognitive Load", "L06": "Doherty Threshold",
    "L07": "Fitts's Law", "L08": "Flow", "L09": "Goal-Gradient Effect",
    "L10": "Hick's Law", "L11": "Jakob's Law", "L12": "Law of Common Region",
    "L13": "Law of Proximity", "L14": "Law of Prägnanz", "L15": "Law of Similarity",
    "L16": "Law of Uniform Connectedness", "L17": "Mental Model", "L18": "Miller's Law",
    "L19": "Occam's Razor", "L20": "Paradox of the Active User", "L21": "Pareto Principle",
    "L22": "Parkinson's Law", "L23": "Peak-End Rule", "L24": "Postel's Law",
    "L25": "Selective Attention", "L26": "Serial Position Effect", "L27": "Tesler's Law",
    "L28": "Von Restorff Effect", "L29": "Working Memory", "L30": "Zeigarnik Effect",
}

SEVERITY_ORDER = {"minor": 0, "major": 1, "critical": 2}


@dataclass
class Rule:
    id: str
    laws: List[str]
    severity: str
    title: str
    fix: str


RULES: Dict[str, Rule] = {r.id: r for r in [
    Rule("viewport-missing", ["L07", "L11"], "critical",
         "HTML document has no responsive viewport meta tag",
         'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to <head>.'),
    Rule("zoom-disabled", ["L24", "L11"], "major",
         "Pinch-zoom is disabled (user-scalable=no / maximum-scale=1)",
         "Remove user-scalable=no and maximum-scale; fix input zoom with 16px inputs instead."),
    Rule("small-target", ["L07"], "minor",
         "Clickable element is sized below the 44px touch-target floor",
         "Use min-height/min-width 44px (Tailwind min-h-11 min-w-11) or expand the hit area with ::after."),
    Rule("input-font-small", ["L08", "L05"], "major",
         "Form control font-size below 16px (iOS zooms the page on focus)",
         "Use font-size >= 16px on inputs at mobile widths (Tailwind: text-base md:text-sm)."),
    Rule("focus-outline-removed", ["L24", "L11"], "major",
         "Focus outline removed without a visible :focus-visible replacement",
         "Keep a visible focus style: :focus-visible { outline: 2px solid var(--focus); outline-offset: 2px }."),
    Rule("nav-overload", ["L10", "L18", "L02"], "major",
         "Navigation exposes too many top-level items",
         "Keep <= 7 top-level items on desktop and 3-5 in a mobile tab bar; group the rest."),
    Rule("select-overload", ["L10", "L02"], "minor",
         "<select> with a long option list",
         "Use a searchable combobox, grouping (<optgroup>), or a smart default. Well-known ordered lists (countries) are OK if searchable."),
    Rule("form-long", ["L03", "L05", "L09"], "major",
         "Long form presented as one undifferentiated block",
         "Group fields with <fieldset>/<legend>, remove optional fields, or split into steps with a progress indicator."),
    Rule("placeholder-as-label", ["L29", "L05"], "major",
         "Placeholder used as the only label (disappears while typing)",
         "Add a visible <label> (or aria-label for search fields); keep placeholder for examples only."),
    Rule("input-unlabeled", ["L05", "L11"], "critical",
         "Form control has no accessible label",
         "Associate a <label for=...> (React: htmlFor), wrap in <label>, or add aria-label/aria-labelledby."),
    Rule("autocomplete-missing", ["L22", "L24", "L27"], "minor",
         "Personal-data field without an autocomplete attribute",
         "Add autocomplete (email, name, tel, street-address, postal-code, cc-number, current-password...)."),
    Rule("input-type-generic", ["L24", "L07"], "minor",
         "Field gets a generic text keyboard on mobile",
         "Use type=email/tel/url or inputmode=numeric/decimal so mobile shows the right keyboard."),
    Rule("strict-pattern", ["L24"], "minor",
         "Strict input pattern rejects reasonable formats",
         "Accept spaces/dashes/parentheses, then normalize in code; validate meaning, not formatting."),
    Rule("disabled-submit", ["L20", "L05"], "minor",
         "Submit button disabled until the form is valid (users can't tell why)",
         "Keep it enabled; on submit, show inline errors and focus the first invalid field."),
    Rule("multiple-primary-cta", ["L28", "L10"], "major",
         "Several primary-styled actions compete in one view",
         "Keep one primary action per view; demote the rest to secondary/tertiary styles."),
    Rule("slow-animation", ["L06", "L08"], "minor",
         "UI transition/animation longer than 500ms",
         "Use 150-300ms for UI transitions (enter ~200-250ms ease-out, exit ~150ms)."),
    Rule("reduced-motion-missing", ["L25", "L05"], "minor",
         "Animations without a prefers-reduced-motion fallback",
         "Add @media (prefers-reduced-motion: reduce) { ... } (Tailwind motion-reduce:, Framer useReducedMotion)."),
    Rule("native-dialog-interrupt", ["L08", "L23"], "minor",
         "Native alert()/confirm()/prompt() interrupts the flow",
         "Use inline feedback, toasts, or an accessible dialog; prefer undo over confirm."),
    Rule("autoplay-carousel", ["L25", "L05"], "minor",
         "Autoplaying carousel/media steals attention",
         "Disable autoplay (or pause on hover/focus, with visible controls); videos with sound must not autoplay."),
    Rule("async-no-feedback", ["L06"], "major",
         "Component fetches/mutates data but renders no loading/pending state",
         "Show a skeleton for content, a spinner/pending label on the triggering button, and disable double submits."),
    Rule("tiny-text", ["L01", "L05"], "minor",
         "Text smaller than 12px",
         "Body text >= 16px; captions/labels >= 12px."),
    Rule("hover-only", ["L17", "L07"], "minor",
         "Content revealed only on hover (touch and keyboard users never see it)",
         "Also reveal on :focus-within / tap, or show it by default on (hover: none) devices."),
    Rule("div-button", ["L11", "L24"], "major",
         "Click handler on a non-interactive element",
         "Use <button> (or <a href> for navigation). If impossible: role=button, tabIndex=0 and Enter/Space handlers."),
    Rule("font-size-sprawl", ["L15", "L14", "L01"], "minor",
         "Too many distinct font sizes (no type scale)",
         "Adopt a type scale of ~6-8 steps (see assets/uxl-tokens.css) and map every size to it."),
    Rule("color-sprawl", ["L15", "L01"], "minor",
         "Too many distinct hard-coded colors (no palette)",
         "Define color roles as tokens (surface, text, muted, border, accent, danger...) and use only those."),
    Rule("spacing-off-scale", ["L13", "L15"], "minor",
         "Spacing values don't follow a 4/8px scale",
         "Use a spacing scale (4, 8, 12, 16, 24, 32, 48, 64...) so grouping by proximity stays consistent."),
    Rule("image-no-dimensions", ["L06", "L14"], "minor",
         "<img> without width/height or aspect-ratio (layout shift)",
         "Set width and height attributes (or aspect-ratio) so space is reserved before the image loads."),
    Rule("dark-pattern-precheck", ["L04", "L22"], "major",
         "Paid add-on or marketing consent is pre-checked",
         "Leave opt-ins unchecked; let users choose add-ons explicitly (consent must be active)."),
    Rule("dark-pattern-urgency", ["L04", "L22"], "major",
         "Urgency/scarcity messaging (verify it is real, not a looping timer or invented stock)",
         "Show urgency only when it is true and verifiable (real stock, real deadline); never loop or fake timers."),
    Rule("dark-pattern-confirmshaming", ["L04", "L23"], "major",
         "Decline option shames the user ('No thanks, I don't like saving money')",
         "Use a neutral decline label: 'No thanks' / 'Not now'."),
    Rule("generic-button-label", ["L17", "L05"], "minor",
         "Generic action label that doesn't say what happens",
         "Label actions with verb + object: 'Create account', 'Save changes', 'Download invoice'."),
]}

# --------------------------------------------------------------------------- files

MARKUP_EXT = {".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".js", ".ts", ".mdx", ".php", ".erb", ".hbs", ".njk", ".liquid"}
STYLE_EXT = {".css", ".scss", ".sass", ".less", ".pcss"}
DOC_EXT = {".html", ".htm", ".astro", ".php", ".erb", ".hbs", ".njk", ".liquid"}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".next", ".nuxt", ".svelte-kit", "out", "coverage",
             "vendor", ".turbo", ".cache", ".vercel", ".output", "storybook-static", "__pycache__", ".venv",
             "venv", "target", ".idea", ".vscode", "uxl-report", ".parcel-cache", "public/build"}
MAX_FILE_BYTES = 600_000


def discover(paths: List[str]) -> List[str]:
    out: List[str] = []
    for p in paths:
        if os.path.isfile(p):
            out.append(p)
            continue
        for root, dirs, files in os.walk(p):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext not in MARKUP_EXT and ext not in STYLE_EXT:
                    continue
                if ".min." in f or f.endswith(".d.ts") or ".test." in f or ".spec." in f or ".stories." in f:
                    continue
                out.append(os.path.join(root, f))
    return sorted(set(out))


# --------------------------------------------------------------------------- findings

@dataclass
class Finding:
    rule: str
    severity: str
    file: str
    line: int
    message: str
    evidence: str = ""
    laws: List[str] = field(default_factory=list)
    fix: str = ""


class Source:
    def __init__(self, path: str, text: str):
        self.path = path
        self.text = text
        self.ext = os.path.splitext(path)[1].lower()
        self._nl = [i for i, c in enumerate(text) if c == "\n"]
        self.lines = text.split("\n")

    def line_of(self, offset: int) -> int:
        return bisect.bisect_left(self._nl, offset) + 1

    def snippet(self, offset: int, width: int = 110) -> str:
        ln = self.line_of(offset)
        s = self.lines[ln - 1].strip() if 0 < ln <= len(self.lines) else ""
        return s if len(s) <= width else s[: width - 1] + "…"

    def suppressed(self, line: int, rule: str) -> bool:
        for ln in (line, line - 1):
            if 1 <= ln <= len(self.lines):
                m = re.search(r"uxl-ignore(?:-next-line)?\b([^\n*]*)", self.lines[ln - 1])
                if m:
                    ids = re.findall(r"[a-z][a-z0-9-]+", m.group(1))
                    ids = [i for i in ids if i in RULES]
                    if not ids or rule in ids:
                        return True
        return False


class Collector:
    def __init__(self):
        self.findings: List[Finding] = []

    def add(self, src: Optional[Source], rule_id: str, offset: int, message: str = "",
            severity: Optional[str] = None, path: Optional[str] = None, line: Optional[int] = None,
            evidence: Optional[str] = None):
        rule = RULES[rule_id]
        if src is not None:
            line = src.line_of(offset) if line is None else line
            if src.suppressed(line, rule_id):
                return
            path = src.path
            evidence = src.snippet(offset) if evidence is None else evidence
        self.findings.append(Finding(rule=rule_id, severity=severity or rule.severity, file=path or "",
                                     line=line or 0, message=message or rule.title, evidence=evidence or "",
                                     laws=list(rule.laws), fix=rule.fix))


# --------------------------------------------------------------------------- tiny parsers

TAG_START = re.compile(r"<(/?)([A-Za-z][\w.:-]*)")


@dataclass
class Tag:
    name: str
    attrs_raw: str
    start: int
    end: int
    closing: bool
    self_closing: bool
    _attrs: Optional[Dict[str, str]] = None

    @property
    def attrs(self) -> Dict[str, str]:
        if self._attrs is None:
            self._attrs = parse_attrs(self.attrs_raw)
        return self._attrs

    @property
    def lname(self) -> str:
        return self.name.lower()


def scan_tags(text: str) -> List[Tag]:
    """Tokenize opening/closing tags, tolerant of JSX expressions ({...}) and quotes."""
    tags: List[Tag] = []
    i, n = 0, len(text)
    while True:
        m = TAG_START.search(text, i)
        if not m:
            break
        start = m.start()
        if text.startswith("<!--", start):
            j = text.find("-->", start)
            i = n if j < 0 else j + 3
            continue
        closing = m.group(1) == "/"
        name = m.group(2)
        j = m.end()
        depth = 0
        quote = ""
        limit = min(n, j + 4000)
        ok = False
        while j < limit:
            c = text[j]
            if quote:
                if c == "\\":
                    j += 2
                    continue
                if c == quote:
                    quote = ""
            elif c in "\"'`":
                quote = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth = max(0, depth - 1)
            elif c == "<" and depth == 0 and not closing and text[j + 1: j + 2].isalpha():
                break  # looks like a new tag -> this was not a tag (e.g. TS generic / comparison)
            elif c == ">" and depth == 0:
                ok = True
                break
            j += 1
        if not ok:
            i = m.end()
            continue
        raw = text[m.end(): j]
        tags.append(Tag(name=name, attrs_raw=raw, start=start, end=j + 1, closing=closing,
                        self_closing=raw.rstrip().endswith("/")))
        # skip raw-text elements
        if not closing and name.lower() in ("script", "style") and not raw.rstrip().endswith("/"):
            k = text.lower().find("</" + name.lower(), j)
            if k > 0 and name.lower() == "style":
                pass  # style content is handled by the CSS pass; keep scanning after it
            i = (k if k > 0 else j + 1)
            continue
        i = j + 1
    return tags


ATTR_RE = re.compile(r"([:@]?[A-Za-z_][\w:.@-]*)(\s*=\s*)?")


def parse_attrs(raw: str) -> Dict[str, str]:
    attrs: Dict[str, str] = {}
    i, n = 0, len(raw)
    while i < n:
        if raw[i].isspace() or raw[i] == "/":
            i += 1
            continue
        if raw[i] == "{":  # JSX spread {...props}
            depth, j = 0, i
            while j < n:
                if raw[j] == "{":
                    depth += 1
                elif raw[j] == "}":
                    depth -= 1
                    if depth == 0:
                        break
                j += 1
            attrs.setdefault("{...}", "")
            attrs["{...}"] += raw[i: j + 1]
            i = j + 1
            continue
        m = ATTR_RE.match(raw, i)
        if not m:
            i += 1
            continue
        name = m.group(1)
        i = m.end()
        val = ""
        if m.group(2):
            if i < n and raw[i] in "\"'`":
                q = raw[i]
                j = raw.find(q, i + 1)
                j = n if j < 0 else j
                val = raw[i + 1: j]
                i = j + 1
            elif i < n and raw[i] == "{":
                depth, j = 0, i
                while j < n:
                    if raw[j] == "{":
                        depth += 1
                    elif raw[j] == "}":
                        depth -= 1
                        if depth == 0:
                            break
                    j += 1
                val = raw[i: j + 1]
                i = j + 1
            else:
                j = i
                while j < n and not raw[j].isspace():
                    j += 1
                val = raw[i:j]
                i = j
        attrs[name.lower()] = val
    return attrs


def find_close(tags: List[Tag], idx: int) -> Optional[int]:
    """Index of the matching closing tag for tags[idx]."""
    name = tags[idx].name
    depth = 0
    for k in range(idx, len(tags)):
        t = tags[k]
        if t.name != name:
            continue
        if t.closing:
            depth -= 1
            if depth == 0:
                return k
        elif not t.self_closing:
            depth += 1
    return None


def classes_of(tag: Tag) -> str:
    a = tag.attrs
    return " ".join(a.get(k, "") for k in ("class", "classname", ":class", "class:list", "tw"))


def unprefixed(cls: str, pattern: str) -> Optional[re.Match]:
    """Match a Tailwind utility only when it is not behind a responsive/state variant."""
    return re.search(r"(?<![\w:\-\[])" + pattern + r"(?![\w\-\[])", cls)


# --------------------------------------------------------------------------- CSS

COMMENT_RE = re.compile(r"/\*.*?\*/", re.S)


def blank(m: re.Match) -> str:
    return re.sub(r"[^\n]", " ", m.group(0))


@dataclass
class CssRule:
    selector: str
    body: str
    offset: int  # offset of body start within the Source text
    at: str = ""  # enclosing @-rules, e.g. "@media (hover: hover)"


def css_blocks(src: Source) -> List[Tuple[str, int]]:
    """Return (css_text, base_offset) chunks: whole stylesheet or <style> blocks."""
    if src.ext in STYLE_EXT:
        return [(src.text, 0)]
    chunks = []
    for m in re.finditer(r"<style\b[^>]*>(.*?)</style>", src.text, re.S | re.I):
        chunks.append((m.group(1), m.start(1)))
    return chunks


def parse_css(css: str, base: int, scss: bool = False) -> List[CssRule]:
    css = COMMENT_RE.sub(blank, css)
    if scss:
        css = re.sub(r"(?<![:\w\"'])//[^\n]*", blank, css)
    rules: List[CssRule] = []
    stack: List[Tuple[str, int]] = []
    seg_start = 0
    i = 0
    n = len(css)
    body_parts: List[List[Tuple[int, int]]] = []
    while i < n:
        c = css[i]
        if c in "\"'":
            j = css.find(c, i + 1)
            i = n if j < 0 else j + 1
            continue
        if c == "{":
            selector = css[seg_start:i].strip().split(";")[-1].strip()
            stack.append((selector, i + 1))
            body_parts.append([])
            seg_start = i + 1
        elif c == "}":
            if stack:
                selector, bstart = stack.pop()
                parts = body_parts.pop()
                # body without nested blocks
                text, last = [], bstart
                for (ps, pe) in parts:
                    text.append(css[last:ps])
                    last = pe
                text.append(css[last:i])
                body = "".join(text)
                if not selector.startswith("@") or selector.startswith("@font-face"):
                    at = " ".join(sel for sel, _ in stack if sel.startswith("@"))
                    rules.append(CssRule(selector=selector, body=body, offset=base + bstart, at=at))
                if body_parts:
                    body_parts[-1].append((bstart - 1 - len(selector), i + 1))
            seg_start = i + 1
        elif c == ";":
            seg_start = i + 1
        i += 1
    return rules


def to_px(value: str) -> Optional[float]:
    m = re.match(r"\s*(-?\d*\.?\d+)\s*(px|rem|em)?\s*$", value)
    if not m:
        return None
    num = float(m.group(1))
    unit = m.group(2) or ("px" if num == 0 else None)
    if unit is None:
        return None
    return num * 16 if unit in ("rem", "em") else num


def decl(body: str, prop: str) -> List[Tuple[str, int]]:
    return [(m.group(1).strip(), m.start()) for m in
            re.finditer(r"(?<![\w-])" + prop + r"\s*:\s*([^;{}]+)", body)]


def duration_ms(text: str) -> List[float]:
    out = []
    for m in re.finditer(r"(?<![\w.])(\d*\.?\d+)(ms|s)\b", text):
        v = float(m.group(1))
        out.append(v if m.group(2) == "ms" else v * 1000)
    return out


# --------------------------------------------------------------------------- helpers

FIELD_TAGS = {"input", "select", "textarea"}
FIELD_COMPONENTS = {"Input", "Textarea", "TextArea", "TextField", "NumberInput", "PasswordInput"}
NON_FIELD_TYPES = {"hidden", "submit", "button", "reset", "image"}
CLICKABLE = {"button", "a"}
CLICKABLE_COMPONENTS = {"Button", "IconButton", "Link", "NavLink", "ActionIcon"}
TW_SCALE_PX = lambda n: float(n) * 4  # noqa: E731  Tailwind spacing unit


def is_field(tag: Tag) -> bool:
    if tag.closing:
        return False
    if tag.lname in FIELD_TAGS:
        t = tag.attrs.get("type", "text").strip("{}'\" ").lower()
        return t not in NON_FIELD_TYPES
    return tag.name in FIELD_COMPONENTS


def field_key(tag: Tag) -> str:
    a = tag.attrs
    return " ".join(a.get(k, "") for k in ("name", "id", "type", "v-model", "bind:value", "formcontrolname")).lower()


def tw_size(cls: str, prefix: str) -> Optional[float]:
    m = unprefixed(cls, prefix + r"-(\d+(?:\.5)?)")
    if m:
        return TW_SCALE_PX(m.group(1))
    m = unprefixed(cls, prefix + r"-\[(\d+(?:\.\d+)?)(px|rem)\]")
    if m:
        v = float(m.group(1))
        return v * 16 if m.group(2) == "rem" else v
    return None


# --------------------------------------------------------------------------- per-file checks

def check_markup(src: Source, tags: List[Tag], out: Collector, project: dict):
    text = src.text
    is_doc = src.ext in DOC_EXT or os.path.basename(src.path) == "app.html"

    # viewport-missing
    if is_doc and re.search(r"<head[\s>]", text, re.I) and not re.search(r"name\s*=\s*[\"']viewport", text, re.I):
        m = re.search(r"<head[\s>]", text, re.I)
        out.add(src, "viewport-missing", m.start())

    # label spans + for/htmlFor ids
    label_spans: List[Tuple[int, int]] = []
    label_targets = set()
    label_positions: List[int] = []
    for idx, t in enumerate(tags):
        if t.closing or t.lname not in ("label", "formlabel"):
            continue
        label_positions.append(t.start)
        f = t.attrs.get("for") or t.attrs.get("htmlfor")
        if f:
            label_targets.add(f.strip("{}'\" "))
        c = find_close(tags, idx)
        if c is not None:
            label_spans.append((t.start, tags[c].end))
    has_label_components = bool(re.search(r"<(FormLabel|Label|FormField|FormItem|Field\.Label|FormControl)\b", text))

    def labelled(t: Tag) -> bool:
        a = t.attrs
        if any(k in a for k in ("aria-label", "aria-labelledby", "arialabel", "title", "label", "{...}")):
            return True
        tid = (a.get("id") or "").strip("{}'\" ")
        if tid and tid in label_targets:
            return True
        if any(s <= t.start <= e for s, e in label_spans):
            return True
        # a label element shortly before (same visual group) -> likely associated by framework context
        k = bisect.bisect_left(label_positions, t.start)
        if k > 0 and t.start - label_positions[k - 1] < 400:
            return True
        if has_label_components and re.search(r"<(FormLabel|Label)\b", text[max(0, t.start - 500): t.start]):
            return True
        return False

    primary_count = 0
    primary_first = None
    primary_labels = set()

    for idx, t in enumerate(tags):
        if t.closing:
            continue
        a = t.attrs
        cls = classes_of(t)
        lname = t.lname

        # ---------- fields
        if is_field(t) and not (a.get("tabindex", "").strip("{}'\" ") == "-1" or _inside_hidden(tags, idx)):  # skip honeypots
            key = field_key(t)
            spread = "{...}" in a
            itype = a.get("type", "text").strip("{}'\" ").lower()
            if not spread and not labelled(t):
                if "placeholder" in a and itype not in ("checkbox", "radio"):
                    out.add(src, "placeholder-as-label", t.start,
                            f"<{t.name}> relies on placeholder \"{a.get('placeholder')[:40]}\" as its only label")
                else:
                    out.add(src, "input-unlabeled", t.start,
                            f"<{t.name}> has no associated label (verify: a wrapper component may provide one)")
            if not spread and itype not in ("checkbox", "radio", "range", "color", "file", "date", "search"):
                if re.search(r"e-?mail|(first|last|full|given|family|user)[-_ ]?name|\bname\b|phone|\btel\b|mobile|address|street|city|zip|postal|postcode|country|card|cc-|cvc|cvv|expir|password|organization|company", key) \
                        and not any(k in a for k in ("autocomplete", "autocomplete", "auto-complete")):
                    out.add(src, "autocomplete-missing", t.start,
                            f"<{t.name}> looks like personal data ({_short(key)}) but has no autocomplete")
                if itype in ("text", "") and "inputmode" not in a:
                    want = None
                    if re.search(r"e-?mail", key):
                        want = 'type="email"'
                    elif re.search(r"phone|\btel\b|mobile", key):
                        want = 'type="tel"'
                    elif re.search(r"otp|\bcode\b|pin\b", key):
                        want = 'inputmode="numeric" (keep type=text)'
                    elif re.search(r"zip|postal|postcode", key) and "autocomplete" not in a:
                        want = 'autocomplete="postal-code" (inputmode="numeric" only if every supported country uses digit-only codes)'
                    elif re.search(r"amount|price|quantity|\bqty\b|\bage\b", key):
                        want = 'inputmode="decimal" or "numeric"'
                    elif re.search(r"\burl\b|website", key):
                        want = 'type="url"'
                    if want:
                        out.add(src, "input-type-generic", t.start, f"<{t.name}> ({_short(key)}) should use {want}")
                if "pattern" in a and re.search(r"phone|tel|zip|postal|name|card|cc-", key):
                    out.add(src, "strict-pattern", t.start, f"pattern=\"{a['pattern'][:40]}\" on {_short(key)} field")
            # input font size via Tailwind
            if lname in FIELD_TAGS or t.name in FIELD_COMPONENTS:
                if unprefixed(cls, r"text-(xs|sm)") or unprefixed(cls, r"text-\[(1[0-5]|[0-9])px\]"):
                    out.add(src, "input-font-small", t.start, f"<{t.name}> uses a < 16px text size at mobile widths")

        # ---------- clickable elements
        clickable = lname in CLICKABLE or t.name in CLICKABLE_COMPONENTS or a.get("role", "").strip("'\"") == "button"
        if clickable:
            sizes = [s for s in (tw_size(cls, "h"), tw_size(cls, "size")) if s is not None]
            min_h = tw_size(cls, "min-h")
            if sizes and min(sizes) < 44 and not (min_h and min_h >= 44) and "sr-only" not in cls:
                sz = min(sizes)
                out.add(src, "small-target", t.start,
                        f"<{t.name}> is {sz:g}px tall (" + ("critical below 24px" if sz < 24 else "fine for dense desktop pointer UI only") + ")",
                        severity="major" if sz < 24 else "minor")
            if re.search(r"btn-primary|button-primary|button--primary|btn--primary|is-primary|primary-button", cls) \
                    or re.search(r"^\W*primary\W*$", a.get("variant", "")) or re.search(r"^\W*(primary)\W*$", a.get("type", "")) \
                    or re.search(r"^\W*contained\W*$", a.get("variant", "")):
                primary_count += 1
                primary_first = primary_first if primary_first is not None else t.start
                c = find_close(tags, idx) if not t.self_closing else None
                label = re.sub(r"<[^>]+>|\s+", " ", text[t.end: tags[c].start]).strip().lower() if c is not None else a.get("value", "")
                primary_labels.add(label or f"@{t.start}")
            # disabled-submit
            dis = a.get("disabled", "")
            if dis and re.search(r"!\s*[\w.]*(valid|isvalid|canSubmit|complete|filled|ready)|invalid|errors?\b|!\s*\w*\.length|===\s*['\"]{2}", dis, re.I) \
                    and not re.search(r"submitting|loading|pending|saving", dis, re.I):
                out.add(src, "disabled-submit", t.start, f"Button disabled by validity ({dis[:50]})")
            # focus outline removed in Tailwind
            if (unprefixed(cls, r"(focus:)?outline-(none|hidden|0)") or re.search(r"focus:outline-(none|hidden)", cls)) \
                    and not re.search(r"focus(-visible)?:(ring|outline-(?!none|hidden)|border|shadow|bg|underline)|ring-", cls):
                out.add(src, "focus-outline-removed", t.start, f"<{t.name}> removes the outline without a focus replacement")
            # generic label
            if lname in ("button", "a") or t.name in ("Button", "Link"):
                c = find_close(tags, idx) if not t.self_closing else None
                if c is not None and c == idx + 1:
                    label = re.sub(r"\s+", " ", text[t.end: tags[c].start]).strip().lower()
                    if label in ("submit", "click here", "here", "ok", "go", "click"):
                        out.add(src, "generic-button-label", t.start, f'Action labelled "{label}"')
        if lname == "input" and a.get("type", "").strip("'\"").lower() == "submit":
            if a.get("value", "").strip().lower() in ("submit", "ok", "go"):
                out.add(src, "generic-button-label", t.start, f'Submit input labelled "{a.get("value")}"')

        # ---------- non-interactive click handlers
        if lname in ("div", "span", "li", "img", "p", "td", "tr", "section", "article", "svg", "i"):
            handler = next((a[k] for k in ("onclick", "@click", "v-on:click", "on:click") if k in a), None)
            is_backdrop = "aria-hidden" in a or re.search(r"backdrop|overlay|scrim", cls) or \
                re.search(r"close|dismiss|hide|setOpen\(\s*false|stopPropagation", handler or "", re.I)
            if handler is not None and "role" not in a and not is_backdrop:
                out.add(src, "div-button", t.start, f"<{t.name}> has a click handler but no role/keyboard support")

        # ---------- Tailwind hover-only reveals
        if re.search(r"(group-)?hover:(block|flex|grid|inline|visible|opacity-100)\b", cls) and \
                not re.search(r"(focus|focus-within|group-focus-within|group-focus|focus-visible|group-focus-visible):(block|flex|grid|inline|visible|opacity-100)", cls):
            out.add(src, "hover-only", t.start, "Element is revealed by hover:* only")

        # ---------- tiny text / slow animation in Tailwind
        m = unprefixed(cls, r"text-\[(\d+(?:\.\d+)?)(px|rem)\]")
        if m:
            px = float(m.group(1)) * (16 if m.group(2) == "rem" else 1)
            if px < 12:
                out.add(src, "tiny-text", t.start, f"Text set to {px:g}px")
            project["font_sizes"].add(round(px, 1))
        m = unprefixed(cls, r"duration-(\d{3,4})")
        if m and int(m.group(1)) > 500 and "animate-" not in cls:
            out.add(src, "slow-animation", t.start, f"duration-{m.group(1)} transition")
        if re.search(r"(?<![\w-])animate-(?!none)", cls) or "transition" in cls:
            project["anim_site"] = project["anim_site"] or (src.path, src.line_of(t.start))
        for hexm in re.finditer(r"(?:bg|text|border|from|to|via|fill|stroke)-\[(#[0-9a-fA-F]{3,8})\]", cls):
            project["colors"][_norm_hex(hexm.group(1))] = (src.path, src.line_of(t.start))

        # ---------- images
        if lname == "img" and "{...}" not in a:
            if not ({"width", "height"} <= set(a)) and not re.search(r"aspect-|object-|w-\d|h-\d|size-", cls) \
                    and "style" not in a:
                out.add(src, "image-no-dimensions", t.start)

        # ---------- media autoplay
        if lname == "video" and ("autoplay" in a) and "muted" not in a:
            out.add(src, "autoplay-carousel", t.start, "<video autoplay> without muted", severity="major")

        # ---------- pre-checked add-ons / consent
        if lname == "input" and a.get("type", "").strip("'\"").lower() == "checkbox" and \
                ("checked" in a and a.get("checked", "").strip("{}'\" ").lower() not in ("false",) and not a.get("checked", "").startswith("{") or
                 a.get("defaultchecked", "").strip("{}'\" ").lower() in ("", "true")) and ("checked" in a or "defaultchecked" in a):
            ctx = re.sub(r"<[^>]+>", " ", text[t.end: t.end + 240])
            if re.search(r"\+\s?[€$£]|[€$£]\s?\d|insurance|protection|warranty|newsletter|marketing|offers|partners|subscribe|donat|upgrade|premium", ctx, re.I):
                out.add(src, "dark-pattern-precheck", t.start, f"Pre-checked: \"{re.sub(r'\s+', ' ', ctx).strip()[:60]}\"")

        # ---------- nav overload
        if lname == "nav" or a.get("role", "").strip("'\"") == "navigation":
            label = (a.get("aria-label", "") + " " + cls + " " + a.get("id", "")).lower()
            if not re.search(r"footer|breadcrumb|pagination|toc|contents|sitemap|legal|social|steps?", label) \
                    and not _inside(tags, idx, "footer"):
                c = find_close(tags, idx)
                if c is not None:
                    links = _count_top_links(tags[idx + 1: c])
                    if links > 7:
                        out.add(src, "nav-overload", t.start, f"<nav> exposes {links} top-level links")

        # ---------- select overload
        if lname == "select":
            c = find_close(tags, idx)
            if c is not None:
                opts = sum(1 for x in tags[idx + 1: c] if not x.closing and x.lname == "option")
                if opts > 15:
                    out.add(src, "select-overload", t.start, f"<select> with {opts} options")

        # ---------- long forms
        if t.name == "form":
            c = find_close(tags, idx)
            if c is not None:
                inner = tags[idx + 1: c]
                fields = sum(1 for x in inner if is_field(x))
                grouped = any(not x.closing and x.lname == "fieldset" for x in inner)
                stepped = re.search(r"step|stepper|wizard|progress|aria-current=[\"']step", text[t.start: tags[c].end], re.I)
                if fields > 8 and not grouped and not stepped:
                    out.add(src, "form-long", t.start, f"<form> with {fields} fields, no <fieldset> groups or steps")
                elif fields > 15 and not stepped:
                    out.add(src, "form-long", t.start, f"<form> with {fields} fields on one page", severity="minor")

    if primary_count >= 3 and len(primary_labels) >= 2:  # the same action repeated down a long page is fine
        out.add(src, "multiple-primary-cta", primary_first or 0,
                f"{primary_count} primary-styled actions ({len(primary_labels)} different) in one file/view")

    # ---------- data-driven nav arrays
    for m in re.finditer(r"(?:const|let|var)\s+(\w*(?:nav|menu|links|tabs)\w*)\s*(?::[^=\n]+)?=\s*\[", text, re.I):
        name = m.group(1).lower()
        if re.search(r"footer|social|legal|breadcrumb|admin", name):
            continue
        count = _count_array_objects(text, m.end() - 1)
        body = text[m.end(): m.end() + 4000]
        grouped = re.search(r"\b(section|group|category|tier|priority|primary|children|items)\s*:", body)
        if count > 7 and re.search(r"(href|path|to|url)\s*:", body) and not grouped:
            out.add(src, "nav-overload", m.start(), f"Navigation array `{m.group(1)}` defines {count} top-level items")

    check_scripts(src, out, project)


def _short(key: str) -> str:
    return re.sub(r"\s+", " ", key).strip()[:40]


def _norm_hex(h: str) -> str:
    h = h.lower()
    if len(h) == 4:
        h = "#" + "".join(c * 2 for c in h[1:])
    return h[:7]


def _inside_hidden(tags: List[Tag], idx: int) -> bool:
    """True if an ancestor element is aria-hidden / hidden (e.g. a honeypot wrapper)."""
    depth = 0
    for k in range(idx - 1, max(-1, idx - 40), -1):
        t = tags[k]
        if t.self_closing:
            continue
        if t.closing:
            depth += 1
            continue
        if depth:
            depth -= 1
            continue
        a = t.attrs
        if a.get("aria-hidden", "").strip("{}'\" ") in ("true", "") and "aria-hidden" in a or "hidden" in a:
            return True
    return False


def _inside(tags: List[Tag], idx: int, name: str) -> bool:
    depth = 0
    for k in range(idx - 1, -1, -1):
        t = tags[k]
        if t.lname != name:
            continue
        if t.closing:
            depth += 1
        elif not t.self_closing:
            if depth == 0:
                return True
            depth -= 1
    return False


def _count_top_links(inner: List[Tag]) -> int:
    """Top-level choices in a nav. Labelled groups (headings, summary, aria-expanded toggles) count once each."""
    heads = [i for i, t in enumerate(inner) if not t.closing and (re.fullmatch(r"h[2-6]", t.lname) or t.lname == "summary"
             or t.attrs.get("role", "").strip("'\"") == "heading" or "aria-expanded" in t.attrs)]
    if len(heads) >= 2:
        before = sum(1 for t in inner[: heads[0]] if not t.closing and (t.lname == "a" or t.name in ("Link", "NavLink")))
        return before + len(heads)
    depth = 0
    count = 0
    for t in inner:
        if t.lname in ("ul", "ol", "menu") or t.name in ("DropdownMenu", "NavigationMenuContent", "Popover", "Menu"):
            if t.closing:
                depth -= 1
            elif not t.self_closing:
                depth += 1
            continue
        if not t.closing and (t.lname == "a" or t.name in ("Link", "NavLink", "NavigationMenuLink", "RouterLink", "router-link")) and depth <= 1:
            count += 1
    return count


def _count_array_objects(text: str, open_idx: int) -> int:
    depth = 0
    count = 0
    i = open_idx
    n = min(len(text), open_idx + 20000)
    quote = ""
    while i < n:
        c = text[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = ""
        elif c in "\"'`":
            quote = c
        elif c in "[{(":
            depth += 1
            if c == "{" and depth == 2:
                count += 1
        elif c in "]})":
            depth -= 1
            if depth == 0:
                break
        i += 1
    return count


ASYNC_RE = re.compile(r"\bfetch\s*\(|\baxios\b|\buseMutation\b|\buseQuery\b|\buseSWR\b|\$fetch\b|\buseFetch\b|\buseAsyncData\b|\.from\(['\"]\w+['\"]\)\.(select|insert|update)|\bmutateAsync\b|\btrpc\.|\bky\.(get|post)")
FEEDBACK_RE = re.compile(r"\b(is)?(loading|pending|fetching|submitting|saving|busy|mutating)\b|skeleton|spinner|aria-busy|<Suspense|useFormStatus|useTransition|useNavigation|\bloader\b|<progress|Progress\b|isLoading|isPending|status\s*===?\s*['\"](loading|pending)|\{#await", re.I)


def check_scripts(src: Source, out: Collector, project: dict):
    text = src.text
    # native dialogs
    for m in re.finditer(r"(?:(?<![\w$.])|(?<=window\.))(alert|confirm|prompt)\s*\(\s*[`'\"\w]", text):
        line_txt = src.lines[src.line_of(m.start()) - 1].lstrip()
        if line_txt.startswith(("//", "*", "/*", "function", "def ")):
            continue
        out.add(src, "native-dialog-interrupt", m.start(), f"{m.group(1)}() interrupts the user")

    # async without feedback (component files only)
    if src.ext in (".jsx", ".tsx", ".vue", ".svelte", ".astro", ".js", ".ts", ".html", ".htm") and re.search(r"<[A-Za-z][\w.]*[\s>/]", text):
        m = ASYNC_RE.search(text)
        code_only = re.sub(r">([^<>{}]+)<", lambda mm: ">" + re.sub(r"[^\n]", " ", mm.group(1)) + "<", text)  # drop copy text
        if m and not FEEDBACK_RE.search(code_only):
            is_server = re.search(r"export\s+default\s+async\s+function", text) and "use client" not in text
            if not (is_server and _has_loading_sibling(src.path)):
                out.add(src, "async-no-feedback", m.start(),
                        "Data is fetched/mutated here but no loading, pending, or skeleton state is rendered")

    # autoplay carousels
    if re.search(r"swiper|slick|carousel|slider|embla|splide|glide|keen-slider|flickity", text, re.I):
        for m in re.finditer(r"\bauto[pP]lay(?:Speed)?\s*(?:=\s*\{?\s*(?:true|\{|\d)|:\s*(?:true|\{|\d)|\b(?!\s*[:=]))|Autoplay\s*\(", text):
            ctx = text[m.start(): m.start() + 40]
            if re.search(r"auto[pP]lay\s*[:=]\s*\{?\s*false", ctx):
                continue
            out.add(src, "autoplay-carousel", m.start(), "Carousel/slider autoplays")
            break

    # submit disabled from script based on validity
    for m in re.finditer(r"\.disabled\s*=\s*([^;\n]*)", text):
        expr = m.group(1)
        if re.search(r"checkValidity|valid|\.value\b|\.length|\bsome\(|\bevery\(", expr) and not re.search(r"submitting|loading|pending|saving|true|false\s*;?$", expr):
            out.add(src, "disabled-submit", m.start(), "Button disabled from script until the form is valid")
            break

    # dark patterns (copy-level heuristics)
    visible = re.sub(r"<script\b.*?</script>|<style\b.*?</style>", lambda mm: re.sub(r"[^\n]", " ", mm.group(0)), text, flags=re.S | re.I)
    m = re.search(r"\b(only|just)\s+(<[^>]+>\s*)?\d+\s*(<[^>]+>\s*)?(left|remaining|in stock)|offer ends|ends in\b|\bhurry\b|selling fast|\d+\s+(people|others)\s+(are\s+)?(viewing|looking|watching)", visible, re.I)
    if m:
        out.add(src, "dark-pattern-urgency", m.start(), f'Urgency copy: "{m.group(0)[:50]}"')
    m = re.search(r"no,?\s*thanks?,?\s*i\s*(don'?t|do not)\s*(like|want|need|care)|i\s*(don'?t|do not)\s*(like|want)\s*(saving|money|discounts|deals|to save)|i\s*('?m|am)\s*not interested in (saving|being|getting)|i\s*prefer\s*(to\s*)?pay(ing)?\s*full", visible, re.I)
    if m:
        out.add(src, "dark-pattern-confirmshaming", m.start(), f'Decline copy: "{m.group(0)[:60]}"')

    # motion libraries count as animation
    if re.search(r"from\s+['\"](framer-motion|motion/react|motion|gsap|@react-spring/web|animejs)['\"]", text):
        project["anim_site"] = project["anim_site"] or (src.path, 1)
    if re.search(r"prefers-reduced-motion|useReducedMotion|motion-reduce:|reducedMotion|motion-safe:", text):
        project["reduced_motion"] = True

    # Next.js viewport export
    for m in re.finditer(r"userScalable\s*:\s*false|maximumScale\s*:\s*1\b", text):
        out.add(src, "zoom-disabled", m.start())


def _has_loading_sibling(path: str) -> bool:
    d = os.path.dirname(os.path.abspath(path))
    for _ in range(4):
        for f in ("loading.tsx", "loading.jsx", "loading.js", "loading.ts"):
            if os.path.exists(os.path.join(d, f)):
                return True
        d = os.path.dirname(d)
    return False


def check_css(src: Source, out: Collector, project: dict):
    scss = src.ext in (".scss", ".sass", ".less")
    for css, base in css_blocks(src):
        rules = parse_css(css, base, scss)
        has_focus_visible = any(":focus" in r.selector and (
            re.search(r"(?<![\w-])outline\s*:(?!\s*(none|0)\b)", r.body) or re.search(r"box-shadow\s*:(?!\s*none\b)", r.body)
            or re.search(r"outline-(color|style|width)\s*:", r.body)) for r in rules) or project.get("focus_visible", False)
        if has_focus_visible:
            project["focus_visible"] = True
        all_selectors = " , ".join(r.selector for r in rules)
        if "prefers-reduced-motion" in css:
            project["reduced_motion"] = True
        if "@keyframes" in css:
            km = re.search(r"@keyframes", css)
            project["anim_site"] = project["anim_site"] or (src.path, src.line_of(base + km.start()))
        for r in rules:
            sel = r.selector.lower()
            body = r.body
            # font sizes
            for v, off in decl(body, "font-size"):
                px = to_px(v.replace("!important", ""))
                if px is not None:
                    project["font_sizes"].add(round(px, 1))
                    if 0 < px < 12:
                        out.add(src, "tiny-text", r.offset + off, f"font-size: {v} on `{_sel(sel)}`")
                    if px < 16 and re.search(r"(^|[\s,>+~(])(input|select|textarea)\b|\.(form-control|input|textfield|form-input)\b", sel) \
                            and "::placeholder" not in sel and "[type=\"checkbox\"]" not in sel:
                        out.add(src, "input-font-small", r.offset + off, f"font-size: {v} on form control `{_sel(sel)}`")
                elif v.strip() in ("x-small", "xx-small", "smaller") and re.search(r"input|select|textarea", sel):
                    out.add(src, "input-font-small", r.offset + off, f"font-size: {v} on form control `{_sel(sel)}`")
            # small targets
            if re.search(r"(^|[\s,>+~])(button|a)\b(?![-\w])|\.(btn|button|icon-btn|icon-button|close|chip|tab|nav-link|menu-item)\b|\[role=.?button", sel) \
                    and ":not(" not in sel and "::" not in sel:
                heights = [to_px(v) for v, _ in decl(body, "height")] + [to_px(v) for v, _ in decl(body, "block-size")]
                mins = [to_px(v) for v, _ in decl(body, "min-height")] + [to_px(v) for v, _ in decl(body, "min-block-size")]
                heights = [h for h in heights if h]
                mins = [h for h in mins if h]
                if heights and min(heights) < 44 and not (mins and max(mins) >= 44):
                    h = min(heights)
                    m = re.search(r"(?<![\w-])(height|block-size)\s*:", body)
                    out.add(src, "small-target", r.offset + (m.start() if m else 0),
                            f"`{_sel(sel)}` is {h:g}px tall", severity="major" if h < 24 else "minor")
            # outline removal
            for v, off in decl(body, "outline"):
                if re.match(r"(none|0)\b", v) and (":focus" in sel or re.search(r"(^|[\s,])(\*|button|a|input|select|textarea)\b", sel)):
                    if ":focus-visible" not in sel and not has_focus_visible and not re.search(r"box-shadow|border-color|outline-color", body):
                        out.add(src, "focus-outline-removed", r.offset + off, f"outline: {v} on `{_sel(sel)}`")
            # durations
            for prop in ("transition", "transition-duration", "animation", "animation-duration"):
                for v, off in decl(body, prop):
                    if re.search(r"spin|pulse|skeleton|shimmer|loading|marquee|infinite|bounce|progress", v + " " + sel):
                        continue
                    ds = [d for d in duration_ms(v) if d > 0]
                    if ds and ds[0] > 500:
                        out.add(src, "slow-animation", r.offset + off, f"{prop}: {v.strip()[:40]}")
                    if prop.startswith("animation") or ("transform" in v or "all" in v):
                        project["anim_site"] = project["anim_site"] or (src.path, src.line_of(r.offset + off))
            # hover-only reveals
            if ":hover" in sel and "hover" not in r.at and re.search(r"(display\s*:\s*(block|flex|grid|inline))|(visibility\s*:\s*visible)|(opacity\s*:\s*1\b)", body):
                parts = [p.strip() for p in r.selector.split(",") if ":hover" in p]
                twins = [p.replace(":hover", alt) for p in parts for alt in (":focus-within", ":focus", ":focus-visible")]
                if not any(t in r.selector or t in all_selectors for t in twins):
                    out.add(src, "hover-only", r.offset, f"`{_sel(sel)}` reveals content on hover only")
            # colors & spacing (project-level)
            for m in re.finditer(r"#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)", body):
                line_start = body.rfind("\n", 0, m.start()) + 1
                if body[line_start: m.start()].strip().startswith("--"):
                    continue  # token definition
                key = _norm_hex(m.group(0)) if m.group(0).startswith("#") else re.sub(r"\s+", "", m.group(0).lower())
                project["colors"].setdefault(key, (src.path, src.line_of(r.offset + m.start())))
            for prop in ("margin", "padding", "gap", "row-gap", "column-gap", "margin-top", "margin-bottom",
                         "padding-top", "padding-bottom", "padding-left", "padding-right", "margin-left", "margin-right"):
                for v, off in decl(body, prop):
                    for num in re.findall(r"(?<![\w.#-])(\d+(?:\.\d+)?)px", v):
                        f = float(num)
                        if f > 2:
                            project["spacing"].append((f, src.path, src.line_of(r.offset + off)))
    # declaration-level checks on CSS-in-JS template literals
    if src.ext in (".js", ".jsx", ".ts", ".tsx") and re.search(r"styled\.|css`|createGlobalStyle", src.text):
        for m in re.finditer(r"font-size\s*:\s*(\d+(?:\.\d+)?)px", src.text):
            if float(m.group(1)) < 12:
                out.add(src, "tiny-text", m.start(), f"font-size: {m.group(1)}px")
        for m in re.finditer(r"outline\s*:\s*(none|0)\b", src.text):
            if ":focus-visible" not in src.text:
                out.add(src, "focus-outline-removed", m.start(), f"outline: {m.group(1)} in CSS-in-JS")


def _sel(sel: str) -> str:
    sel = re.sub(r"\s+", " ", sel)
    return sel if len(sel) < 50 else sel[:49] + "…"


def check_meta(src: Source, out: Collector):
    for m in re.finditer(r"<meta[^>]+name\s*=\s*[\"']viewport[\"'][^>]*>", src.text, re.I):
        if re.search(r"user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b", m.group(0), re.I):
            out.add(src, "zoom-disabled", m.start())


# --------------------------------------------------------------------------- project-level

def check_project(out: Collector, project: dict):
    if project["anim_site"] and not project["reduced_motion"]:
        path, line = project["anim_site"]
        out.add(None, "reduced-motion-missing", 0, path=path, line=line,
                message="Animations/transitions found, but no prefers-reduced-motion handling anywhere in the project",
                evidence="(project-wide)")
    sizes = sorted(s for s in project["font_sizes"] if s > 0)
    if len(sizes) > 10:
        out.add(None, "font-size-sprawl", 0, path="(project)", line=0,
                message=f"{len(sizes)} distinct font sizes: " + ", ".join(f"{s:g}" for s in sizes[:16]) + ("…" if len(sizes) > 16 else ""),
                evidence="(project-wide)")
    colors = project["colors"]
    if len(colors) > 24:
        path, line = next(iter(colors.values()))
        out.add(None, "color-sprawl", 0, path="(project)", line=0,
                message=f"{len(colors)} distinct hard-coded colors outside token definitions", evidence="(project-wide)")
    sp = project["spacing"]
    if len(sp) >= 20:
        off = [x for x in sp if x[0] % 4 != 0]
        if len(off) / len(sp) > 0.25:
            ex = ", ".join(f"{v:g}px" for v, _, _ in off[:6])
            out.add(None, "spacing-off-scale", 0, path=off[0][1], line=off[0][2],
                    message=f"{len(off)}/{len(sp)} spacing values are off the 4px grid (e.g. {ex})", evidence="(project-wide)")


# --------------------------------------------------------------------------- scoring & output

WEIGHTS = {"critical": 12.0, "major": 5.0, "minor": 1.5}


def score(findings: List[Finding]) -> int:
    by_rule: Dict[Tuple[str, str], int] = {}
    for f in findings:
        by_rule[(f.rule, f.severity)] = by_rule.get((f.rule, f.severity), 0) + 1
    penalty = sum(WEIGHTS[sev] * (1 + math.log2(n)) for (_, sev), n in by_rule.items())
    return max(0, round(100 - penalty))


def cite(laws: List[str]) -> str:
    return ", ".join(f"§{l} {LAWS[l]}" for l in laws)


def render_text(findings: List[Finding], files: int, sc: int) -> str:
    counts = {s: sum(1 for f in findings if f.severity == s) for s in ("critical", "major", "minor")}
    lines = [f"UXL static scan · {files} files · {len(findings)} findings "
             f"({counts['critical']} critical, {counts['major']} major, {counts['minor']} minor) · heuristic score {sc}/100", ""]
    for sev in ("critical", "major", "minor"):
        group = [f for f in findings if f.severity == sev]
        if not group:
            continue
        lines.append(sev.upper())
        for f in group:
            loc = f"{f.file}:{f.line}" if f.line else f.file
            lines.append(f"  {loc}  [{f.rule}]  {cite(f.laws)}")
            lines.append(f"    {f.message}")
            if f.evidence and f.evidence != "(project-wide)":
                lines.append(f"    > {f.evidence}")
            lines.append(f"    Fix: {f.fix}")
        lines.append("")
    lines.append(_footer(findings))
    return "\n".join(lines)


def render_md(findings: List[Finding], files: int, sc: int) -> str:
    counts = {s: sum(1 for f in findings if f.severity == s) for s in ("critical", "major", "minor")}
    out = ["## UXL static scan", "",
           f"**{files}** files scanned · **{len(findings)}** findings "
           f"(**{counts['critical']}** critical, **{counts['major']}** major, **{counts['minor']}** minor) · heuristic score **{sc}/100**", ""]
    for sev in ("critical", "major", "minor"):
        group = [f for f in findings if f.severity == sev]
        if not group:
            continue
        out += [f"### {sev.capitalize()} ({len(group)})", "", "| Location | Rule | Law | Finding | Remedy |", "|---|---|---|---|---|"]
        for f in group:
            loc = f"`{f.file}:{f.line}`" if f.line else f"`{f.file}`"
            msg = f.message.replace("|", "\\|")
            out.append(f"| {loc} | `{f.rule}` | {cite(f.laws)} | {msg} | {f.fix.replace('|', '/')} |")
        out.append("")
    out.append(_footer(findings))
    return "\n".join(out)


STATIC_LAWS = sorted({l for r in RULES.values() for l in r.laws})


def _footer(findings: List[Finding]) -> str:
    tally: Dict[str, int] = {}
    for f in findings:
        for l in f.laws:
            tally[l] = tally.get(l, 0) + 1
    top = ", ".join(f"§{l}×{n}" for l, n in sorted(tally.items(), key=lambda x: -x[1])[:8]) or "none"
    manual = [l for l in LAWS if l not in STATIC_LAWS]
    return (f"Laws implicated: {top}\n"
            f"Not statically checkable (review manually): " + ", ".join(f"§{l} {LAWS[l]}" for l in manual) +
            "\nHeuristic scan: verify each finding in context. Pair with uxl_audit.mjs for rendered measurements.")


def run(paths: List[str]) -> Tuple[List[Finding], int]:
    files = discover(paths)
    out = Collector()
    project = {"anim_site": None, "reduced_motion": False, "font_sizes": set(), "colors": {}, "spacing": []}
    for path in files:
        try:
            if os.path.getsize(path) > MAX_FILE_BYTES:
                continue
            with open(path, encoding="utf-8", errors="replace") as fh:
                text = fh.read()
        except OSError:
            continue
        src = Source(os.path.relpath(path), text)
        if src.ext in STYLE_EXT:
            check_css(src, out, project)
            continue
        tags = scan_tags(text)
        check_meta(src, out)
        check_markup(src, tags, out, project)
        check_css(src, out, project)
    check_project(out, project)
    return out.findings, len(files)


def main(argv: Optional[List[str]] = None) -> int:
    ap = argparse.ArgumentParser(description="UXL static linter: Laws of UX checks for front-end source.")
    ap.add_argument("paths", nargs="*", default=["."], help="files or directories (default: .)")
    ap.add_argument("--format", choices=["text", "md", "json"], default="text")
    ap.add_argument("--min-severity", choices=["minor", "major", "critical"], default="minor")
    ap.add_argument("--ignore", default="", help="comma-separated rule ids to skip")
    ap.add_argument("--only", default="", help="comma-separated rule ids to run exclusively")
    ap.add_argument("--max-per-rule", type=int, default=25, help="cap findings per rule (default 25, 0 = no cap)")
    ap.add_argument("--fail-on", choices=["none", "minor", "major", "critical"], default="none",
                    help="exit 1 if any finding at or above this severity (for CI)")
    ap.add_argument("--list-rules", action="store_true", help="print the rule catalogue and exit")
    ap.add_argument("--version", action="version", version=f"uxl_lint {VERSION}")
    args = ap.parse_args(argv)

    if args.list_rules:
        for r in RULES.values():
            print(f"{r.id:24} {r.severity:8} {cite(r.laws)}\n{'':24} {r.title}")
        return 0

    findings, nfiles = run(args.paths)
    ignore = {x.strip() for x in args.ignore.split(",") if x.strip()}
    only = {x.strip() for x in args.only.split(",") if x.strip()}
    findings = [f for f in findings if f.rule not in ignore and (not only or f.rule in only)
                and SEVERITY_ORDER[f.severity] >= SEVERITY_ORDER[args.min_severity]]
    # de-duplicate and cap
    seen, capped, per_rule = set(), [], {}
    for f in sorted(findings, key=lambda f: (-SEVERITY_ORDER[f.severity], f.rule, f.file, f.line)):
        k = (f.rule, f.file, f.line)
        if k in seen:
            continue
        seen.add(k)
        per_rule[f.rule] = per_rule.get(f.rule, 0) + 1
        if args.max_per_rule and per_rule[f.rule] > args.max_per_rule:
            continue
        capped.append(f)
    sc = score(capped)
    if args.format == "json":
        print(json.dumps({"tool": "uxl_lint", "version": VERSION, "files": nfiles, "score": sc,
                          "counts": {s: sum(1 for f in capped if f.severity == s) for s in ("critical", "major", "minor")},
                          "findings": [dict(asdict(f), citation=cite(f.laws)) for f in capped]}, indent=2, ensure_ascii=False))
    elif args.format == "md":
        print(render_md(capped, nfiles, sc))
    else:
        print(render_text(capped, nfiles, sc))
    if args.fail_on != "none" and any(SEVERITY_ORDER[f.severity] >= SEVERITY_ORDER[args.fail_on] for f in capped):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
