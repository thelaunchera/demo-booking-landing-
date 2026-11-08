import {chromium} from 'playwright';
import {strict as assert} from 'node:assert';
import fs from 'node:fs';

const base='https://thelaunchera.github.io/demo-booking-landing-';
const active=['seasonal-brew','wok-social','soluna-yoga','yummm'];
fs.mkdirSync('qa-screenshots/motion-20261108',{recursive:true});
const browser=await chromium.launch({headless:true});
try {
  for(const brand of active){
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});
    const page=await context.newPage();
    await page.goto(base+'/'+brand+'/',{waitUntil:'domcontentloaded',timeout:40000});
    await page.locator('section.hero').first().waitFor({timeout:13000});
    await page.waitForFunction(brand=>{
      const v=document.querySelector('video[data-tle-cinematic-hero="'+brand+'"]');
      return !!v&&v.videoWidth>0&&v.readyState>=2;
    },brand,{timeout:20000});
    await page.waitForFunction(name=>{
      const v=document.querySelector('video[data-tle-cinematic-hero="'+name+'"]');
      return !!v && !v.paused && Number(getComputedStyle(v).opacity)>.01;
    },brand,{timeout:12000});
    const media=await page.evaluate(()=>{
      const video=document.querySelector('video[data-tle-cinematic-hero]');
      return {src:new URL(video.currentSrc).pathname,hasDepth:video.hasAttribute('data-tle-reactive-photo'),pointerEvents:getComputedStyle(video).pointerEvents,width:video.videoWidth};
    });
    assert(media.src.endsWith('/media/hero-motion-20261108.mp4'),brand+' public video path');
    assert(media.hasDepth&&media.pointerEvents==='none',brand+' cursor/scroll and CTA safety');
    assert(media.width>0,brand+' decoded');
    if(brand==='yummm'){
      const coffee=page.locator('button[data-hero="1"]');
      if(await coffee.count()) await coffee.click();
      await page.waitForTimeout(400);
      const current=await page.locator('.hero-slide[data-slide="1"]').evaluate(el=>el.classList.contains('is-current'));
      assert(current,'YUMMM cinematic stays on the coffee slide');
    }
    await page.screenshot({path:'qa-screenshots/motion-20261108/'+brand+'-390.png'});
    console.log('PASS cinematic mobile '+brand,media.width);
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  const page=await context.newPage();
  await page.goto(base+'/seasonal-brew/',{waitUntil:'domcontentloaded',timeout:40000});
  const hero=page.locator('[data-tle-reactive-hero]').first();
  await hero.waitFor({timeout:15000});
  const box=await hero.boundingBox();
  await page.mouse.move(box.x+box.width*.2,box.y+box.height*.3);
  await page.waitForTimeout(350);
  const first=await hero.evaluate(el=>el.style.getPropertyValue('--tle-rh-px'));
  await page.mouse.move(box.x+box.width*.8,box.y+box.height*.7);
  await page.waitForTimeout(350);
  const second=await hero.evaluate(el=>el.style.getPropertyValue('--tle-rh-px'));
  assert.notEqual(first,second,'desktop cursor parallax');
  assert((await page.locator('video[data-tle-reactive-photo]').count())>0,'video responds to cursor');
  await context.close();
  const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const still=await reduced.newPage();
  await still.goto(base+'/seasonal-brew/',{waitUntil:'domcontentloaded',timeout:40000});
  await still.waitForTimeout(1300);
  assert.equal(await still.locator('video[data-tle-cinematic-hero]').count(),0,'reduced-motion hides videos');
  assert((await still.locator('.hero-media img').count())>0,'original image fallback');
  await reduced.close();
  console.log('PASS desktop cursor and reduced-motion fallback');
} finally {await browser.close();}
