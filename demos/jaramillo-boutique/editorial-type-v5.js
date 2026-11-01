
/* Editorial gallery art direction: preserve the whole look; photography stays untouched. */
(() => {
  const labels=['SIGNATURE','DENIM','AFTER DARK','SHAPE','HEELS','SANDALS','BLOUSES','WINTER','SUMMER'];
  const cards=[...document.querySelectorAll('#collectionGrid .collection-item')];
  cards.forEach((tile,i)=>{
    const photo=tile.querySelector('.card-photo');
    const img=photo?.querySelector('img');
    if(!photo||!img)return;
    const url=img.getAttribute('src');
    if(!/^assets\/[\w.-]+\.webp$/.test(url))return;
    tile.dataset.photoShape= [6,7,8].includes(i) ? 'portrait':'landscape';
    photo.dataset.editorial=labels[i]||'JARAMILLO';
    photo.style.setProperty('--look-image','url("'+url+'")');
  });
})();
