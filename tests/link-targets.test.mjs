import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
const canonical={
  'casa-brownie':'https://thelaunchera.com/demos/casa-brownie/',
  crumb:'https://thelaunchera.com/demos/crumb/',
  aftr:'https://thelaunchera.com/demos/aftr/'
};
test('Brand Board links to three real demos hosted on the GitHub website',()=>{
  for(const [id,url] of Object.entries(canonical)){
    assert.ok(source.includes(`'${id}':'${url}'`),id);
    assert.ok(source.includes(`site:'${url}'`),id);
  }
  assert.doesNotMatch(source,/https:\/\/[^\s'"]+appdeploy\.ai/i);
});
test('Old locally saved or restored AppDeploy links never override GitHub demos',()=>{
  assert.match(source,/const merged=\{\.\.\.clone\(d\),\.\.\.b\};\s*merged\.site=publishedSite\(merged\)/);
  assert.match(source,/brands=data\.brands\.map\(b=>\(\{\.\.\.b,site:publishedSite\(b\)\}\)\)/);
  assert.match(source,/if\(OFFICIAL_DEMO_SITES\[brand\.id\]\)return OFFICIAL_DEMO_SITES\[brand\.id\]/);
  assert.match(source,/appdeploy\[\.\]ai/);
  assert.match(source,/href=\"\'\+html\(publishedSite\(b\)\)/);
});
