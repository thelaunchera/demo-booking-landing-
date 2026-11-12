'use strict';

const products = {
  'ruby-08': {name:'Ruby 08', type:'Velvet matte lipstick', group:'lips', price:28, note:'A deep ruby red with a velvet matte finish. The angled bullet lets you trace the cupid’s bow before filling in.', images:[['ruby-08','Product','Ruby 08 lipstick and its black-cherry cap'],['ruby-on-lips','On lips','Ruby 08 lipstick worn on deep brown skin'],['ruby-swatches','On skin','Ruby 08 swatched on three skin tones']]},
  'night-trace': {name:'Night Trace', type:'Lip pencil', group:'lips', price:19, note:'A garnet lip pencil for adding definition around Ruby 08 or softly blending the edges of a red lip.', images:[['night-trace','Product','Night Trace lip pencil with a garnet stroke']]},
  'eclipse-quad': {name:'Eclipse Quad', type:'Eyeshadow palette', group:'eyes', price:44, note:'Champagne shimmer, dusty rose, matte garnet, and charcoal for an eye look that gets deeper after dark.', images:[['eclipse-quad','Product','Open Eclipse Quad with four eyeshadow shades']]},
  'blood-rose': {name:'Blood Rose', type:'Pressed powder blush', group:'face', price:32, note:'A deep muted rose pressed powder for a soft flush across the cheekbones.', images:[['blood-rose','Product','Open Blood Rose compact with rose pressed powder']]}
};
const productDetails = {
  'ruby-08': {facts:[['Shade','Deep ruby red'],['Finish','Velvet matte']], pair:'night-trace'},
  'night-trace': {facts:[['Shade','Garnet'],['Format','Sharpenable pencil']], pair:'ruby-08'},
  'eclipse-quad': {facts:[['Shades','Champagne, garnet, rose and charcoal'],['Finish','Matte, satin and shimmer']]},
  'blood-rose': {facts:[['Shade','Muted rose'],['Format','Pressed powder']]}
};
const tones = {
  'ruby-08': {color:'#8e1935', label:'Ruby 08 · Deep ruby'},
  'night-trace': {color:'#61203a', label:'Garnet lip pencil'},
  'eclipse-quad': {color:'#a16e79', label:'Four-shade eye palette'},
  'blood-rose': {color:'#ae5c73', label:'Muted rose blush'}
};
const keys = Object.keys(products);
const storageKey = 'velmora-store-v1';
const wishlistPage = document.body.dataset.page === 'wishlist';
const grid = document.querySelector('[data-products]');
const currency = new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'});
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const icons = {
  heart:'<path d="M20.8 4.6a5.3 5.3 0 0 0-7.5 0L12 5.9l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5l1.3 1.3L12 21l7.5-7.6 1.3-1.3a5.3 5.3 0 0 0 0-7.5z"/>',
  bag:'<path d="M5 8h14l2 13H3L5 8zM9 9V6a3 3 0 0 1 6 0v3"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>'
};
const svg = name => `<svg aria-hidden="true" viewBox="0 0 24 24">${icons[name]}</svg>`;
const image = ([file,,alt]) => `<img src="media/${file}.webp" width="900" height="1125" loading="lazy" alt="${alt}">`;

function readState() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
  return {
    cart: Object.fromEntries(keys.filter(id => Number.isSafeInteger(saved?.cart?.[id]) && saved.cart[id] > 0).map(id => [id,Math.min(saved.cart[id],99)])),
    wishes: new Set(Array.isArray(saved?.wishes) ? saved.wishes.filter(id => keys.includes(id)) : [])
  };
}
let {cart,wishes} = readState();
let filter = 'all';
let pendingFlights = 0;

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify({cart,wishes:[...wishes]})); } catch {}
}
document.querySelector('[data-tools]').innerHTML = `
  <a href="wishlist.html" class="icon" id="wish-link" aria-label="Wishlist"${wishlistPage ? ' aria-current="page"' : ''}>${svg('heart')}<span class="badge" hidden></span></a>
  <button class="icon" id="bag-trigger" type="button" aria-label="Shopping bag">${svg('bag')}<span class="badge" hidden></span></button>`;
document.body.insertAdjacentHTML('beforeend', `
  <dialog class="product-dialog" id="product-dialog" aria-labelledby="product-title"><button type="button" class="icon close" data-close aria-label="Close product">${svg('close')}</button><div id="product-body"></div></dialog>
  <dialog class="bag" id="bag-dialog" aria-labelledby="bag-title"><button type="button" class="icon close" data-close aria-label="Close shopping bag">${svg('close')}</button><div id="bag-body"></div></dialog>
  <div id="status" class="sr-only" role="status" aria-live="polite"></div>`);
