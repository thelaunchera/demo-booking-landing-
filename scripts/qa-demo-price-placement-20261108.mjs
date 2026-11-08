// Verify original published price previews appear near each real menu/hero.
import assert from 'node:assert/strict';
import {chromium,webkit,devices} from 'playwright';
const origin='http://127.0.0.1:4193';
const cases=[
 {slug:'seasonal-brew',kind:'menu',target:'#flavors'},
 {slug:'wok-social',kind:'menu',target:'#menu'},
 {slug:'soluna-yoga',kind:'service'}
];
for(const engine of [chromium,webkit]){
 const browser=await engine.launch({headless:true});
 try{
  const widths=engine===webkit?[390]:[360,390];
  for(const width of widths){
   const context=await browser.newContext({...devices['iPhone 13'],viewport:{width,height:800},reducedMotion:'reduce'});
   for(const {slug,kind,target} of cases){
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(String(error)));
    const response=await page.goto(origin+'/'+slug+'/',{waitUntil:'domcontentloaded'});
    assert.equal(response?.status(),200,slug+' local published URL');
    const grid=page.locator('#tle-demo-sample-prices');
    await grid.waitFor({state:'visible',timeout:16000});
    const geo=await page.evaluate(({target,kind})=>{
      const p=document.querySelector('#tle-demo-sample-prices');
      const hero=document.querySelector('section.hero');
      const menu=target?document.querySelector(target):null;
      const r=p.getBoundingClientRect();
      return {kind:p.dataset.tlePriceKind,placement:p.dataset.tlePricePlacement,
       afterHero:hero?.nextElementSibling===p,
       beforeMenu:menu?.previousElementSibling===p,
       count:p.querySelectorAll('.tle-price-card').length,
       left:r.left,right:r.right,viewport:innerWidth};
    },{target,kind});
    assert.equal(geo.kind,kind,slug+' price category unchanged');
    assert.equal(geo.placement,kind==='service'?'below-hero':'beside-menu',slug+' price section moved');
    assert.ok(kind==='service'?geo.afterHero:geo.beforeMenu,slug+' prices must be at hero/menu, not footer: '+JSON.stringify(geo));
    assert.equal(geo.count,3,slug+' should retain original three preview prices');
    assert.ok(geo.left>=-2&&geo.right<=geo.viewport+2,slug+' iPhone width: '+JSON.stringify(geo));
    assert.deepEqual(errors,[],slug+' page JS errors');
    console.log('EARLY PRICE LIST PASS',engine.name(),slug,width,JSON.stringify(geo));
    await page.close();
   }
   await context.close();
  }
 }finally{await browser.close()}
}
