
// @ts-nocheck
import './styles.css';
import './section-gallery.css';
import { YUMMM_ALL_PROMPTS } from './yummm-prompts';
import { FINISHED_DEMO_BOARDS, FINISHED_DEMO_IDS } from './finished-demo-boards';
import { FINISHED_DEMO_PROMPTS } from './finished-demo-prompts';
import {
  SECTION_DEFS,
  ensureGallery,
  sectionCount,
  addControl,
  galleryHTML,
  galleryManagerHTML,
  loadGallery,
  getGalleryPhotoSource,
  getCachedGalleryPhotoSource,
  addFiles,
  removePhoto,
  movePhoto,
  movePhotoTo,
  toggleFit,
  galleryBackup,
  galleryRestore,
  appendixRows,
  duplicateGallery
} from './section-gallery';

const KEY='tle-brand-board-studio-v1';
const DEMOS=[
  {
    id:'casa-brownie',name:'Casa Brownie',category:'Bakery · Demo',description:'Brownies horneados para hacer especial cualquier momento.',tagline:'Small moments, made sweeter.',
    monogram:'CB',symbol:'✳',titleFont:'Bodoni Moda',bodyFont:'DM Sans',tone:'Cálida · artesanal · deliciosa',style:'bakery',
    colors:['#422419','#BC7658','#E5D3A9','#FCF3E9','#A5AB91','#DEAF95'],
    heroPhoto:'https://www.amummytoo.co.uk/wp-content/uploads/2025/04/big-batch-brownies-SQUARE.jpg',
    detailPhoto:'https://images.ctfassets.net/brcxfsm84vq2/3XfvKaeEjct7Rjgweuzp5r/174011d220376e0cf240558c79796251/Fudge_Brownies_Salted_Caramel.jpg?w=600',
    site:'https://thelaunchera.com/demos/casa-brownie/',logoImage:'',patternImage:'',imageY:50,imageX:50,imageScale:1
  },
  {
    id:'crumb',name:'CRUMB Cookies',category:'Cookie Shop · Demo',description:'Cookies oversized, horneadas frescas y llenas de personalidad.',tagline:'The good stuff, fresh from the oven.',
    monogram:'C',symbol:'✺',titleFont:'Cormorant Garamond',bodyFont:'DM Sans',tone:'Suave · apetitosa · acogedora',style:'cookies',
    colors:['#392720','#BA8E6A','#E9DBCA','#FAF7F0','#B9AB8F','#DFC2A4'],
    heroPhoto:'https://d2ol7oe51mr4n9.cloudfront.net/user_3FC9GcVebQE6WAxiCP5Hh9w95GF/e5bb099c-dc60-4ebe-884c-2c33dccfab62.jpg',
    detailPhoto:'https://d2ol7oe51mr4n9.cloudfront.net/user_3FC9GcVebQE6WAxiCP5Hh9w95GF/678a8c92-21bd-410c-b72f-18e051b620c8.jpg',
    site:'https://thelaunchera.com/demos/crumb/',logoImage:'',patternImage:'',imageY:50,imageX:50,imageScale:1
  },
  {
    id:'aftr',name:'AFTR Las Vegas',category:'Nightclub · Demo',description:'Nightlife de alta energía, música y experiencias después del anochecer.',tagline:'After dark. Beyond ordinary.',
    monogram:'A',symbol:'✦',titleFont:'Bebas Neue',bodyFont:'Manrope',tone:'Nocturna · eléctrica · sofisticada',style:'nightclub',
    colors:['#0B0911','#9A6AFF','#FF3F9D','#F3F0F7','#D9FF52','#C6C9D4'],
    heroPhoto:'https://raw.githubusercontent.com/thelaunchera/demo-booking-landing-/main/aftr-nightclub/assets/hero.webp',
    detailPhoto:'https://raw.githubusercontent.com/thelaunchera/demo-booking-landing-/main/aftr-nightclub/assets/dj.webp',
    site:'https://thelaunchera.com/demos/aftr/',logoImage:'',patternImage:'',imageY:50,imageX:50,imageScale:1
  },
  {
    id:'yummm',name:'YUMMM',category:'Coffee & Bakery · Demo',description:'Un rincón para cafés, cookies, repostería y pequeños momentos felices. Vitrina interactiva y cajas para llevar.',tagline:'Your daily happy place.',
    monogram:'Y',symbol:'●',titleFont:'Nunito',bodyFont:'DM Sans',tone:'Cálida · divertida · editorial · deliciosa',style:'coffee',
    colors:['#992B2B','#C85E49','#EFDDC9','#FBF6EC','#B99A7F','#39241D'],
    heroPhoto:'https://thelaunchera.github.io/demo-booking-landing-/yummm/images/10.webp',detailPhoto:'https://thelaunchera.github.io/demo-booking-landing-/yummm/images/11.webp',
    site:'https://thelaunchera.github.io/demo-booking-landing-/yummm/',
    logoImage:'',patternImage:'',imageY:35,imageX:50,imageScale:1,
    sectionPhotos:{"hero":[{"id":"photo-yummm-hero-01","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/10.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-hero-02","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/02.webp","fit":"cover","x":50,"y":50}],"identity":[{"id":"photo-yummm-identity-01","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/01.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-identity-02","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/06.webp","fit":"cover","x":50,"y":50}],"palette":[{"id":"photo-yummm-palette-01","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/06.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-palette-02","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/09.webp","fit":"cover","x":50,"y":50}],"typography":[{"id":"photo-yummm-typography-01","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/01.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-typography-02","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/09.webp","fit":"cover","x":50,"y":50}],"pattern":[{"id":"photo-yummm-pattern-01","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/12.webp","fit":"cover","x":50,"y":50}],"applications":[{"id":"photo-yummm-applications-01","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/12.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-applications-02","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/03.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-applications-03","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/07.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-applications-04","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/04.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-applications-05","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/08.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-applications-06","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/16.webp","fit":"cover","x":50,"y":50}],"universe":[{"id":"photo-yummm-universe-01","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/10.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-universe-02","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/11.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-universe-03","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/13.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-universe-04","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/14.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-universe-05","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/15.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-universe-06","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/16.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-universe-07","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/17.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-universe-08","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/18.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-universe-09","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/19.webp","fit":"cover","x":50,"y":50},{"id":"photo-yummm-universe-10","src":"https://thelaunchera.github.io/demo-booking-landing-/yummm/images/20.webp","fit":"cover","x":50,"y":50}]}
  }
  ,{
    id:'jaramillo-boutique',name:'Jaramillo Boutique',category:'Women’s Fashion · Boutique Demo',
    description:'Boutique editorial de moda femenina colombiana en Nueva York, diseño y colecciones de tendencia.',
    tagline:'Colombian Spirit, New York Attitude.',
    monogram:'JB',symbol:'◈',titleFont:'Italiana',bodyFont:'DM Sans',tone:'Fashion editorial · femenina · elegante · atrevida',style:'boutique',
    colors:['#5A0F21','#3D101D','#F7F4EF','#E4D3C3','#B69B7C','#1D1718'],
    heroPhoto:'https://thelaunchera.github.io/demo-booking-landing-/jaramillo-boutique/assets/model-cutout.webp',
    detailPhoto:'https://thelaunchera.github.io/demo-booking-landing-/jaramillo-boutique/assets/designer-real.webp',
    site:'https://thelaunchera.github.io/demo-booking-landing-/jaramillo-boutique/',
    logoImage:'',patternImage:'',imageY:50,imageX:50,imageScale:1
  }
];
// Expand official demo boards with their approved photo collections and current brand identities.
// Only the three completed demos are migrated; YUMMM keeps its existing curated setup.
for (const demo of DEMOS) {
  if (FINISHED_DEMO_BOARDS[demo.id]) {
    Object.assign(demo, JSON.parse(JSON.stringify(FINISHED_DEMO_BOARDS[demo.id])));
  }
}
// Demos oficiales: publicados en GitHub Pages desde el repositorio de The Launch Era.
// Nunca recuperar las URLs antiguas de AppDeploy desde la memoria del navegador o backups.
const OFFICIAL_DEMO_SITES={
  'casa-brownie':'https://thelaunchera.com/demos/casa-brownie/',
  'crumb':'https://thelaunchera.com/demos/crumb/',
  'aftr':'https://thelaunchera.com/demos/aftr/',
  'yummm':'https://thelaunchera.github.io/demo-booking-landing-/yummm/',
  'jaramillo-boutique':'https://thelaunchera.github.io/demo-booking-landing-/jaramillo-boutique/'
};
function publishedSite(brand){
  if(OFFICIAL_DEMO_SITES[brand.id])return OFFICIAL_DEMO_SITES[brand.id];
  const candidate=String(brand.site||'').trim();
  if(!candidate)return '';
  try{
    const url=new URL(candidate);
    if(url.protocol!=='https:'||/([.]|^)appdeploy[.]ai$/i.test(url.hostname))return '';
    return url.href;
  }catch{return '';}
}
const TYPES=['Coffee & Bakery · Demo','Bakery · Demo','Cookie Shop · Demo','Nightclub · Demo','Boutique · Demo','Beauty · Demo','Wellness · Demo','Restaurante · Demo','Otra categoría'];
const FONTS=['Nunito','Bodoni Moda','DM Serif Display','Cormorant Garamond','Bebas Neue','Barlow Condensed','Italiana','Georgia','Manrope','DM Sans','Arial'];
const clone=x=>JSON.parse(JSON.stringify(x));
const $=id=>document.getElementById(id);
const html=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','&#39;':'&#39;'}[c]||'&#39;'));
const cssUrl=x=>'url('+JSON.stringify(x||'')+')';
const hex=(v,f='#FFFFFF')=>/^#[0-9a-fA-F]{6}$/.test(v||'')?v:f;
const FONT_MAP={Nunito:"'Nunito',sans-serif",'Bodoni Moda':"'Bodoni Moda',Georgia,serif",'DM Serif Display':"'DM Serif Display',Georgia,serif",'Cormorant Garamond':"'Cormorant Garamond',Georgia,serif",'Bebas Neue':"'Bebas Neue',Arial,sans-serif",'Barlow Condensed':"'Barlow Condensed',Arial,sans-serif",Italiana:"'Italiana',Georgia,serif",Georgia:'Georgia,serif',Manrope:"Manrope,sans-serif",'DM Sans':"'DM Sans',sans-serif",Arial:'Arial,sans-serif'};
const font=v=>FONT_MAP[v]||FONT_MAP['DM Sans'];