const status = document.querySelector('#status');
const bagTrigger = document.querySelector('#bag-trigger');
const wishLink = document.querySelector('#wish-link');
const bagDialog = document.querySelector('#bag-dialog');
const productDialog = document.querySelector('#product-dialog');
const bagBody = document.querySelector('#bag-body');
const productBody = document.querySelector('#product-body');

function setBadge(button, label, count) {
  const badge = button.querySelector('.badge');
  badge.hidden = !count;
  badge.textContent = count;
  button.setAttribute('aria-label', `${label}, ${count} ${count === 1 ? 'item' : 'items'}`);
}
function updateBagCount() {
  const count = Object.values(cart).reduce((sum,qty) => sum + qty,0);
  setBadge(bagTrigger, 'Shopping bag', count);
}
function updateWishCount() {
  setBadge(wishLink, 'Wishlist', wishes.size);
  wishLink.dataset.active = wishes.size > 0;
  if (wishlistPage) {
    document.querySelector('[data-wish-count]').textContent = `(${wishes.size})`;
    document.querySelector('[data-wish-empty]').hidden = wishes.size > 0;
  }
}
function renderGrid() {
  const ids = keys.filter(id => wishlistPage ? wishes.has(id) : filter === 'all' || products[id].group === filter);
  grid.innerHTML = ids.map(id => {
    const p = products[id];
    const tone = tones[id];
    return `<article class="card" data-card="${id}">
      <button class="photo" type="button" data-product="${id}" aria-label="View ${p.name}">${image(p.images[0])}</button>
      <button class="icon save" type="button" data-save="${id}" aria-label="${wishlistPage ? 'Remove' : 'Save'} ${p.name}${wishlistPage ? ' from wishlist' : ' to wishlist'}" aria-pressed="${wishes.has(id)}">${svg(wishlistPage ? 'close' : 'heart')}</button>
      <div class="card-info"><p class="eyebrow">${p.type}</p><h3><button type="button" data-product="${id}">${p.name}</button></h3>
      <p>${currency.format(p.price)}</p><div class="product-tone"><span class="tone-dot" style="background:${tone.color}" aria-hidden="true"></span><span>${tone.label}</span></div><button class="button" type="button" data-${wishlistPage ? 'move' : 'add'}="${id}">${wishlistPage ? 'Move to bag' : 'Add to bag'}</button></div>
    </article>`;
  }).join('');
  const results = document.querySelector('[data-results-count]');
  if (results) results.textContent = filter === 'all' ? 'Showing all four essentials' : `Showing ${ids.length} ${filter === 'lips' ? 'lip essentials' : filter === 'eyes' ? 'eye essential' : 'face essential'}`;
}
function openProduct(id) {
  const p = products[id];
  const {facts, pair} = productDetails[id];
  const companion = products[pair];
  const tone = tones[id];
  productBody.innerHTML = `<div class="detail">
    <div class="detail-media"><div data-detail-image>${image(p.images[0])}</div>
      ${p.images.length > 1 ? `<div class="thumbs" aria-label="Product gallery">${p.images.map((img,i) => `<button type="button" data-gallery="${i}" data-id="${id}" aria-label="View ${img[1]} photo of ${p.name}" aria-pressed="${i === 0}">${image(img)}<span>${img[1]}</span></button>`).join('')}</div>` : ''}
    </div>
    <div class="detail-copy"><div class="detail-topline"><p class="eyebrow">${p.type} / The after dark edit</p>${wishlistPage ? '' : `<button type="button" class="detail-save" data-save="${id}" aria-label="${wishes.has(id) ? 'Remove from' : 'Save to'} wishlist" aria-pressed="${wishes.has(id)}">${svg('heart')} <span>${wishes.has(id) ? 'Saved' : 'Save'}</span></button>`}</div>
    <h2 id="product-title" tabindex="-1">${p.name}</h2><p>${p.note}</p><p class="detail-price">${currency.format(p.price)} USD</p>
    <div class="detail-tone"><span class="tone-dot" style="background:${tone.color}" aria-hidden="true"></span><span><strong>${tone.label}</strong> · ${facts[1][1]}</span></div>
    <button class="button primary" type="button" data-add="${id}">Add to bag</button>
    <small class="detail-shipping">Available online · Worldwide shipping</small>
    <dl class="detail-facts">${facts.map(([label,value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>
    ${companion ? `<div class="detail-pair">${image(companion.images[0])}<span><small>Complete the lip</small>${companion.name}</span><button class="button" type="button" data-product="${pair}" aria-label="Explore ${companion.name}">View</button></div>` : ''}
    </div>
  </div>`;
  if (!productDialog.open) productDialog.showModal();
  productBody.querySelector('#product-title').focus({preventScroll:true});
  productDialog.scrollTop = 0;
}
async function removeWish(id) {
  if (!wishes.delete(id)) return;
  persist();
  const card = grid.querySelector(`[data-card="${id}"]`);
  if (card && !reducedMotion.matches) {
    card.inert = true;
    await card.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.93)'}],{duration:185,fill:'forwards'}).finished.catch(() => {});
  }
  renderGrid();
  updateWishCount();
  (grid.querySelector('[data-product]') ?? document.querySelector('[data-wish-empty] a')).focus();
}
function flyToBag(origin) {
  if (reducedMotion.matches || productDialog.open || !origin.animate) {
    updateBagCount();
    return;
  }
  pendingFlights++;
  const from = origin.getBoundingClientRect();
  const to = bagTrigger.getBoundingClientRect();
  const start = [from.x + from.width / 2, from.y + from.height / 2];
  const end = [to.x + to.width / 2, to.y + to.height / 2];
  const dot = document.createElement('span');
  dot.className = 'fly';
  document.body.append(dot);
  const position = (x,y,scale) => ({transform:`translate(${x}px,${y}px) scale(${scale})`});
  dot.animate([
    position(...start,1),
    position((start[0]+end[0])/2, Math.min(start[1],end[1])-28, .85),
    position(...end,.35)
  ],{duration:720,easing:'cubic-bezier(.25,.55,.4,1)'}).finished.catch(() => {}).finally(() => {
    dot.remove();
    pendingFlights--;
    if (pendingFlights === 0) updateBagCount();
    bagTrigger.querySelector('.badge').animate([{scale:1},{scale:1.35},{scale:1}],{duration:270});
  });
}
function addToBag(id,origin) {
  if ((cart[id] ?? 0) >= 99) { status.textContent = 'The limit is 99 per product.'; return false; }
  cart[id] = (cart[id] ?? 0) + 1;
  persist();
  status.textContent = `${products[id].name} added to the bag. Quantity ${cart[id]}.`;
  flyToBag(origin);
  return true;
}
const subtotal = () => Object.entries(cart).reduce((sum,[id,qty]) => sum + products[id].price * qty,0);
const bagHeading = title => `<header><p class="eyebrow">VELMORA / After Dark</p><h2 id="bag-title">${title}</h2></header>`;
function renderBag() {
  const items = Object.entries(cart);
  bagBody.innerHTML = bagHeading('Your bag') + (items.length ? `
    ${items.map(([id,qty]) => {
      const p = products[id];
      return `<div class="bag-item">${image(p.images[0])}<div><h3>${p.name}</h3><p>${currency.format(p.price * qty)}</p></div>
        <div class="quantity"><button type="button" data-qty="-1" data-id="${id}" aria-label="Decrease ${p.name} quantity">−</button><span>${qty}</span><button type="button" data-qty="1" data-id="${id}" aria-label="Increase ${p.name} quantity"${qty >= 99 ? ' disabled' : ''}>+</button></div></div>`;
    }).join('')}
    <p class="total"><span>Subtotal</span><strong>${currency.format(subtotal())} USD</strong></p>
    <button type="button" class="button primary" data-checkout>Continue to checkout</button>
    <small>Online only · Worldwide shipping</small>` : '<p>Your bag is empty.</p><a class="button primary" href="./#shop" data-continue>Shop the edit</a>');
}
function renderCheckout() {
  bagBody.innerHTML = bagHeading('Checkout') + `
    <button type="button" class="text-button back" data-back>Back to bag</button>
    <form id="checkout-form">
      <label for="country">Shipping country or territory</label>
      <input id="country" name="country" required maxlength="100" placeholder="e.g. United States">
      <p class="total"><span>Merchandise subtotal</span><strong>${currency.format(subtotal())} USD</strong></p>
      <small>This is a sample checkout. No payment or shipping address is collected.</small>
      <button type="submit" class="button primary">Place sample order</button>
    </form>`;
  document.querySelector('#country').focus();
}
function confirmOrder() {
  const order = String(Date.now()).slice(-6);
  const total = currency.format(subtotal());
  const items = Object.entries(cart).map(([id, qty]) => {
    const product = products[id];
    return `<li data-receipt-line><span>${qty} × ${product.name}</span><strong>${currency.format(product.price * qty)}</strong></li>`;
  }).join('');
  cart = {};
  persist();
  updateBagCount();
  bagBody.innerHTML = `<section data-demo-receipt="velmora">
    <p data-receipt-caption>VELMORA / After Dark</p>
    <h2 id="bag-title" data-receipt-title tabindex="-1">Your sample order is complete.</h2>
    <p>Preview reference <strong>VM-${order}</strong></p>
    <details data-receipt-disclosure>
      <summary>Order details · ${total} USD</summary>
      <ul class="tle-receipt-lines" data-receipt-items>${items}</ul>
    </details>
    <p>No order was placed, no payment was processed, and nothing will ship.</p>
    <a class="button primary" href="./#shop" data-continue>Continue shopping</a>
  </section>`;
  bagBody.querySelector('#bag-title').focus({preventScroll:true});
  window.TLEDemoConfirmation?.play(bagBody.querySelector('[data-demo-receipt]'));
}

