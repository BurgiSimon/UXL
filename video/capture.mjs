// Captures the footage for the Voxmere video from the two published pages in docs/voxmere/.
// Frame by frame under a virtual clock: requestAnimationFrame, performance.now and Date.now only advance
// 1/30 s per screenshot, so GSAP, Lenis and WebGL move at video speed however slow the software renderer is.
// Writes public/clips/<name>.mp4 and public/clips/clips.json (frame of every tap and key moment).
//   node capture.mjs            all four clips
//   node capture.mjs a-phone    one clip
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";

const req = createRequire(path.join(execSync("npm root -g").toString().trim(), "noop.js"));
const mod = await import(pathToFileURL(req.resolve("playwright")).href);
const chromium = (mod.chromium ? mod : mod.default).chromium;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.join(HERE, "..", "docs", "voxmere");
const OUT = path.join(HERE, "public", "clips");
const FPS = 30;
const PAGES = { a: `${DOCS}/without-uxl/index.html`, b: `${DOCS}/with-uxl/index.html` };

function virtualClock() {
  let t = performance.now();
  const base = Date.now() - t;
  let queue = new Map(), id = 0;
  performance.now = () => t;
  Date.now = () => Math.round(base + t);
  window.requestAnimationFrame = (cb) => { queue.set(++id, cb); return id; };
  window.cancelAnimationFrame = (i) => { queue.delete(i); };
  window.__advance = (ms) => {
    t += ms;
    const due = [...queue.values()];
    queue = new Map();
    for (const cb of due) { try { cb(t); } catch (e) { console.error(e); } }
  };
}

