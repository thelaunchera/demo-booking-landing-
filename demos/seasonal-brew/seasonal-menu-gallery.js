/* Seasonal Brew · interactive six-flavor menu · local to this demo */
(()=>{
  'use strict';
  const track=document.querySelector('#seasonal-menu-track');
  if(!track)return;
  const cards=[...track.querySelectorAll('.seasonal-menu-card')];
  const products=cards.map(card=>({
    name:card.dataset.menuName,
    priceCents:Number(card.dataset.priceCents),
    image:card.querySelector('img')?.getAttribute('src')||''
  }));
  // The public menu and browser-only order journey share exactly one price source.
  window.TLE_DEMO_PRICE_CATALOGS=window.TLE_DEMO_PRICE_CATALOGS||{};
  window.TLE_DEMO_PRICE_CATALOGS['seasonal-brew']={
    kind:'menu',tone:'#95663b',items:products
  };
  const previous=document.querySelector('[data-seasonal-prev]');
  const next=document.querySelector('[data-seasonal-next]');
  const counter=document.querySelector('[data-seasonal-counter]');
  const viewBag=document.querySelector('[data-seasonal-view-bag]');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let active=0;
  function nearest(){
    let closest=0,distance=Infinity;
    cards.forEach((card,index)=>{
      const gap=Math.abs(card.offsetLeft-cards[0].offsetLeft-track.scrollLeft);
      if(gap<distance){closest=index;distance=gap;}
    });
    return closest;
  }
  function paint(){
    active=nearest();
    const visible=Math.max(1,Math.round(track.clientWidth/(cards[0]?.getBoundingClientRect().width||1)));
    const end=Math.min(cards.length,active+visible);
    if(counter)counter.textContent=String(active+1).padStart(2,'0')+'–'+String(end).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
    if(previous)previous.disabled=active===0;
    if(next)next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-3;
  }
  function navigate(step){
    const target=Math.max(0,Math.min(cards.length-1,nearest()+step));
    const left=cards[target].offsetLeft-cards[0].offsetLeft;
    track.scrollTo({left,behavior:reduced.matches?'auto':'smooth'});
    active=target;
    requestAnimationFrame(paint);
  }
  previous?.addEventListener('click',()=>navigate(-1));
  next?.addEventListener('click',()=>navigate(1));
  track.addEventListener('scroll',()=>requestAnimationFrame(paint),{passive:true});
  track.addEventListener('keydown',event=>{
    if(event.target!==track)return;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
      event.preventDefault();navigate(event.key==='ArrowRight'?1:-1);
    }
  });
  window.addEventListener('resize',paint,{passive:true});
  track.querySelectorAll('[data-menu-details]').forEach(button=>{
    button.addEventListener('click',()=>{
      const slug=button.dataset.menuDetails;
      document.querySelector('.flavor-card[data-flavor="'+slug+'"]')?.click();
    });
  });
  track.querySelectorAll('[data-menu-add]').forEach(button=>{
    button.addEventListener('click',()=>{
      const order=window.TLE_ORDER;
      const product=button.dataset.menuAdd;
      if(!order?.add){
        // Do not claim an item was added unless the order journey is available.
        const info=document.querySelector('[data-seasonal-status]');
        if(info)info.textContent='The order preview is temporarily unavailable.';
        return;
      }
      if(!order.add(product,1))return;
      const original=button.dataset.originalLabel||button.textContent;
      button.dataset.originalLabel=original;
      button.textContent='Added ✓';
      button.classList.add('is-added');
      const status=document.querySelector('[data-seasonal-status]');
      if(status)status.textContent=product+' added to your bag.';
      clearTimeout(button._seasonalReset);
      button._seasonalReset=setTimeout(()=>{
        if(!button.isConnected)return;
        button.textContent=original;
        button.classList.remove('is-added');
      },1300);
    });
  });
  viewBag?.addEventListener('click',()=>{
    const order=window.TLE_ORDER;
    if(order?.open)order.open('service');
    else {
      const status=document.querySelector('[data-seasonal-status]');
      if(status)status.textContent='The order preview is temporarily unavailable.';
    }
  });
  paint();
})();
