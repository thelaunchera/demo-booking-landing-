// Footer interaction & early catalog discovery, five standalone public demos.
import assert from 'node:assert/strict';
import {chromium,webkit,devices} from 'playwright';
const origin='http://127.0.0.1:4193';
const slugs=['seasonal-brew','soluna-yoga','wok-social','yummm','jaramillo-boutique'];
const moved={
 'soluna-yoga':['#about','#memberships','#classes'],
 'wok-social':['.hero + .ticker','#menu'],
 'yummm':['.feature-links','#counter'],
 'jaramillo-boutique':['.hero','#collections']
};
for(const engine of [chromium,webkit]){
 const browser=await engine.launch({headless:true});
 try{
  for(const width of engine===webkit?[390]:[360,390]){
   const context=await browser.newContext({...devices['iPhone 13'],viewport:{width,height:800},reducedMotion:'reduce'});
   for(const slug of slugs){
    const page=await context.newPage(),errors=[];
    page.on('pageerror',err=>errors.push(String(err)));
    const response=await page.goto(origin+'/'+slug+'/',{waitUntil:'domcontentloaded'});
    assert.equal(response?.status(),200,slug+' should load as a published Pages route');
    const finale=page.locator('.tle-footer-finale[data-tle-owned="true"]');
    await finale.waitFor({state:'visible',timeout:12000});
    assert.equal(await finale.count(),1,slug+' should have one footer interaction');
    assert.ok((await finale.locator('h2').innerText()).length>8,slug+' branded invitation missing');
    const link=finale.locator('a.tle-footer-finale__link');
    const href=await link.getAttribute('href');
    assert.ok(href?.startsWith('#')&&await page.locator(href).count()===1,slug+' must link to actual catalog');
    const fit=await finale.evaluate(el=>{
     const r=el.getBoundingClientRect(),btn=el.querySelector('button').getBoundingClientRect();
     return {left:r.left,right:r.right,buttonRight:btn.right,viewport:innerWidth};
    });
    assert.ok(fit.left>=-2&&fit.right<=fit.viewport+2,slug+' footer must fit screen '+JSON.stringify(fit));
    assert.ok(fit.buttonRight<=fit.viewport+2,slug+' button must fit screen');
    if(moved[slug]){
      const order=await page.evaluate(selectors=>{
        const [a,...rest]=selectors;let prev=document.querySelector(a);
        for(const selector of rest){
         const curr=document.querySelector(selector);
         if(!curr||!prev||prev.nextElementSibling!==curr)return false;
         prev=curr;
        }
        return true;
      },moved[slug]);
      assert.equal(order,true,slug+' must display original prices/menu closer to hero');
    }
    await link.click();
    assert.equal(new URL(page.url()).hash,href,slug+' anchor link works');
    await finale.locator('button.tle-footer-finale__return').click();
    await page.waitForFunction(()=>window.scrollY<10,null,{timeout:3000});
    assert.ok(await page.locator('footer').count()>0,'Original footer/legal must remain');
    assert.deepEqual(errors,[],slug+' JS runtime errors');
    console.log('FOOTER + CATALOG PASS',engine.name(),slug,width);
    await page.close();
   }
   await context.close();
  }
 }finally{await browser.close()}
}
