/* POLITICA globe.js — the hero visual: a dotted globe (land only, no borders), glowing network arcs and a particle field.
   Plain canvas, no libraries. Pauses when off-screen or in a hidden tab. Static when the visitor prefers reduced motion.
   The land mask is a coarse, stylised 2-degree grid: it is decoration, not a map, and shows no country borders. */
(function(){
  var MASK="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAAAAAAP/////wAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAAAAAAAAAAAAAAAAAP8f///4AAAAAAAAAfAAAAAAAAAAAAAAAA///4AAAAAAAAf/wAAAAAAAAAAAwAYAf//wAAAAACB////8AAAAABwAAf4D/gP//wAAAAAAB//////4AAAP////wA/4H/+AAAP+AA//////////4P/////gP+H/gAAAf/z///////////+P/////wH8H+A+AB+/H///////////AP/////gD8B8AAAD9////////////gAf/////gHgA4AAAP5///////////8AAH4H///wH8AAAAAH4///////////4AADgB///8H+AAAAGDx/////////+A8AAAAAf///n/AAAAPCD/////////4A4AAAAAP/////gAAAbn//////////9AwAAAAAH/////wAAAH////////////AAAAAAAD////4AAAAB///////////9AAAAAAAD////8AAAAD///////////8AAAAAAAD////+AAAAB//4fH//////4AAAAAAAD////wAAAAP5vwHP//////jgAAAAAAD////AAAAAfgz//H/////+CAAAAAAAD///8AAAAAfALf/n/////MCAAAAAAAB///8AAAAAOORP/v/////mOAAAAAAAB///8AAAAAH/AA///////k8AAAAAAAAf//4AAAAAP/gB///////hgAAAAAAAAP//wAAAAAf/7////////hAAAAAAAAAP/8wAAAAAf//////////gAAAAAAAAAF/AQAAAAB/////n/////gAAAAAAAAAC/AAAAAAD////f0f////AAAAAAAAAAAeAQAAAAD////f/D///8gAAAAAAAAAAfEMAAAAD////v/B/z/wAAAAAAAAAAAPMBgAAAD////v+A/B+AAAAAAAAAAAAD8AAAAAD////n8AfB/AgAAAAAAAAAAAPAAAAAH////3wAcAfAwAAAAAAAAAAADgAAAAH////+AAcAfgAAAAAAAAAAAABhwAAAD////9wAMAXAAAAAAAAAAAAAA//AAAB/////wAMAQAIAAAAAAAAAAAAP/wAAA/////gACAYAYAAAAAAAAAAAAH/8AAAPH///AAAAMHAAAAAAAAAAAAAH/+AAAAB//+AAAAcOAAAAAAAAAAAAAP/+AAAAB//8AAAAYegAAAAAAAAAAAAP//gAAAB//4AAAAMewAAAAAAAAAAAAP//4AAAB//4AAAAGcg+AAAAAAAAAAAP///AAAA//wAAAACAgPAAAAAAAAAAAP///gAAA//wAAAABwAHwAAAAAAAAAAH///gAAA//wAAAAAAAD4AAAAAAAAAAH///AAAAf/wAAAAAAAAAAAAAAAAAAAD//+AAAAf/4gAAAAABxAAAAAAAAAAAB//+AAAA//wgAAAAAPxgAAAAAAAAAAA//+AAAA//jgAAAAAP/gAAAAAAAAAAAf/+AAAA//DgAAAAA//gAAAAAAAAAAAf/8AAAAf/DAAAAAD//4AAAAAAAAAAA//4AAAAf/DAAAAAH//8AAAAAAAAAAA//gAAAAf+DAAAAAH//8AAAAAAAAAAA//AAAAAP+AAAAAAH//+AAAAAAAAAAA//AAAAAP8AAAAAAH//+AAAAAAAAAAA/+AAAAAH4AAAAAAH//+AAAAAAAAAAA/8AAAAAHwAAAAAAH4f8AAAAAAAAAAA/wAAAAAAAAAAAAABAH8AAAAAAAAAAB/wAAAAAAAAAAAAAAAH4AEAAAAAAAAB/AAAAAAAAAAAAAAAAAAAGAAAAAAAAB8AAAAAAAAAAAAAAAAAQAOAAAAAAAAB8AAAAAAAAAAAAAAAAAQAYAAAAAAAAB4AAAAAAAAAAAAAAAAAAAwAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",W=180,H=90;
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small=window.matchMedia&&matchMedia("(max-width:700px)").matches;
  var gc=document.getElementById("globe"),pc=document.getElementById("fxParticles"),hero=document.querySelector(".hero");
  if(!gc||!gc.getContext)return;
  var gx=gc.getContext("2d"),px=pc?pc.getContext("2d"):null;
  var DPR=Math.min(window.devicePixelRatio||1,small?1.5:2);
  var land=(function(){var b=atob(MASK),a=new Uint8Array(W*H),i;for(i=0;i<W*H;i++)a[i]=(b.charCodeAt(i>>3)>>(7-(i&7)))&1;return a})();
  function isLand(lat,lon){var x=Math.floor((((lon+180)%360)+360)%360/2),y=Math.floor((90-lat)/2);if(y<0)y=0;if(y>=H)y=H-1;return land[y*W+x]===1}
  function vec(lat,lon){var p=lat*Math.PI/180,l=lon*Math.PI/180;return[Math.cos(p)*Math.sin(l),Math.sin(p),Math.cos(p)*Math.cos(l)]}
  // --- dots (land only) on a roughly even lattice
  var STEP=small?3.7:3,dots=[];
  for(var lat=-60;lat<=84;lat+=STEP){var n=Math.max(1,Math.round(360*Math.cos(lat*Math.PI/180)/STEP));for(var k=0;k<n;k++){var lon=-180+360*k/n+(lat/STEP%2?STEP/2:0);if(isLand(lat,lon))dots.push(vec(lat,lon))}}
  // --- network nodes: spread-out land points chosen with a fixed seed, so every visit looks the same
  var seed=7;function rnd(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296}
  var NN=small?9:14,nodes=[],tries=0;
  while(nodes.length<NN&&tries++<4000){var la=-50+rnd()*125,lo=-180+rnd()*360;if(!isLand(la,lo))continue;var v=vec(la,lo),ok=true;
    for(var q=0;q<nodes.length;q++){var d=nodes[q][0]*v[0]+nodes[q][1]*v[1]+nodes[q][2]*v[2];if(Math.acos(Math.max(-1,Math.min(1,d)))<.5){ok=false;break}}
    if(ok)nodes.push(v)}
  var arcs=[],seen={};
  nodes.forEach(function(a,i){
    var ds=nodes.map(function(b,j){return[j,i===j?9:Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2])))]}).sort(function(x,y){return x[1]-y[1]});
    for(var m=0;m<2;m++){var j=ds[m][0],key=Math.min(i,j)+"-"+Math.max(i,j);if(seen[key])continue;seen[key]=1;arcs.push(makeArc(a,nodes[j],ds[m][1]))}});
  function makeArc(a,b,om){var pts=[],N=32,s=Math.sin(om)||1e-6,h=.10+.14*om/Math.PI;
    for(var t=0;t<=N;t++){var u=t/N,A=Math.sin((1-u)*om)/s,B=Math.sin(u*om)/s,r=1+h*Math.sin(Math.PI*u);pts.push([(A*a[0]+B*b[0])*r,(A*a[1]+B*b[1])*r,(A*a[2]+B*b[2])*r])}
    return{pts:pts,ph:rnd(),sp:.55+rnd()*.5}}
  // --- graticule (faint lat/lon lines)
  var grat=[],g;
  for(g=-150;g<=180;g+=30){var m=[];for(var t=-90;t<=90;t+=6)m.push(vec(t,g));grat.push(m)}
  for(g=-60;g<=60;g+=30){var pl=[];for(var t2=-180;t2<=180;t2+=6)pl.push(vec(g,t2));grat.push(pl)}
  // --- view state
  var lon0=reduce?.25:.2,lat0=.32,vel=0,dragging=false,lastX=0,tiltX=0,tiltY=0,R=0,cx=0,cy=0,size=0;
  function resize(){var r=gc.getBoundingClientRect();size=Math.max(10,r.width);gc.width=gc.height=Math.round(size*DPR);R=size*DPR*.4;cx=cy=size*DPR/2;
    if(pc&&hero){var hr=hero.getBoundingClientRect();pc.width=Math.round(hr.width);pc.height=Math.round(hr.height);initParticles()}}
  function project(v){var c=Math.cos(lon0),s=Math.sin(lon0),x=v[0]*c-v[2]*s,z=v[0]*s+v[2]*c,y=v[1],t=lat0+tiltY,ct=Math.cos(t),st=Math.sin(t);return[x,y*ct-z*st,y*st+z*ct]}
  function draw(time){
    var c=gx;c.clearRect(0,0,gc.width,gc.height);
    var ag=c.createRadialGradient(cx,cy,R*.92,cx,cy,R*1.24);ag.addColorStop(0,"rgba(127,214,200,.24)");ag.addColorStop(1,"rgba(127,214,200,0)");c.fillStyle=ag;c.beginPath();c.arc(cx,cy,R*1.24,0,7);c.fill();
    var bg=c.createRadialGradient(cx-R*.38,cy-R*.42,R*.05,cx,cy,R);bg.addColorStop(0,"#1c3a5c");bg.addColorStop(.55,"#0f2038");bg.addColorStop(1,"#070f1d");c.fillStyle=bg;c.beginPath();c.arc(cx,cy,R,0,7);c.fill();
    c.lineWidth=Math.max(1,DPR*.6);c.strokeStyle="rgba(127,214,200,.09)";
    grat.forEach(function(line){c.beginPath();var pen=false;line.forEach(function(v){var p=project(v);if(p[2]>0){var X=cx+p[0]*R,Y=cy-p[1]*R;if(pen)c.lineTo(X,Y);else{c.moveTo(X,Y);pen=true}}else pen=false});c.stroke()});
    var buckets=[[],[],[],[],[]];
    dots.forEach(function(v){var p=project(v);if(p[2]>.03){var b=Math.min(4,Math.floor(p[2]*5));buckets[b].push(cx+p[0]*R,cy-p[1]*R,p[2])}});
    var sz=DPR*(small?1.6:1.95);
    buckets.forEach(function(arr,bi){c.fillStyle="rgba(127,214,200,"+(.22+bi*.2).toFixed(2)+")";var s=sz*(.7+bi*.18);for(var i=0;i<arr.length;i+=3)c.fillRect(arr[i]-s/2,arr[i+1]-s/2,s,s)});
    var rg=c.createRadialGradient(cx,cy,R*.78,cx,cy,R);rg.addColorStop(0,"rgba(0,0,0,0)");rg.addColorStop(1,"rgba(2,8,18,.55)");c.fillStyle=rg;c.beginPath();c.arc(cx,cy,R,0,7);c.fill();
    c.strokeStyle="rgba(160,230,220,.35)";c.lineWidth=DPR;c.beginPath();c.arc(cx,cy,R,0,7);c.stroke();
    // arcs and travelling pulses
    arcs.forEach(function(a){
      c.beginPath();var pen=false;
      a.pts.forEach(function(v){var p=project(v);if(p[2]>0.02){var X=cx+p[0]*R,Y=cy-p[1]*R;if(pen)c.lineTo(X,Y);else{c.moveTo(X,Y);pen=true}}else pen=false});
      c.strokeStyle="rgba(232,183,90,.38)";c.lineWidth=DPR*1.1;c.stroke();
      var u=((time*.00011*a.sp)+a.ph)%1,i=Math.floor(u*(a.pts.length-1)),p2=project(a.pts[i]);
      if(p2[2]>.02){var X2=cx+p2[0]*R,Y2=cy-p2[1]*R;c.fillStyle="rgba(232,183,90,.25)";c.beginPath();c.arc(X2,Y2,DPR*5,0,7);c.fill();c.fillStyle="#ffe3a8";c.beginPath();c.arc(X2,Y2,DPR*1.9,0,7);c.fill()}});
    nodes.forEach(function(v,i){var p=project(v);if(p[2]>.05){var X=cx+p[0]*R,Y=cy-p[1]*R,pulse=(Math.sin(time*.003+i*1.7)+1)/2;
      c.strokeStyle="rgba(127,214,200,"+(.15+.35*pulse).toFixed(2)+")";c.lineWidth=DPR;c.beginPath();c.arc(X,Y,DPR*(4+5*pulse),0,7);c.stroke();
      c.fillStyle="#bff5ec";c.beginPath();c.arc(X,Y,DPR*2.4,0,7);c.fill()}})
  }
  // --- particle network behind the hero
  var parts=[],PN=small?30:62,mouse=null;
  function initParticles(){parts=[];for(var i=0;i<PN;i++)parts.push({x:Math.random()*pc.width,y:Math.random()*pc.height,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:.6+Math.random()*1.4})}
  function drawParticles(){
    if(!px)return;var w=pc.width,h=pc.height,L=small?90:125;px.clearRect(0,0,w,h);
    for(var i=0;i<parts.length;i++){var a=parts[i];
      if(!reduce){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1}
      px.fillStyle="rgba(190,230,225,.45)";px.beginPath();px.arc(a.x,a.y,a.r,0,7);px.fill();
      for(var j=i+1;j<parts.length;j++){var b=parts[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;if(d<L*L){px.strokeStyle="rgba(127,214,200,"+(.16*(1-Math.sqrt(d)/L)).toFixed(3)+")";px.lineWidth=1;px.beginPath();px.moveTo(a.x,a.y);px.lineTo(b.x,b.y);px.stroke()}}}
  }
  // --- loop
  var running=false,visible=true,last=0,frames=0,acc=0;
  window.__politicaFx={frames:0,avgMs:0,get running(){return running}};
  function frame(t){
    if(!running)return;
    var dt=Math.min(64,t-(last||t));last=t;
    var t0=performance.now();
    if(!dragging){lon0+=vel*dt*.001;vel+=(.075-vel)*.02;}
    var P=window.__politicaPointer;tiltX+=((P?P.x:0)-tiltX)*.05;tiltY+=((P?P.y*.12:0)-tiltY)*.05;lon0+=tiltX*dt*.00002;
    draw(t);drawParticles();
    acc+=performance.now()-t0;frames++;if(frames%30===0){window.__politicaFx.frames=frames;window.__politicaFx.avgMs=+(acc/30).toFixed(2);acc=0}
    requestAnimationFrame(frame)
  }
  function start(){if(running||reduce||!visible||document.hidden)return;running=true;last=0;requestAnimationFrame(frame)}
  function stop(){running=false}
  // --- drag to rotate (horizontal drag only, so vertical page scrolling still works on touch screens)
  gc.addEventListener("pointerdown",function(e){dragging=true;lastX=e.clientX;vel=0;try{gc.setPointerCapture(e.pointerId)}catch(x){}});
  gc.addEventListener("pointermove",function(e){if(!dragging)return;var dx=e.clientX-lastX;lastX=e.clientX;lon0-=dx*.006;vel=-dx*.06;if(reduce){draw(0)}});
  function up(){dragging=false}
  gc.addEventListener("pointerup",up);gc.addEventListener("pointercancel",up);
  gc.addEventListener("keydown",function(e){if(e.key==="ArrowLeft"){lon0-=.15;if(reduce)draw(0)}if(e.key==="ArrowRight"){lon0+=.15;if(reduce)draw(0)}});
  // --- lifecycle
  window.addEventListener("resize",function(){resize();if(!running)draw(0),drawParticles()});
  window.addEventListener("politica:pause",function(){visible=false;stop()});
  window.addEventListener("politica:resume",function(){visible=true;start()});
  document.addEventListener("visibilitychange",function(){document.hidden?stop():start()});
  if("IntersectionObserver" in window&&hero){new IntersectionObserver(function(es){visible=es[0].isIntersecting;visible?start():stop()},{threshold:0}).observe(hero)}
  resize();draw(0);drawParticles();start();
})();
