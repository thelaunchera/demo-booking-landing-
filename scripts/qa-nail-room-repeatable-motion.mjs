// Verify existing NAIL ROOM animations replay without trapping touch, keyboard or booking UI.
import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';

const base=(process.env.QA_URL||'http://127.0.0.1:4195').replace(/\/$/,'')+'/nail-room/';
for (const browserType of [chromium, webkit]) {
  const browser=await browserType.launch({headless:true});
  try {
    for (const width of [390, 375]) {
      const page=await browser.newPage({viewport:{width,height:800},reducedMotion:'no-preference'});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const result=await page.goto(base,{waitUntil:'domcontentloaded'});
      assert.equal(result?.status(),200,'NAIL ROOM must load');
      const card=page.locator('.gallery-item').first();
      await card.scrollIntoViewIfNeeded();
      const handle=await card.elementHandle();
      await page.waitForFunction(el=>el?.classList.contains('motion-visible'),handle,{timeout:6000});
      await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
      await page.waitForFunction(el=>el&&!el.classList.contains('motion-visible'),handle,{timeout:6000});
      await card.scrollIntoViewIfNeeded();
      await page.waitForFunction(el=>el?.classList.contains('motion-visible'),handle,{timeout:6000});
      assert.ok(await page.locator('#bookingForm').count(),'Sample booking form stays mounted');
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert.ok(overflow<=3,'No horizontal overflow at '+width+' px: '+overflow);
      await card.locator('.photo-open').click();
      assert.ok(await page.locator('#photoLightbox').evaluate(el=>el.open),'Existing photo viewer opens');
      await page.locator('#lightboxClose').click();
      assert.equal(await page.locator('#photoLightbox').evaluate(el=>el.open),false,'Photo viewer closes');
      assert.deepEqual(errors,[],'No JavaScript runtime errors');
      console.log('PASS',browserType.name(),width,'repeatable reveals, photo viewer, form and scroll');
      await page.close();
    }
    const reduced=await browser.newPage({viewport:{width:390,height:800},reducedMotion:'reduce'});
    await reduced.goto(base,{waitUntil:'domcontentloaded'});
    const allVisible=await reduced.locator('.gallery-item').first().evaluate(el=>getComputedStyle(el).opacity==='1');
    assert.ok(allVisible,'Reduced-motion keeps gallery visible');
    await reduced.close();
  } finally { await browser.close(); }
}