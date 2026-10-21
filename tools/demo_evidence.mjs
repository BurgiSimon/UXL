// Capture focused evidence crops for the Fernwheel demo (mobile 390x844 @2x): footer targets + booking form.
// Run after tools/build_demo.py:  node tools/demo_evidence.mjs
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = execSync("npm root -g").toString().trim();
const req = createRequire(path.join(root, "noop.js"));
const mod = await import(pathToFileURL(req.resolve("playwright")).href);
const chromium = (mod.chromium ? mod : mod.default).chromium;

const DOCS = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs", "fernwheel");
const pages = [
  { key: "a", file: `${DOCS}/without-uxl/index.html`, form: "#test-ride" },
  { key: "b", file: `${DOCS}/with-uxl/index.html`, form: "#book" },
];

const browser = await chromium.launch();
for (const p of pages) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(p.file).href, { waitUntil: "load" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(600);
  // Outline undersized touch targets in the footer, the way uxl_audit does
  const count = await page.evaluate(() => {
    const footer = document.querySelector("footer");
    if (!footer) return 0;
    let n = 0;
    for (const el of footer.querySelectorAll("a[href], button")) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      if (r.height < 44 || r.width < 44) {
        n++;
        el.style.outline = "2px solid #d0021b";
        el.style.outlineOffset = "2px";
        el.style.background = "rgba(208,2,27,.12)";
      }
    }
    return n;
  });
  const footer = page.locator("footer").first();
  await footer.scrollIntoViewIfNeeded();
  await footer.screenshot({ path: `${DOCS}/screens/${p.key}-mobile-footer.png` });
  // Element screenshots stitch sticky/fixed bars into the middle of the crop: hide them for the capture
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const pos = getComputedStyle(el).position;
      if (pos === "sticky" || pos === "fixed") el.style.visibility = "hidden";
    }
  });
  const form = page.locator(p.form).first();
  await form.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await form.screenshot({ path: `${DOCS}/screens/${p.key}-mobile-form.png` });
  console.log(p.key, "footer targets < 44px:", count);
  await ctx.close();
}
await browser.close();
// Form crops are trimmed to the form card for the showcase (Python + Pillow):
//   a-mobile-form.png -> a-mobile-form-card.png, b-mobile-form.png -> b-mobile-form-card.png
