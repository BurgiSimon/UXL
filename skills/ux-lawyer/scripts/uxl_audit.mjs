#!/usr/bin/env node
/**
 * UXL runtime auditor: render pages at mobile + desktop viewports and measure them
 * against the Laws of UX (https://lawsofux.com). Part of UXL (UX Lawyer).
 *
 * Usage:
 *   node uxl_audit.mjs <url|file.html> [more...] [--out uxl-report] [--viewports mobile,desktop]
 *                      [--wait 800] [--no-screenshots] [--fail-on major] [--chrome /path/to/chrome] [--json]
 *
 * Requires Playwright (`npm i -D playwright` or `@playwright/test`) and a Chromium build
 * (`npx playwright install chromium`). Resolved from the current project, then global npm.
 * Writes <out>/report.md, <out>/report.json and annotated screenshots per page/viewport.
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";

const VERSION = "1.0.0";

const LAWS = {
  L01: "Aesthetic-Usability Effect", L02: "Choice Overload", L03: "Chunking", L04: "Cognitive Bias",
  L05: "Cognitive Load", L06: "Doherty Threshold", L07: "Fitts's Law", L08: "Flow", L09: "Goal-Gradient Effect",
  L10: "Hick's Law", L11: "Jakob's Law", L12: "Law of Common Region", L13: "Law of Proximity",
  L14: "Law of Prägnanz", L15: "Law of Similarity", L16: "Law of Uniform Connectedness", L17: "Mental Model",
  L18: "Miller's Law", L19: "Occam's Razor", L20: "Paradox of the Active User", L21: "Pareto Principle",
  L22: "Parkinson's Law", L23: "Peak-End Rule", L24: "Postel's Law", L25: "Selective Attention",
  L26: "Serial Position Effect", L27: "Tesler's Law", L28: "Von Restorff Effect", L29: "Working Memory",
  L30: "Zeigarnik Effect",
};

const RULES = {
  "tap-target-size": { laws: ["L07"], fix: "min-height/min-width 44px, or expand the hit area with ::after (inset: -10px)." },
  "tap-target-spacing": { laws: ["L07", "L13"], fix: "Keep >= 8px between separate targets, or merge them into one larger control." },
  "horizontal-overflow": { laws: ["L11", "L17"], fix: "Constrain widths (max-width: 100%, min-width: 0 on flex children, overflow-wrap: anywhere)." },
  "text-too-small": { laws: ["L01", "L05"], fix: "Body text >= 16px on mobile; nothing below 12px." },
  "input-zoom": { laws: ["L08", "L24"], fix: "Form controls need font-size >= 16px on mobile (iOS zooms otherwise). Never fix this by disabling zoom." },
  "contrast": { laws: ["L01", "L25"], fix: "Text contrast >= 4.5:1 (>= 3:1 for >= 24px or >= 18.7px bold)." },
  "nav-overload": { laws: ["L10", "L18", "L02"], fix: "<= 7 top-level items on desktop, 3-5 in a mobile tab bar; group the rest." },
  "cta-competition": { laws: ["L28", "L10"], fix: "One filled/high-emphasis primary action per view; demote others to secondary/ghost styles." },
  "no-h1": { laws: ["L26", "L25"], fix: "Give each page one visible <h1> that states its purpose, near the top." },
  "slow-paint": { laws: ["L06"], fix: "LCP <= 2.5s, FCP <= 1.8s: optimize images (srcset, AVIF/WebP), preload the hero, cut render-blocking JS/CSS." },
  "layout-shift": { laws: ["L06", "L14"], fix: "CLS <= 0.1: reserve space (width/height, aspect-ratio, skeletons); don't inject content above existing content." },
  "focus-invisible": { laws: ["L24", "L11"], fix: "Visible :focus-visible style (2px outline + offset) on every interactive element." },
  "form-load": { laws: ["L03", "L05", "L09"], fix: "Group fields (fieldset/legend), remove optional ones, or split into steps with progress." },
  "unlabeled-input": { laws: ["L29", "L05"], fix: "Visible <label> for every control; placeholders are hints, not labels." },
  "font-sprawl": { laws: ["L15", "L14", "L01"], fix: "Use a type scale of ~6-8 sizes and at most 2 font families." },
  "color-sprawl": { laws: ["L15", "L01"], fix: "Limit text colors to token roles (text, muted, accent, danger, success...)." },
  "autoplay-media": { laws: ["L25", "L05"], fix: "No autoplaying carousels; videos never autoplay with sound; provide pause controls." },
  "viewport-missing": { laws: ["L07", "L11"], fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' },
  "zoom-disabled": { laws: ["L24", "L11"], fix: "Remove user-scalable=no / maximum-scale; never block pinch-zoom." },
};

const VIEWPORTS = {
  small: {
    viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36",
  },
  mobile: {
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
};

const SEV = { minor: 0, major: 1, critical: 2 };

// ------------------------------------------------------------------ args

function parseArgs(argv) {
  const opts = { targets: [], out: "uxl-report", viewports: ["mobile", "desktop"], wait: 800, screenshots: true, failOn: "none", chrome: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--out") opts.out = next();
    else if (a === "--viewports") opts.viewports = next().split(",").map((s) => s.trim()).filter(Boolean);
    else if (a === "--wait") opts.wait = Number(next());
    else if (a === "--no-screenshots") opts.screenshots = false;
    else if (a === "--fail-on") opts.failOn = next();
    else if (a === "--chrome") opts.chrome = next();
    else if (a === "--json") opts.json = true;
    else if (a === "--help" || a === "-h") { opts.help = true; }
    else if (a === "--version") { console.log(`uxl_audit ${VERSION}`); process.exit(0); }
    else opts.targets.push(a);
  }
  return opts;
}

const HELP = `UXL runtime auditor ${VERSION}: Laws of UX checks on rendered pages (mobile 390x844 + desktop 1440x900)

  node uxl_audit.mjs <url|file.html> [more...] [options]

Options:
  --out <dir>            output directory (default: uxl-report)
  --viewports <list>     small (360x740), mobile (390x844), desktop (1440x900); default mobile,desktop
  --wait <ms>            extra settle time after load (default 800)
  --no-screenshots       skip screenshots
  --fail-on <severity>   exit 1 if any finding >= minor|major|critical (CI)
  --chrome <path>        Chromium/Chrome executable to use
  --json                 print JSON to stdout instead of the summary

Outputs: report.md, report.json, <page>-<viewport>.png (first screen) and
<page>-<viewport>-annotated.png (full page, violations outlined).`;

// ------------------------------------------------------------------ playwright resolution

async function loadPlaywright() {
  const bases = [process.cwd(), path.dirname(fileURLToPath(import.meta.url))];
  try { bases.push(execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim()); } catch {}
  for (const base of bases) {
    const req = createRequire(path.join(base, "noop.js"));
    for (const name of ["playwright", "@playwright/test", "playwright-core"]) {
      try {
        const resolved = req.resolve(name, { paths: [base] });
        const mod = await import(pathToFileURL(resolved).href);
        const pw = mod.chromium ? mod : mod.default;
        if (pw?.chromium) return pw;
      } catch {}
    }
  }
  return null;
}

async function launch(pw, chromePath) {
  const candidates = [chromePath, process.env.UXL_CHROME, process.env.CHROME_PATH].filter(Boolean);
  const errors = [];
  try { return await pw.chromium.launch(); } catch (e) { errors.push(e.message.split("\n")[0]); }
  for (const executablePath of candidates) {
    try { return await pw.chromium.launch({ executablePath }); } catch (e) { errors.push(e.message.split("\n")[0]); }
  }
  for (const channel of ["chrome", "msedge"]) {
    try { return await pw.chromium.launch({ channel }); } catch {}
  }
  for (const p of ["/opt/pw-browsers/chromium", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]) {
    if (fs.existsSync(p)) { try { return await pw.chromium.launch({ executablePath: p }); } catch {} }
  }
  throw new Error("Could not launch Chromium. Run `npx playwright install chromium` or pass --chrome <path>.\n" + errors.join("\n"));
}

// ------------------------------------------------------------------ in-page measurement

/* eslint-disable no-undef */
function measure(cfg) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const isMobile = cfg.isMobile;
  const out = { metrics: {}, findings: [], marks: [] };
  const add = (rule, severity, message, evidence, el, extra = {}) => {
    out.findings.push({ rule, severity, message, evidence, ...extra });
    if (el) out.marks.push({ rule, severity, rect: absRect(el) });
  };
  const absRect = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) return false;
    if (el.closest("[hidden],[aria-hidden='true'],details:not([open]) > :not(summary)")) return false;
    if (cs.clip === "rect(0px, 0px, 0px, 0px)" || (cs.position === "absolute" && r.width <= 1 && r.height <= 1)) return false;
    return true;
  };
  const sel = (el) => {
    const parts = [];
    let node = el;
    for (let depth = 0; node && node.nodeType === 1 && depth < 3; depth++) {
      let s = node.tagName.toLowerCase();
      if (node.id) { parts.unshift(`${s}#${node.id}`); break; }
      const cls = [...node.classList].filter((c) => !/^(css|sc|jsx|svelte)-|\d{3,}|:/.test(c)).slice(0, 2);
      if (cls.length) s += "." + cls.join(".");
      if (node.getAttribute("name")) s += `[name="${node.getAttribute("name")}"]`;
      parts.unshift(s);
      node = node.parentElement;
    }
    return parts.join(" > ");
  };
  const text = (el) => (el.innerText || el.value || el.getAttribute("aria-label") || el.getAttribute("title") || "").trim().replace(/\s+/g, " ").slice(0, 40);

  // ---- colors
  const parseColor = (c) => {
    const m = c && c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const blend = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  const bgOf = (el) => {
    const layers = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return null; // unknown (image/gradient)
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base);
    return base;
  };
  const pageBg = bgOf(document.body) || { r: 255, g: 255, b: 255, a: 1 };

  // ---- interactive targets (Fitts)
  const interactiveSel = "a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [role=menuitem], [role=checkbox], [role=switch], [role=radio], [onclick], [tabindex]:not([tabindex='-1'])";
  const all = [...document.querySelectorAll(interactiveSel)].filter(visible);
  const targets = all.filter((el) => !(el.parentElement && el.parentElement.closest(interactiveSel)) || el.matches("input,select,textarea"));
  const isInlineTextLink = (el) => {
    if (el.tagName !== "A") return false;
    const cs = getComputedStyle(el);
    if (cs.display !== "inline") return false;
    const block = el.parentElement;
    return block && (block.innerText || "").trim().length > (el.innerText || "").trim().length + 15;
  };
  const minSize = isMobile ? 44 : 24;
  const small = [];
  for (const el of targets) {
    if (isInlineTextLink(el)) continue;
    if (el.matches("input[type=checkbox], input[type=radio]") && el.closest("label")) continue; // label is the target
    const r = el.getBoundingClientRect();
    let w = r.width, h = r.height;
    if (w < minSize || h < minSize) {
      // probe the real hit area (pseudo-element expansions, wrapping labels)
      const label = el.closest("label") || (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
      if (label && visible(label)) { const lr = label.getBoundingClientRect(); w = Math.max(w, lr.width); h = Math.max(h, lr.height); }
    }
    if (w < minSize || h < minSize) small.push({ el, w, h });
  }
  out.metrics.targets = targets.length;
  out.metrics.smallTargets = small.length;
  if (small.length) {
    const worst = [...small].sort((a, b) => Math.min(a.w, a.h) - Math.min(b.w, b.h));
    const tiny = small.filter((s) => Math.min(s.w, s.h) < 24).length;
    const sev = isMobile ? (tiny ? "critical" : "major") : "minor";
    add("tap-target-size", sev,
      `${small.length} of ${targets.length} interactive targets are smaller than ${minSize}×${minSize}px` + (tiny && minSize > 24 ? ` (${tiny} below 24px)` : ""),
      worst.slice(0, 6).map((s) => `${sel(s.el)} "${text(s.el)}" ${Math.round(s.w)}×${Math.round(s.h)}`).join("; "));
    for (const s of worst.slice(0, 80)) out.marks.push({ rule: "tap-target-size", severity: sev, rect: absRect(s.el) });
  }
  // spacing between undersized targets (only meaningful on touch)
  if (isMobile && small.length) {
    const rects = targets.map((el) => ({ el, r: el.getBoundingClientRect() }));
    const tooClose = [];
    for (const s of small.slice(0, 120)) {
      const a = s.el.getBoundingClientRect();
      for (const o of rects) {
        if (o.el === s.el || o.el.contains(s.el) || s.el.contains(o.el)) continue;
        const b = o.r;
        const dx = Math.max(0, Math.max(a.left, b.left) - Math.min(a.right, b.right));
        const dy = Math.max(0, Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom));
        if (Math.hypot(dx, dy) < 8) { tooClose.push([s.el, o.el, Math.hypot(dx, dy)]); break; }
      }
    }
    if (tooClose.length) add("tap-target-spacing", "major", `${tooClose.length} small targets sit < 8px from a neighbour`,
      tooClose.slice(0, 4).map(([a, b, d]) => `${sel(a)} ↔ ${sel(b)} (${Math.round(d)}px)`).join("; "));
  }

  // ---- viewport meta (mobile rendering + zoom)
  const vpMeta = document.querySelector("meta[name=viewport]");
  const vpContent = (vpMeta && vpMeta.getAttribute("content")) || "";
  if (!vpMeta) add("viewport-missing", "critical", "No viewport meta tag: phones render a zoomed-out desktop page", "");
  else if (/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(vpContent)) add("zoom-disabled", "major", "Pinch-zoom is disabled by the viewport meta tag", vpContent);

  // ---- overflow
  const sw = document.documentElement.scrollWidth;
  out.metrics.scrollWidth = sw;
  if (sw > vw + 2 && getComputedStyle(document.body).overflowX !== "hidden") {
    const offenders = [...document.body.querySelectorAll("*")].filter((el) => { const r = el.getBoundingClientRect(); return r.right > vw + 2 && r.width > 0 && visible(el); })
      .filter((el) => !el.parentElement || el.parentElement.getBoundingClientRect().right <= vw + 2).slice(0, 4);
    add("horizontal-overflow", isMobile ? "major" : "minor", `Page is ${sw}px wide in a ${vw}px viewport (sideways scrolling)`,
      offenders.map((el) => `${sel(el)} (right edge ${Math.round(el.getBoundingClientRect().right)}px)`).join("; "), offenders[0]);
  }

  // ---- text: sizes, contrast, sprawl
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.nodeValue.trim().length > 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
  const sizeChars = new Map(), families = new Map(), colors = new Map();
  const seen = new Set();
  const lowContrast = [], tinyText = [];
  let n;
  while ((n = walker.nextNode())) {
    const el = n.parentElement;
    if (!el || seen.has(el) || el.closest("script,style,noscript,svg,code,pre")) continue;
    seen.add(el);
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const chars = n.nodeValue.trim().length;
    sizeChars.set(fs, (sizeChars.get(fs) || 0) + chars);
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase();
    families.set(fam, (families.get(fam) || 0) + chars);
    colors.set(cs.color, (colors.get(cs.color) || 0) + chars);
    if (fs < 12 && !el.closest("sup,sub")) tinyText.push({ el, fs });
    if (seen.size < 1500) {
      const fg = parseColor(cs.color), bg = bgOf(el);
      if (fg && bg) {
        const eff = fg.a < 1 ? blend(fg, bg) : fg;
        const rr = ratio(eff, bg);
        const large = fs >= 24 || (fs >= 18.66 && Number(cs.fontWeight) >= 700);
        const need = large ? 3 : 4.5;
        if (rr < need && !el.closest("[disabled],[aria-disabled='true']")) lowContrast.push({ el, rr, need });
      }
    }
  }
  const totalChars = [...sizeChars.values()].reduce((a, b) => a + b, 0) || 1;
  const bodySize = [...sizeChars.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 16;
  out.metrics.bodyFontSize = bodySize;
  out.metrics.fontSizes = [...sizeChars.keys()].sort((a, b) => a - b);
  out.metrics.fontFamilies = [...families.keys()];
  out.metrics.textColors = colors.size;
  if (isMobile && bodySize < 16) {
    add("text-too-small", bodySize < 14 ? "major" : "minor", `Most body text renders at ${bodySize}px on mobile`, `${Math.round((sizeChars.get(bodySize) / totalChars) * 100)}% of characters`);
  }
  if (tinyText.length) {
    add("text-too-small", "minor", `${tinyText.length} text elements render below 12px`, tinyText.slice(0, 5).map((t) => `${sel(t.el)} ${t.fs}px "${text(t.el)}"`).join("; "));
    for (const t of tinyText.slice(0, 40)) out.marks.push({ rule: "text-too-small", severity: "minor", rect: absRect(t.el) });
  }
  if (lowContrast.length) {
    const severe = lowContrast.filter((c) => c.rr < 3).length;
    add("contrast", severe ? "major" : "minor", `${lowContrast.length} text elements below WCAG AA contrast` + (severe ? ` (${severe} below 3:1)` : ""),
      lowContrast.sort((a, b) => a.rr - b.rr).slice(0, 5).map((c) => `${sel(c.el)} "${text(c.el)}" ${c.rr.toFixed(2)}:1 (needs ${c.need}:1)`).join("; "));
    for (const c of lowContrast.slice(0, 60)) out.marks.push({ rule: "contrast", severity: c.rr < 3 ? "major" : "minor", rect: absRect(c.el) });
  }
  const meaningfulSizes = [...sizeChars.entries()].filter(([, c]) => c / totalChars > 0.002).length;
  if (meaningfulSizes > 8) add("font-sprawl", "minor", `${meaningfulSizes} distinct font sizes in use`, out.metrics.fontSizes.join(", "));
  const fams = [...families.entries()].filter(([, c]) => c / totalChars > 0.01);
  if (fams.length > 3) add("font-sprawl", "minor", `${fams.length} font families in use`, fams.map(([f]) => f).join(", "));
  const meaningfulColors = [...colors.entries()].filter(([, c]) => c / totalChars > 0.003).length;
  if (meaningfulColors > 12) add("color-sprawl", "minor", `${meaningfulColors} distinct text colors in use`, "");

  // ---- form controls: zoom + labels + load
  const controls = [...document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]):not([type=image]), select, textarea")].filter(visible);
  const zoomers = controls.filter((el) => !el.matches("[type=checkbox],[type=radio],[type=range],[type=color],[type=file]") && parseFloat(getComputedStyle(el).fontSize) < 16);
  if (isMobile && zoomers.length) {
    add("input-zoom", "major", `${zoomers.length} form controls use < 16px text (iOS Safari zooms in on focus)`,
      zoomers.slice(0, 4).map((el) => `${sel(el)} ${getComputedStyle(el).fontSize}`).join("; "), zoomers[0]);
  }
  const unlabeled = [], placeholderOnly = [];
  for (const el of controls) {
    const named = (el.labels && [...el.labels].some((l) => l.innerText.trim())) || el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.getAttribute("title");
    if (named) continue;
    if (el.getAttribute("placeholder")) placeholderOnly.push(el); else unlabeled.push(el);
  }
  if (unlabeled.length) add("unlabeled-input", "critical", `${unlabeled.length} form controls have no accessible label`, unlabeled.slice(0, 5).map(sel).join("; "), unlabeled[0]);
  if (placeholderOnly.length) {
    add("unlabeled-input", "major", `${placeholderOnly.length} form controls use the placeholder as their only label`, placeholderOnly.slice(0, 5).map((el) => `${sel(el)} "${el.placeholder}"`).join("; "));
    for (const el of placeholderOnly.slice(0, 30)) out.marks.push({ rule: "unlabeled-input", severity: "major", rect: absRect(el) });
  }
  for (const form of document.querySelectorAll("form")) {
    const fields = controls.filter((c) => form.contains(c)).length;
    if (fields > 8 && !form.querySelector("fieldset") && !/step|progress/i.test(form.outerHTML.slice(0, 20000))) {
      add("form-load", "major", `A single form shows ${fields} fields at once without grouping or steps`, sel(form));
    }
  }

  // ---- navigation (Hick / Miller)
  const navs = [...document.querySelectorAll("nav, [role=navigation]")].filter((nv) => visible(nv) && !nv.closest("footer") && !/breadcrumb|pagination|footer|toc|contents/i.test(nv.getAttribute("aria-label") || nv.className || ""));
  for (const nv of navs) {
    const items = [...nv.querySelectorAll("a[href], button")].filter(visible).filter((el) => el.getBoundingClientRect().top < vh * 1.2);
    const cs = getComputedStyle(nv);
    const r = nv.getBoundingClientRect();
    const bottomBar = isMobile && (cs.position === "fixed" || cs.position === "sticky") && r.bottom >= vh - 4;
    const limit = bottomBar ? 5 : 7;
    // Labelled groups (heading / aria-expanded toggle / role=group) count as ONE choice each (§L03 chunking)
    const groups = new Set();
    for (const h of nv.querySelectorAll("h2,h3,h4,h5,h6,[role=heading],[aria-expanded],[role=group],summary,legend")) {
      if (!visible(h)) continue;
      let c = h.parentElement;
      while (c && c !== nv && items.filter((i) => c.contains(i) && i !== h).length < 2) c = c.parentElement;
      if (c && c !== nv) groups.add(c);
    }
    const outer = [...groups].filter((g) => ![...groups].some((o) => o !== g && o.contains(g)));
    const ungrouped = items.filter((i) => !outer.some((g) => g.contains(i)));
    const choices = ungrouped.length + outer.length;
    out.metrics.navChoices = Math.max(out.metrics.navChoices || 0, choices);
    if (choices > limit) {
      add("nav-overload", "major", `${bottomBar ? "Bottom tab bar" : "Navigation"} presents ${choices} top-level choices (limit ${limit})` + (outer.length ? ` (${outer.length} groups + ${ungrouped.length} ungrouped)` : ""), `${sel(nv)}: ${items.slice(0, 12).map(text).join(" · ")}`, nv);
    } else if (items.length > 20) {
      add("nav-overload", "minor", `Navigation shows ${items.length} links at once (grouped into ${outer.length} sections); consider collapsing rarely used groups`, sel(nv));
    }
  }

  // ---- CTA competition in the first screen (Von Restorff)
  const btnLike = all.filter((el) => el.matches("button, a, input[type=submit], [role=button]") && !el.closest("nav, header nav, footer"));
  const filled = [];
  for (const el of btnLike) {
    const r = el.getBoundingClientRect();
    if (r.top > vh || r.bottom < 0 || r.height < 20 || r.width < 40) continue;
    const bg = parseColor(getComputedStyle(el).backgroundColor);
    if (!bg || bg.a < 0.6) continue;
    const eff = blend(bg, pageBg);
    const c = ratio(eff, pageBg);
    const sat = Math.max(eff.r, eff.g, eff.b) - Math.min(eff.r, eff.g, eff.b);
    if (c >= 2 || sat > 60) filled.push({ el, c });
  }
  out.metrics.filledCtasAboveFold = filled.length;
  const distinct = new Set(filled.map((f) => text(f.el).toLowerCase())).size;  // the same action repeated is not competition
  if (filled.length >= 3 && distinct >= 2) {
    add("cta-competition", "major", `${filled.length} high-emphasis (filled) actions compete in the first screen`, filled.slice(0, 6).map((f) => `"${text(f.el)}"`).join(", "));
    for (const f of filled) out.marks.push({ rule: "cta-competition", severity: "major", rect: absRect(f.el) });
  } else if (filled.length === 2 && distinct === 2 && isMobile) {
    add("cta-competition", "minor", `2 filled actions share the first screen; make sure one clearly dominates`, filled.map((f) => `"${text(f.el)}"`).join(", "));
  }

  // ---- headline
  const h1s = [...document.querySelectorAll("h1")].filter(visible);
  out.metrics.h1 = h1s.length;
  if (!h1s.length) add("no-h1", "minor", "No visible <h1>: the page's purpose is not stated as its first, strongest element", "");
  else if (h1s[0].getBoundingClientRect().top > vh) add("no-h1", "minor", `The <h1> starts below the first screen (${Math.round(h1s[0].getBoundingClientRect().top)}px)`, sel(h1s[0]), h1s[0]);

  // ---- media
  const loudVideos = [...document.querySelectorAll("video")].filter((v) => (v.autoplay || !v.paused) && !v.muted);
  if (loudVideos.length) add("autoplay-media", "major", `${loudVideos.length} video(s) autoplay with sound`, loudVideos.map(sel).join("; "), loudVideos[0]);
  if (document.querySelector("marquee, blink")) add("autoplay-media", "minor", "<marquee>/<blink> motion", "");
  out.carousels = [...document.querySelectorAll("[class*=carousel i], [class*=slider i], [class*=swiper i], [class*=slick i], [class*=embla i], [data-autoplay]")]
    .filter(visible).slice(0, 5).map((el) => ({ sel: sel(el), sig: el.innerHTML.length + "|" + [...el.querySelectorAll("*")].slice(0, 50).map((c) => getComputedStyle(c).transform + getComputedStyle(c).display).join() }));
  return out;
}

