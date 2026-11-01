const translations = {
  en: {
    announce:'A DESIGNER\'S EYE. A NEW YORK STATE OF MIND.',navCollection:'Collections',navDesigner:'The designer',navBoutiques:'Our boutiques',heroKicker:'COLOMBIAN SPIRIT / NEW YORK ATTITUDE',heroMain:'Made to',heroItalic:'be seen.',heroDesc:'Statement pieces, Colombian jeans and confident looks for every season. Your style, unapologetically.',heroCTA:'Explore the collection',stripOne:'FEMININE FASHION',stripTwo:'CURATED IN NEW YORK',collectionKicker:'01 / THE COLLECTION',collectionTitle:'The Jaramillo <i>Collection.</i>',collectionIntro:'Dresses, statement blouses, Colombian denim, shapewear, sandals and heels. A complete wardrobe for every season.',filterAll:'All looks',filterClothes:'Clothing & dresses',filterShoes:'Shoes',filterEssentials:'Shapewear',cardCorse:'THE SIGNATURE LOOK',cardJeans:'COLOMBIAN JEANS',cardNight:'AFTER DARK',cardFajas:'SHAPEWEAR EDIT',cardPlats:'PLATFORMS & HEELS',cardSandals:'THE SANDAL EDIT',cardBlouses:'BLOUSES & DETAILS',cardWinter:'FALL / WINTER',cardSummer:'SPRING / SUMMER',catalogNote:'Editorial concept images. Final styles, sizes and availability will be confirmed with the boutique.',manifesto:'Not just what you wear.<br><em>How you walk into a room.</em>',designerKicker:'02 / MEET THE DESIGNER',designerTitle:'A Colombian eye.<br><i>A New York story.</i>',designerBody1:'Behind Jaramillo Boutique is a fashion designer from Colombia who has made New York her home. Her eye for feminine lines and the latest trends shapes the boutique’s point of view.',designerBody2:'It is about feeling confident, finding your style, and discovering the pieces you reach for when you want to make an entrance.',designerCTA:'Discover our three boutiques',sizeKicker:'STYLE FOR YOUR SILHOUETTE',sizeNote:'Size range is a proposed catalog display; confirm availability by style before publishing.',storesKicker:'03 / VISIT IN PERSON',storesTitle:'Three cities.<br><i>One signature style.</i>',storesIntro:'Find Jaramillo Boutique in Miami, Las Vegas and New York. Exact street addresses and opening hours will be added when confirmed.',storeOne:'Miami',storeTwo:'Las Vegas',storeThree:'New York',storePending:'Address to be confirmed',storesDisclaimer:'City presentation only · Storefront photographs, directions and hours are pending verification.',footerCaption:'Colombian roots. New York confidence.',collectionSwipe:'Swipe to explore every look. Tap a photo to see it larger.',swipeHint:'Swipe the image to discover another look.',previewDisclaimer:'Private concept preview · No online checkout'
  },
  es: {
    announce:'EL OJO DE UNA DISEÑADORA. LA ENERGÍA DE NUEVA YORK.',navCollection:'Colecciones',navDesigner:'La diseñadora',navBoutiques:'Nuestras tiendas',heroKicker:'ESENCIA COLOMBIANA / ESTILO NEW YORK',heroMain:'Hecha para',heroItalic:'destacar.',heroDesc:'Prendas especiales, pantalones colombianos y looks para cada temporada. Un estilo completamente tuyo.',heroCTA:'Explorar colección',stripOne:'MODA FEMENINA',stripTwo:'SELECCIONADA EN NUEVA YORK',collectionKicker:'01 / LA COLECCIÓN',collectionTitle:'La colección <i>Jaramillo.</i>',collectionIntro:'Vestidos, blusas, pantalones colombianos, fajas, sandalias y plataformas. Una colección completa para cada temporada.',filterAll:'Todos los looks',filterClothes:'Ropa y vestidos',filterShoes:'Zapatos',filterEssentials:'Fajas',cardCorse:'LOOK INSIGNIA',cardJeans:'PANTALONES COLOMBIANOS',cardNight:'VESTIDOS DE NOCHE',cardFajas:'FAJAS',cardPlats:'PLATAFORMAS Y TACONES',cardSandals:'SANDALIAS',cardBlouses:'BLUSAS Y DETALLES',cardWinter:'OTOÑO / INVIERNO',cardSummer:'PRIMAVERA / VERANO',catalogNote:'Fotos conceptuales. Los modelos, tallas y disponibilidad finales deben confirmarse con la boutique.',manifesto:'No es solo lo que llevas.<br><em>Es cómo entras a un lugar.</em>',designerKicker:'02 / CONOCE A LA DISEÑADORA',designerTitle:'Raíces colombianas.<br><i>Una historia en Nueva York.</i>',designerBody1:'Detrás de Jaramillo Boutique hay una diseñadora colombiana que hizo de Nueva York su hogar. Su pasión por las siluetas femeninas y las tendencias define el estilo de la boutique.',designerBody2:'Se trata de sentirte segura, encontrar tu estilo y descubrir esas prendas que eliges cuando quieres destacar.',designerCTA:'Conoce nuestras tres tiendas',sizeKicker:'ESTILO PARA TU SILUETA',sizeNote:'Rango de tallas propuesto para el catálogo; confirma disponibilidad por prenda antes de publicar.',storesKicker:'03 / VISÍTANOS',storesTitle:'Tres ciudades.<br><i>Un mismo estilo.</i>',storesIntro:'Encuentra Jaramillo Boutique en Miami, Las Vegas y Nueva York. Añadiremos las direcciones exactas y los horarios cuando estén confirmados.',storeOne:'Miami',storeTwo:'Las Vegas',storeThree:'Nueva York',storePending:'Dirección por confirmar',storesDisclaimer:'Solo presentamos las ciudades · Las fachadas, direcciones y horarios están pendientes de confirmar.',footerCaption:'Raíces colombianas. Confianza neoyorquina.',collectionSwipe:'Desliza para ver cada look. Toca una foto para ampliarla.',swipeHint:'Desliza la foto para descubrir otro look.',previewDisclaimer:'Vista privada de concepto · Sin pagos en línea'
  }
};
let language='en';
const languageButton=document.querySelector('#languageBtn');
const menuBtn=document.querySelector('#menuBtn');
const mobileMenu=document.querySelector('#mobileMenu');
function translate(lang){language=lang;document.documentElement.lang=lang;for(const node of document.querySelectorAll('[data-i18n]')){const value=translations[lang][node.dataset.i18n];if(value!==undefined)node.innerHTML=value;}renderStory();if(zoomToggle && dialog.open) zoomToggle.textContent=dialog.classList.contains('photo-expanded')?(lang==='es'?'VOLVER AL LOOK':'BACK TO LOOK'):(lang==='es'?'VER FOTO COMPLETA':'VIEW FULL PHOTO');languageButton.textContent=lang==='en'?'ES':'EN';languageButton.setAttribute('aria-label',lang==='en'?'Cambiar a español':'Switch to English');}
languageButton.addEventListener('click',()=>translate(language==='en'?'es':'en'));
menuBtn.addEventListener('click',()=>{const expanded=menuBtn.getAttribute('aria-expanded')==='true';menuBtn.setAttribute('aria-expanded',String(!expanded));menuBtn.setAttribute('aria-label',expanded?'Open menu':'Close menu');mobileMenu.hidden=expanded;});
mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menuBtn.setAttribute('aria-expanded','false');mobileMenu.hidden=true;}));
const filters=[...document.querySelectorAll('.filter')];
const cards=[...document.querySelectorAll('.collection-card')];
filters.forEach(filter=>filter.addEventListener('click',()=>{const value=filter.dataset.filter;filters.forEach(btn=>{const active=btn===filter;btn.classList.toggle('is-selected',active);btn.setAttribute('aria-pressed',String(active));});cards.forEach(card=>{const hide=value!=='all'&&card.dataset.group!==value;card.hidden=hide;const tile=card.closest('.collection-item');if(tile)tile.hidden=hide;});}));
const dialog=document.querySelector('#lightbox');
const lightboxImage=document.querySelector('#lightboxImg');
const lightboxCaption=document.querySelector('#lightboxCaption');
cards.forEach(card=>card.addEventListener('click',event=>{if(typeof dialog.showModal!=='function')return;event.preventDefault();lightboxImage.src=card.href;lightboxImage.alt=card.querySelector('img').alt;lightboxCaption.textContent=card.dataset[language==='es'?'labelEs':'labelEn'];if(!dialog.open)dialog.showModal();}));
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>{lightboxImage.src='';});

