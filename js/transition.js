/* POLITICA transition.js — home page: a short (~1.5 s) full-screen network/globe overlay before opening the assessment.
   Skipped entirely for reduced-motion or data-saver visitors, modified clicks (new tab) and when JavaScript is off:
   in all those cases the normal link simply works. Click, tap or any key during the animation skips ahead. */
(function(){
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var save=navigator.connection&&navigator.connection.saveData;
  if(reduce||save)return;
  var links=document.querySelectorAll('a[href="assessment.html"]'),busy=false,done=false,overlay=null,raf=0;
  var DURATION=1500;
  function prefetch(){
    if(prefetch.on)return;prefetch.on=true;
    ["assessment.html","css/assessment.css","js/storage.js","js/render.js","js/app.js","js/arrive.js"].forEach(function(h){var l=document.createElement("link");l.rel="prefetch";l.href=h;document.head.appendChild(l)})
  }
  links.forEach(function(a){
    a.addEventListener("pointerenter",prefetch,{once:true});a.addEventListener("focus",prefetch,{once:true});a.addEventListener("touchstart",prefetch,{once:true,passive:true});
    a.addEventListener("click",function(e){
      if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      if(a.target&&a.target!=="_self")return;
      e.preventDefault();if(busy)return;busy=true;
      try{start(a.href)}catch(err){go(a.href)}
    })
  });
  function go(url){if(done)return;done=true;cancelAnimationFrame(raf);window.location.href=url}
  function start(url){
    prefetch();
    try{sessionStorage.setItem("politica.tx","1")}catch(e){}
    window.dispatchEvent(new Event("politica:pause"));
    document.documentElement.classList.add("tx-lock");
    overlay=document.createElement("div");overlay.className="tx";overlay.setAttribute("aria-hidden","true");
    overlay.innerHTML='<canvas></canvas><div class="tx-center"><svg class="tx-emblem" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" pathLength="1"/><ellipse cx="100" cy="100" rx="36" ry="90" pathLength="1"/><ellipse cx="100" cy="100" rx="68" ry="90" pathLength="1"/><path d="M10 100h180M22 60h156M22 140h156" pathLength="1"/></svg><div class="tx-word">POLI<span>T</span>ICA</div><div class="tx-sub">Understand your political thinking</div></div>';
    document.body.appendChild(overlay);
    var live=document.createElement("div");live.className="sr-only";live.setAttribute("role","status");live.textContent="Opening the assessment…";document.body.appendChild(live);
    overlay.getBoundingClientRect();overlay.classList.add("run");
    sweep(overlay.querySelector("canvas"));
    var skip=function(){go(url)};
    overlay.addEventListener("click",skip);window.addEventListener("keydown",skip,{once:true});
    setTimeout(function(){go(url)},DURATION)
  }
  // network sweep: a field of nodes lights up as a bright front crosses the screen
  function sweep(cv){
    var dpr=Math.min(window.devicePixelRatio||1,1.5),W=cv.width=Math.round(innerWidth*dpr),H=cv.height=Math.round(innerHeight*dpr),c=cv.getContext("2d");
    var seed=11;function rnd(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296}
    var N=innerWidth<700?38:72,nodes=[],i,j;
    for(i=0;i<N;i++)nodes.push({x:rnd()*W,y:rnd()*H,r:(.8+rnd()*1.6)*dpr});
    var edges=[];
    nodes.forEach(function(a,ia){var ds=nodes.map(function(b,ib){return[ib,(a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)]}).sort(function(p,q){return p[1]-q[1]});
      for(var k=1;k<=2;k++)edges.push([ia,ds[k][0]])});
    var t0=performance.now(),band=W*.22;
    (function frame(now){
      var t=Math.min(1,(now-t0)/1150),front=(t*1.35-.12)*W;
      c.clearRect(0,0,W,H);
      function lit(x){return Math.max(0,Math.min(1,(front-x)/band+.15))}
      c.lineWidth=dpr;
      edges.forEach(function(e){var a=nodes[e[0]],b=nodes[e[1]],l=Math.min(lit(a.x),lit(b.x));if(l>0){c.strokeStyle="rgba(127,214,200,"+(.32*l).toFixed(3)+")";c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()}});
      nodes.forEach(function(n){var l=lit(n.x);if(l>0){c.fillStyle="rgba(190,240,232,"+(.15+.75*l).toFixed(3)+")";c.beginPath();c.arc(n.x,n.y,n.r*(1+.9*(1-Math.abs(front-n.x)/band>0?Math.max(0,1-Math.abs(front-n.x)/band):0)),0,7);c.fill()}});
      var g=c.createLinearGradient(front-band*.45,0,front,0);g.addColorStop(0,"rgba(127,214,200,0)");g.addColorStop(1,"rgba(127,214,200,.09)");c.fillStyle=g;c.fillRect(front-band*.45,0,band*.45,H);c.fillStyle="rgba(190,245,235,.55)";c.fillRect(front,0,Math.max(1,dpr),H);
      raf=requestAnimationFrame(frame)
    })(t0)
  }
  // coming back with the browser's Back button: remove the overlay and wake the globe up again
  window.addEventListener("pageshow",function(e){
    var o=document.querySelector(".tx");if(o)o.remove();
    document.documentElement.classList.remove("tx-lock");busy=false;done=false;
    window.dispatchEvent(new Event("politica:resume"))
  })
})();
