import { animate } from './vendor/motion-mini-12.23.24.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const editorialEase = [0.22, 1, 0.36, 1];

function animateHero() {
  if (reducedMotion.matches || !Element.prototype.animate) return;
  let index = 0;
  for (const line of document.querySelectorAll('[data-letters]')) {
    const words = line.textContent.match(/\S+|\s+/g);
    line.setAttribute('aria-hidden', 'true');
    line.replaceChildren(...words.map(word => {
      if (!word.trim()) return document.createTextNode(word);
      const token = document.createElement('span');
      token.className = 'motion-word';
      for (const character of word) {
        const letter = document.createElement('span');
        letter.textContent = character;
        letter.className = 'motion-letter';
        token.append(letter);
      }
      return token;
    }));
    for (const letter of line.querySelectorAll('.motion-letter')) {
      animate(letter, {
        opacity: [0.28, 1],
        transform: ['translateY(.35em)', 'translateY(0)']
      }, {duration: 0.7, delay: index++ * 0.028, ease: editorialEase});
    }
  }
}

function observeHeadlines() {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const observer = new IntersectionObserver(entries => {
    for (const {isIntersecting, target} of entries) {
      if (!isIntersecting || reducedMotion.matches) continue;
      animate(target, {opacity:[0.68,1], transform:['translateY(16px)','translateY(0)']}, {
        duration: 0.74, ease: editorialEase
      });
    }
  }, {threshold:0.45});
  document.querySelectorAll('[data-title-motion]').forEach(heading => observer.observe(heading));
}

const campaign = document.querySelector('#campaign');
const strip = campaign.querySelector('.film-strip');
const previous = campaign.querySelector('[data-film-step="-1"]');
const next = campaign.querySelector('[data-film-step="1"]');
const dialog = campaign.querySelector('.film-dialog');
const largeImage = dialog.querySelector('img');
const caption = dialog.querySelector('figcaption');

function syncFilmControls() {
  previous.disabled = strip.scrollLeft <= 2;
  next.disabled = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2;
}

campaign.addEventListener('click', event => {
  const step = event.target.closest('[data-film-step]');
  const frame = event.target.closest('[data-frame]');
  if (step) {
    const items = [...strip.children];
    const distance = items[1].offsetLeft - items[0].offsetLeft;
    strip.scrollBy({left:Number(step.dataset.filmStep) * distance, behavior:reducedMotion.matches ? 'instant' : 'smooth'});
  }
  if (frame) {
    const poster = frame.querySelector('img');
    largeImage.src = poster.src;
    largeImage.alt = poster.alt;
    caption.textContent = frame.querySelector('span').textContent.trim();
    dialog.showModal();
  }
});
strip.addEventListener('scroll', syncFilmControls, {passive:true});
window.addEventListener('resize', syncFilmControls);
syncFilmControls();
animateHero();
observeHeadlines();
