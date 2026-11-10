import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const root=(process.env.QA_URL||'http://127.0.0.1:4199').replace(/\/$/,'');
for(const type of [chromium,webkit]){
 const browser=await type.launch({headless:true});
 try{
  for(const [width,motion] of [[390,'no-preference'],[375,'reduce'],[1280,'no-preference']]){
   const page=await browser.newPage({viewport:{width,height:844},reducedMotion:motion});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(root+'/yummm/',{waitUntil:'domcontentloaded'});
   assert.equal(response?.status(),200,'YUMMM must load');
   await page.locator('#openBox').click();
   const panel=page.locator('#boxDrawer');
   await page.waitForTimeout(motion==='reduce'?80:560);
   assert.ok(await panel.evaluate(el=>el.classList.contains('open')),'Original box should open');
   const rect=await panel.boundingBox();
   assert.ok(rect,'Box must be visible');
   if(width<=640){
     assert.ok(Math.abs(rect.y+rect.height-844)<5,'Mobile sheet rises from phone bottom');
     assert.ok(rect.y>3,'Mobile sheet should not occupy the entire screen');
     assert.ok(rect.width>=width-5,'Mobile sheet spans phone');
   }else{
     assert.ok(rect.width<=500,'Desktop keeps original slim side drawer');
   }
   await page.locator('#closeBox').click();
   assert.equal(await panel.getAttribute('aria-hidden'),'true','Close restores accessibility state');
   assert.ok(!(await panel.evaluate(el=>el.classList.contains('open'))),'Original drawer closes');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert.ok(overflow<5,'No horizontal overflow');
   assert.deepEqual(errors,[],'No JavaScript failures');
   console.log('PASS YUMMM',type.name(),width,motion);
   await page.close();
  }
 }finally{await browser.close()}
}