function carouselSignature(sels) {
  return sels.map((s) => {
    const el = document.querySelector(s.split(" > ").join(" "));
    if (!el) return "";
    return el.innerHTML.length + "|" + [...el.querySelectorAll("*")].slice(0, 50).map((c) => getComputedStyle(c).transform + getComputedStyle(c).display).join();
  });
}

function focusState() {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const sig = [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow, cs.borderColor, cs.backgroundColor, cs.textDecorationLine, cs.color].join("|");
  let s = el.tagName.toLowerCase();
  if (el.id) s += "#" + el.id; else if (el.classList.length) s += "." + [...el.classList].slice(0, 2).join(".");
  return { sig, sel: s, text: (el.innerText || el.value || el.getAttribute("aria-label") || "").trim().slice(0, 30), visibleRect: r.width > 0 && r.height > 0, rect: { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height } };
}

function overlay(marks) {
  const colors = { critical: "#d0021b", major: "#f5730a", minor: "#c9a400" };
  const root = document.createElement("div");
  root.id = "__uxl_overlay";
  root.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none;";
  const merged = new Map();
  for (const m of marks) {
    const k = [m.rect.x, m.rect.y, m.rect.w, m.rect.h].map(Math.round).join(",");
    const prev = merged.get(k);
    if (!prev) merged.set(k, { ...m, rules: [m.rule] });
    else {
      if (!prev.rules.includes(m.rule)) prev.rules.push(m.rule);
      if ((["minor", "major", "critical"].indexOf(m.severity)) > (["minor", "major", "critical"].indexOf(prev.severity))) prev.severity = m.severity;
    }
  }
  for (const m of merged.values()) {
    m.rule = m.rules.join(" · ");
    const b = document.createElement("div");
    const c = colors[m.severity] || "#f5730a";
    b.style.cssText = `position:absolute;left:${m.rect.x - 2}px;top:${m.rect.y - 2}px;width:${m.rect.w + 4}px;height:${m.rect.h + 4}px;outline:2px solid ${c};background:${c}22;box-sizing:border-box;`;
    const t = document.createElement("span");
    t.textContent = m.rule;
    t.style.cssText = `position:absolute;left:0;top:-14px;font:600 10px/12px system-ui,sans-serif;color:#fff;background:${c};padding:1px 3px;white-space:nowrap;`;
    b.appendChild(t);
    root.appendChild(b);
  }
  document.body.appendChild(root);
}
/* eslint-enable no-undef */

