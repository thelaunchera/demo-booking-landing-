/* Native inline hero video is independent of YUMMM's rotating text.
   Keep it playing when the page is foregrounded, with a matching poster. */
(()=>{"use strict";
 const video=document.querySelector(".yummm-motion-video");
 if(!video)return;
 const reduce=matchMedia("(prefers-reduced-motion: reduce)");
 const dataSaver=Boolean(navigator.connection?.saveData);
 const shouldPlay=()=>!document.hidden&&!reduce.matches&&!dataSaver;
 function reveal(){
  const ready=()=>{if(shouldPlay()&&!video.paused&&video.readyState>=2)video.classList.add("is-playing");};
  if(typeof video.requestVideoFrameCallback==="function")video.requestVideoFrameCallback(ready);
  else requestAnimationFrame(()=>requestAnimationFrame(ready));
 }
 function resume(){
  if(!shouldPlay()){video.pause();video.classList.remove("is-playing");return;}
  video.muted=true;video.defaultMuted=true;video.loop=true;
  const p=video.play();
  if(p?.catch)p.catch(()=>video.classList.remove("is-playing"));
 }
 video.addEventListener("playing",reveal);
 video.addEventListener("loadeddata",reveal);
 video.addEventListener("canplay",()=>{if(shouldPlay()&&video.paused)resume();});
 video.addEventListener("ended",()=>{video.currentTime=0;resume();});
 video.addEventListener("error",()=>video.classList.remove("is-playing"));
 document.addEventListener("visibilitychange",resume);
 window.addEventListener("pageshow",resume);
 reduce.addEventListener?.("change",resume);
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",resume,{once:true});
 else resume();
})();
