import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium, webkit } from "playwright";

const base = process.env.QA_URL || "http://127.0.0.1:4198";
const folder = "qa-screenshots/seasonal-brew-type";
fs.mkdirSync(folder, { recursive:true });
const widths = [360, 390, 768, 1024, 1440];
for (const browserType of [chromium, webkit]) {
  const browser = await browserType.launch({ headless:true });
  try {
    for (const width of widths) {
      const page = await browser.newPage({
        viewport: { width, height:900 }, deviceScaleFactor:1
      });
      await page.goto(base + "/seasonal-brew/", { waitUntil:"domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      const found = await page.evaluate(() => {
        const pick = (selector) => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const st = getComputedStyle(el);
          return { family:st.fontFamily, style:st.fontStyle, size:st.fontSize, weight:st.fontWeight };
        };
        const img = document.querySelector(".hero-media>img");
        const hero = document.querySelector(".hero");
        return {
          logo:pick(".brand-words>span"),
          title:pick(".hero h1"),
          subtitle:pick(".hero-subtitle"),
          cta:pick(".hero-actions .button"),
          nav:pick(".nav a"),
          section:pick(".flavors-section h2"),
          flavor:pick(".flavor-card strong"),
          footer:pick(".footer-brand"),
          label:pick(".brand-words small"),
          photo:img?.getAttribute("src"),
          photoLoaded:img?.complete && img.naturalWidth > 0,
          ctaHref:document.querySelector(".hero-actions .button")?.getAttribute("href"),
          bodyWidth:document.documentElement.scrollWidth,
          viewportWidth:document.documentElement.clientWidth,
          heroWidth:hero?.getBoundingClientRect().width,
          heroHeight:hero?.getBoundingClientRect().height
        };
      });
      for (const key of ["logo","title","subtitle","cta","section","flavor","footer"]) {
        assert.ok(found[key]?.family.includes("Bodoni Moda"),
          `${browserType.name()} ${width}: ${key} must use Bodoni Moda`);
        assert.equal(found[key]?.style,"italic",
          `${browserType.name()} ${width}: ${key} should match italic coffeehouse logo`);
      }
      assert.ok(found.nav?.family.includes("Bodoni Moda"));
      assert.ok(found.label?.family.includes("DM Sans"), "Submark should remain readable small caps");
      assert.equal(found.photo,"assets/storefront.webp","Approved hero photo was changed");
      assert.ok(found.photoLoaded,"Original storefront hero did not load");
      assert.equal(found.ctaHref,"#flavors","CTA destination was changed");
      assert.ok(found.heroWidth > 300 && found.heroHeight > 300,"Hero collapsed");
      if (found.bodyWidth > found.viewportWidth + 3) {
        console.log("OVERFLOW ELEMENTS", browserType.name(), width,
          JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll("body *"))
            .map(e => ({name:e.tagName.toLowerCase(), cls:typeof e.className === "string" ? e.className.slice(0,70) : "",
              text:(e.innerText||"").slice(0,35), r:Math.round(e.getBoundingClientRect().right),
              l:Math.round(e.getBoundingClientRect().left), w:Math.round(e.getBoundingClientRect().width)}))
            .filter(x => x.r > innerWidth + 4 && x.w < 1500)
            .sort((a,b) => b.r - a.r).slice(0,20))));
      }
      assert.ok(found.bodyWidth <= found.viewportWidth + 3,
        `${browserType.name()} ${width}: unexpected horizontal page overflow (${found.bodyWidth} / ${found.viewportWidth})`);
      await page.screenshot({
        path:path.join(folder, `${browserType.name()}-${width}.png`),
        fullPage:false
      });
      if (width <= 390) {
        const button=page.locator(".menu-toggle");
        await button.click();
        assert.equal(await button.getAttribute("aria-expanded"),"true");
        assert.ok(await page.getByRole("navigation",{name:"Main navigation"}).isVisible(),"Mobile navigation did not open");
      }
      console.log("PASS",browserType.name(),width,JSON.stringify(found));
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