// ------------------------------------------------------------------ driver

const PERF_INIT = `
  window.__uxl = { lcp: 0, cls: 0, fcp: 0 };
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__uxl.lcp = Math.max(window.__uxl.lcp, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__uxl.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__uxl.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
  } catch (e) {}
`;

function toUrl(target) {
  if (/^(https?|file|data):/i.test(target)) return target;
  const p = path.resolve(target);
  if (fs.existsSync(p)) return pathToFileURL(fs.statSync(p).isDirectory() ? path.join(p, "index.html") : p).href;
  return "http://" + target;
}

function slug(url) {
  const u = url.replace(/^[a-z]+:\/\//i, "").replace(/[?#].*$/, "");
  return (u.split("/").filter(Boolean).slice(-2).join("-") || "page").replace(/[^a-z0-9.-]+/gi, "-").replace(/\.html?$/, "").slice(0, 60) || "page";
}

async function auditPage(browser, url, vpName, opts, outDir) {
  const vp = VIEWPORTS[vpName];
  const context = await browser.newContext({ ...vp, reducedMotion: "no-preference" });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(String(e.message || e).slice(0, 160)));
  await page.addInitScript(PERF_INIT);
  const t0 = Date.now();
  let status = null;
  try {
    const resp = await page.goto(url, { waitUntil: "load", timeout: 45000 });
    status = resp ? resp.status() : null;
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  } catch (e) {
    await context.close();
    return { url, viewport: vpName, error: `Navigation failed: ${e.message.split("\n")[0]}`, findings: [] };
  }
  await page.waitForTimeout(opts.wait);
  const loadMs = Date.now() - t0;

  const res = await page.evaluate(measure, { isMobile: vp.isMobile });
  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    return { ...window.__uxl, ttfb: nav ? nav.responseStart : 0, domContentLoaded: nav ? nav.domContentLoadedEventEnd : 0 };
  });
  res.metrics.perf = { ...perf, loadMs };
  const lcp = perf.lcp, fcp = perf.fcp, cls = perf.cls;
  if (lcp > 4000) res.findings.push({ rule: "slow-paint", severity: "critical", message: `Largest Contentful Paint ${Math.round(lcp)}ms (> 4s)`, evidence: `FCP ${Math.round(fcp)}ms, TTFB ${Math.round(perf.ttfb)}ms` });
  else if (lcp > 2500) res.findings.push({ rule: "slow-paint", severity: "major", message: `Largest Contentful Paint ${Math.round(lcp)}ms (> 2.5s)`, evidence: `FCP ${Math.round(fcp)}ms` });
  else if (fcp > 1800) res.findings.push({ rule: "slow-paint", severity: "minor", message: `First Contentful Paint ${Math.round(fcp)}ms (> 1.8s)`, evidence: "" });
  if (cls > 0.25) res.findings.push({ rule: "layout-shift", severity: "critical", message: `Cumulative Layout Shift ${cls.toFixed(3)} (> 0.25)`, evidence: "" });
  else if (cls > 0.1) res.findings.push({ rule: "layout-shift", severity: "major", message: `Cumulative Layout Shift ${cls.toFixed(3)} (> 0.1)`, evidence: "" });

  // keyboard focus visibility (desktop only: keyboard users)
  if (!vp.isMobile) {
    const invisible = [];
    const seen = new Set();
    // Freeze transitions so focused vs. blurred styles can be compared instantly
    await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
    await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement) document.activeElement.blur(); });
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(focusState);
      if (!focused || seen.has(focused.sel + focused.text)) continue;
      seen.add(focused.sel + focused.text);
      // Compare the element AND its two nearest ancestors (indicators drawn via :focus-within count)
      const changed = await page.evaluate(() => {
        const el = document.activeElement;
        const sigOf = (n) => { if (!n || n.nodeType !== 1) return ""; const c = getComputedStyle(n); return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.boxShadow, c.borderColor, c.backgroundColor, c.textDecorationLine, c.color].join("|"); };
        const chain = [el, el.parentElement, el.parentElement && el.parentElement.parentElement];
        const before = chain.map(sigOf).join("#");
        el.blur();
        const after = chain.map(sigOf).join("#");
        el.focus();
        return before !== after;
      });
      const hasOutline = !/^none\|/.test(focused.sig) && !/\|0px\|/.test(focused.sig.split("|").slice(0, 3).join("|") + "|");
      if (focused.visibleRect && !changed && !hasOutline) invisible.push(focused);
    }
    res.metrics.focusChecked = seen.size;
    if (invisible.length) {
      res.findings.push({ rule: "focus-invisible", severity: "major", message: `${invisible.length} of ${seen.size} keyboard focus stops show no visible focus indicator`, evidence: invisible.slice(0, 5).map((f) => `${f.sel} "${f.text}"`).join("; ") });
      for (const f of invisible) res.marks.push({ rule: "focus-invisible", severity: "major", rect: f.rect });
    }
  }

  // carousel autoplay: did anything move on its own?
  if (res.carousels?.length && vpName === opts.viewports[0]) {
    const before = res.carousels.map((c) => c.sig);
    await page.waitForTimeout(3500);
    const after = await page.evaluate(carouselSignature, res.carousels.map((c) => c.sel));
    const moved = res.carousels.filter((c, i) => after[i] && after[i] !== before[i]);
    if (moved.length) res.findings.push({ rule: "autoplay-media", severity: "minor", message: `${moved.length} carousel/slider(s) advance on their own`, evidence: moved.map((c) => c.sel).join("; ") });
  }
  delete res.carousels;

  const base = `${slug(url)}-${vpName}`;
  if (opts.screenshots) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(outDir, `${base}.png`) });
    await page.evaluate(overlay, res.marks);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({ path: path.join(outDir, `${base}-annotated.png`), fullPage: height < 12000 });
  }
  await context.close();
  for (const f of res.findings) Object.assign(f, { laws: RULES[f.rule].laws, fix: RULES[f.rule].fix, viewport: vpName, url });
  return { url, viewport: vpName, status, metrics: res.metrics, findings: res.findings, consoleErrors, screenshots: opts.screenshots ? [`${base}.png`, `${base}-annotated.png`] : [] };
}

