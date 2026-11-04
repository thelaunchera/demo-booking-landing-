import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { ADDITIONAL_DEMO_BOARDS } from '../src/additional-demo-boards.ts';
import { ADDITIONAL_DEMO_PROMPTS } from '../src/additional-demo-prompts.ts';
import { JARAMILLO_BOARD } from '../src/jaramillo-board.ts';
import { FINISHED_DEMO_BOARDS } from '../src/finished-demo-boards.ts';
import { ensureGallery } from '../src/section-gallery.ts';

const source = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
const program = source.slice(source.indexOf("const KEY="), source.indexOf('let brands=hydrate();'));
function restore(previous) {
  return JSON.parse(vm.runInNewContext(program + '\nJSON.stringify(hydrate());', {
    ADDITIONAL_DEMO_BOARDS,
    ADDITIONAL_DEMO_PROMPTS,
    JARAMILLO_BOARD,
    FINISHED_DEMO_BOARDS,
    FINISHED_DEMO_PROMPTS: {},
    YUMMM_ALL_PROMPTS: [],
    JARAMILLO_ALL_PROMPTS: [],
    localStorage: { getItem: () => JSON.stringify(previous) },
    ensureGallery,
  }));
}

test('a new browser receives twelve unique brands including all missing demos', () => {
  const brands = restore([]);
  assert.equal(brands.length, 12);
  assert.equal(new Set(brands.map(brand => brand.id)).size, 12);
  assert.equal(brands.filter(brand => brand.id === 'jaramillo-boutique').length, 1);
  const sova = brands.find(brand => brand.id === 'sova');
  assert.equal(sova.site, 'https://thelaunchera.com/demos/sova/');
  assert.equal(sova.sectionPhotos.universe.length, 10);
});

test('an existing browser gains missing demos without losing its own brand edits or images', () => {
  const own = {
    id: 'sova', name: 'SOVA personal', tagline: 'My custom line',
    heroPhoto: 'data:image/png;base64,custom', colors: ['#112233','#223344','#334455','#445566','#556677','#667788'],
    sectionPhotos: { applications: [{ id: 'photo-custom-fixture', src: 'https://example.com/custom.png' }] },
  };
  const custom = { ...own, id: 'my-own-brand', name: 'My own brand' };
  const brands = restore([own, custom, { ...own, name: 'Duplicate old SOVA' }]);
  assert.equal(brands.length, 13);
  const sova = brands.find(brand => brand.id === 'sova');
  assert.equal(sova.name, own.name);
  assert.equal(sova.tagline, own.tagline);
  assert.equal(sova.heroPhoto, own.heroPhoto);
  assert.deepEqual(sova.colors, own.colors);
  assert.equal(sova.sectionPhotos.applications[0].src, own.sectionPhotos.applications[0].src);
  assert.equal(sova.site, 'https://thelaunchera.com/demos/sova/');
  assert.ok(brands.some(brand => brand.id === custom.id));
});

test('malformed saved brand lists recover to a usable catalog', () => {
  assert.equal(restore([null, {}, { name: 'No ID' }]).length, 12);
});
