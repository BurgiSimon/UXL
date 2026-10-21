// Evidence crops for the Voxmere demo (mobile 390x844 @2x, reduced motion for stable frames):
// the ship-to choice with the reservation summary, the checkout after an empty submit, and the
// confirmation after a complete reservation (B also: a declined test card). Logs where focus lands.
// Run after: python3 tools/build_demo.py --slug voxmere ...   then: node tools/demo_evidence_voxmere.mjs
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";

const req = createRequire(path.join(execSync("npm root -g").toString().trim(), "noop.js"));
const mod = await import(pathToFileURL(req.resolve("playwright")).href);
const chromium = (mod.chromium ? mod : mod.default).chromium;

const DOCS = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs", "voxmere");
const pages = [
  { key: "a", file: `${DOCS}/without-uxl/index.html`, form: "#order",
    shipFrom: "#country", shipTo: "#order .ledger__note",
    choose: async (p) => {
      await p.locator("label:has(input[name=size][value='20'])").click();
      await p.locator("label:has(input[name=finish][value='smoke'])").click();
    },
    open: "[data-pay-open]", dialog: "dialog#pay", submit: "[data-pay-submit]",
    fill: async (p) => { await p.fill("#pay-email", "ada@example.ch"); await p.fill("#pay-name", "Ada Muster"); } },
  { key: "b", file: `${DOCS}/with-uxl/index.html`, form: "#reserve-form",
    shipFrom: "#f-region", shipTo: "#reserve .fine",
    choose: async (p) => {
      await p.locator("label:has(input[name=size][value='20'])").click();
      await p.locator("label:has(input[name=finish][value='smoke'])").click();
    },
    open: "#reserve-btn", dialog: "dialog#checkout", submit: "#pay-btn",
    fill: async (p) => {
      await p.fill("#co-email", "ada@example.ch"); await p.fill("#co-name", "Ada Muster");
      await p.fill("#co-cc", "4242 4242 4242 4242"); await p.fill("#co-exp", "12/28"); await p.fill("#co-cvc", "123");
    },
    declined: async (p) => { await p.fill("#co-cc", "4000 0000 0000 0002"); } },
];

const hideFixed = () => {
  for (const el of document.querySelectorAll("body *")) {
    const pos = getComputedStyle(el).position;
    if ((pos === "sticky" || pos === "fixed") && !el.closest("dialog")) el.style.visibility = "hidden";
  }
};
const showFixed = () => document.querySelectorAll("body *").forEach((el) => { if (el.style.visibility === "hidden") el.style.visibility = ""; });
const focusName = () => {
  const el = document.activeElement;
  return el === document.body ? "BODY" : `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""} "${(el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50)}"`;
};

const browser = await chromium.launch();
for (const p of pages) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(p.file).href, { waitUntil: "load" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1500);
  await page.locator(p.form).scrollIntoViewIfNeeded();
  await p.choose(page);
  await page.waitForTimeout(400);

  // 1. Where it ships: from the ship-to control down to the note under the summary
  await page.evaluate(hideFixed);
  const box = await page.evaluate(({ from, to }) => {
    const a = document.querySelector(from).closest("fieldset, label, div") || document.querySelector(from);
    const notes = [...document.querySelectorAll(to)].filter((n) => n.offsetParent);
    const b = notes[notes.length - 1];
    const top = a.getBoundingClientRect().top + scrollY - 48;
    return { top, bottom: b.getBoundingClientRect().bottom + scrollY + 16 };
  }, { from: p.shipFrom, to: p.shipTo });
  await page.screenshot({ path: `${DOCS}/screens/${p.key}-mobile-shipto.png`, fullPage: true, clip: { x: 0, y: box.top, width: 390, height: Math.round(box.bottom - box.top) } });
  await page.evaluate(showFixed);
  const shipOptions = await page.evaluate((f) => {
    const el = document.querySelector(f);
    return el.tagName === "SELECT" ? el.options.length : el.querySelectorAll("input[type=radio]").length;
  }, p.shipFrom);
  console.log(p.key, "ship-to options:", shipOptions);

  // 2. Checkout, submitted empty
  await page.locator(p.open).click();
  await page.waitForTimeout(800);
  const dlg = page.locator(p.dialog);
  await dlg.locator(p.submit).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${DOCS}/screens/${p.key}-mobile-pay-empty.png` });
  console.log(p.key, "focus after empty submit:", await page.evaluate(focusName));

  // 3. B only: the declined test card
  await p.fill(page);
  if (p.declined) {
    await p.declined(page);
    await dlg.locator(p.submit).click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${DOCS}/screens/${p.key}-mobile-declined.png` });
    console.log(p.key, "focus after declined card:", await page.evaluate(focusName));
    await p.fill(page);
  }

  // 4. Confirmation
  await dlg.locator(p.submit).click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${DOCS}/screens/${p.key}-mobile-done.png` });
  console.log(p.key, "focus after paying:", await page.evaluate(focusName));
  await ctx.close();
}
await browser.close();
