(()=>{
"use strict";
const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const search=$("ideology-search"),grid=$("ideology-grid"),count=$("ideology-count"),empty=$("ideology-empty");
if(!search||!grid)return;
let records=[],sources=[],scope="all";
const sourceMap=()=>new Map(sources.map(s=>[s.id,s]));
function render(){
 const q=search.value.trim().toLowerCase();
 const list=records.filter(x=>(scope==="all"||x.scope===scope)&&(!q||[x.name,x.summary,x.recurring_ideas,x.internal_debates,x.classification_caution,...(x.related_tags||[])].join(" ").toLowerCase().includes(q)));
 count.textContent="Showing "+list.length+" of "+records.length+" traditions and concepts";
 $("ideology-count-all").textContent=records.length;
 grid.innerHTML=list.map((x,i)=>'<article class="ideology-card" id="'+esc(x.id)+'"><p class="ideology-number">'+String(i+1).padStart(2,"0")+' / '+esc(x.kind.replace(/-/g," "))+'</p><span class="ideology-scope">'+(x.scope==="india"?"Indian political thought":"International")+'</span><h2>'+esc(x.name)+'</h2><p class="ideology-lede ideology-card-summary">'+esc(x.summary)+'</p><h3>Recurring ideas</h3><p>'+esc(x.recurring_ideas)+'</p><a class="ideology-card-link" href="ideology.html?id='+encodeURIComponent(x.id)+'">Explore this tradition →</a></article>').join("");
 empty.hidden=list.length!==0;
}
fetch("data/ideologies.json").then(r=>{if(!r.ok)throw Error("Could not load ideology catalogue");return r.json()}).then(d=>{records=d.records||[];return fetch("data/sources.json")}).then(r=>r.json()).then(d=>{sources=d.records||[];render()}).catch(err=>{grid.innerHTML='<p class="ideology-empty">The catalogue could not be loaded right now. Please refresh the page or use the full library.</p>';count.textContent="Catalogue unavailable";console.error(err)});
search.addEventListener("input",render);
document.querySelectorAll(".ideology-filter").forEach(b=>b.addEventListener("click",()=>{scope=b.dataset.scope;document.querySelectorAll(".ideology-filter").forEach(x=>{const on=x===b;x.classList.toggle("active",on);x.setAttribute("aria-pressed",String(on))});render()}));
})();