function promptItems(b){return b.id==='yummm' ? YUMMM_ALL_PROMPTS : (FINISHED_DEMO_PROMPTS[b.id]||[]);}
function promptsView(b){
  const items=promptItems(b);
  if(!items.length)return guide(b);
  const count=items.length;
  const groups=ensureGallery(b);
  const sourceCount=new Set(Object.values(groups).flat().map(p=>p.src).filter(Boolean)).size;
  return '<section class="yummm-prompt-library" aria-labelledby="brandPromptTitle">'+
    '<div class="yummm-prompts-hero"><div><span class="yummm-prompts-overline">THE LAUNCH ERA / BRAND BOARD MASTER</span><h2 id="brandPromptTitle">'+html(b.name)+' · Photo & Prompt Studio</h2><p>8 composiciones editoriales máster y 5 escenas fotográficas creadas para la identidad aprobada de esta demo. Cada prompt produce una imagen independiente.</p></div><a class="btn ghost" href="'+html(publishedSite(b))+'" target="_blank" rel="noopener noreferrer">Ver demo real</a></div>'+
    '<div class="yummm-prompts-help"><strong>Cómo utilizar estos prompts</strong><span>1. Elige una foto de la galería de '+html(b.name)+' · 2. Copia el prompt · 3. Genera una sola pieza · 4. Comprueba que logotipo, colores y producto no hayan cambiado. Las imágenes son referencias conceptuales, no pruebas de negocios reales.</span></div>'+
    '<div class="yummm-prompt-grid">'+items.map((item,i)=>'<article class="yummm-prompt-card">'+
      '<div class="yummm-prompt-meta"><small>'+html(item.group)+'</small><span>'+String(i+1).padStart(2,'0')+' / '+count+'</span></div>'+
      '<h3>'+html(item.title)+'</h3><p>'+html(item.text.slice(0,165))+'…</p>'+
      '<div class="yummm-prompt-actions"><button type="button" class="btn dark" data-demo-prompt="'+i+'">Copiar prompt</button><details><summary>Leer completo</summary><pre>'+html(item.text)+'</pre></details></div>'+
    '</article>').join('')+'</div>'+
    '<div class="yummm-prompts-bottom"><p>'+sourceCount+' fotografías o referencias distintas, organizadas por portada, identidad, paleta, tipografía, patrones, aplicaciones y universo visual. Las fotos oficiales enlazan con archivos de las demos publicadas, sin consumir memoria del teléfono.</p><button class="btn" data-action="download-demo-prompts">Descargar los '+count+' prompts (.txt)</button></div>'+
  '</section>';
}

