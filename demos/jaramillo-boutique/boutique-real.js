/* Jaramillo Boutique. No unverified contact address, order, or submission is implied. */
(() => {
  'use strict';
  const isES = () => document.documentElement.lang === 'es';
  async function copyText(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch (_) {}
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.cssText = 'position:fixed;opacity:0;left:-9999px;top:0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    textarea.remove();
    return copied;
  }
  async function shareText(text, title) {
    if (navigator.share) {
      try {
        await navigator.share({title, text});
        return 'shared';
      } catch (error) {
        if (error && error.name === 'AbortError') return 'cancelled';
      }
    }
    return (await copyText(text)) ? 'copied' : 'failed';
  }
  function statusMessage(type) {
    if (isES()) {
      if (type === 'shared') return 'Selección compartida mediante la aplicación elegida. Confirma con la boutique que la recibió.';
      if (type === 'copied') return 'Mensaje copiado. Pégalo y envíalo a la boutique desde tu aplicación preferida.';
      if (type === 'failed') return 'No se pudo copiar automáticamente. Intenta desde el menú Compartir del navegador.';
      return '';
    }
    if (type === 'shared') return 'Shared through your chosen app. Please confirm the boutique received it.';
    if (type === 'copied') return 'Message copied. Paste and send it to the boutique through your preferred app.';
    if (type === 'failed') return 'Automatic copying was unavailable. Try the browser Share menu.';
    return '';
  }
  window.JaramilloShare = Object.freeze({shareText, statusMessage});
  const form = document.querySelector('#inquiryForm');
  if (!form) return;
  const status = document.querySelector('#inquiryStatus');
  let submitting = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;
    const city = document.querySelector('#inquiryCity')?.value;
    const inquiry = document.querySelector('#inquiryMessage')?.value.trim().slice(0, 500) || '';
    if (!city || !['Miami','Las Vegas','New York'].includes(city)) {
      document.querySelector('#inquiryCity')?.focus();
      status.textContent = isES() ? 'Selecciona una ciudad para continuar.' : 'Please choose a boutique city.';
      return;
    }
    const text = isES()
      ? ['Consulta sobre Jaramillo Boutique','Ciudad: '+(city === 'New York' ? 'Nueva York' : city),'Me interesan: '+(inquiry || 'Las prendas de la colección'),'¿Podrían confirmarme disponibilidad, tallas y cómo comprar?','Este mensaje es una consulta, no una orden.'].join('\n')
      : ['Jaramillo Boutique style inquiry','City: '+city,'Interested in: '+(inquiry || 'The collection'),'Could you confirm available styles, sizes, and how to purchase?','This is an inquiry, not an order.'].join('\n');
    submitting = true;
    const button = form.querySelector('[type=submit]');
    button.disabled = true;
    try {
      const result = await shareText(text,'Jaramillo Boutique');
      status.textContent = statusMessage(result);
    } finally {
      button.disabled = false;
      submitting = false;
    }
  });
})();
