// Jaramillo Boutique — interactive concept-only look selection, no checkout or inventory.
(() => {
  'use strict';
  const cards = [...document.querySelectorAll('.collection-card')];
  const lightbox = document.querySelector('#lightbox');
  const bagDialog = document.querySelector('#bagDialog');
  const bagTrigger = document.querySelector('#bagTrigger');
  const bagCount = document.querySelector('#bagCount');
  const bagItems = document.querySelector('#bagItems');
  const addButton = document.querySelector('#productAddToBag');
  const sizesNode = document.querySelector('#productSizeChoices');
  const qtyNode = document.querySelector('#productQtyValue');
  if (!cards.length || !bagDialog || !lightbox || !bagTrigger || !addButton || !sizesNode) return;

  const STORAGE_KEY = 'jaramillo-boutique-concept-bag-v1';
  const MAX_PER_VARIANT = 12;
  const UNIT_PRICE = 45;
  const displayPrice = value => '
  const words = {
    en: {
      bag: 'BAG', open: 'Open bag', pieces: 'pieces', yourEdit: 'YOUR EDIT',
      bagTitle: 'Your bag.', bagSubtitle: 'Save the looks you love in one place.',
      productIntro: 'Choose a look to keep in your bag.', sizeLabel: 'Size to ask about',
      sizeNote: 'Size choices are illustrative. Confirm fit and availability in store.',
      ask: 'Ask in store', add: 'ADD TO BAG', choose: 'CHOOSE',
      continue: 'CONTINUE EXPLORING', selected: 'Selected pieces',
      empty: 'Your bag is waiting for a look you love.',
      disclaimer: 'Visual selection only · No purchase, reservation or payment. Sizes and stock are unconfirmed.',
      remove: 'Remove', decrease: 'Decrease', increase: 'Increase',
      itemAdded: 'Added to your bag', collection: 'JARAMILLO / THE COLLECTION',
      qty: 'Quantity', bagList: 'Selected looks', unit: 'piece'
    },
    es: {
      bag: 'BOLSA', open: 'Abrir bolsa', pieces: 'prendas', yourEdit: 'TU SELECCIÓN',
      bagTitle: 'Tu bolsa.', bagSubtitle: 'Guarda aquí los looks que te encantan.',
      productIntro: 'Elige un look para guardarlo en tu bolsa.', sizeLabel: 'Talla que deseas consultar',
      sizeNote: 'Las tallas son ilustrativas. Confirma ajuste y disponibilidad en tienda.',
      ask: 'Consultar', add: 'AÑADIR A LA BOLSA', choose: 'ELEGIR',
      continue: 'SEGUIR EXPLORANDO', selected: 'Prendas seleccionadas',
      empty: 'Tu bolsa está esperando tu próximo look favorito.',
      disclaimer: 'Selección visual · No es compra, reserva ni pago. Tallas y existencias por confirmar.',
      remove: 'Quitar', decrease: 'Disminuir', increase: 'Aumentar',
      itemAdded: 'Añadido a tu bolsa', collection: 'JARAMILLO / LA COLECCIÓN',
      qty: 'Cantidad', bagList: 'Prendas elegidas', unit: 'prenda'
    }
  };
  const locale = () => document.documentElement.lang === 'es' ? 'es' : 'en';
  const w = () => words[locale()];
  const node = id => document.getElementById(id);
  const product = index => {
    const card = cards[index];
    if (!card) return null;
    const image = card.querySelector('img');
    return { index, name: card.dataset[locale() === 'es' ? 'labelEs' : 'labelEn'] || card.dataset.labelEn || '', image: image?.getAttribute('src') || '', group: card.dataset.group };
  };
  const validSizes = ['ASK', 'S', 'M', 'L', 'XL', '6', '7', '8', '9', '10'];
  let selections = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) selections = saved.filter(x =>
      Number.isInteger(x.index) && x.index >= 0 && x.index < cards.length &&
      validSizes.includes(x.size) && Number.isInteger(x.qty) && x.qty >= 1 && x.qty <= MAX_PER_VARIANT
    ).slice(0, 50);
  } catch (_) { selections = []; }
  let selectedIndex = 0;
  let selectedSize = 'ASK';
  let selectedQty = 1;
  const quantity = () => selections.reduce((sum, item) => sum + item.qty, 0);
  const persist = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selections)); } catch (_) {}
  };

  function setText(id, value) { const target = node(id); if (target) target.textContent = value; }
  function sizeText(size) { return size === 'ASK' ? w().ask : size; }
  function labelCount() {
    bagCount.textContent = String(quantity());
    bagTrigger.setAttribute('aria-label', w().open + ', ' + quantity() + ' ' + w().pieces);
    setText('bagPiecesValue', String(quantity()));
  }
  function renderSizes() {
    const choices = product(selectedIndex)?.group === 'shoes' ? ['ASK', '6', '7', '8', '9', '10'] : ['ASK', 'S', 'M', 'L', 'XL'];
    if (!choices.includes(selectedSize)) selectedSize = 'ASK';
    sizesNode.replaceChildren();
    for (const size of choices) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'size-option' + (size === selectedSize ? ' is-selected' : '');
      button.setAttribute('aria-pressed', String(size === selectedSize));
      button.textContent = sizeText(size);
      button.addEventListener('click', () => { selectedSize = size; renderSizes(); });
      sizesNode.append(button);
    }
  }
  function openDetails(index) {
    const item = product(index);
    if (!item) return;
    selectedIndex = index;
    selectedSize = 'ASK';
    selectedQty = 1;
    setText('productTitle', item.name);
    setText('productLead', w().productIntro);
    setText('productUnitPrice', displayPrice(UNIT_PRICE));
    qtyNode.textContent = '1';
    renderSizes();
  }
  cards.forEach((card, index) => card.addEventListener('click', () => openDetails(index)));
  document.querySelectorAll('.quick-add').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.productIndex);
    if (Number.isInteger(index) && cards[index]) cards[index].click();
  }));
  node('productQtyMinus')?.addEventListener('click', () => {
    selectedQty = Math.max(1, selectedQty - 1); qtyNode.textContent = String(selectedQty);
  });
  node('productQtyPlus')?.addEventListener('click', () => {
    selectedQty = Math.min(MAX_PER_VARIANT, selectedQty + 1); qtyNode.textContent = String(selectedQty);
  });

  function adjust(index, size, delta) {
    const existing = selections.find(item => item.index === index && item.size === size);
    if (existing) {
      existing.qty = Math.min(MAX_PER_VARIANT, Math.max(0, existing.qty + delta));
      if (!existing.qty) selections = selections.filter(item => item !== existing);
    } else if (delta > 0) {
      selections.push({index, size, qty: Math.min(MAX_PER_VARIANT, delta)});
    }
    persist();
    renderBag();
  }

  addButton.addEventListener('click', () => {
    adjust(selectedIndex, selectedSize, selectedQty);
    if (lightbox.open) lightbox.close();
    openBag();
  });

  function bagButton(text, description, handler, className = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.setAttribute('aria-label', description);
    button.addEventListener('click', handler);
    return button;
  }

  function renderBag() {
    labelCount();
    setText('bagSubtotal', displayPrice(quantity() * UNIT_PRICE));
    bagItems.replaceChildren();
    if (!selections.length) {
      const empty = document.createElement('div'); empty.className = 'bag-empty';
      const heading = document.createElement('p'); heading.textContent = w().empty;
      const link = bagButton(w().continue, w().continue, () => { bagDialog.close(); node('collections')?.scrollIntoView({behavior:'smooth'}); }, 'bag-empty-link');
      empty.append(heading, link);
      bagItems.append(empty);
      return;
    }
    for (const item of selections) {
      const p = product(item.index);
      if (!p) continue;
      const row = document.createElement('article'); row.className = 'bag-item';
      const photo = document.createElement('img'); photo.src = p.image; photo.alt = ''; photo.loading = 'lazy';
      const content = document.createElement('div'); content.className = 'bag-item-info';
      const name = document.createElement('strong'); name.textContent = p.name;
      const price = document.createElement('small'); price.className='bag-line-price'; price.textContent=displayPrice(UNIT_PRICE) + ' × ' + item.qty + ' = ' + displayPrice(UNIT_PRICE * item.qty);
      const size = document.createElement('small'); size.textContent = w().sizeLabel + ': ' + sizeText(item.size);
      const controls = document.createElement('div'); controls.className = 'bag-item-controls';
      const minus = bagButton('−', w().decrease + ' ' + p.name, () => adjust(item.index, item.size, -1), 'bag-quantity-button');
      const qty = document.createElement('span'); qty.textContent = String(item.qty); qty.className = 'bag-item-quantity';
      const plus = bagButton('+', w().increase + ' ' + p.name, () => adjust(item.index, item.size, 1), 'bag-quantity-button');
      plus.disabled = item.qty >= MAX_PER_VARIANT;
      const remove = bagButton(w().remove, w().remove + ' ' + p.name, () => adjust(item.index, item.size, -item.qty), 'bag-remove');
      controls.append(minus, qty, plus, remove);
      content.append(name, price, size, controls);
      row.append(photo, content);
      bagItems.append(row);
    }
  }

  function openBag() {
    renderBag();
    if (!bagDialog.open) bagDialog.showModal();
  }
  bagTrigger.addEventListener('click', openBag);
  node('bagClose')?.addEventListener('click', () => bagDialog.close());
  node('bagContinue')?.addEventListener('click', () => {
    bagDialog.close();
    node('collections')?.scrollIntoView({behavior:'smooth'});
  });
  bagDialog.addEventListener('click', e => { if (e.target === bagDialog) bagDialog.close(); });
  const observer = new MutationObserver(() => renderLanguage());
  observer.observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  function renderLanguage() {
    setText('bagTriggerLabel', w().bag);
    setText('bagEyebrow', w().yourEdit);
    setText('bagTitle', w().bagTitle);
    setText('bagSubtitle', w().bagSubtitle);
    setText('bagPiecesLabel', w().selected);
    setText('bagContinue', w().continue);
    setText('bagDisclaimer', w().disclaimer);
    setText('productOverline', w().collection);
    setText('productSizeLabel', w().sizeLabel);
    setText('productSizeNote', w().sizeNote);
    setText('productLead', w().productIntro);
    setText('productAddToBag', w().add);
    document.querySelectorAll('.quick-add-word').forEach(x => { x.textContent = w().choose; });
    renderSizes();
    setText('productUnitPrice', displayPrice(UNIT_PRICE));
    if (lightbox.open) setText('productTitle', product(selectedIndex)?.name || '');
    renderBag();
  }
  renderLanguage();
  // All nine products are US$45; the preview bag is not a checkout.
  for (const card of cards) {
    const foot = card.querySelector('.card-foot');
    if (!foot || foot.querySelector('.card-price')) continue;
    const price = document.createElement('strong');
    price.className = 'card-price';
    price.textContent = displayPrice(UNIT_PRICE);
    foot.append(price);
  }
})(); + value.toFixed(2);
  const words = {
    en: {
      bag: 'BAG', open: 'Open bag', pieces: 'pieces', yourEdit: 'YOUR EDIT',
      bagTitle: 'Your bag.', bagSubtitle: 'Save the looks you love in one place.',
      productIntro: 'Choose a look to keep in your bag.', sizeLabel: 'Size to ask about',
      sizeNote: 'Size choices are illustrative. Confirm fit and availability in store.',
      ask: 'Ask in store', add: 'ADD TO BAG', choose: 'CHOOSE',
      continue: 'CONTINUE EXPLORING', selected: 'Selected pieces',
      empty: 'Your bag is waiting for a look you love.',
      disclaimer: 'Visual selection only · No purchase, reservation or payment. Sizes and stock are unconfirmed.',
      remove: 'Remove', decrease: 'Decrease', increase: 'Increase',
      itemAdded: 'Added to your bag', collection: 'JARAMILLO / THE COLLECTION',
      qty: 'Quantity', bagList: 'Selected looks', unit: 'piece'
    },
    es: {
      bag: 'BOLSA', open: 'Abrir bolsa', pieces: 'prendas', yourEdit: 'TU SELECCIÓN',
      bagTitle: 'Tu bolsa.', bagSubtitle: 'Guarda aquí los looks que te encantan.',
      productIntro: 'Elige un look para guardarlo en tu bolsa.', sizeLabel: 'Talla que deseas consultar',
      sizeNote: 'Las tallas son ilustrativas. Confirma ajuste y disponibilidad en tienda.',
      ask: 'Consultar', add: 'AÑADIR A LA BOLSA', choose: 'ELEGIR',
      continue: 'SEGUIR EXPLORANDO', selected: 'Prendas seleccionadas',
      empty: 'Tu bolsa está esperando tu próximo look favorito.',
      disclaimer: 'Selección visual · No es compra, reserva ni pago. Tallas y existencias por confirmar.',
      remove: 'Quitar', decrease: 'Disminuir', increase: 'Aumentar',
      itemAdded: 'Añadido a tu bolsa', collection: 'JARAMILLO / LA COLECCIÓN',
      qty: 'Cantidad', bagList: 'Prendas elegidas', unit: 'prenda'
    }
  };
  const locale = () => document.documentElement.lang === 'es' ? 'es' : 'en';
  const w = () => words[locale()];
  const node = id => document.getElementById(id);
  const product = index => {
    const card = cards[index];
    if (!card) return null;
    const image = card.querySelector('img');
    return { index, name: card.dataset[locale() === 'es' ? 'labelEs' : 'labelEn'] || card.dataset.labelEn || '', image: image?.getAttribute('src') || '', group: card.dataset.group };
  };
  const validSizes = ['ASK', 'S', 'M', 'L', 'XL', '6', '7', '8', '9', '10'];
  let selections = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) selections = saved.filter(x =>
      Number.isInteger(x.index) && x.index >= 0 && x.index < cards.length &&
      validSizes.includes(x.size) && Number.isInteger(x.qty) && x.qty >= 1 && x.qty <= MAX_PER_VARIANT
    ).slice(0, 50);
  } catch (_) { selections = []; }
  let selectedIndex = 0;
  let selectedSize = 'ASK';
  let selectedQty = 1;
  const quantity = () => selections.reduce((sum, item) => sum + item.qty, 0);
  const persist = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selections)); } catch (_) {}
  };

  function setText(id, value) { const target = node(id); if (target) target.textContent = value; }
  function sizeText(size) { return size === 'ASK' ? w().ask : size; }
  function labelCount() {
    bagCount.textContent = String(quantity());
    bagTrigger.setAttribute('aria-label', w().open + ', ' + quantity() + ' ' + w().pieces);
    setText('bagPiecesValue', String(quantity()));
  }
  function renderSizes() {
    const choices = product(selectedIndex)?.group === 'shoes' ? ['ASK', '6', '7', '8', '9', '10'] : ['ASK', 'S', 'M', 'L', 'XL'];
    if (!choices.includes(selectedSize)) selectedSize = 'ASK';
    sizesNode.replaceChildren();
    for (const size of choices) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'size-option' + (size === selectedSize ? ' is-selected' : '');
      button.setAttribute('aria-pressed', String(size === selectedSize));
      button.textContent = sizeText(size);
      button.addEventListener('click', () => { selectedSize = size; renderSizes(); });
      sizesNode.append(button);
    }
  }
  function openDetails(index) {
    const item = product(index);
    if (!item) return;
    selectedIndex = index;
    selectedSize = 'ASK';
    selectedQty = 1;
    setText('productTitle', item.name);
    setText('productLead', w().productIntro);
    qtyNode.textContent = '1';
    renderSizes();
  }
  cards.forEach((card, index) => card.addEventListener('click', () => openDetails(index)));
  document.querySelectorAll('.quick-add').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.productIndex);
    if (Number.isInteger(index) && cards[index]) cards[index].click();
  }));
  node('productQtyMinus')?.addEventListener('click', () => {
    selectedQty = Math.max(1, selectedQty - 1); qtyNode.textContent = String(selectedQty);
  });
  node('productQtyPlus')?.addEventListener('click', () => {
    selectedQty = Math.min(MAX_PER_VARIANT, selectedQty + 1); qtyNode.textContent = String(selectedQty);
  });

  function adjust(index, size, delta) {
    const existing = selections.find(item => item.index === index && item.size === size);
    if (existing) {
      existing.qty = Math.min(MAX_PER_VARIANT, Math.max(0, existing.qty + delta));
      if (!existing.qty) selections = selections.filter(item => item !== existing);
    } else if (delta > 0) {
      selections.push({index, size, qty: Math.min(MAX_PER_VARIANT, delta)});
    }
    persist();
    renderBag();
  }

  addButton.addEventListener('click', () => {
    adjust(selectedIndex, selectedSize, selectedQty);
    if (lightbox.open) lightbox.close();
    openBag();
  });

  function bagButton(text, description, handler, className = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.setAttribute('aria-label', description);
    button.addEventListener('click', handler);
    return button;
  }

  function renderBag() {
    labelCount();
    bagItems.replaceChildren();
    if (!selections.length) {
      const empty = document.createElement('div'); empty.className = 'bag-empty';
      const heading = document.createElement('p'); heading.textContent = w().empty;
      const link = bagButton(w().continue, w().continue, () => { bagDialog.close(); node('collections')?.scrollIntoView({behavior:'smooth'}); }, 'bag-empty-link');
      empty.append(heading, link);
      bagItems.append(empty);
      return;
    }
    for (const item of selections) {
      const p = product(item.index);
      if (!p) continue;
      const row = document.createElement('article'); row.className = 'bag-item';
      const photo = document.createElement('img'); photo.src = p.image; photo.alt = ''; photo.loading = 'lazy';
      const content = document.createElement('div'); content.className = 'bag-item-info';
      const name = document.createElement('strong'); name.textContent = p.name;
      const size = document.createElement('small'); size.textContent = w().sizeLabel + ': ' + sizeText(item.size);
      const controls = document.createElement('div'); controls.className = 'bag-item-controls';
      const minus = bagButton('−', w().decrease + ' ' + p.name, () => adjust(item.index, item.size, -1), 'bag-quantity-button');
      const qty = document.createElement('span'); qty.textContent = String(item.qty); qty.className = 'bag-item-quantity';
      const plus = bagButton('+', w().increase + ' ' + p.name, () => adjust(item.index, item.size, 1), 'bag-quantity-button');
      plus.disabled = item.qty >= MAX_PER_VARIANT;
      const remove = bagButton(w().remove, w().remove + ' ' + p.name, () => adjust(item.index, item.size, -item.qty), 'bag-remove');
      controls.append(minus, qty, plus, remove);
      content.append(name, size, controls);
      row.append(photo, content);
      bagItems.append(row);
    }
  }

  function openBag() {
    renderBag();
    if (!bagDialog.open) bagDialog.showModal();
  }
  bagTrigger.addEventListener('click', openBag);
  node('bagClose')?.addEventListener('click', () => bagDialog.close());
  node('bagContinue')?.addEventListener('click', () => {
    bagDialog.close();
    node('collections')?.scrollIntoView({behavior:'smooth'});
  });
  bagDialog.addEventListener('click', e => { if (e.target === bagDialog) bagDialog.close(); });
  const observer = new MutationObserver(() => renderLanguage());
  observer.observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  function renderLanguage() {
    setText('bagTriggerLabel', w().bag);
    setText('bagEyebrow', w().yourEdit);
    setText('bagTitle', w().bagTitle);
    setText('bagSubtitle', w().bagSubtitle);
    setText('bagPiecesLabel', w().selected);
    setText('bagContinue', w().continue);
    setText('bagDisclaimer', w().disclaimer);
    setText('productOverline', w().collection);
    setText('productSizeLabel', w().sizeLabel);
    setText('productSizeNote', w().sizeNote);
    setText('productLead', w().productIntro);
    setText('productAddToBag', w().add);
    document.querySelectorAll('.quick-add-word').forEach(x => { x.textContent = w().choose; });
    renderSizes();
    if (lightbox.open) setText('productTitle', product(selectedIndex)?.name || '');
    renderBag();
  }
  renderLanguage();
})();