function hydrate(){
  let previous=[];
  try{previous=JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){}
  if(!Array.isArray(previous))previous=[];
  const base=clone(DEMOS);
  if(!previous.length)return base;
  const hydrated=previous.map(b=>{
    const d=base.find(x=>x.id===b.id)||base[0];
    const merged={...clone(d),...b};
    merged.site=publishedSite(merged);
    if(!b.heroPhoto)merged.heroPhoto=d.heroPhoto;
    if(!b.detailPhoto)merged.detailPhoto=b.referenceImage||d.detailPhoto;
    if(!b.titleFont||b.titleFont==='Georgia')merged.titleFont=d.titleFont;
    if(!merged.style)merged.style=d.style;
    if(!Array.isArray(merged.colors)||merged.colors.length!==6)merged.colors=d.colors;
    ensureGallery(merged);
    // Migrate stale initial brand boards without discarding manually added photographs.
    if(FINISHED_DEMO_BOARDS[merged.id]){
      const official=FINISHED_DEMO_BOARDS[merged.id];
      const oldHero=String(b.heroPhoto||'');
      const oldDetail=String(b.detailPhoto||'');
      if(!b.heroPhoto || /amummytoo|cloudfront|raw\\.githubusercontent\\.com/.test(oldHero))merged.heroPhoto=official.heroPhoto;
      if(!b.detailPhoto || /ctfassets|cloudfront|raw\\.githubusercontent\\.com/.test(oldDetail))merged.detailPhoto=official.detailPhoto;
      // CRUMB's legacy brown palette is not the approved blue identity.
      if(merged.id==='crumb' && b.colors?.[0]?.toLowerCase()==='#392720'){
        merged.colors=clone(official.colors);
        merged.tone=official.tone;
      }
      // AFTR now uses Barlow Condensed and DM Sans on the published live demo.
      if(merged.id==='aftr' && b.titleFont==='Bebas Neue')merged.titleFont='Barlow Condensed';
      if(merged.id==='aftr' && b.bodyFont==='Manrope')merged.bodyFont='DM Sans';
      const wasLegacy= !b.studioOfficialBoardVersion;
      if(wasLegacy){
        merged.tagline=official.tagline;
        merged.description=official.description;
        if(merged.id!=='crumb' || !b.colors || b.colors[0]==='#392720')merged.tone=official.tone;
      }
      for(const [section,photographs] of Object.entries(official.sectionPhotos)){
        const current=merged.sectionPhotos[section]||[];
        const seen=new Set(current.map(p=>p.src).filter(Boolean));
        const fresh=photographs.filter(p=>!seen.has(p.src));
        // Prioritize official approved imagery, retaining user uploads and their order.
        merged.sectionPhotos[section]=current.length?current.concat(fresh.slice(0,Math.max(0,10-current.length)))
          :clone(photographs);
      }
      merged.studioOfficialBoardVersion='2026-11-01';
      ensureGallery(merged);
    }
    // YUMMM's existing cookie additions remain available in older saved boards.
    if(merged.id==='yummm'){
      const universe=merged.sectionPhotos.universe;
      for(const n of [17,18,19,20]){
        const source='https://thelaunchera.github.io/demo-booking-landing-/yummm/images/'+n+'.webp';
        if(!universe.some(p=>p.src===source) && universe.length<10){
          universe.push({id:'photo-yummm-universe-'+String(n-10).padStart(2,'0'),src:source,fit:'cover',x:50,y:50});
        }
      }
      ensureGallery(merged);
    }
    if(!Number.isFinite(Number(merged.imageX)))merged.imageX=50;
    if(!Number.isFinite(Number(merged.imageY)))merged.imageY=50;
    if(!Number.isFinite(Number(merged.imageScale)))merged.imageScale=1;
    return merged;
  });
  // Add every missing official demo, preserving other brands already edited locally.
  return hydrated.concat(base.filter(d=>!hydrated.some(b=>b.id===d.id)));
}
let brands=hydrate();
let activeId=localStorage.getItem(KEY+'-active')||brands[0].id;
if(!brands.some(x=>x.id===activeId))activeId=brands[0].id;
let view='board',tab='identity',focused=false,toastId;
let uploadSection = 'identity';
let replacementPhotoId = '';
let draggedGallery = null;
let selectedApplicationId = '';
let applicationDrag = null;
const active=()=>brands.find(x=>x.id===activeId)||brands[0];
function notify(s){
  document.querySelector('.toast')?.remove();
  const t=document.createElement('div');t.className='toast';t.textContent=s;document.body.append(t);
  clearTimeout(toastId);toastId=setTimeout(()=>t.remove(),3600);
}
function save(){
  try{localStorage.setItem(KEY,JSON.stringify(brands));localStorage.setItem(KEY+'-active',activeId);return true;}
  catch(e){notify('No hay espacio suficiente para guardar imágenes. Usa fotos más pequeñas o descarga un respaldo.');return false;}
}
function asset(b,key){return b[key]||'';}
function imageMarkup(url,cls='',alt='Fotografía'){
  if(!url)return '<div class="'+cls+' no-photo">✳</div>';
  return '<img src="'+html(url)+'" alt="'+html(alt)+'" loading="eager" draggable="false" onerror="this.style.opacity=0">';
}
function wordmark(b,variant=''){
  const style='font-family:'+font(b.titleFont)+';';
  if(b.logoImage&&variant==='element')return '<img class="logo-uploaded" src="'+html(b.logoImage)+'" alt="Logo de '+html(b.name)+'">';
  if(b.id==='yummm')return '<span style="font-family:Nunito,sans-serif;font-weight:1000;letter-spacing:-.09em">YUMMM</span>';
  if(b.id==='jaramillo-boutique')return '<span style="font-family:Italiana,Georgia,serif;font-weight:400;letter-spacing:.04em">JARAMILLO<small style="display:block;font:600 .2em DM Sans,sans-serif;letter-spacing:.38em">BOUTIQUE</small></span>';
  if(b.style==='bakery'&&b.name.toLowerCase()==='casa brownie')return '<span style="'+style+'">casa<br><em>brownie.</em></span>';
  if(b.style==='cookies'&&b.name.toLowerCase()==='crumb cookies')return '<span style="'+style+'">crumb<span style="opacity:.55">.</span></span>';
  if(b.style==='nightclub'&&b.name.toLowerCase()==='aftr las vegas')return '<span style="'+style+'">AFTR</span>';
  return '<span style="'+style+'">'+html(b.name)+'</span>';
}
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
function appLayers(b){
  const items=ensureGallery(b).applications;
  const layers=items.map((item,index)=>{
    const source=getCachedGalleryPhotoSource(item.id);
    const left=clamp(item.left??(index?15:0),0,100),top=clamp(item.top??(index?12:0),0,100);
    const width=clamp(item.width??(index?58:100),12,100),height=clamp(item.height??(index?74:100),12,100);
    return '<div class="board-application-layer'+(selectedApplicationId===item.id?' selected':'')+'" tabindex="0" role="button"'+
      ' aria-label="Editar foto '+(index+1)+'" data-application-id="'+html(item.id)+'"'+
      ' style="left:'+left+'%;top:'+top+'%;width:'+width+'%;height:'+height+'%;z-index:'+(index+1)+'">'+
      (source?'<img src="'+html(source)+'" alt="Foto editable de aplicación" style="object-fit:'+(item.fit==='contain'?'contain':'cover')+'">':
        '<span>Abriendo foto…</span>')+
      '<span class="board-layer-handle" aria-hidden="true"></span></div>';
  }).join('');
  const activeItem=items.find(v=>v.id===selectedApplicationId)||items[items.length-1];
  const actions=activeItem?
    '<div class="board-application-tools" aria-label="Controles de foto seleccionada">'+
    '<button data-action="app-select" data-id="'+html(activeItem.id)+'">Seleccionar foto</button>'+
    '<label>Tamaño <input aria-label="Cambiar tamaño de foto" type="range" data-app-size="'+html(activeItem.id)+'" min="18" max="100" step="1" value="'+clamp(activeItem.width??100,18,100)+'"></label>'+
    '<button data-action="app-fit" data-id="'+html(activeItem.id)+'">'+(activeItem.fit==='contain'?'Llenar':'Ver completa')+'</button>'+
    '<button data-action="app-replace" data-id="'+html(activeItem.id)+'">Reemplazar</button>'+
    '<button data-action="app-front" data-id="'+html(activeItem.id)+'">Al frente</button>'+
    '<button data-action="app-back" data-id="'+html(activeItem.id)+'">Al fondo</button>'+
    '<button class="danger" data-action="app-remove" data-id="'+html(activeItem.id)+'">Eliminar</button>'+
    '</div>':'';
  return '<div class="board-application-editor">'+
    '<div class="package-area board-application-canvas" data-section-drop="applications" style="background:'+hex(b.colors[4])+'">'+
    (items.length?layers:'<div class="board-application-empty"><span>Tu fotografía de producto o packaging va aquí</span>'+
      '<button type="button" data-action="section-add" data-section="applications">Añadir fotografía</button></div>')+
    '</div>'+
    '<div class="board-application-header">'+
       '<button type="button" data-action="'+(items.length?'app-replace':'section-add')+'" data-section="applications"'+
       (items.length?' data-id="'+html((activeItem||items[0]).id)+'"':'')+'>'+
         (items.length?'Cambiar imagen':'Colocar imagen')+'</button>'+
       (items.length?'<button type="button" data-action="section-add" data-section="applications">Añadir otra foto</button>':'')+
    '</div>'+actions+'</div>';
}
function board(b){
  const c=b.colors.map((v,i)=>hex(v,DEMOS[0].colors[i]));
  const cssVars='--ink:'+c[0]+';--accent:'+c[1]+';--soft:'+c[2]+';--paper:'+c[3]+';--extra:'+c[4]+';--detail:'+c[5]+';--muted:'+c[0]+'99;';
  const picX=Math.max(0,Math.min(100,Number(b.imageX)||50)),picY=Math.max(0,Math.min(100,Number(b.imageY)||50)),scale=Math.max(1,Math.min(2,Number(b.imageScale)||1));
  const photostyle='object-position:'+picX+'% '+picY+'%;transform:scale('+scale+');';
  const showPhoto=b.heroPhoto?imageMarkup(b.heroPhoto,'hero-shot',b.name):'<div class="no-photo" style="height:100%">Arrastra una fotografía</div>';
  const graphic='◌'; // Neutral editorial mark. Never render colored emoji placeholders.
  const paintPattern=b.patternImage?'<img class="pattern-image" src="'+html(b.patternImage)+'" alt="Patrón de la marca">':'';
  const block=(text,section)=>'<div class="art-label"><span>'+text+'</span>'+
    addControl(section)+'</div>';
  return '<div class="artboard" id="artboard" style="'+cssVars+'">'+
    '<header class="art-head" style="background:'+c[0]+';color:'+c[3]+'">'+
      '<div class="head-copy"><div class="art-meta"><span>THE LAUNCH ERA / CREATIVE STUDIO</span><span>IDENTITY 001</span></div>'+
      '<div class="wordmark '+html(b.style==='nightclub'?'aftr':'')+'">'+wordmark(b)+'</div><div class="hero-small">'+html(b.tagline)+'</div></div>'+
      '<div class="art-photo image-drop" data-drop="heroPhoto" title="Arrastra aquí una foto o mueve la imagen verticalmente">'+
      (b.heroPhoto?'<div class="hero-image-inner">'+showPhoto+'</div>':showPhoto)+
      '<span class="photo-hint">↕ Arrastra para ajustar</span>'+
      addControl('hero', '＋ Fotos') + '</div>'+
    '</header>'+
    '<div class="gallery-hero-wrap">'+galleryHTML(b,'hero')+'</div>'+
    '<section class="art-body">'+
      block('01 &nbsp; Elementos de identidad','identity')+
      '<div class="elements">'+
        '<div class="element logo-cell" style="background:'+c[0]+';color:'+c[3]+';font-family:'+font(b.titleFont)+'"><small>Wordmark</small>'+wordmark(b,'element')+'</div>'+
        '<div class="element monogram-cell" style="background:'+c[1]+';color:'+c[3]+';font-family:'+font(b.titleFont)+'"><small>Monograma</small>'+html(b.monogram)+'</div>'+
        '<div class="element mark-cell" style="background:'+c[2]+';color:'+c[0]+'"><small>Símbolo / pattern</small>'+html(graphic)+'</div>'+
      '</div>'+
      galleryHTML(b,'identity')+
      '<div class="art-section">'+block('02 &nbsp; Paleta de color','palette')+
        '<div class="palettes">'+c.map((col,i)=>'<div class="coloritem"><div class="colorcircle" style="background:'+col+'"></div><div class="colorname">'+['Principal','Acento','Suave','Fondo','Extra','Detalle'][i]+'</div><div class="colorcode">'+col.toUpperCase()+'</div></div>').join('')+'</div>'+
      galleryHTML(b,'palette')+'</div>'+
      '<div class="art-section">'+block('03 &nbsp; Tipografías y voz','typography')+
        '<div class="typeboard" style="background:'+c[0]+';color:'+c[3]+'">'+
        '<div class="bigtype"><div class="type-char" style="font-family:'+font(b.titleFont)+'">Aa</div><div class="type-meta">Titulares · '+html(b.titleFont)+'</div></div>'+
        '<div class="type-samples"><div class="typequote" style="font-family:'+font(b.titleFont)+'">'+html(b.tagline)+'</div>'+
        '<div class="sample-sub" style="font-family:'+font(b.bodyFont)+'">'+html(b.description||b.tone)+'</div><div class="type-meta">Texto · '+html(b.bodyFont)+'</div></div></div>'+
        galleryHTML(b,'typography')+
      '</div>'+
      '<div class="art-section double">'+
        '<div>'+block('04 &nbsp; Patrón','pattern')+'<div class="pattern-preview" data-pattern="'+html(graphic+'  '+graphic+'  '+graphic+'  '+graphic+'  '+graphic+'  '+graphic)+'" style="background:'+c[2]+';color:'+c[0]+'">'+paintPattern+'</div>'+galleryHTML(b,'pattern')+'</div>'+
        '<div>'+block('05 &nbsp; Packaging / aplicación','applications')+appLayers(b)+'</div>'+
      '</div>'+
      '<div class="art-section">'+block('06 &nbsp; Universo visual','universe')+
        '<div class="mood-strip">'+
          '<div class="mood-photo">'+imageMarkup(b.detailPhoto,'',b.name+' referencia secundaria')+'</div>'+
          '<div class="mood-photo">'+imageMarkup(b.heroPhoto,'',b.name+' fotografía de referencia')+'</div>'+
          '<div class="mood-photo mood-photo-edit" style="background:'+c[1]+';color:'+c[3]+'"><button type="button" data-action="section-add" data-section="universe">Añadir foto</button></div>'+
        '</div>'+galleryHTML(b,'universe')+
      '</div>'+
      '<div class="art-footer"><span>'+html(b.tone)+'</span><span>CONCEPT BRAND  /  THE LAUNCH ERA</span></div>'+
    '</section></div>';
}
function editor(b){
  let inside='';
  if(tab==='identity')inside=
    '<label class="field wide">Nombre de la marca<input data-field="name" maxlength="55" value="'+html(b.name)+'"></label>'+
    '<label class="field wide">Frase principal / tagline<input data-field="tagline" maxlength="110" value="'+html(b.tagline)+'"></label>'+
    '<label class="field wide">Qué hace esta marca<textarea data-field="description" maxlength="240">'+html(b.description||'')+'</textarea></label>'+
    '<label class="field wide">Categoría<select data-field="category">'+[...new Set([b.category,...TYPES])].map(t=>'<option '+(t===b.category?'selected':'')+'>'+html(t)+'</option>').join('')+'</select></label>'+
    '<label class="field">Monograma<input data-field="monogram" maxlength="5" value="'+html(b.monogram)+'"></label>'+
    '<label class="field">Símbolo<input data-field="symbol" maxlength="3" value="'+html(b.symbol)+'"></label>'+
    '<label class="field wide">Personalidad de la marca<input data-field="tone" maxlength="100" value="'+html(b.tone)+'"></label>'+
    '<div class="helper">💡 <strong>Dirección creativa:</strong> primero define cómo se siente la marca, después sus colores y fotos. Esto evita que todas nuestras demos se parezcan.</div>';
  else if(tab==='style')inside=
    '<div class="field wide">Paleta de seis colores</div>'+
    b.colors.map((v,i)=>'<label class="colorfield"><input type="color" data-color="'+i+'" value="'+hex(v)+'"><span><strong>'+['Principal','Acento','Suave','Fondo','Complementario','Detalle'][i]+'</strong><span>'+['Base para identidad','Color de acento','Fondos suaves','Fondo claro','Contraste adicional','Pequeños detalles'][i]+'</span></span><span class="colorhex">'+hex(v).toUpperCase()+'</span></label>').join('')+
    '<label class="field wide">Tipografía de títulos<select data-field="titleFont">'+FONTS.map(f=>'<option '+(b.titleFont===f?'selected':'')+'>'+f+'</option>').join('')+'</select></label>'+
    '<label class="field wide">Tipografía de textos<select data-field="bodyFont">'+FONTS.map(f=>'<option '+(b.bodyFont===f?'selected':'')+'>'+f+'</option>').join('')+'</select></label>'+
    '<button class="fullbtn" type="button" data-action="css">Copiar estilos para el website ↗</button>'+
    '<div class="helper">Al cambiar un color o tipografía, el board se actualiza inmediatamente. Los códigos HEX están listos para usar en las demos.</div>';
  else inside=
    '<div class="helper">Sube tus propias imágenes para que el tablero se vea como tu marca real. También puedes soltar una foto sobre la imagen grande.</div>'+
    assetBox(b,'heroPhoto','Foto principal','Reemplazar foto')+
    assetBox(b,'detailPhoto','Foto secundaria','Subir foto')+
    assetBox(b,'logoImage','Logotipo en PNG','Subir logo')+
    assetBox(b,'patternImage','Textura o patrón','Subir patrón')+
    galleryManagerHTML(b)+
    '<label class="field">Posición horizontal<div class="sliderrow"><input type="range" data-range="imageX" min="0" max="100" value="'+Math.round(b.imageX??50)+'"><span>'+Math.round(b.imageX??50)+'%</span></div></label>'+
    '<label class="field">Posición vertical<div class="sliderrow"><input type="range" data-range="imageY" min="0" max="100" value="'+Math.round(b.imageY??50)+'"><span>'+Math.round(b.imageY??50)+'%</span></div></label>'+
    '<label class="field">Acercamiento<div class="sliderrow"><input type="range" data-range="imageScale" min="1" max="2" step=".05" value="'+Number(b.imageScale||1)+'"><span>'+Math.round(Number(b.imageScale||1)*100)+'%</span></div></label>'+
    '<div class="helper">Las imágenes subidas se guardan en este navegador. Descarga un respaldo después de trabajar para no perderlas.</div>';
  return '<aside class="editor" id="editor"><div class="editor-head"><h2>Personalizar marca</h2><p>Tu identidad, un cambio a la vez.</p></div>'+
    '<div class="editor-tabs"><button class="edit-tab '+(tab==='identity'?'active':'')+'" data-tab="identity">Identidad</button><button class="edit-tab '+(tab==='style'?'active':'')+'" data-tab="style">Estilo</button><button class="edit-tab '+(tab==='assets'?'active':'')+'" data-tab="assets">Fotos</button></div>'+
    '<div class="formbody">'+inside+'</div>'+
    '<div class="panel-foot"><button class="btn" data-action="duplicate">⧉ Duplicar</button><button class="btn danger" data-action="delete">Eliminar marca</button></div></aside>';
}
function assetBox(b,key,title,cta){
  const img=b[key];
  return '<div class="uploadbox" data-drop="'+key+'"><div class="upload-thumb">'+(img?'<img src="'+html(img)+'" alt="'+html(title)+'">':'＋')+'</div>'+
  '<div class="upload-info"><strong>'+title+'</strong><p>JPG, PNG o WEBP</p>'+
  '<label class="upload-label"><input type="file" data-upload="'+key+'" accept="image/png,image/jpeg,image/webp"><button type="button" data-action="choose-file" data-target="'+key+'">'+cta+'</button></label></div>'+
  (img?'<button type="button" data-action="remove-image" data-target="'+key+'" title="Quitar imagen">×</button>':'')+'</div>';
}
function guide(b){
  const c=b.colors.map(x=>hex(x));
  const code=cssTokens(b);
  return '<section class="guide"><div class="guide-label">TLE — Guía de marca / 001</div><h2>'+html(b.name)+'<br><em>Brand Guidelines</em></h2>'+
    '<p>'+html(b.description||'')+' Su estilo se define por una estética '+html(b.tone.toLowerCase())+'. Usa esta guía para mantener la misma identidad en website, piezas visuales, publicaciones y presentaciones.</p>'+
    '<div class="guide-grid"><div class="guide-card"><h3>Paleta oficial</h3><div class="guide-swatch">'+c.map(x=>'<span title="'+x+'" style="background:'+x+'"></span>').join('')+'</div>'+
    '<p>'+c.join(' · ')+'</p></div>'+
    '<div class="guide-card"><h3>Tipografías</h3><p><b>Display:</b> '+html(b.titleFont)+'<br><b>Body:</b> '+html(b.bodyFont)+'</p></div>'+
    '<div class="guide-card"><h3>Estilo y tono</h3><p>'+html(b.tone)+'<br>'+html(b.tagline)+'</p></div>'+
    '<div class="guide-card"><h3>Variables para tu website</h3><pre>'+html(code)+'</pre><button class="btn dark" data-action="css">Copiar CSS</button></div></div>'+
    '<div style="margin-top:25px;display:flex;gap:9px;flex-wrap:wrap"><button class="btn" data-action="json">↓ Descargar ficha JSON</button><button class="btn" data-action="print">↓ Imprimir guía</button></div></section>';
}
function mockups(b){
  const c=b.colors.map(x=>hex(x));
  return '<section class="mockups-view"><div class="guide-label">Vista de aplicaciones / 002</div><h2>Una identidad que<br><em>vive fuera del tablero.</em></h2><p>Estas son simulaciones visuales de cómo podrían verse el website y las piezas de marca. No modifican los demos publicados.</p>'+
    '<div class="mockup-grid">'+
    '<div class="mockup-card" style="background:'+c[2]+'"><div class="phone"><div class="phone-notch"></div><div class="phone-hero">'+imageMarkup(b.heroPhoto,'',b.name)+'</div><h3 style="font-family:'+font(b.titleFont)+';color:'+c[0]+'">'+html(b.name)+'</h3><p style="color:'+c[0]+'">'+html(b.tagline)+'</p><div class="tinycta" style="background:'+c[0]+';color:'+c[3]+'">EXPLORE THE EXPERIENCE</div></div></div>'+
    '<div class="mockup-card" style="background:'+c[4]+'"><div class="cardmock" style="background:'+c[0]+';color:'+c[3]+'"><div class="smallmark">'+html(b.monogram)+'</div><strong style="font-family:'+font(b.titleFont)+'">'+html(b.name)+'</strong><small>'+html(b.tagline)+'</small></div></div>'+
    '</div></section>';
}
function render(){
  const b=active();
  const content=view==='board'
    ?'<div class="stage"><div class="stage-top"><strong>Vista previa · Identidad completa</strong><div class="stage-controls"><span>Brand Board 01</span><button class="microbtn" data-action="focus">'+(focused?'Mostrar editor':'Ampliar vista')+'</button></div></div>'+board(b)+'</div>'
    :view==='mockups'?mockups(b):view==='prompts'?promptsView(b):guide(b);
  $('app').innerHTML=
    '<div class="shell"><aside class="sidebar">'+
      '<div class="brandlock"><span class="brandlock-icon">L.</span><span><strong>The Launch Era</strong><small>BRAND BOARD STUDIO</small></span></div>'+
      '<div class="sidebar-caption">Mis marcas demo</div><div class="sidebar-navgroup"><nav class="brandlist" aria-label="Marcas">'+
      brands.map(x=>'<button class="brandnav '+(x.id===b.id?'active':'')+'" data-brand="'+html(x.id)+'"><span class="navlogo" style="background:'+hex(x.colors[1])+';color:'+hex(x.colors[0])+'">'+html(x.monogram.slice(0,3))+'</span><span class="navinfo"><strong>'+html(x.name)+'</strong><small>'+html(x.category)+'</small></span><span class="navarrow">›</span></button>').join('')+
      '</nav><button class="newbrand" data-action="new">＋ Nueva marca</button></div>'+
      '<div class="sidefoot"><a href="'+html(publishedSite(b)||'#')+'" '+(publishedSite(b)?'target="_blank" rel="noopener noreferrer"':'')+'>↗ Abrir demo de GitHub</a><a href="#" data-action="backup">↓ Respaldo de mis marcas</a><a href="#" data-action="import">↑ Importar respaldo</a><span>Área de trabajo creativa de The Launch Era. Los cambios se guardan solo en este navegador.</span></div>'+
    '</aside><div class="content"><header class="header"><div class="breadcrumb">The Launch Era &nbsp; / &nbsp; Demo Studio &nbsp; / &nbsp; <b>Brand Boards</b></div>'+
      '<div class="header-end"><span class="savepoint"></span><span class="savetext">Guardado local</span><span class="head-avatar">L</span></div></header>'+
      '<main class="workspace"><div class="page-intro"><div><div class="kicker">Creative direction · Brand identity</div><h1>'+html(b.name)+'</h1><p>'+html(b.category)+' &nbsp; · &nbsp; Una identidad lista para llevar al siguiente diseño.</p></div>'+
      '<div class="main-actions"><button class="btn" data-action="backup">↓ Respaldo</button><button class="btn" data-action="print">PDF</button><button class="btn dark" data-action="png">↓ Exportar PNG</button></div></div>'+
      '<div class="switcher"><button class="viewtab '+(view==='board'?'active':'')+'" data-view="board">✦ Brand Board</button>'+
      '<button class="viewtab '+(view==='mockups'?'active':'')+'" data-view="mockups">Aplicaciones</button>'+
      '<button class="viewtab '+(view==='guide'?'active':'')+'" data-view="guide">Guía de marca</button>'+ (b.id==='yummm'?'<button class="viewtab '+(view==='prompts'?'active':'')+'" data-view="prompts">Prompts (13)</button>':'')+
      '<span class="viewspacer"></span>'+(publishedSite(b)?'<a class="btn ghost" href="'+html(publishedSite(b))+'" target="_blank" rel="noopener noreferrer">↗ Ver demo en GitHub</a>':'')+'</div>'+
      '<div class="workspace-grid '+(focused?'focus':'')+(view==='prompts'?' prompt-mode':'')+'"><div class="left-stage">'+content+
      '<p class="workspace-hint">El tablero se actualiza al editar. Puedes cargar nuevas fotos y exportar el resultado sin modificar tus demos.</p></div>'+
      (focused||view==='prompts'?'':editor(b))+'</div></main></div></div>'+
      '<dialog id="new-dialog"><form method="dialog" class="dialog-body" id="new-form"><h3>Nueva marca demo</h3><p>Empieza con una dirección visual propia, no con un tablero vacío.</p>'+
      '<label class="field">Nombre de la marca<input name="brandname" class="modal-input" maxlength="55" required placeholder="Ej. Miel Coffee Studio"></label>'+
      '<label class="field" style="margin-top:14px">Tipo de marca<select name="brandtype" class="modal-input">'+TYPES.map(x=>'<option>'+html(x)+'</option>').join('')+'</select></label>'+
      '<div class="dialog-actions"><button type="button" class="btn" data-action="cancel-new">Cancelar</button><button type="submit" class="btn dark">Crear Brand Board</button></div></form></dialog>'+
      '<input type="file" accept="application/json,.json" id="import-file" hidden>'+
      '<input type="file" id="section-upload" accept="image/png,image/jpeg,image/webp" multiple hidden>';
  syncPhoto();
  const current = b.id;
  loadGallery(b).then(loaded => {
    if (loaded && activeId === current && view === 'board') preview();
  }).catch(() => {});
}
function syncPhoto(){
  const b=active();const img=document.querySelector('.art-photo img');
  if(img){img.style.objectPosition=b.imageX+'% '+b.imageY+'%';img.style.transform='scale('+b.imageScale+')';}
}
function preview(){
  const b=active();
  if(view==='board'){
    const st=document.querySelector('.artboard');
    if(st){st.outerHTML=board(b);syncPhoto();}
  }else{
    const box=document.querySelector('.guide,.mockups-view');
    if(box)box.outerHTML=view==='guide'?guide(b):mockups(b);
  }
  const page=document.querySelector('.page-intro h1');if(page)page.textContent=b.name;
  document.querySelectorAll('.colorhex').forEach((e,i)=>e.textContent=hex(b.colors[i]).toUpperCase());
}
function tokenName(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-');}
function cssTokens(b){
  return ':root {\n'+b.colors.map((x,i)=>'  --brand-'+['primary','accent','soft','background','extra','detail'][i]+': '+hex(x)+';').join('\n')+
    '\n  --font-display: '+font(b.titleFont)+';\n  --font-body: '+font(b.bodyFont)+';\n}';
}
function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove();},1000);}
async function backup(){
  try {
    const photos = await galleryBackup(brands);
    const data = JSON.stringify({format:'the-launch-era-brand-boards',version:3,brands,photos},null,2);
    download(new Blob([data],{type:'application/json'}),'tle-brandboards-respaldo.json');
    notify('Respaldo con fotos descargado. Guárdalo fuera del navegador.');
  } catch(e) { notify('No se pudo preparar el respaldo completo.'); }
}
function exportJSON(){const b=active(),doc={brand:b.name,category:b.category,tagline:b.tagline,description:b.description,personality:b.tone,colors:b.colors,typography:{display:b.titleFont,body:b.bodyFont},css:cssTokens(b)};download(new Blob([JSON.stringify(doc,null,2)],{type:'application/json'}),'guia-'+tokenName(b.name)+'.json');}
async function loadImage(src){
  if(!src)return null;
  return new Promise(resolve=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;});
}
function canvasImage(ctx,img,x,y,w,h,pX=50,pY=50,scale=1,mode='cover'){
  if(!img)return false;
  const fit=(mode==='contain'?Math.min(w/img.width,h/img.height):Math.max(w/img.width,h/img.height))*scale;
  const iw=img.width*fit,ih=img.height*fit;
  const dx=mode==='contain'?x+(w-iw)/2:x-(iw-w)*(pX/100);
  const dy=mode==='contain'?y+(h-ih)/2:y-(ih-h)*(pY/100);
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(img,dx,dy,iw,ih);ctx.restore();return true;
}
function write(ctx,s,x,y,size,color,fontName='Arial',weight='normal'){
  ctx.fillStyle=color;ctx.font=weight+' '+size+'px '+fontName;ctx.fillText(String(s),x,y);
}
function wrap(ctx,s,x,y,maxw,sz,color,f='Georgia',leading=1.14){
  ctx.font=sz+'px '+f;const words=String(s).split(/\s+/);let text='',line=0;
  words.forEach(w=>{const test=text?text+' '+w:w;if(ctx.measureText(test).width>maxw&&text){write(ctx,text,x,y+line*sz*leading,sz,color,f);line++;text=w;}else{text=test;}});
  if(text)write(ctx,text,x,y+line*sz*leading,sz,color,f);return line;
}
async function exportPNG(){
  const b=active(),c=b.colors.map(v=>hex(v)),W=1400;
  const galleryRows=await appendixRows(b);
  const appendixHeight=galleryRows.reduce((sum,row)=>sum+92+Math.ceil(row.photos.length/3)*288+25,0);
  const H=1900+appendixHeight;
  const can=document.createElement('canvas');
  can.width=W;can.height=H;const g=can.getContext('2d');
  g.fillStyle=c[3];g.fillRect(0,0,W,H);g.fillStyle=c[0];g.fillRect(0,0,W,410);
  const [hero,detail,logo,pattern]=await Promise.all([loadImage(b.heroPhoto),loadImage(b.detailPhoto),loadImage(b.logoImage),loadImage(b.patternImage)]);
  canvasImage(g,hero,700,0,700,410,b.imageX,b.imageY,b.imageScale);
  g.fillStyle=c[3];g.fillRect(40,38,12,12);write(g,'THE LAUNCH ERA / CREATIVE STUDIO',72,49,15,c[3],'Arial','bold');
  const display=b.titleFont==='Bebas Neue'?'Impact':b.titleFont==='Cormorant Garamond'||b.titleFont==='Bodoni Moda'||b.titleFont==='DM Serif Display'?'Georgia':'Arial';
  if(b.style==='bakery'&&b.name.toLowerCase()==='casa brownie'){write(g,'casa',69,225,118,c[3],display);write(g,'brownie.',69,332,113,c[3],display);}
  else if(b.style==='cookies'&&b.name.toLowerCase()==='crumb cookies'){write(g,'crumb.',65,266,139,c[3],display);}
  else if(b.style==='nightclub'&&b.name.toLowerCase()==='aftr las vegas'){write(g,'AFTR',65,275,179,c[3],display,'bold');}
  else wrap(g,b.name,65,234,600,b.name.length>19?60:95,c[3],display);
  wrap(g,b.tagline,67,367,580,22,c[3],'Arial');
  const title=(s,y)=>write(g,s.toUpperCase(),52,y,20,c[0],'Arial','bold');
  title('01  Brand elements',467);
  for(let i=0;i<3;i++){g.fillStyle=c[i];g.fillRect(52+i*435,490,416,185);}
  if(logo){const w=Math.min(330,logo.width),h=Math.min(130,logo.height);g.drawImage(logo,108,520,w,h);}
  else write(g,b.name.length>18?b.monogram:b.name,75,598,b.name.length>18?95:53,c[3],display);
  write(g,b.monogram,625,613,95,c[3],display);
  write(g,b.symbol,1100,614,115,c[0],display);
  title('02  Color palette',737);
  for(let i=0;i<6;i++){
    const x=54+i*223;
    g.beginPath();g.arc(x+90,841,79,0,Math.PI*2);g.fillStyle=c[i];g.fill();
    write(g,['PRIMARY','ACCENT','SOFT','BACKGROUND','EXTRA','DETAIL'][i],x+2,955,14,c[0],'Arial','bold');
    write(g,c[i],x+2,982,17,c[0],'Arial');
  }
  title('03  Typography / voice',1063);
  g.fillStyle=c[0];g.fillRect(52,1091,1296,276);
  write(g,'Aa',90,1272,165,c[3],display);
  write(g,'DISPLAY / '+b.titleFont.toUpperCase(),89,1332,17,c[3],'Arial');
  wrap(g,b.tagline,603,1194,697,51,c[3],display);
  wrap(g,b.description||b.tone,607,1290,690,21,c[3],'Arial');
  title('04  Pattern and applications',1431);
  g.fillStyle=c[2];g.fillRect(52,1462,622,281);
  if(pattern){canvasImage(g,pattern,52,1462,622,281);}
  else{for(let i=0;i<15;i++){write(g,b.symbol,65+(i%5)*125,1548+Math.floor(i/5)*86,60,c[0],display);}}
  g.fillStyle=c[4];g.fillRect(688,1462,660,281);
  // Packaging is a true photo-layer canvas; export exactly what the board shows.
  const applications=ensureGallery(b).applications;
  g.save();g.beginPath();g.rect(688,1462,660,281);g.clip();
  for (let index=0;index<applications.length;index++){
    const item=applications[index],src=await getGalleryPhotoSource(item.id),img=await loadImage(src);
    if(!img)continue;
    const l=clamp(item.left??(index?15:0),0,100),t=clamp(item.top??(index?12:0),0,100);
    const w=clamp(item.width??(index?58:100),12,100),h=clamp(item.height??(index?74:100),12,100);
    canvasImage(g,img,688+660*l/100,1462+281*t/100,660*w/100,281*h/100,50,50,1,item.fit==='contain'?'contain':'cover');
  }
  g.restore();
  title('05  Visual universe',1800);
  if(detail)canvasImage(g,detail,52,1815,224,64);
  if(hero)canvasImage(g,hero,287,1815,224,64);
  write(g,b.tone,553,1857,19,c[0],'Arial');
  write(g,'THE LAUNCH ERA / CONCEPT BRAND',1068,1865,15,c[0],'Arial');
  let galleryY=1900;
  for (const row of galleryRows) {
    g.fillStyle=c[3];g.fillRect(0,galleryY,W,92);
    write(g,'GALERÍA  /  '+row.title.toUpperCase(),52,galleryY+56,26,c[0],'Arial','bold');
    galleryY+=92;
    for (let i=0;i<row.photos.length;i++) {
      const col=i%3, r=Math.floor(i/3),x=52+col*438,y=galleryY+r*288;
      g.fillStyle=c[2];g.fillRect(x,y,418,264);
      const photo=await loadImage(row.photos[i].src);
      if(photo)canvasImage(g,photo,x,y,418,264,row.photos[i].x,row.photos[i].y,1,row.photos[i].fit);
    }
    galleryY+=Math.ceil(row.photos.length/3)*288+25;
  }
  can.toBlob(blob=>{if(blob){download(blob,'brand-board-'+tokenName(b.name)+'.png');notify(!hero&&b.heroPhoto?'PNG descargado. Una foto externa no permitió exportación; súbela desde tu dispositivo para incluirla.':'PNG HD descargado.');}else notify('No se pudo generar el PNG.');},'image/png');
}
async function resizeFile(file){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Formato no permitido');
  if(file.size>14*1024*1024)throw Error('La imagen supera 14 MB');
  const u=URL.createObjectURL(file);
  try{
    const im=new Image();await new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=reject;im.src=u;});
    const scale=Math.min(1,1100/Math.max(im.width,im.height));const cv=document.createElement('canvas');
    cv.width=Math.round(im.width*scale);cv.height=Math.round(im.height*scale);
    cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
    return cv.toDataURL(file.type==='image/png'?'image/png':'image/jpeg',.83);
  }finally{URL.revokeObjectURL(u);}
}
async function assignImage(file,key){
  if(!file||!['heroPhoto','detailPhoto','logoImage','patternImage'].includes(key))return;
  const id=activeId;
  try{
    const img=await resizeFile(file);const b=brands.find(x=>x.id===id);if(!b)return;
    const prev=b[key];b[key]=img;
    if(!save()){b[key]=prev;save();return;}
    if(id===activeId){tab='assets';render();}notify('Imagen colocada en el Brand Board.');
  }catch(e){notify(e.message||'No se pudo procesar la foto.');}
}
function openNew(){const dialog=$('new-dialog');if(dialog?.showModal)dialog.showModal();else notify('Tu navegador no admite este formulario.');}
function addBrand(name,type){
  const id='brand-'+Date.now().toString(36);const starter=clone(DEMOS[0]);
  const fallback=type.includes('Nightclub')?DEMOS[2]:type.includes('Cookie')?DEMOS[1]:DEMOS[0];
  Object.assign(starter,clone(fallback),{id,name,category:type,tagline:'Una marca con una historia propia.',description:'Una nueva identidad creada para un proyecto demo.',monogram:name.trim().split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase(),site:'',logoImage:'',patternImage:'',heroPhoto:'',detailPhoto:'',imageY:50,imageX:50,imageScale:1});
  brands.push(starter);activeId=id;save();tab='identity';view='board';focused=false;render();notify('Nueva marca creada. Ahora puedes darle identidad.');
}
async function openPhotoReview(section,id){
  const source=await getGalleryPhotoSource(id);
  if(!source){notify('No se pudo cargar la imagen para revisarla.');return;}
  document.querySelector('#gallery-photo-review')?.remove();
  const dialog=document.createElement('dialog');
  dialog.id='gallery-photo-review';
  dialog.className='gallery-photo-review-dialog';
  const heading=document.createElement('h3');
  heading.textContent='Revisa la fotografía antes de usarla';
  const image=document.createElement('img');
  image.src=source;image.alt='Vista ampliada de la foto seleccionada';
  const note=document.createElement('p');
  note.textContent='Especialmente si la hiciste con IA: revisa pies, manos, rostro, proporciones y detalles de fondo. La aplicación no puede garantizar automáticamente que una foto generada sea correcta.';
  const bar=document.createElement('div');bar.className='gallery-review-buttons';
  const close=document.createElement('button');close.type='button';close.textContent='Conservar foto';
  close.addEventListener('click',()=>dialog.close());
  const replace=document.createElement('button');replace.type='button';replace.textContent='Reemplazar foto';
  replace.addEventListener('click',()=>{
    dialog.close();
    uploadSection=section;replacementPhotoId=id;
    const input=$('section-upload');
    if(input){input.value='';input.multiple=false;input.click();}
  });
  const remove=document.createElement('button');remove.type='button';remove.textContent='Eliminar foto';
  remove.addEventListener('click',()=>{
    dialog.close();
    if(!confirm('¿Eliminar esta foto del Brand Board?'))return;
    removePhoto(active(),section,id,save).then(()=>{
      render();notify('Foto eliminada. Puedes reemplazarla por una versión corregida.');
    }).catch(e=>notify(e.message));
  });
  bar.append(close,replace,remove);
  dialog.append(heading,image,note,bar);
  document.body.append(dialog);
  dialog.addEventListener('close',()=>dialog.remove(),{once:true});
  dialog.showModal();
}

