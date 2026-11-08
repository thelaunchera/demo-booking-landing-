// Multi-brand scroll motion QA for secondary GitHub Pages demos.
// Includes Jaramillo source branch copied into demos/jaramillo-boutique by workflow.
import assert from 'node:assert/strict';
import {chromium,webkit,devices} from 'playwright';
const origin='http://127.0.0.1:4193';
const slugs=['seasonal-brew','soluna-yoga','wok-social','yummm','jaramillo-boutique'];
for (const engine of [chromium,webkit]){
 const browser=await engine.launch({headless:true});
 try {
  const context=await browser.newContext({...devices['iPhone 13'],viewport:{width:390,height:800},reducedMotion:'no-preference'});
  for(const slug of slugs){
   const page=await context.newPage();
   const response=await page.goto(origin+'/'+slug+'/',{waitUntil:'domcontentloaded'});
   assert.equal(response?.status(),200,engine.name()+' '+slug+' page must load');
   await page.waitForTimeout(180);
   const nodes=page.locator('[data-tle-scroll-part]');
   assert.ok(await nodes.count()>=1,engine.name()+' '+slug+' must initialize editorial scroll elements');
   const candidate=page.locator('.tle-scroll-pending').first();
   if(await candidate.count()){
    const el=await candidate.elementHandle();
    await el.scrollIntoViewIfNeeded();
    await page.waitForFunction(node=>node?.classList.contains('tle-scroll-visible'),el,{timeout:4000});
   }
   assert.equal(await page.locator('button.tle-scroll-pending,form.tle-scroll-pending,[role=dialog].tle-scroll-pending').count(),0,
     'Interactive elements must not be masked by scroll effects');
   console.log('SCROLL',engine.name(),slug,'OK');
   await page.close();
  }
  await context.close();
  const reduce=await browser.newContext({...devices['iPhone 13'],viewport:{width:390,height:800},reducedMotion:'reduce'});
  const p=await reduce.newPage();
  await p.goto(origin+'/wok-social/',{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(160);
  assert.equal(await p.locator('.tle-scroll-pending').count(),0,'Reduced motion cannot hide or animate content');
  console.log('REDUCED MOTION',engine.name(),'OK');
  await reduce.close();
 }finally{await browser.close()}
}
