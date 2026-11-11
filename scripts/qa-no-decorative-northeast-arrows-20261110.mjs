// Regression guard: no northeast-arrow decoration on client-facing demos.
// Preserve working links, forms, photo viewers, actual navigation controls.
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
const base='demos';
const source=[];
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())walk(file);
  else if(/\.(html|css|js|jsx|ts|tsx)$/.test(entry.name))source.push(file);
 }
}
walk(base);
assert.ok(source.length>=6,'Must scan all demo sources');
for(const file of source){
 const s=fs.readFileSync(file,'utf8');
 assert.ok(!s.includes('↗'),file+' contains forbidden decorative northeast arrow');
 assert.ok(!s.includes('nail-design-arrow'),file+' retains obsolete decorative arrow element');
}
const nail=fs.readFileSync('demos/nail-room/index.html','utf8');
assert.equal((nail.match(/class="service nail-design-card"/g)||[]).length,4,'Keep all service cards');
const galleryItems=[...nail.matchAll(/<article class="gallery-item"[^>]*>[\s\S]*?<\/article>/g)].map(m=>m[0]);
assert(galleryItems.length>0,'Keep the current inspiration gallery');
assert.equal((nail.match(/class="photo-open"/g)||[]).length,galleryItems.length,'Every current photo needs one lightbox control');
for(const item of galleryItems){
 assert.match(item,/<img[^>]+src="[^"]+"/,'Keep each gallery photograph');
 assert.match(item,/<button[^>]+class="photo-open"[^>]+aria-label="View [^"]+ full size"/,'Keep a named accessible photo control');
}
assert.ok(nail.includes('id="bookingForm"'),'Keep the existing sample booking form');
assert.ok(nail.includes('id="dateGrid"'),'Keep date selection');
assert.ok(nail.includes('id="timeGrid"'),'Keep time selection');
assert.ok(nail.includes('id="photoLightbox"'),'Keep photo preview');

console.log('PASS: removed ↗ in '+source.length+' demo HTML/JS/CSS files; 4 cards, gallery and booking intact');
