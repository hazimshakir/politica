/* POLITICA fx.js — landing page motion: headline word reveal, scroll reveals, scroll and pointer parallax.
   Everything here is decoration; the page is fully readable without it. Respects prefers-reduced-motion. */
(function(){
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero=document.querySelector(".hero");
  // 1. Headline: wrap each word so it can animate in one by one (text itself is unchanged)
  var h1=document.querySelector(".hero h1");
  if(h1&&!reduce){
    var n=0;
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var parts=c.textContent.split(/(\s+)/),frag=document.createDocumentFragment();
          parts.forEach(function(p){
            if(!p)return;
            if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(p));return}
            var s=document.createElement("span");s.className="w";s.style.setProperty("--i",n++);s.textContent=p;frag.appendChild(s)});
          node.replaceChild(frag,c)
        }else if(c.nodeType===1&&c.tagName!=="BR")walk(c)})
    })(h1)
  }
  // 2. Reveal on scroll
  var items=document.querySelectorAll(".reveal");
  if(reduce||!("IntersectionObserver" in window)){
    items.forEach(function(e){e.classList.add("in")})
  }else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -6% 0px"});
    items.forEach(function(e){io.observe(e)})
  }
  // 3. Parallax: scroll depth and pointer position drive CSS variables on the hero
  if(reduce||!hero)return;
  var sy=0,ticking=false;
  function onScroll(){
    if(ticking)return;ticking=true;
    requestAnimationFrame(function(){
      var y=window.scrollY||0;
      if(y<window.innerHeight*1.6)hero.style.setProperty("--sy",y.toFixed(1));
      ticking=false})
  }
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
  if(window.matchMedia("(pointer:fine)").matches){
    var tx=0,ty=0,cx=0,cy=0,run=false;
    window.addEventListener("pointermove",function(e){
      tx=(e.clientX/window.innerWidth)*2-1;ty=(e.clientY/window.innerHeight)*2-1;
      window.__politicaPointer={x:tx,y:ty};
      if(!run){run=true;requestAnimationFrame(loop)}
    },{passive:true});
    function loop(){
      cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
      hero.style.setProperty("--mx",cx.toFixed(3));hero.style.setProperty("--my",cy.toFixed(3));
      if(Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002)requestAnimationFrame(loop);else run=false
    }
  }
})();
