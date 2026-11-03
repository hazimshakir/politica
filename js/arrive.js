/* POLITICA arrive.js — assessment page: if we arrived through the home-page transition, fade the overlay away. */
(function(){
  var h=document.documentElement;if(!h.classList.contains("arrive"))return;
  function out(){requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add("arrive-out");setTimeout(function(){h.classList.remove("arrive","arrive-out")},650)})})}
  if(document.readyState==="complete")setTimeout(out,120);else window.addEventListener("load",function(){setTimeout(out,120)});
  setTimeout(function(){h.classList.remove("arrive","arrive-out")},4000)
})();
