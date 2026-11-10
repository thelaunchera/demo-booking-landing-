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
      assert.equal(await page.locator('.nail-design-card').count(),4,'One four-card visual service menu');
      assert.equal(await page.locator('.nail-design-photo img').count(),4,'Every service price has an editorial photo');
      assert.equal(await page.locator('.price-tag-grid').count(),0,'No duplicate booking price grid');
      assert.equal(await page.locator('.filterbar').count(),0,'No third filter menu');
      await page.locator('[data-service="art"]').click();
      assert.equal(await page.locator('#service').inputValue(),'art','Selected photo card drives native form');
      assert.match(await page.locator('#nailSelectedName').innerText(),/Nail Art Studio/,'Selected service summary updates');
      assert.match(await page.locator('#nailSelectedMeta').innerText(),/\$74/,'One authentic starting price is displayed');
      assert.equal(await page.locator('[data-service="art"]').getAttribute('aria-pressed'),'true','Photo selection announced');

      const month=await page.locator('#nailCalendarLabel').innerText();
      await page.locator('#nailCalendarNext').click();
      assert.notEqual(await page.locator('#nailCalendarLabel').innerText(),month,'Calendar advances to next month');
      assert.equal(await page.locator('.nail-weekday').count(),7,'Weekday labels present');
      const day=page.locator('#dateGrid .date-option:not([disabled])').first();
      assert.ok(await day.count(),'Future sample dates shown');
      await day.click();
      assert.equal(await day.getAttribute('aria-pressed'),'true','Date selection is announced');
      await page.locator('#timeGrid .time-option').first().click();
      await page.locator('#guestName').fill('Demo Guest');
      await page.locator('#guestEmail').fill('demo@example.com');
      await page.locator('#bookingForm button[type="submit"]').click();
      assert.equal(await page.locator('#bookingModal').getAttribute('aria-hidden'),'false','Preview modal displays');
      assert.ok((await page.locator('#receipt').innerText()).includes('Demo Guest'),'Preview contains chosen sample details');
      assert.ok((await page.locator('#bookingModal').innerText()).includes('No appointment has been booked'),'Demo never claims a real booking');
      await page.locator('#closeModal').click();
      assert.equal(await page.locator('#bookingModal').getAttribute('aria-hidden'),'true','Preview closes');
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