function score(findings) {
  const w = { critical: 12, major: 5, minor: 1.5 };
  const by = new Map();
  for (const f of findings) { const k = f.rule + "|" + f.severity; by.set(k, (by.get(k) || 0) + 1); }
  let penalty = 0;
  for (const [k, n] of by) penalty += w[k.split("|")[1]] * (1 + Math.log2(n));
  return Math.max(0, Math.round(100 - penalty));
}

const cite = (laws) => laws.map((l) => `§${l} ${LAWS[l]}`).join(", ");

function renderMd(pages, sc) {
  const findings = pages.flatMap((p) => p.findings);
  const count = (s) => findings.filter((f) => f.severity === s).length;
  const lines = [
    "# UXL runtime audit", "",
    `**${pages.length}** page renders · **${findings.length}** findings (**${count("critical")}** critical, **${count("major")}** major, **${count("minor")}** minor) · heuristic score **${sc}/100**`, "",
    "Each finding cites the Law of UX it violates (lawsofux.com). Measurements are heuristics. Confirm visually in the annotated screenshots.", "",
  ];
  for (const p of pages) {
    lines.push(`## ${p.url} · ${p.viewport}`, "");
    if (p.error) { lines.push(`> ${p.error}`, ""); continue; }
    const m = p.metrics;
    const perf = m.perf || {};
    lines.push(`- Targets: ${m.targets} interactive, ${m.smallTargets} undersized · Body text: ${m.bodyFontSize}px · Font sizes: ${(m.fontSizes || []).length} · Families: ${(m.fontFamilies || []).join(", ")}`);
    lines.push(`- Paint: FCP ${Math.round(perf.fcp || 0)}ms · LCP ${Math.round(perf.lcp || 0)}ms · CLS ${(perf.cls || 0).toFixed(3)} · Filled CTAs in first screen: ${m.filledCtasAboveFold} · h1: ${m.h1}`);
    if (p.screenshots.length) lines.push(`- Screenshots: \`${p.screenshots[0]}\` (first screen), \`${p.screenshots[1]}\` (annotated)`);
    if (p.consoleErrors.length) lines.push(`- JS errors: ${p.consoleErrors.slice(0, 3).join(" | ")}`);
    lines.push("");
    if (!p.findings.length) { lines.push("No runtime violations detected.", ""); continue; }
    lines.push("| Severity | Rule | Law | Finding | Evidence | Remedy |", "|---|---|---|---|---|---|");
    for (const f of [...p.findings].sort((a, b) => SEV[b.severity] - SEV[a.severity])) {
      const esc = (s) => String(s || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(`| ${f.severity} | \`${f.rule}\` | ${cite(f.laws)} | ${esc(f.message)} | ${esc(f.evidence).slice(0, 300)} | ${esc(f.fix)} |`);
    }
    lines.push("");
  }
  const checked = new Set(Object.values(RULES).flatMap((r) => r.laws));
  lines.push("---", "", "Not measurable at runtime (review manually): " + Object.keys(LAWS).filter((l) => !checked.has(l)).map((l) => `§${l} ${LAWS[l]}`).join(", "));
  return lines.join("\n");
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.targets.length) { console.log(HELP); process.exit(opts.help ? 0 : 2); }
  for (const v of opts.viewports) if (!VIEWPORTS[v]) { console.error(`Unknown viewport "${v}" (use small, mobile, desktop)`); process.exit(2); }
  const pw = await loadPlaywright();
  if (!pw) {
    console.error("UXL audit needs Playwright. Install it in the project:\n  npm i -D playwright && npx playwright install chromium\n(or @playwright/test). Then re-run. Static checks are still available via uxl_lint.py.");
    process.exit(3);
  }
  const browser = await launch(pw, opts.chrome);
  fs.mkdirSync(opts.out, { recursive: true });
  const pages = [];
  try {
    for (const t of opts.targets) {
      const url = toUrl(t);
      for (const vp of opts.viewports) pages.push(await auditPage(browser, url, vp, opts, opts.out));
    }
  } finally {
    await browser.close();
  }
  const findings = pages.flatMap((p) => p.findings);
  const sc = score(findings);
  const report = { tool: "uxl_audit", version: VERSION, generated: new Date().toISOString(), score: sc,
    counts: Object.fromEntries(["critical", "major", "minor"].map((s) => [s, findings.filter((f) => f.severity === s).length])),
    pages: pages.map((p) => ({ ...p, findings: p.findings.map((f) => ({ ...f, citation: cite(f.laws) })) })) };
  fs.writeFileSync(path.join(opts.out, "report.json"), JSON.stringify(report, null, 2));
  const md = renderMd(pages, sc);
  fs.writeFileSync(path.join(opts.out, "report.md"), md);
  if (opts.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`UXL runtime audit · ${pages.length} renders · ${findings.length} findings (${report.counts.critical} critical, ${report.counts.major} major, ${report.counts.minor} minor) · score ${sc}/100`);
    for (const p of pages) {
      console.log(`\n${p.url} [${p.viewport}]` + (p.error ? `  ERROR ${p.error}` : ""));
      for (const f of [...p.findings].sort((a, b) => SEV[b.severity] - SEV[a.severity])) console.log(`  ${f.severity.toUpperCase().padEnd(8)} ${f.rule.padEnd(19)} ${f.message}  (${cite(f.laws)})`);
    }
    console.log(`\nReport: ${path.join(opts.out, "report.md")}` + (opts.screenshots ? ` · screenshots in ${opts.out}/ (view the *-annotated.png files)` : ""));
  }
  if (opts.failOn !== "none" && SEV[opts.failOn] !== undefined && findings.some((f) => SEV[f.severity] >= SEV[opts.failOn])) process.exit(1);
}

main().catch((e) => { console.error(e.stack || String(e)); process.exit(2); });