function perform(action,button){
  const b=active();
  if(action==='new')openNew();
  if(action==='cancel-new')$('new-dialog')?.close();
  if(action==='duplicate'){
    const next=clone(b);next.id='brand-'+Date.now().toString(36);next.name=b.name+' · copia';
    brands.push(next);activeId=next.id;
    duplicateGallery(b,next).then(()=>{save();render();notify('Tablero y fotos duplicados.');})
      .catch(()=>{next.sectionPhotos={};save();render();notify('Tablero duplicado, pero algunas imágenes no se copiaron.');});
    return;
  }
  if(action==='delete'){
    if(brands.length===1){notify('Conserva al menos una marca.');return;}
    if(!confirm('¿Eliminar el Brand Board de '+b.name+'? Esto no se puede deshacer.'))return;
    brands=brands.filter(x=>x.id!==b.id);activeId=brands[0].id;save();render();notify('Marca eliminada.');
  }
  if(action==='download-demo-prompts' && promptItems(b).length){
    const prompts=promptItems(b);
    const txt=prompts.map((item,i)=>'PROMPT '+String(i+1).padStart(2,'0')+' / '+item.title+'\n'+item.group+'\n\n'+item.text).join('\n\n'+('-'.repeat(65))+'\n\n');
    download(new Blob([txt],{type:'text/plain;charset=utf-8'}),b.id+'-13-creative-prompts.txt');notify(prompts.length+' prompts descargados.');return;
  }
  if(action==='backup')backup();
  if(action==='import'){$('import-file')?.click();return;}
  if(action==='section-add' || action==='gallery-replace') {
    uploadSection=button.dataset.section;
    replacementPhotoId=action==='gallery-replace' ? button.dataset.id : '';
    const input=$('section-upload');
    if (input) { input.value='';input.multiple=!replacementPhotoId;input.click(); }
    return;
  }
  if(action==='app-select'||action==='app-front'||action==='app-back'||action==='app-remove'||action==='app-fit'||action==='app-replace'){
    const items=ensureGallery(b).applications,id=button.dataset.id,
      index=items.findIndex(v=>v.id===id);
    if(index<0)return;
    selectedApplicationId=id;
    if(action==='app-replace'){
      uploadSection='applications';replacementPhotoId=id;
      const input=$('section-upload');if(input){input.value='';input.multiple=false;input.click();}
      return;
    }
    if(action==='app-remove'){
      if(!confirm('¿Quitar esta foto del tablero?'))return;
      removePhoto(b,'applications',id,save).then(()=>{selectedApplicationId='';preview();notify('Foto eliminada.');});
      return;
    }
    if(action==='app-front'){items.push(...items.splice(index,1));save();}
    if(action==='app-back'){items.unshift(...items.splice(index,1));save();}
    if(action==='app-fit'){items[index].fit=items[index].fit==='contain'?'cover':'contain';save();}
    preview();return;
  }
  if(action==='gallery-review') {void openPhotoReview(button.dataset.section,button.dataset.id);return;}
  if(action==='gallery-delete') {
    removePhoto(b,button.dataset.section,button.dataset.id,save).then(()=>{
      render();notify('Foto eliminada.');
    }).catch(e=>notify(e.message));
    return;
  }
  if(action==='gallery-left'||action==='gallery-right') {
    movePhoto(b,button.dataset.section,button.dataset.id,action==='gallery-left'?-1:1,save);
    render();return;
  }
  if(action==='gallery-fit') {
    toggleFit(b,button.dataset.section,button.dataset.id,save);
    render();return;
  }
  if(action==='png')exportPNG();
  if(action==='json')exportJSON();
  if(action==='print')window.print();
  if(action==='focus'){focused=!focused;render();}
  if(action==='css'){
    const src=cssTokens(b);
    if(navigator.clipboard?.writeText){navigator.clipboard.writeText(src).then(()=>notify('Variables CSS copiadas.'),()=>prompt('Copia estas variables:',src));}
    else prompt('Copia estas variables:',src);
  }
  if(action==='choose-file'){
    const key=button?.dataset.target;
    const input=document.querySelector('input[data-upload="'+key+'"]');input?.click();
  }
  if(action==='remove-image'){
    const key=button?.dataset.target;
    if(!['heroPhoto','detailPhoto','logoImage','patternImage'].includes(key))return;
    b[key]='';save();render();notify('Imagen quitada.');
  }
}
document.addEventListener('click',event=>{
  const promptBtn=event.target.closest('[data-demo-prompt]');
  if(promptBtn){const item=promptItems(active())[Number(promptBtn.dataset.demoPrompt)];if(item){if(navigator.clipboard?.writeText){navigator.clipboard.writeText(item.text).then(()=>notify('Prompt copiado: '+item.title)).catch(()=>prompt('Copia el prompt:',item.text));}else prompt('Copia el prompt:',item.text);}return;}
  const nav=event.target.closest('[data-brand]');
  if(nav){activeId=nav.dataset.brand;save();view='board';tab='identity';focused=false;render();return;}
  const viewBtn=event.target.closest('[data-view]');
  if(viewBtn){view=viewBtn.dataset.view;render();return;}
  const tabBtn=event.target.closest('[data-tab]');
  if(tabBtn){tab=tabBtn.dataset.tab;render();return;}
  const action=event.target.closest('[data-action]');
  if(action){if(action.tagName==='A')event.preventDefault();perform(action.dataset.action,action);}
});
document.addEventListener('input',event=>{
  const b=active(),t=event.target;
  const prop=t.dataset.field;
  if(prop){b[prop]=String(t.value).slice(0,prop==='description'?240:110);save();preview();}
  if(t.dataset.color!==undefined){
    const n=Number(t.dataset.color);if(Number.isInteger(n)&&n>=0&&n<6){b.colors[n]=hex(t.value);save();preview();}
  }
  if(t.dataset.appSize){
    const item=ensureGallery(b).applications.find(x=>x.id===t.dataset.appSize);
    if(item){item.width=clamp(t.value,18,100);
      item.height=clamp(item.height??100,12,100);
      const tile=document.querySelector('.board-application-layer[data-application-id="'+item.id+'"]');
      if(tile)tile.style.width=item.width+'%';
      save();}
  }
  if(t.dataset.range){
    const k=t.dataset.range;
    if(['imageX','imageY','imageScale'].includes(k)){
      b[k]=Number(t.value);save();syncPhoto();const label=t.closest('.sliderrow')?.querySelector('span');
      if(label)label.textContent=k==='imageScale'?Math.round(b[k]*100)+'%':Math.round(b[k])+'%';
    }
  }
});
document.addEventListener('change',async event=>{
  const t=event.target;
  if(t.dataset.upload&&t.files?.[0])await assignImage(t.files[0],t.dataset.upload);
  if(t.id==='section-upload' && t.files?.length) {
    const current=activeId;
    try {
      const count=await addFiles(active(),uploadSection,t.files,save,replacementPhotoId);
      if(uploadSection==='applications'){
        const list=ensureGallery(active()).applications;
        selectedApplicationId=replacementPhotoId||list[list.length-1]?.id||'';
      }
      if(activeId===current)render();
      notify('Imagen colocada en el tablero. Puedes moverla y ajustar su tamaño.');
    } catch(e) {notify(e.message||'No se pudieron subir las imágenes.');}
    return;
  }
  if(t.id==='import-file'&&t.files?.[0]){
    try{
      const data=JSON.parse(await t.files[0].text());
      if(data.format!=='the-launch-era-brand-boards'||!Array.isArray(data.brands)||!data.brands.length||data.brands.length>150||!data.brands.every(x=>x.id&&x.name&&Array.isArray(x.colors)&&x.colors.length===6))throw Error();
      if(!confirm('¿Reemplazar los Brand Boards de este dispositivo por los del respaldo?'))return;
      await galleryRestore(data.photos);
      brands=data.brands.map(b=>({...b,site:publishedSite(b)}));activeId=brands[0].id;save();render();notify('Respaldo e imágenes restaurados.');
    }catch(e){notify('Este archivo no es un respaldo válido.');}
  }
});
document.addEventListener('submit',event=>{
  if(event.target.id!=='new-form')return;
  event.preventDefault();const f=new FormData(event.target),name=String(f.get('brandname')||'').trim(),type=String(f.get('brandtype')||TYPES[0]);
  if(!name){notify('Escribe un nombre.');return;}
  $('new-dialog')?.close();addBrand(name,type);
});
document.addEventListener('dragstart', event => {
  const card=event.target.closest('.gallery-photo-card');
  draggedGallery=card?{section:card.dataset.section,id:card.dataset.imageId}:null;
  if (card) card.classList.add('dragging');
});
document.addEventListener('dragend', () => {
  draggedGallery=null;
  document.querySelectorAll('.dragging,.over').forEach(el=>el.classList.remove('dragging','over'));
});
document.addEventListener('dragover',event=>{
  const gallery=event.target.closest('[data-section-drop]');
  if(gallery){event.preventDefault();gallery.classList.add('over');return;}
  const target=event.target.closest('[data-drop]');if(!target)return;
  event.preventDefault();target.classList.add('over');
});
document.addEventListener('dragleave',event=>{
  const target=event.target.closest('[data-drop],[data-section-drop]');
  if(target&&!target.contains(event.relatedTarget))target.classList.remove('over');
});
document.addEventListener('drop',event=>{
  const gallery=event.target.closest('[data-section-drop]');
  if(gallery){
    event.preventDefault();gallery.classList.remove('over');
    const section=gallery.dataset.section,files=event.dataTransfer?.files;
    if(draggedGallery && draggedGallery.section===section){
      const card=event.target.closest('.gallery-photo-card');
      if(card)movePhotoTo(active(),section,draggedGallery.id,card.dataset.imageId,save);
      draggedGallery=null;render();return;
    }
    if(files?.length){
      addFiles(active(),section,files,save).then(count=>{
        render();notify(count+' foto(s) añadidas a '+section+'.');
      }).catch(e=>notify(e.message));
    }
    return;
  }
  const target=event.target.closest('[data-drop]');if(!target)return;
  event.preventDefault();target.classList.remove('over');const file=event.dataTransfer?.files?.[0];
  if(file)assignImage(file,target.dataset.drop);
});
let editorDrag=null;
document.addEventListener('pointerdown',event=>{
 const tile=event.target.closest('.board-application-layer');
 if(!tile||event.target.closest('button')||event.pointerType==='mouse'&&event.button!==0)return;
 const canvas=tile.closest('.board-application-canvas'),rect=canvas?.getBoundingClientRect();
 if(!rect?.width||!rect?.height)return;
 const item=ensureGallery(active()).applications.find(x=>x.id===tile.dataset.applicationId);
 if(!item)return;
 selectedApplicationId=item.id;
 const resize=Boolean(event.target.closest('.board-layer-handle'));
 editorDrag={id:item.id,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,
  left:item.left??0,top:item.top??0,width:item.width??100,height:item.height??100,
  containerWidth:rect.width,containerHeight:rect.height,resize,element:tile};
 tile.setPointerCapture?.(event.pointerId);event.preventDefault();
});
document.addEventListener('pointermove',event=>{
 if(!editorDrag||event.pointerId!==editorDrag.pointerId)return;
 const state=editorDrag,photo=ensureGallery(active()).applications.find(x=>x.id===state.id);
 if(!photo)return;
 const dx=(event.clientX-state.startX)/state.containerWidth*100;
 const dy=(event.clientY-state.startY)/state.containerHeight*100;
 if(state.resize){
  photo.width=clamp(state.width+dx,18,100);
  photo.height=clamp(state.height+dy,18,100);
  state.element.style.width=photo.width+'%';state.element.style.height=photo.height+'%';
 }else{
  photo.left=clamp(state.left+dx,0,100-photo.width);
  photo.top=clamp(state.top+dy,0,100-photo.height);
  state.element.style.left=photo.left+'%';state.element.style.top=photo.top+'%';
 }
});
document.addEventListener('pointerup',event=>{
 if(editorDrag&&editorDrag.pointerId===event.pointerId){
  editorDrag=null;save();preview();
 }
});
document.addEventListener('pointercancel',()=>{if(editorDrag){editorDrag=null;save();}});

let pointerStart=null;
document.addEventListener('pointerdown',event=>{
  const hit=event.target.closest('.art-photo');
  if(!hit||!active().heroPhoto||event.pointerType==='mouse'&&event.button!==0)return;
  pointerStart={x:event.clientX,y:event.clientY,bX:Number(active().imageX||50),bY:Number(active().imageY||50),id:event.pointerId};
  hit.setPointerCapture?.(event.pointerId);
});
document.addEventListener('pointermove',event=>{
  if(!pointerStart||event.pointerId!==pointerStart.id)return;
  if(!event.target.closest('.art-photo')&&!event.target.closest('.art-head'))return;
  const b=active();
  b.imageY=Math.max(0,Math.min(100,pointerStart.bY-(event.clientY-pointerStart.y)*.23));
  b.imageX=Math.max(0,Math.min(100,pointerStart.bX-(event.clientX-pointerStart.x)*.23));
  syncPhoto();
});
document.addEventListener('pointerup',event=>{
  if(pointerStart&&event.pointerId===pointerStart.id){pointerStart=null;save();}
});
document.addEventListener('pointercancel',()=>{pointerStart=null;});
render();
