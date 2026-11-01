/* Jaramillo Boutique — varied editorial compositions in both languages. */
(() => {
  const labels={
    en:['SIGNATURE','DENIM','AFTER DARK','SHAPE','HEELS','SANDALS','BLOUSES','WINTER','SUMMER'],
    es:['JARAMILLO','DENIM','DE NOCHE','SILUETA','TACONES','SANDALIAS','BLUSAS','INVIERNO','VERANO']
  };
  const tiles=[...document.querySelectorAll('#collectionGrid .collection-item')];
  tiles.forEach((tile,i)=>{
    const photo=tile.querySelector('.card-photo');
    const img=photo?.querySelector('img');
    if(!photo||!img)return;
    const url=img.getAttribute('src');
    if(!/^assets\/[\w.-]+\.webp$/.test(url))return;
    tile.dataset.photoShape=[6,7,8].includes(i)?'portrait':'landscape';
    photo.style.setProperty('--look-image','url("'+url+'")');
  });
  function updateEditorialWords(){
    const lang=document.documentElement.lang==='es'?'es':'en';
    tiles.forEach((tile,i)=>{
      const photo=tile.querySelector('.card-photo');
      if(photo)photo.dataset.editorial=labels[lang][i]||'JARAMILLO';
    });
  }
  updateEditorialWords();
  new MutationObserver(updateEditorialWords).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();