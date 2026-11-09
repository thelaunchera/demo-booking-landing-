/* YUMMM hero: play the approved video only in the opening scene.
   Slides 2 and 3 are the original static storefront and takeaway photography. */
(()=>{"use strict";
 const video=document.querySelector(".yummm-motion-video");
 if(!video)return;
 const opening=video.closest(".hero-slide");
 if(!opening)return;
 const reduce=matchMedia("(prefers-reduced-motion: reduce)");
 const dataSaver=Boolean(navigator.connection?.saveData);
 const active=()=>opening.classList.contains("is-current");
 const shouldPlay=()=>active()&&!document.hidden&&!reduce.matches&&!dataSaver;
 let wasActive=active();
 function reveal(){
  const ready=()=>{
   if(shouldPlay()&&!video.paused&&video.readyState>=2)video.classList.add("is-playing");
  };
  if(typeof video.requestVideoFrameCallback==="function")video.requestVideoFrameCallback(ready);
  else requestAnimationFrame(()=>requestAnimationFrame(ready));
 }
 function sync(){
  const nowActive=active();
  if(!shouldPlay()){
   video.pause();
   video.classList.remove("is-playing");
   wasActive=nowActive;
   return;
  }
  if(nowActive&&!wasActive){
   try{video.currentTime=0;}catch(_){}
   video.classList.remove("is-playing");
  }
  wasActive=nowActive;
  video.muted=true;
  video.defaultMuted=true;
  video.loop=true;
  const result=video.play();
  if(result?.then)result.then(reveal).catch(()=>video.classList.remove("is-playing"));
  else reveal();
 }
 // The existing carousel changes is-current on the three slides.
 // Observe that state instead of allowing a permanent video overlay.
 new MutationObserver(sync).observe(opening,{attributes:true,attributeFilter:["class"]});
 video.addEventListener("playing",reveal);
 video.addEventListener("loadeddata",reveal);
 video.addEventListener("error",()=>video.classList.remove("is-playing"));
 document.addEventListener("visibilitychange",sync);
 window.addEventListener("pageshow",sync);
 window.addEventListener("pagehide",()=>video.pause());
 reduce.addEventListener?.("change",sync);
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});
 else sync();
})();
