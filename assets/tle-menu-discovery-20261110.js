/* Progressive menu discovery: existing cards, prices and order handlers stay authoritative. */
(()=>{
'use strict';
const brand=document.currentScript?.dataset.menuBrand;
const configs={
 'wok-social':{root:'#menu',cards:'.dish',anchor:'.filters',title:'Find your craving',placeholder:'Search noodles, shrimp, steak…',tone:'#bd312d'},
 'yummm':{root:'#menu',cards:'.product-card',anchor:'.counter-head',title:'Find your little happy',placeholder:'Search coffee, cookies, pastries…',tone:'#b7303b'},
 'seasonal-brew':{root:'#seasonal-menu',cards:'.seasonal-menu-card',anchor:'.seasonal-menu-heading',title:'What is your coffee mood?',placeholder:'Search vanilla, cinnamon, cocoa…',tone:'#95663b'}
};
const cfg=configs[brand];if(!cfg)return;
const cards=[...document.querySelectorAll(cfg.cards)];
const anchor=document.querySelector(cfg.anchor);
if(!cards.length||!anchor||document.querySelector('.tle-menu-finder'))return;
const style=document.createElement('style');style.textContent=`
.tle-menu-finder{--finder-tone:${cfg.tone};margin:22px 0;padding:20px;border:1px solid currentColor;border-radius:${brand==='wok-social'?'4':'22'}px;background:${brand==='seasonal-brew'?'#f7efe4':'#fffaf3'};color:#191919;text-align:left}
.tle-menu-finder *{box-sizing:border-box}.tle-menu-finder label{display:block;font:600 22px/1.3 Georgia,serif;margin-bottom:12px}.tle-menu-finder input{width:100%;min-height:48px;border:1px solid #a2988b;border-radius:8px;padding:12px;background:#fff;color:#191919;font:16px/1.4 system-ui}.tle-menu-finder button{min-height:44px;border:1px solid var(--finder-tone);border-radius:30px;padding:9px 16px;background:transparent;color:#191919;font:600 14px/1.3 system-ui;cursor:pointer}.tle-menu-finder button[aria-pressed=true]{background:var(--finder-tone);color:white}.tle-menu-finder button:focus-visible,.tle-menu-finder input:focus-visible{outline:3px solid var(--finder-tone);outline-offset:3px}.tle-menu-moods{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.tle-menu-result{font:14px/1.5 system-ui;margin:12px 0 0}.tle-menu-reset{margin-top:12px}[data-menu-search-hidden=true]{display:none!important}.tle-menu-detail-photo{width:100%;height:200px;object-fit:cover;border-radius:12px;margin:12px 0}
`;document.head.append(style);
const panel=document.createElement('div');panel.className='tle-menu-finder';
const label=document.createElement('label');label.htmlFor='tle-menu-search';label.textContent=cfg.title;
const input=document.createElement('input');input.type='search';input.id=label.htmlFor;input.placeholder=cfg.placeholder;input.autocomplete='off';
const status=document.createElement('p');status.className='tle-menu-result';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const reset=document.createElement('button');reset.type='button';reset.className='tle-menu-reset';reset.textContent='Clear search';reset.hidden=true;
panel.append(label,input);let mood='All flavors';
const moodMap={'Sweet & creamy':['sugar-cookie','toasted-marshmallow'],'Warm & spiced':['gingerbread','snickerdoodle'],'Rich & bold':['chestnut-praline','peppermint-mocha']};
const normalize=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const buttons=[];
function update(){
 const q=normalize(input.value.trim());let count=0;
 cards.forEach(card=>{
  const matches=normalize(card.textContent).includes(q)&&(mood==='All flavors'||moodMap[mood]?.includes(card.dataset.menuFlavor));
  card.dataset.menuSearchHidden=String(!matches);
  if(matches&&!card.hidden&&!card.classList.contains('is-hidden'))count++;
 });
 status.textContent=count?`${count} ${count===1?'favorite':'favorites'} to explore`:'No matches. Try another flavor or category.';
 reset.hidden=!q&&mood==='All flavors';
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===mood)));
}
if(brand==='seasonal-brew'){
 const moods=document.createElement('div');moods.className='tle-menu-moods';moods.setAttribute('role','group');moods.setAttribute('aria-label','Choose a flavor mood');
 ['All flavors',...Object.keys(moodMap)].forEach(text=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.dataset.discoveryMood=text;b.addEventListener('click',()=>{mood=text;update()});buttons.push(b);moods.append(b)});panel.append(moods);
}
panel.append(status,reset);anchor.after(panel);
input.addEventListener('input',update);reset.addEventListener('click',()=>{input.value='';mood='All flavors';update();input.focus()});
document.querySelectorAll('.filter,[data-select-category]').forEach(b=>b.addEventListener('click',()=>queueMicrotask(update)));
if(brand==='wok-social'){
 const target=document.querySelector('#dialogText');
 if(target){const photo=document.createElement('img');photo.className='tle-menu-detail-photo';photo.hidden=true;
 cards.forEach(card=>card.querySelector('[data-dish]')?.addEventListener('click',()=>{const source=card.querySelector('img');if(source){photo.src=source.src;photo.alt=source.alt;photo.hidden=false;target.before(photo)}}));}
}
update();
})();
