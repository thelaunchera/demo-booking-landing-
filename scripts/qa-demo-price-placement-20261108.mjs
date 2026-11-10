// Verify original published price previews appear near each real menu/hero.
import assert from 'node:assert/strict';
import {chromium,webkit,devices} from 'playwright';
const origin='http://127.0.0.1:4193';
const cases=[
 {slug:'soluna-yoga',kind:'service'},
 {slug:'seasonal-brew',kind:'menu',nativeMenu:'#seasonal-menu-track'},
 {slug:'wok-social',kind:'menu',target:'#menu'}
];
for(const engine of [chromium,webkit]){
 const browser=await engine.launch({headless:true});
 try{
  const widths=engine===webkit?[390]:[360,390];
  for(const width of widths){
   const context=await browser.newContext({...devices['iPhone 13'],viewport:{width,height:800},reducedMotion:'reduce'});
   for(const {slug,kind,target,nativeMenu} of cases){
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(String(error)));
    const response=await page.goto(origin+'/'+slug+'/',{waitUntil:'domcontentloaded'});
    assert.equal(response?.status(),200,slug+' local published URL');
    // Seasonal Brew now has one native six-product menu with prices on each card.
    // Do not demand the retired, injected three-card price block or duplicate prices.
    if(nativeMenu){
      const menu=page.locator(nativeMenu);
      await menu.waitFor({state:'visible',timeout:16000});
      const native=await page.evaluate(selector=>{
        const track=document.querySelector(selector);
        const section=track?.closest('section');
        const footer=document.querySelector('footer');
        const rect=track.getBoundingClientRect();
        const cards=[...track.querySelectorAll('.seasonal-menu-card')].map(card=>{
          const cents=Number(card.dataset.priceCents);
          const expected=Number.isInteger(cents)&&cents>0?'
    await page.waitForFunction(()=>document.querySelector('#tle-demo-sample-prices')||document.querySelector('.tle-demo-customer-price'),null,{timeout:16000});
    if(await grid.count()===0){
      const badgeCount=await page.locator('.tle-demo-customer-price').count();
      assert.ok(badgeCount>0,slug+' must have original price badges or the sample price block');
      assert.deepEqual(errors,[],slug+' runtime errors');
      console.log('ORIGINAL PRODUCT PRICE BADGES PASS',engine.name(),slug,width,badgeCount);
      await page.close();
      continue;
    }
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
+(cents/100).toFixed(2):'INVALID';
          return {
            name:card.dataset.menuName||'',
            displayed:card.querySelector('.seasonal-menu-price')?.textContent?.trim()||'',
            expected,
            addButton:!!card.querySelector('.seasonal-menu-add')
          };
        });
        return {
          cards, sectionId:section?.id||'',
          beforeFooter:!!section&&!!footer&&!!(section.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING),
          left:rect.left,right:rect.right,viewport:innerWidth
        };
      },nativeMenu);
      assert.equal(native.sectionId,'seasonal-menu',slug+' price list belongs beside its native menu');
      assert.ok(native.beforeFooter,slug+' prices should not be appended after the footer');
      assert.equal(native.cards.length,6,slug+' must preserve all six original menu items');
      for(const item of native.cards){
        assert.ok(item.name,slug+' menu item is missing its name');
        assert.equal(item.displayed,item.expected,slug+' incorrect price for '+item.name);
        assert.ok(item.addButton,slug+' missing add-to-bag action for '+item.name);
      }
      assert.ok(native.left>=-2&&native.right<=native.viewport+2,slug+' iPhone menu width: '+JSON.stringify(native));
      assert.equal(await page.locator('#tle-demo-sample-prices').count(),0,slug+' must not duplicate the native price menu');
      assert.deepEqual(errors,[],slug+' page JS errors');
      console.log('NATIVE MENU PRICES PASS',engine.name(),slug,width,native.cards.length);
      await page.close();
      continue;
    }
    const grid=page.locator('#tle-demo-sample-prices');
    await page.waitForFunction(()=>document.querySelector('#tle-demo-sample-prices')||document.querySelector('.tle-demo-customer-price'),null,{timeout:16000});
    if(await grid.count()===0){
      const badgeCount=await page.locator('.tle-demo-customer-price').count();
      assert.ok(badgeCount>0,slug+' must have original price badges or the sample price block');
      assert.deepEqual(errors,[],slug+' runtime errors');
      console.log('ORIGINAL PRODUCT PRICE BADGES PASS',engine.name(),slug,width,badgeCount);
      await page.close();
      continue;
    }
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
