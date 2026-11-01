(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroCopy = [
    { title: 'Your daily<br><em>happy place.</em>', summary: 'Really good coffee, little bakery treats and sweet moments worth coming back for.' },
    { title: 'Good days<br><em>start here.</em>', summary: 'Your favorite sip, served with a little extra happy.' },
    { title: 'Sweet things.<br><em>To take home.</em>', summary: 'Cookies, pastries and beautiful little boxes, ready for your next moment.' }
  ];
  const slides = $$('.hero-slide');
  const dots = $$('[data-hero]');
  let current = 0;
  let slideshow;
  const showSlide = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-current', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-pressed', String(i === current));
    });
    $('#heroTitle').innerHTML = heroCopy[current].title;
    $('#heroSummary').textContent = heroCopy[current].summary;
    $('#slideNumber').textContent = String(current + 1).padStart(2, '0');
  };
  const pauseSlides = () => { if (slideshow) clearInterval(slideshow); };
  const startSlides = () => {
    pauseSlides();
    if (!reducedMotion) slideshow = setInterval(() => showSlide(current + 1), 6500);
  };
  dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.hero)); startSlides(); }));
  const hero = $('.hero');
  hero.addEventListener('mouseenter', pauseSlides);
  hero.addEventListener('mouseleave', startSlides);
  hero.addEventListener('focusin', pauseSlides);
  hero.addEventListener('focusout', startSlides);
  document.addEventListener('visibilitychange', () => document.hidden ? pauseSlides() : startSlides());
  let touchX = 0;
  hero.addEventListener('touchstart', event => { touchX = event.changedTouches[0]?.clientX || 0; }, { passive: true });
  hero.addEventListener('touchend', event => {
    const delta = (event.changedTouches[0]?.clientX || 0) - touchX;
    if (Math.abs(delta) > 65) { showSlide(current + (delta < 0 ? 1 : -1)); startSlides(); }
  }, { passive: true });
  startSlides();

  const toggle = $('#menuToggle');
  const nav = $('#mobileNav');
  const closeMenu = () => { nav.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); };
  toggle.addEventListener('click', () => {
    nav.hidden = !nav.hidden;
    toggle.setAttribute('aria-expanded', String(!nav.hidden));
    toggle.setAttribute('aria-label', nav.hidden ? 'Open menu' : 'Close menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); closeDrawer(); } });

  function selectCategory(kind) {
    $$('.filter').forEach(button => {
      const active = button.dataset.category === kind;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $$('.product-card').forEach(card => { card.hidden = kind !== 'all' && card.dataset.kind !== kind; });
  }
  $$('.filter').forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.category)));
  $$('[data-select-category]').forEach(link => link.addEventListener('click', () => selectCategory(link.dataset.selectCategory)));

  // The drawer uses the exact same catalog and image references as the main counter.
  const catalog = $('.product-card').map(card => ({
    name: card.dataset.product,
    image: card.dataset.image,
    kind: card.dataset.kind
  }));
  const drawerCatalog = $('#drawerProducts');
  const drawerTabs = $('[data-drawer-category]');
  let drawerCategory = 'all';
  function renderDrawerCatalog() {
    drawerCatalog.replaceChildren();
    catalog.filter(item => drawerCategory === 'all' || item.kind === drawerCategory).forEach(item => {
      const tile = document.createElement('article'); tile.className = 'drawer-product';
      const image = document.createElement('img');
      image.src = './images/' + item.image; image.alt = ''; image.loading = 'lazy';
      const details = document.createElement('div'); details.className = 'drawer-product-detail';
      const category = document.createElement('small'); category.textContent = item.kind === 'bakery' ? 'BAKERY & SWEETS' : item.kind.toUpperCase();
      const name = document.createElement('strong'); name.textContent = item.name;
      const add = document.createElement('button'); add.type = 'button'; add.className = 'drawer-product-add';
      const selected = box.find(entry => entry.name === item.name);
      add.textContent = selected ? '+ Add more (' + selected.qty + ')' : '+ Add';
      add.setAttribute('aria-label', 'Add ' + item.name + ' to your box');
      add.addEventListener('click', () => addProduct(item.name, item.image, false));
      details.append(category, name, add);
      tile.append(image, details);
      drawerCatalog.append(tile);
    });
  }
  drawerTabs.forEach(tab => tab.addEventListener('click', () => {
    drawerCategory = tab.dataset.drawerCategory;
    drawerTabs.forEach(candidate => {
      const active = candidate === tab;
      candidate.classList.toggle('is-active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });
    renderDrawerCatalog();
  }));

  let box = [];
  try {
    const stored = JSON.parse(sessionStorage.getItem('yummm-demo-box') || '[]');
    if (Array.isArray(stored)) box = stored.filter(x => typeof x.name === 'string' && typeof x.image === 'string' && Number.isInteger(x.qty) && x.qty > 0).slice(0, 30);
  } catch (_) { box = []; }
  const saveBox = () => { try { sessionStorage.setItem('yummm-demo-box', JSON.stringify(box)); } catch (_) {} };
  const countBox = () => box.reduce((sum, item) => sum + item.qty, 0);
  const itemRows = $('#boxItems');
  const renderBox = () => {
    $('#boxCount').textContent = String(countBox());
    $('#drawerPickCount').textContent = String(countBox());
    renderDrawerCatalog();
    $('#drawerSummary').textContent = `${countBox()} ${countBox() === 1 ? 'treat' : 'treats'} selected`;
    $('#previewBox').disabled = countBox() === 0;
    if (!box.length) { itemRows.innerHTML = '<p class="empty-box">Choose a treat above to start your box.</p>'; return; }
    itemRows.replaceChildren();
    box.forEach((item, index) => {
      const row = document.createElement('div'); row.className = 'box-row';
      const image = document.createElement('img'); image.src = `./images/${item.image}`; image.alt = '';
      const text = document.createElement('div');
      const strong = document.createElement('strong'); strong.textContent = item.name;
      const small = document.createElement('small'); small.textContent = 'YUMMM favorite';
      text.append(strong, small);
      const qty = document.createElement('div'); qty.className = 'box-qty';
      const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', `Remove one ${item.name}`);
      minus.addEventListener('click', () => changeQty(index, -1));
      const total = document.createElement('span'); total.textContent = String(item.qty);
      const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', `Add one ${item.name}`);
      plus.addEventListener('click', () => changeQty(index, 1));
      qty.append(minus, total, plus);
      row.append(image, text, qty);
      itemRows.append(row);
    });
  };
  const changeQty = (index, amount) => {
    if (!box[index]) return;
    box[index].qty = Math.min(24, box[index].qty + amount);
    if (box[index].qty < 1) box.splice(index, 1);
    saveBox(); renderBox();
  };
  let previousFocus = null;
  const backdrop = $('#drawerBackdrop');
  const drawer = $('#boxDrawer');
  function openDrawer() {
    previousFocus = document.activeElement;
    backdrop.hidden = false;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    $('#closeBox').focus();
  }
  function closeDrawer() {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    document.body.classList.remove('drawer-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }
  $('#openBox').addEventListener('click', openDrawer);
  $('#buildBox').addEventListener('click', openDrawer);
  $('#closeBox').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  function addProduct(name, image, showDrawer) {
    const existing = box.find(item => item.name === name);
    if (existing) existing.qty = Math.min(24, existing.qty + 1);
    else box.push({ name, image, qty: 1 });
    saveBox(); renderBox();
    if (showDrawer) openDrawer();
  }
  $('.choose-item').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    if (card) addProduct(card.dataset.product, card.dataset.image, true);
  }));
  renderBox();
  const preview = $('#previewDialog');
  $('#previewBox').addEventListener('click', () => {
    if (countBox() === 0) return;
    const selected = document.querySelector('input[name="packaging"]:checked')?.value || 'Just for me';
    const list = box.map(item => `${item.qty} × ${item.name}`).join(', ');
    $('#previewContents').textContent = `${selected} · ${list}`;
    closeDrawer(); preview.showModal();
  });
  $('#closePreview').addEventListener('click', () => preview.close());
  $('#backToMenu').addEventListener('click', () => preview.close());
  preview.addEventListener('click', event => { if (event.target === preview) preview.close(); });
})();