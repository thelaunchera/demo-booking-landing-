// WOK SOCIAL focused browser QA. Run with: node qa/run.cjs
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const base = process.env.WOK_QA_URL || "http://127.0.0.1:8765/wok-social/";
const out = path.resolve(__dirname, "..", "qa-artifacts");
fs.mkdirSync(out, { recursive: true });
const sizes = [320, 375, 390, 768, 820, 1024, 1440];
const report = { url:base, date:new Date().toISOString(), viewports:[], interactions:{}, failures:[] };
const check=(condition,message)=>{ if(!condition){report.failures.push(message);console.error("FAIL",message);} else console.log("PASS",message); };
(async()=>{
  const browser = await chromium.launch({headless:true, args:["--no-sandbox"]});
  try {
    const context = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:"reduce"});
    const page = await context.newPage();
    page.on("pageerror",error=>report.failures.push("Browser JS error: "+error.message));
    const response = await page.goto(base,{waitUntil:"domcontentloaded",timeout:45000});
    check(response && response.status()===200,"HTML returns HTTP 200");
    await page.waitForSelector("#heroTitle",{timeout:15000});
    await page.evaluate(()=>{document.querySelectorAll("img").forEach(img=>img.loading="eager");});
    await page.evaluate(()=>document.fonts?.ready);
    await page.waitForTimeout(4500);
    const photos=await page.locator("img").evaluateAll(imgs=>imgs.map(i=>({src:i.currentSrc||i.src,alt:i.alt,complete:i.complete,width:i.naturalWidth,height:i.naturalHeight})));
    report.photos=photos;
    check(photos.every(p=>p.src.includes("/wok-social/assets/")),"Every demo photograph is served from local versioned assets");
    check(photos[0].src.endsWith("/hero-storefront.webp"),"Storefront photograph occupies first hero image position");
    check(photos.length===14,"Fourteen original photograph positions present");
    check(new Set(photos.map(p=>p.src.split("?")[0])).size===14,"All fourteen photo URLs are different");
    check(photos.every(p=>p.complete&&p.width>=280&&p.height>=180),"All local brand photographs load at usable resolution");
    check(photos.every(p=>p.alt&&p.alt.length>15),"All food photographs have descriptive alt text");
    for(const width of sizes){
      const height=width>=1024?950:width>=768?1024:844;
      await page.setViewportSize({width,height});
      await page.waitForTimeout(400);
      const m=await page.evaluate(()=>{
        const rect=el=>{const r=el.getBoundingClientRect();return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),width:+r.width.toFixed(1),height:+r.height.toFixed(1),right:+r.right.toFixed(1),bottom:+r.bottom.toFixed(1)};};
        return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,heading:rect(document.querySelector("#heroTitle")),heroPhoto:rect(document.querySelector(".hero-photo-frame")),hero:rect(document.querySelector(".hero")),header:rect(document.querySelector(".site-header")),button:rect(document.querySelector(".hero .btn")),filters:[...document.querySelectorAll(".filter")].map(rect)};
      });
      report.viewports.push({width,height,...m});
      check(m.scrollWidth<=width+2,width+"px: no horizontal document overflow ("+m.scrollWidth+"px)");
      check(m.heading.x>=-2&&m.heading.right<=width+2,width+"px: hero headline stays inside viewport");
      check(m.heading.height>35,width+"px: hero headline has visible height");
      if(width<=900) check(m.filters.every(f=>f.height>=43),width+"px: filter touch targets are at least ~44px");
      if([375,390,768,1440].includes(width)) {
        // Headless full-page capture does not always paint offscreen lazy images.
        // Scroll and decode each real picture, then capture both a scrolled card
        // (the actual phone experience) and the complete page.
        if(width===390||width===1440) {
          for(const image of await page.locator("img").all()) {
            await image.scrollIntoViewIfNeeded();
            await image.evaluate(img=>img.decode().catch(()=>undefined));
            await page.waitForTimeout(125);
          }
          if(width===390){
            await page.locator(".dish").first().scrollIntoViewIfNeeded();
            await page.waitForTimeout(280);
            await page.screenshot({path:path.join(out,"wok-social-390-menu-visible.png"),animations:"disabled"});
          }
          await page.evaluate(()=>window.scrollTo(0,0));
          await page.waitForTimeout(350);
        }
        await page.screenshot({path:path.join(out,"wok-social-"+width+"-viewport.png"),animations:"disabled"});
        if(width===390||width===1440)await page.screenshot({path:path.join(out,"wok-social-"+width+"-full.png"),fullPage:true,animations:"disabled"});
      }
    }
    await page.setViewportSize({width:390,height:844});
    const toggle=page.locator("#menuToggle");
    await toggle.click();
    check(await toggle.getAttribute("aria-expanded")==="true"&&await page.locator("#mobileNav").isVisible(),"mobile navigation opens with correct expanded state");
    await page.locator("#mobileNav a[href='#menu']").click();
    check(await toggle.getAttribute("aria-expanded")==="false"&&!(await page.locator("#mobileNav").isVisible()),"mobile navigation closes after selecting a section");
    await page.locator(".filter[data-filter='noodles']").click();
    check(await page.locator(".dish:visible").count()===4,"noodles filter shows exactly four matching dishes");
    check(await page.locator(".filter[data-filter='noodles']").getAttribute("aria-pressed")==="true","filters expose accessible pressed state");
    await page.locator(".filter[data-filter='hibachi']").click();
    check(await page.locator(".dish:visible").count()===2,"hibachi filter shows exactly two grill dishes");
    await page.locator(".filter[data-filter='noodles']").click();
    const trigger=page.locator(".dish:visible [data-dish]").first();
    const name=await trigger.getAttribute("data-dish");
    await trigger.click();
    check(await page.locator("#detailDialog").isVisible()&&await page.locator("#dialogTitle").innerText()===name,"dish details dialog opens with correct title");
    await page.keyboard.press("Escape");
    check(!(await page.locator("#detailDialog").isVisible()),"Escape closes dish details");
    check(await trigger.evaluate(el=>el===document.activeElement),"dialog returns focus to the trigger");
    await trigger.click();
    await page.locator("#dialogDone").click();
    check(!(await page.locator("#detailDialog").isVisible()),"dialog action button closes it");
    await page.locator(".filter[data-filter='all']").click();
    check(await page.locator(".dish:visible").count()===6,"all filter restores six cards");
    report.interactions={mobileNav:true,filters:true,dialog:true,focusReturn:true};
    const brokenAnchors=await page.locator("a[href^='#']").evaluateAll(links=>links.filter(a=>a.getAttribute("href")!="#"&&!document.querySelector(a.getAttribute("href"))).map(a=>a.outerHTML));
    check(brokenAnchors.length===0,"All internal anchor targets exist");
  } finally {await browser.close();fs.writeFileSync(path.join(out,"results.json"),JSON.stringify(report,null,2));}
  if(report.failures.length) {console.error(JSON.stringify(report.failures,null,2));process.exitCode=1;}
  else console.log("WOK SOCIAL QA PASS at all "+sizes.length+" viewport widths");
})().catch(err=>{report.failures.push("QA error: "+err.stack);fs.writeFileSync(path.join(out,"results.json"),JSON.stringify(report,null,2));console.error(err);process.exitCode=1;});