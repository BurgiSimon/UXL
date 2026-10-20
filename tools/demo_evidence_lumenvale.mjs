// Evidence crops for the Lumenvale demo (mobile 390x844 @2x, reduced motion for stable frames):
// the nights list, the booking dialog opened from the first bookable night, and its confirmation
// after a complete booking (then where keyboard focus lands once the dialog closes).
// Run after: python3 tools/build_demo.py --slug lumenvale ...   then: node tools/demo_evidence_lumenvale.mjs
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";

const req = createRequire(path.join(execSync("npm root -g").toString().trim(), "noop.js"));
const mod = await import(pathToFileURL(req.resolve("playwright")).href);
const chromium = (mod.chromium ? mod : mod.default).chromium;

const DOCS = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs", "lumenvale");
let nightsHeight = null;
const pages = [
  { key: "a", file: `${DOCS}/without-uxl/index.html`, nights: "#nights", book: "#nights [data-book]", dialog: "dialog#book",
    steps: [], submit: "[data-book-submit]", close: "[data-book-done] [data-book-close]" },
  { key: "b", file: `${DOCS}/with-uxl/index.html`, nights: "#nights", book: "#nights [data-book]", dialog: "dialog#booking",
    steps: ["[data-next]"], submit: "[data-next]", close: "[data-panel='3'] [data-close]" },
];

const hideFixed = () => {
  for (const el of document.querySelectorAll("body *")) {
    const pos = getComputedStyle(el).position;
    if ((pos === "sticky" || pos === "fixed") && !el.closest("dialog")) el.style.visibility = "hidden";
  }
};

const browser = await chromium.launch();
for (const p of [...pages].reverse()) {  // B first: its recommended night sets the crop height for both
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(p.file).href, { waitUntil: "load" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1200);
  await page.evaluate(hideFixed);
  const nights = page.locator(p.nights).first();
  await nights.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  // the rows, from the first night down to the recommended one (B) or the same height (A), 760–1100 px
  const rows = await page.evaluate(() => {
    const first = document.querySelector("#nights .night:not([hidden])").getBoundingClientRect();
    const feat = document.querySelector("#nights .night.is-featured")?.getBoundingClientRect();
    return { top: first.top + scrollY - 16, bottom: feat ? feat.bottom + scrollY + 16 : 0 };
  });
  nightsHeight ??= Math.min(1100, Math.max(760, Math.round(rows.bottom - rows.top)));
  await page.screenshot({ path: `${DOCS}/screens/${p.key}-mobile-nights.png`, fullPage: true, clip: { x: 0, y: rows.top, width: 390, height: nightsHeight } });
  await page.evaluate(() => document.querySelectorAll("body *").forEach((el) => { if (el.style.visibility === "hidden") el.style.visibility = ""; }));
  const btn = page.locator(p.book).first();
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await page.waitForTimeout(800);
  const open = await page.evaluate((sel) => !!document.querySelector(sel)?.open, p.dialog);
  await page.screenshot({ path: `${DOCS}/screens/${p.key}-mobile-booking.png` });
  console.log(p.key, "dialog open:", open);

  const dlg = page.locator(p.dialog);
  for (const step of p.steps) { await dlg.locator(step).click(); await page.waitForTimeout(500); }
  await dlg.locator("[name=name]").fill("Ada Muster");
  await dlg.locator("[name=email]").fill("ada@example.ch");
  await dlg.locator(p.submit).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${DOCS}/screens/${p.key}-mobile-done.png` });
  await dlg.locator(p.close).first().click();
  await page.waitForTimeout(800);
  const focus = await page.evaluate(() => {
    const el = document.activeElement;
    return el === document.body ? "BODY" : `${el.tagName.toLowerCase()} "${(el.textContent || "").trim().slice(0, 40)}"`;
  });
  console.log(p.key, "focus after closing the confirmation:", focus);
  await ctx.close();
}
await browser.close();