/* Brand-story chapters replace the static ticker. */
const storyTexts={
 en:[
  {count:'01 / 03 · THE JARAMILLO EDIT',title:'Colombian roots. A wardrobe for every season.',href:'#collections'},
  {count:'02 / 03 · THE DESIGNER',title:'Designed with an eye for confidence.',href:'#story'},
  {count:'03 / 03 · THE BOUTIQUES',title:'Miami. Las Vegas. New York.',href:'#boutiques'}
 ],
 es:[
  {count:'01 / 03 · EL ESTILO JARAMILLO',title:'Raíces colombianas. Moda para cada temporada.',href:'#collections'},
  {count:'02 / 03 · LA DISEÑADORA',title:'Diseño que celebra tu personalidad.',href:'#story'},
  {count:'03 / 03 · NUESTRAS TIENDAS',title:'Miami. Las Vegas. Nueva York.',href:'#boutiques'}
 ]
};
const storyBanner=document.querySelector('#brandStoryBanner');
const storyTabs=[...document.querySelectorAll('[data-story]')];
let activeStory=0, storyPaused=false;
function renderStory(){
 const item=storyTexts[language][activeStory];
 if(!item||!storyBanner)return;
 document.querySelector('#storyBannerCount').textContent=item.count;
 document.querySelector('#storyBannerTitle').textContent=item.title;
 document.querySelector('#storyBannerLink').href=item.href;
 storyTabs.forEach((tab,i)=>{tab.classList.toggle('is-current',i===activeStory);tab.setAttribute('aria-pressed',String(i===activeStory));});
}
storyTabs.forEach(tab=>tab.addEventListener('click',()=>{activeStory=Number(tab.dataset.story);renderStory();}));
if(storyBanner){
 storyBanner.addEventListener('mouseenter',()=>{storyPaused=true;storyBanner.classList.add('is-paused')});
 storyBanner.addEventListener('mouseleave',()=>{storyPaused=false;storyBanner.classList.remove('is-paused')});
 storyBanner.addEventListener('focusin',()=>{storyPaused=true;storyBanner.classList.add('is-paused')});
 storyBanner.addEventListener('focusout',event=>{if(!storyBanner.contains(event.relatedTarget)){storyPaused=false;storyBanner.classList.remove('is-paused')}});
 if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
  window.setInterval(()=>{if(!storyPaused&&!document.hidden){activeStory=(activeStory+1)%storyTabs.length;renderStory()}},7000);
 }
 renderStory();
}
/* An enlarged photograph remains within the product dialog; touching or swiping is supported. */
const zoomToggle=document.querySelector('#viewPhotoFull');
function resetPhotoZoom(){dialog.classList.remove('photo-expanded');zoomToggle?.setAttribute('aria-pressed','false');if(zoomToggle)zoomToggle.textContent=language==='es'?'VER FOTO COMPLETA':'VIEW FULL PHOTO'}
function togglePhotoZoom(){const on=dialog.classList.toggle('photo-expanded');zoomToggle?.setAttribute('aria-pressed',String(on));if(zoomToggle)zoomToggle.textContent=on?(language==='es'?'VOLVER AL LOOK':'BACK TO LOOK'):(language==='es'?'VER FOTO COMPLETA':'VIEW FULL PHOTO')}
zoomToggle?.addEventListener('click',togglePhotoZoom);
lightboxImage.addEventListener('click',togglePhotoZoom);
let swipeStart=null;
lightboxImage.addEventListener('touchstart',event=>{if(event.touches.length===1)swipeStart={x:event.touches[0].clientX,y:event.touches[0].clientY}},{passive:true});
lightboxImage.addEventListener('touchend',event=>{
 if(!swipeStart||!event.changedTouches.length)return;
 const dx=event.changedTouches[0].clientX-swipeStart.x,dy=event.changedTouches[0].clientY-swipeStart.y;
 swipeStart=null;
 if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.3)return;
 const visible=cards.filter(c=>!c.closest('.collection-item')?.hidden);
 const current=visible.findIndex(c=>c.href===lightboxImage.src);
 const next=visible[current+(dx<0?1:-1)];
 if(next){resetPhotoZoom();next.click()}
},{passive:true});
dialog.addEventListener('close',resetPhotoZoom);

document.querySelector('#year').textContent=new Date().getFullYear();
