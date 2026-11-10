/* Seasonal Brew · single interactive menu with six real flavor cards.
   Product photos are the gallery. Prices come from card data, not duplicate scripts. */
(()=>{
  'use strict';
  const menu=document.querySelector('#seasonal-menu-track');
  if(!menu)return;
  const cards=[...menu.querySelectorAll('.seasonal-menu-card')];
  const items=cards.map(card=>({
    name:card.dataset.menuName,
    priceCents:Number(card.dataset.priceCents),
    image:card.querySelector('img')?.getAttribute('src')||''
  }));
  window.TLE_DEMO_PRICE_CATALOGS=window.TLE_DEMO_PRICE_CATALOGS||{};
  window.TLE_DEMO_PRICE_CATALOGS['seasonal-brew']={
    kind:'menu',tone:'#95663b',items
  };
  const status=document.querySelector('[data-seasonal-status]');
  menu.querySelectorAll('[data-menu-add]').forEach(button=>{
    button.addEventListener('click',()=>{
      const order=window.TLE_ORDER;
      const name=button.dataset.menuAdd;
      const float=document.querySelector('.tle-order-float');
      const prior=float?.querySelector('b')?.textContent;
      if(!order?.add||!order.add(name,1)){
        if(status)status.textContent='The order preview is temporarily unavailable.';
        return;
      }
      const badge=float?.querySelector('b');
      const next=badge?.textContent;
      if(badge&&prior!==undefined){
        badge.textContent=prior;
        const motion=window.TLECartMotion?.flyDot(button,float,{
          badge,color:'#95663B',onLand:()=>{badge.textContent=next;}
        });
        if(!motion)badge.textContent=next;
      }
      const original=button.dataset.originalLabel||button.textContent;
      button.dataset.originalLabel=original;
      button.textContent='Added ✓';
      button.classList.add('is-added');
      if(status)status.textContent=name+' added to your bag.';
      clearTimeout(button._seasonalReset);
      button._seasonalReset=setTimeout(()=>{
        if(!button.isConnected)return;
        button.textContent=original;
        button.classList.remove('is-added');
      },1300);
    });
  });
  document.querySelector('[data-seasonal-view-bag]')?.addEventListener('click',()=>{
    if(window.TLE_ORDER?.open)window.TLE_ORDER.open('cart');
    else if(status)status.textContent='The order preview is temporarily unavailable.';
  });
})();