class Recorder {
  constructor(page, name) {
    this.page = page; this.name = name; this.frame = 0; this.marks = {}; this.taps = [];
    this.dir = path.join(OUT, `${name}-frames`);
    fs.rmSync(this.dir, { recursive: true, force: true });
    fs.mkdirSync(this.dir, { recursive: true });
  }
  async tick(n = 1) {
    for (let i = 0; i < n; i++) {
      await this.page.evaluate((ms) => window.__advance(ms), 1000 / FPS);
      await this.page.screenshot({ path: path.join(this.dir, `f${String(this.frame).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
      this.frame++;
    }
  }
  mark(key) { this.marks[key] = this.frame; }
  async scrollTo(y, frames) {
    const from = await this.page.evaluate(() => scrollY);
    for (let i = 1; i <= frames; i++) {
      const p = i / frames, e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      await this.page.evaluate((v) => window.scrollTo(0, v), Math.round(from + (y - from) * e));
      await this.tick();
    }
  }
  async scrollToEl(sel, offset, frames) {
    const y = await this.page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + scrollY - o, [sel, offset]);
    await this.scrollTo(Math.max(0, y), frames);
  }
  // A tap: record where it lands (for the ripple drawn in the video), then let the page react.
  async tap(locator, label, { click = true } = {}) {
    const box = await locator.boundingBox();
    this.taps.push({ frame: this.frame, x: box.x + box.width / 2, y: box.y + box.height / 2, label });
    await this.tick(6);
    if (click) await locator.click({ noWaitAfter: true });
  }
  encode() {
    const file = path.join(OUT, `${this.name}.mp4`);
    execSync(`ffmpeg -y -v error -framerate ${FPS} -i "${this.dir}/f%05d.jpg" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart "${file}"`);
    fs.rmSync(this.dir, { recursive: true, force: true });
    return { file: `clips/${this.name}.mp4`, frames: this.frame, marks: this.marks, taps: this.taps };
  }
}

async function open(browser, key, viewport, dpr) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr, isMobile: dpr > 1, hasTouch: dpr > 1 });
  await ctx.addInitScript(virtualClock);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log(key, "pageerror:", e.message));
  await page.goto(pathToFileURL(PAGES[key]).href, { waitUntil: "load" });
  for (let i = 0; i < 60; i++) await page.evaluate(() => window.__advance(1000 / 30));   // boot: loaders, fonts, first GL frames
  await page.waitForTimeout(1500);
  for (let i = 0; i < 60; i++) await page.evaluate(() => window.__advance(1000 / 30));
  return { ctx, page };
}

// Desktop: the first screen, then the story scrolling by.
async function desktop(browser, key) {
  const { ctx, page } = await open(browser, key, { width: 1440, height: 900 }, 1);
  const r = new Recorder(page, `${key}-desktop`);
  r.mark("hero"); await r.tick(60);
  const h = await page.evaluate(() => innerHeight);
  r.mark("scroll"); await r.scrollTo(Math.round(h * 2.6), 210);
  await r.tick(30);
  await ctx.close();
  return r.encode();
}

// Phone: the reservation, from choosing a Cube to the confirmation.
const FLOWS = {
  a: {
    form: "#order", region: "#country", summary: "#ledger-title", note: "#order .ledger__note",
    open: "[data-pay-open]", dialog: "dialog#pay", submit: "[data-pay-submit]",
    pickRegion: async (r, page) => {
      // A native <select> popup blocks headless screenshots: show the tap, leave time for the picker the video
      // draws over it, then pick the option directly.
      await r.tap(page.locator("#country"), "Ship to", { click: false });
      await r.tick(30);
      await page.selectOption("#country", { label: "Germany" });
    },
    fill: async (page) => { await page.fill("#pay-email", "ada@example.ch"); await page.fill("#pay-name", "Ada Muster"); },
  },
  b: {
    form: "#reserve-form", region: "#f-region", summary: "#summary-title", note: "#reserve .fine",
    open: "#reserve-btn", dialog: "dialog#checkout", submit: "#pay-btn",
    pickRegion: async (r, page) => {
      await r.tap(page.locator("label:has(input[name=region][value='eu'])"), "European Union");
      await r.tick(30);   // same length as A's picker, so both clips keep the same marks
    },
    fill: async (page) => {
      await page.fill("#co-email", "ada@example.ch"); await page.fill("#co-name", "Ada Muster");
      await page.fill("#co-cc", "4000 0000 0000 0002"); await page.fill("#co-exp", "12/28"); await page.fill("#co-cvc", "123");
    },
    declined: true,
  },
};

async function phone(browser, key) {
  const f = FLOWS[key];
  const { ctx, page } = await open(browser, key, { width: 390, height: 844 }, 2);
  await page.evaluate(([s]) => window.scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY - 70), [f.form]);
  const r = new Recorder(page, `${key}-phone`);
  r.mark("choose"); await r.tick(20);
  await r.tap(page.locator("label:has(input[name=size][value='20'])"), "Cube 20"); await r.tick(10);
  await r.tap(page.locator("label:has(input[name=finish][value='smoke'])"), "Smoke"); await r.tick(10);
  await r.scrollToEl(f.region, 120, 24);
  r.mark("region"); await r.tick(24);
  await f.pickRegion(r, page); await r.tick(24);
  await r.scrollToEl(f.summary, 90, 24);
  r.mark("summary"); await r.tick(30);
  await r.scrollToEl(f.note, 520, 18);
  r.mark("note"); await r.tick(50);
  r.mark("open"); await r.tap(page.locator(f.open).first(), "Pay"); await r.tick(16);
  r.mark("checkout"); await r.tick(24);
  await r.tap(page.locator(`${f.dialog} ${f.submit}`), "Pay, empty"); await r.tick(4);
  r.mark("errors"); await r.tick(56);
  await f.fill(page);
  if (f.declined) {
    await r.tick(12);
    await r.tap(page.locator(`${f.dialog} ${f.submit}`), "Pay, declined card"); await r.tick(30);
    r.mark("declined"); await r.tick(45);
    await page.fill("#co-cc", "4242 4242 4242 4242");
  }
  await r.tick(12);
  await r.tap(page.locator(`${f.dialog} ${f.submit}`), "Pay"); await r.tick(40);
  r.mark("done"); await r.tick(60);
  await ctx.close();
  return r.encode();
}

const only = process.argv[2];
const jobs = { "a-desktop": (b) => desktop(b, "a"), "b-desktop": (b) => desktop(b, "b"), "a-phone": (b) => phone(b, "a"), "b-phone": (b) => phone(b, "b") };
fs.mkdirSync(OUT, { recursive: true });
const indexFile = path.join(OUT, "clips.json");
const index = fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile, "utf8")) : {};
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [name, run] of Object.entries(jobs)) {
  if (only && only !== name) continue;
  const t0 = Date.now();
  index[name] = await run(browser);
  console.log(name, index[name].frames, "frames,", Math.round((Date.now() - t0) / 1000), "s", JSON.stringify(index[name].marks));
}
await browser.close();
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\n");
// The first phone screens, as published by tools/build_demo.py
for (const k of ["a", "b"]) fs.copyFileSync(path.join(DOCS, "screens", `${k}-mobile.png`), path.join(OUT, `${k}-first.png`));