document.addEventListener('click', event => {
  const action = event.target.closest('button,[data-continue],[data-category]');
  if (!action) return;
  const d = action.dataset;
  if ('close' in d) action.closest('dialog').close();
  if ('continue' in d) bagDialog.close();
  if ('filter' in d || 'category' in d) {
    filter = d.filter ?? d.category;
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', button.dataset.filter === filter));
    renderGrid();
  }
  if ('product' in d) openProduct(d.product);
  if ('shade' in d) {
    const selected = products['ruby-08'].images[d.shade === 'model' ? 1 : 2];
    const visual = document.querySelector('#shade-image');
    [visual.src,,visual.alt] = ['media/' + selected[0] + '.webp',selected[1],selected[2]];
    document.querySelectorAll('[data-shade]').forEach(button => button.setAttribute('aria-pressed', button === action));
  }
  if ('gallery' in d) {
    productBody.querySelector('[data-detail-image]').innerHTML = image(products[d.id].images[Number(d.gallery)]);
    productBody.querySelectorAll('[data-gallery]').forEach(button => button.setAttribute('aria-pressed', button === action));
  }
  if ('save' in d) {
    const id = d.save;
    if (wishlistPage) removeWish(id);
    else {
      if (!wishes.delete(id)) wishes.add(id);
      persist();
      action.setAttribute('aria-pressed', wishes.has(id));
      if (action.classList.contains('detail-save')) {
        action.querySelector('span').textContent = wishes.has(id) ? 'Saved' : 'Save';
        action.setAttribute('aria-label', wishes.has(id) ? 'Remove from wishlist' : 'Save to wishlist');
      }
      status.textContent = `${products[id].name} ${wishes.has(id) ? 'saved to' : 'removed from'} your wishlist.`;
      renderGrid();
      updateWishCount();
    }
  }
  if ('add' in d && addToBag(d.add,action) && productDialog.open) {
    action.textContent = 'Added to bag';
    clearTimeout(action.resetLabel);
    action.resetLabel = setTimeout(() => { action.textContent = 'Add to bag'; }, 1500);
  }
  if ('move' in d && addToBag(d.move,action)) removeWish(d.move);
  if (action === bagTrigger) {
    updateBagCount();
    renderBag();
    bagDialog.showModal();
  }
  if ('qty' in d) {
    const qty = (cart[d.id] ?? 0) + Number(d.qty);
    if (qty <= 0) delete cart[d.id];
    else cart[d.id] = Math.min(qty,99);
    persist();
    updateBagCount();
    renderBag();
    (bagBody.querySelector(`[data-id="${d.id}"][data-qty="${d.qty}"]:enabled`) ?? bagDialog.querySelector('[data-close]')).focus();
  }
  if ('checkout' in d) renderCheckout();
  if ('back' in d) { renderBag(); bagBody.querySelector('[data-checkout]').focus(); }
});
document.addEventListener('submit', event => {
  if (event.target.id !== 'checkout-form') return;
  event.preventDefault();
  const country = document.querySelector('#country');
  if (!country.value.trim()) {
    country.setCustomValidity('Enter a shipping country or territory.');
    country.reportValidity();
    return;
  }
  if (Object.keys(cart).length) confirmOrder();
});
document.addEventListener('input', event => {
  if (event.target.id === 'country') event.target.setCustomValidity('');
});
document.addEventListener('contextmenu', event => {
  if (event.target instanceof HTMLImageElement) event.preventDefault();
});
document.addEventListener('dragstart', event => {
  if (event.target instanceof HTMLImageElement) event.preventDefault();
});
addEventListener('pageshow', event => {
  if (!event.persisted) return;
  ({cart,wishes} = readState());
  renderGrid();
  updateBagCount();
  updateWishCount();
});
renderGrid();
updateBagCount();
updateWishCount();
