(()=>{
"use strict";
const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const id=new URLSearchParams(location.search).get("id");
Promise.all([fetch("data/ideologies.json").then(r=>r.json()),fetch("data/sources.json").then(r=>r.json())]).then(([a,b])=>{
 const item=(a.records||[]).find(x=>x.id===id);if(!item)throw Error("Unknown ideology");
 const sourceMap=new Map((b.records||[]).map(x=>[x.id,x]));
 $("detail-title").textContent=item.name;$("detail-crumb").textContent=item.name;$("detail-summary").textContent=item.summary;
 $("detail-ideas").textContent=item.recurring_ideas;$("detail-debates").textContent=item.internal_debates;$("detail-caution").textContent=item.classification_caution;
 const refs=(item.source_ids||[]).map(x=>sourceMap.get(x)).filter(x=>x&&typeof x.url==="string"&&/^https:\/\//i.test(x.url));
 $("detail-sources").innerHTML=refs.length?refs.map(x=>'<li><a href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">'+esc(x.title)+'</a><br>'+esc(x.publisher)+'</li>').join(""):"<li>No linked sources yet. Further research is needed for this entry.</li>";
 document.title=item.name+" | Political Ideologies | POLITICA";
}).catch(()=>{$("detail-title").textContent="Tradition not found";$("detail-summary").textContent="This entry may have moved. Return to the complete catalogue.";$("detail-sources").innerHTML='<li><a href="ideologies.html">Browse all traditions</a></li>'});
})();