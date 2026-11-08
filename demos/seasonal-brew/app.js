'use strict';
const flavors={
  'sugar-cookie':{title:'Sugar Cookie',kicker:'Soft, sweet & a little nostalgic.',description:'Think buttery sugar-cookie comfort, a touch of vanilla, and the joy of the first festive cookie of the season.',image:'assets/flavor-posters/sugar-cookie.webp',alt:'Frosted sugar cookies and golden crumbs'},
  gingerbread:{title:'Gingerbread',kicker:'Warm spice, familiar magic.',description:'A cozy blend of gingerbread-inspired spices, cinnamon warmth, and that just-out-of-the-oven feeling.',image:'assets/flavor-posters/gingerbread.webp',alt:'Gingerbread cookies with cinnamon and star anise'},
  'toasted-marshmallow':{title:'Toasted Marshmallow',kicker:'The coziest kind of comfort.',description:'Inspired by the sweet golden edges of toasted marshmallows and evenings worth staying in for.',image:'assets/flavor-posters/toasted-marshmallow.webp',alt:'Toasted marshmallows with graham crackers'},
  snickerdoodle:{title:'Snickerdoodle',kicker:'Cinnamon sugar, always.',description:'That sweet swirl of cinnamon and sugar, inspired by the comforting classic cookie.',image:'assets/flavor-posters/snickerdoodle.webp',alt:'Snickerdoodle cookies dusted with cinnamon'},
  'chestnut-praline':{title:'Chestnut Praline',kicker:'Rich, golden & wonderfully cozy.',description:'Warm roasted-nut notes, caramel-inspired sweetness, and a little touch of indulgence.',image:'assets/flavor-posters/chestnut-praline.webp',alt:'Whipped cream, pecans, chestnuts and caramel'},
  'peppermint-mocha':{title:'Peppermint Mocha',kicker:'Chocolate meets holiday cheer.',description:'Deep cocoa, cool peppermint inspiration, and just enough festive sparkle to make the moment special.',image:'assets/flavor-posters/peppermint-mocha.webp',alt:'Dark chocolate shavings, cocoa and peppermint candies'}
};
const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#site-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');nav.classList.remove('is-open')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?'Open menu':'Close menu');nav.classList.toggle('is-open',!open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
document.addEventListener('click',event=>{if(!header.contains(event.target))closeMenu()});
// The six photo menu buttons open the flavor detail panel.
const cards=[...document.querySelectorAll('.seasonal-menu-photo[data-menu-details]')];
const dialog=document.querySelector('#flavor-dialog');
const dialogTitle=document.querySelector('#dialog-title');
const dialogKicker=document.querySelector('#dialog-kicker');
const dialogDesc=document.querySelector('#dialog-desc');
const dialogImage=document.querySelector('#dialog-img');
let previouslyFocused=null;
cards.forEach(card=>card.addEventListener('click',()=>{
 const d=flavors[card.dataset.menuDetails]; if(!d)return;
 previouslyFocused=card;
 dialogTitle.textContent=d.title;dialogKicker.textContent=d.kicker;dialogDesc.textContent=d.description;dialogImage.src=d.image;dialogImage.alt=d.alt;
 dialog.showModal();
}));
function closeDialog(){dialog.close();if(previouslyFocused)previouslyFocused.focus()}
document.querySelector('#dialog-close').addEventListener('click',closeDialog);
document.querySelector('#dialog-back').addEventListener('click',closeDialog);
dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});
document.querySelector('#year').textContent=new Date().getFullYear();
