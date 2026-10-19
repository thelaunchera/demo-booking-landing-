import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url),'utf8');
const js = readFileSync(new URL('../src/app.js', import.meta.url),'utf8');
const content = readFileSync(new URL('../src/content.js', import.meta.url),'utf8');
const css = readFileSync(new URL('../styles-boutique.css', import.meta.url),'utf8');
test('interactive booking keeps three steps and validation', () => {
  assert.match(js, /renderStepOne\(\)/);
  assert.match(js, /renderStepTwo\(\)/);
  assert.match(js, /renderStepThree\(\)/);
  assert.match(js, /validateGuestForm\(\)/);
  assert.match(js, /resetBooking\(\)/);
});
test('Sonny is bilingual, opt-in and local only', () => {
  assert.match(html, /id="sonnyPanel"[^>]*hidden/);
  assert.match(js, /const SONNY = \{/);
  assert.match(js, /function initSonny\(\)/);
  assert.match(html, /No live AI/);
  assert.doesNotMatch(js, /fetch\s*\(/);
});
test('offer shown after cleaning proof and booking', () => {
  assert.ok(html.indexOf('id="forBusiness"') > html.indexOf('id="reviews"'));
  assert.ok(html.indexOf('id="forBusiness"') > html.indexOf('id="booking"'));
  assert.match(html, /https:\/\/thelaunchera\.com\//);
  assert.match(content, /tleTitle: "What if booking/);
  assert.match(content, /tleTitle: "¿Y si reservar/);
});
test('accessible responsive demo with clear limits', () => {
  assert.match(html, /id="comparisonRange"/);
  assert.match(html, /id="languageToggle"/);
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(content, /not a confirmed booking/i);
});
