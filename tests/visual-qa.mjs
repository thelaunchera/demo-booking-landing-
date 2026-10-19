import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const directory = 'qa-screenshots';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const configurations = [
  { name: 'phone-360', width: 360, height: 780, isMobile: true, hasTouch: true },
  { name: 'phone-390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'tablet-820', width: 820, height: 1180, isMobile: true, hasTouch: true },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 }
];
const results = [];
for (const config of configurations) {
  const context = await browser.newContext({viewport:{width:config.width,height:config.height},isMobile:!!config.isMobile,hasTouch:!!config.hasTouch,deviceScaleFactor:1,reducedMotion:'reduce'});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push('Script error: '+error.message));
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push('HTTP '+response.status()+' '+response.url());
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({path:directory+'/'+config.name+'-homepage.png',fullPage:true,animations:'disabled'});
  const metrics = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    brokenImages:[...document.images].filter(img=>!img.complete || img.naturalWidth===0).map(img=>img.src),
    hero: !!document.querySelector('#heroTitle'),
    serviceCards: document.querySelectorAll('.service-card').length
  }));
  try {
    assert.ok(metrics.hero, 'Hero missing');
    assert.ok(metrics.serviceCards >= 4, 'Not enough services');
    assert.ok(metrics.overflow <= 3,'Horizontal overflow '+metrics.overflow+'px');
    assert.deepEqual(metrics.brokenImages, [],'Broken images');
    await page.locator('#sonnyToggle').click();
    assert.equal(await page.locator('#sonnyPanel').isVisible(),true,'Sonny panel did not open');
    await page.locator('#sonnyTopics [data-sonny-topic="book"]').click();
    assert.ok((await page.locator('#sonnyMessages').innerText()).includes('3 steps'),'Sonny booking answer missing');
    await page.screenshot({path:directory+'/'+config.name+'-sonny.png',animations:'disabled'});
    await page.locator('#sonnyClose').click();
    await page.locator('#languageToggle').click();
    assert.equal(await page.locator('html').getAttribute('lang'),'es');
    await page.locator('#sonnyToggle').click();
    assert.ok((await page.locator('#sonnyStatus').innerText()).includes('Guía'),'Spanish Sonny not localized');
    await page.locator('#sonnyClose').click();
    await page.locator('#languageToggle').click();
    await page.locator('[data-action="select-service"]').first().click();
    await page.locator('[data-action="set-property"][data-value="home"]').click();
    await page.locator('[data-action="next"]').click();
    assert.ok(await page.locator('#bookingStepView .calendar').isVisible(),'Calendar not shown');
    const date = page.locator('[data-action="choose-date"]:not([disabled])').first();
    if(await date.count()===0) await page.locator('[data-action="month-next"]').click();
    await page.locator('[data-action="choose-date"]:not([disabled])').first().click();
    await page.locator('[data-action="choose-time"][data-value="morning"]').click();
    await page.locator('[data-action="next"]').click();
    assert.ok(await page.locator('#customerForm').isVisible(),'Guest details not shown');
    for(const [field,value] of Object.entries({name:'QA Preview',email:'qa@example.com',phone:'5551234567',address:'123 Test Street',city:'Test City',region:'FL',postal:'33435'})) {
      await page.locator('#guest-'+field).fill(value);
    }
    await page.locator('#customerForm [type="submit"]').click();
    assert.ok(await page.locator('#confirmationTitle').isVisible(),'Confirmation missing');
    await page.screenshot({path:directory+'/'+config.name+'-confirmation.png',animations:'disabled'});
    await page.locator('[data-action="restart"]').click();
    assert.ok(await page.locator('#bookingStepView [data-action="select-service"]').first().isVisible(),'Repeat booking did not reset');
    await page.locator('#comparisonRange').fill('72');
    assert.ok((await page.locator('#comparisonWidget').getAttribute('style')).includes('72%'),'Comparison slider not updating');
    assert.deepEqual(errors, [],'Browser errors');
    results.push({device:config.name,passed:true,metrics});
    console.log('PASS '+config.name);
  } catch (error) {
    results.push({device:config.name,passed:false,metrics,errors,error:String(error)});
    console.error('FAIL '+config.name,error);
  } finally { await context.close(); }
}
await browser.close();
await writeFile(directory+'/results.json',JSON.stringify(results,null,2));
if(results.some(item=>!item.passed)) process.exitCode=1;
