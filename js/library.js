/* POLITICA library browser — reads the existing provisional datasets; no matching/scoring changes. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const familyNames={indic:"South Asian traditions",sinic:"East Asian traditions",islamic:"Islamic intellectual traditions","west-asian":"West Asian traditions",african:"African traditions","latin-american":"Latin American traditions",caribbean:"Caribbean traditions","southeast-asian":"Southeast Asian traditions",indigenous:"Indigenous traditions",western:"Western traditions"};
const traditionName=s=>String(s||"").replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
const dimName=k=>(typeof DIMENSIONS!=="undefined"&&DIMENSIONS.find(d=>d.key===k)?.label)||k;
const allThinkers=THINKERS.map(x=>({...x,kind:"thinker"}));
const allBooks=BOOKS.map(x=>({...x,kind:"book"}));
const entries=[...allThinkers,...allBooks];
let active="all";
const terms=new Set();
entries.forEach(x=>{(x.traditions||[]).forEach(v=>terms.add("t:"+v));if(x.family)terms.add("f:"+x.family)});
[...terms].sort().forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=v.startsWith("t:")?traditionName(v.slice(2)):familyNames[v.slice(2)]||traditionName(v.slice(2));$("library-tradition").append(o)});
$("count-all").textContent=entries.length;$("count-thinkers").textContent=allThinkers.length;$("count-books").textContent=allBooks.length;
function sourceList(sources){if(!sources?.length)return"<li>No source details supplied.</li>";return sources.map(s=>"<li>"+(s.url?'<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.citation||s.id)+'</a>':esc(s.citation||s.id))+(s.locator?"<p>"+esc(s.locator)+"</p>":"")+' <span class="source-status">'+(s.verified?"Locator marked verified in project data":"Locator not independently verified")+"</span></li>").join("")}
function dimensionRows(dims){return Object.entries(dims||{}).map(([key,c])=>'<div class="profile-dimension"><div><b>'+esc(dimName(key))+'</b><span>'+(typeof c.score==="number"?esc(c.score>0?"+":"")+esc(c.score)+"/100 · "+esc(c.conf)+" confidence":"Not scored")+'</span></div><p>'+esc(c.documented||c.note||"No documented position supplied.")+'</p><small>'+esc(c.rationale||"")+'</small></div>').join("")}
const commons=(file,alt,kind="photograph")=>({url:"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width=480",source:"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(file),credit:"Wikimedia Commons · check file page for author and licence",alt,kind});
const portraits={
 gandhi:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Mohandas%20K.%20Gandhi%2C%20portrait.jpg",credit:"Wikimedia Commons · see file page",source:"https://commons.wikimedia.org/wiki/File:Mohandas_K._Gandhi,_portrait.jpg",alt:"Archival portrait photograph of Mohandas K. Gandhi",kind:"photograph"},
 ambedkar:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Dr%20B%20R%20Ambedkar%20as%20Barrister%20in%201922.jpg",credit:"Wikimedia Commons · see file page",source:"https://commons.wikimedia.org/wiki/Category:Portraits_of_B._R._Ambedkar",alt:"Portrait photograph of B. R. Ambedkar",kind:"photograph"},
 hayek:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Friedrich%20Hayek%20portrait.jpg",credit:"Wikimedia Commons · see file page",source:"https://commons.wikimedia.org/wiki/File:Friedrich_Hayek_portrait.jpg",alt:"Portrait of Friedrich A. Hayek",kind:"photograph"},
 marx:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Karl%20Marx%20Portrait.jpg",credit:"Wikimedia Commons · see file page",source:"https://commons.wikimedia.org/wiki/File:Karl_Marx_Portrait.jpg",alt:"Portrait of Karl Marx",kind:"photograph"},
 phule:commons("Mahatma Jotirao Phule.jpg","Archival portrait of Jyotirao Phule","portrait"),
 periyar:commons("Periyar during Self respect movement.JPG","Archival photograph of E. V. Ramasamy (Periyar)"),
 nehru:commons("Shri Jawaharlal Nehru.jpg","Official portrait of Jawaharlal Nehru"),
 "mn-roy":commons("Mn roy2.jpg","Portrait photograph of M. N. Roy"),
 "ram-manohar-lohia":commons("Lohia-full.jpg","Portrait photograph of Ram Manohar Lohia"),
 "deendayal-upadhyaya":commons("Deendayal Upadhyaya 2018 stamp of India (cropped).jpg","Postage-stamp portrait of Deendayal Upadhyaya","stamp portrait"),
 "ramakrishna-paramahamsa":commons("Ramakrishna 1883 image.jpg","Archival photograph of Ramakrishna Paramahamsa"),
 "rabindranath-tagore":commons("Rabindranath Tagore.jpg","Archival portrait photograph of Rabindranath Tagore"),
 "subhas-chandra-bose":commons("Subhas Chandra Bose in Cambridge in 1919.jpg","Archival photograph of Subhas Chandra Bose"),
 "bhagat-singh":commons("Bhagat Singh 1929.jpg","Archival 1929 portrait photograph of Bhagat Singh"),
 "ems-namboodiripad":commons("E-M-S-Namboodiripad (cropped).jpg","Portrait photograph of E. M. S. Namboodiripad"),
 "k-karunakaran":commons("K. Karunakaran in 1999.jpg","Portrait photograph of K. Karunakaran"),
 "indira-gandhi":commons("Indira Gandhi official portrait.png","Official portrait of Indira Gandhi"),
 "ak-gopalan":commons("AK Gopalan 1990 stamp of India.jpg","Commemorative postage-stamp portrait of A. K. Gopalan","stamp portrait"),
 "john-locke":commons("John Locke.jpg","Painted portrait of John Locke by Godfrey Kneller, 1697","painting"),
 "jean-jacques-rousseau":commons("Jean-Jacques Rousseau (1712-1778) par François Guérin (05A).jpg","Painted portrait of Jean-Jacques Rousseau","painting"),
 "edmund-burke":commons("Edmund Burke by Sir Joshua Reynolds.jpg","Painted portrait of Edmund Burke","painting"),
 "john-rawls":commons("John Rawls (1971 photo portrait).jpg","Portrait photograph of John Rawls"),
 "karl-popper":commons("Karl Popper.jpg","Portrait photograph of Karl Popper"),
 "hannah-arendt":commons("Hannah Arendt 1933.jpg","Portrait photograph of Hannah Arendt"),
 "ibn-khaldun":commons("Ibn Khaldūn, Sayr mulhimah min al-Sharq wa-al-Gharb.png","Imagined artistic depiction of Ibn Khaldun; no contemporary portrait survives","historical illustration"),
 "al-farabi":commons("Abu Nasr al-Farabi (head).png","Modern artistic depiction of Al-Farabi","historical illustration"),
 "abul-ala-maududi":commons("Sayyed Abul A'la Maududi.svg","Illustrated portrait of Abul A'la Maududi","illustration"),
 "napoleon-bonaparte":commons("Jacques-Louis David - Napoleon Crossing the Alps - Google Art Project 2.jpg","Painted portrait of Napoleon Bonaparte","painting"),
 "abraham-lincoln":commons("Abraham Lincoln O-77 matte collodion print.jpg","Photographic portrait of Abraham Lincoln","photograph"),
 "nelson-mandela":commons("Nelson Mandela-2008 (edit).jpg","Photograph of Nelson Mandela","photograph"),
 "winston-churchill":commons("Sir Winston Churchill - 19086236948.jpg","Photographic portrait of Winston Churchill","photograph"),
 "adolf-hitler":commons("Bundesarchiv Bild 183-S33882, Adolf Hitler.jpg","Historical photograph of Adolf Hitler","photograph"),
 "benito-mussolini":commons("Benito Mussolini portrait.jpg","Historical portrait of Benito Mussolini","photograph"),
 "vladimir-lenin":commons("Lenin in 1920 (cropped).jpg","Historical photograph of Vladimir Lenin","photograph"),
 "che-guevara":commons("Che Guevara.jpg","Photographic portrait of Che Guevara","photograph"),
 "fidel-castro":commons("Fidel Castro 1959.jpg","Photograph of Fidel Castro","photograph"),
 "martin-luther-king-jr":commons("Martin Luther King Jr NYWTS.jpg","Photographic portrait of Martin Luther King Jr.","photograph"),
 "george-washington":commons("Gilbert Stuart Williamstown Portrait of George Washington.jpg","Painted portrait of George Washington","painting"),
 "franklin-d-roosevelt":commons("FDR 1944 Color Portrait.jpg","Official portrait of Franklin D. Roosevelt","photograph"),
 "joseph-stalin":commons("Joseph Stalin in 1943.jpg","Historical photograph of Joseph Stalin","photograph"),
 "mao-zedong":commons("Mao Zedong portrait.jpg","Portrait photograph of Mao Zedong","photograph"),
 "barack-obama":commons("President Barack Obama.jpg","Official portrait of Barack Obama","photograph"),
 "emmanuel-macron":commons("Emmanuel Macron in 2019.jpg","Photograph of Emmanuel Macron","photograph"),
 "vladimir-putin":commons("Vladimir Putin (2020-02-20).jpg","Photograph of Vladimir Putin","photograph"),
 "saddam-hussein":commons("Saddam Hussein 1979.jpg","Historical photograph of Saddam Hussein","photograph"),
 "muammar-gaddafi":commons("Muammar al-Gaddafi.jpg","Photograph of Muammar Gaddafi","photograph"),
 "idi-amin":commons("Idi Amin 1973.jpg","Historical photograph of Idi Amin","photograph"),
 "vallabhbhai-patel":commons("Sardar Vallabhbhai Patel (cropped).jpg","Archival portrait of Vallabhbhai Patel","photograph"),
 "atal-bihari-vajpayee":commons("Atal Bihari Vajpayee portrait.jpg","Portrait photograph of Atal Bihari Vajpayee","photograph"),
 "muhammad-ali-jinnah":commons("Jinnah1945c.jpg","Photographic portrait of Muhammad Ali Jinnah","photograph"),
 "yasser-arafat":commons("Yasser Arafat 1996.jpg","Photograph of Yasser Arafat","photograph"),
 "malcolm-x":commons("Malcolm X 1964.jpg","Photographic portrait of Malcolm X","photograph")
};
const coverPos={"hind-swaraj":[0,0],"annihilation-of-caste":[1,0],"road-to-serfdom":[2,0],"communist-manifesto":[3,0],"reflections":[0,1],"theory-of-justice":[1,1],"arthashastra":[2,1],"analects":[3,1],"on-liberty":[0,2],"the-federalist":[1,2],"political-ideologies":[2,2],"muqaddimah":[3,2],"wretched-of-the-earth":[0,3],"seven-essays-peruvian-reality":[1,3]};
function coverThumb(id,title){const p=coverPos[id];if(!p)return '<div class="library-cover-fallback" role="img" aria-label="Cover artwork unavailable for '+esc(title)+'">POLITICA<br><small>BOOK</small></div>';return '<div class="library-cover-thumb" role="img" aria-label="Illustrated cover for '+esc(title)+'" style="background-position:'+p[0]*100/3+'% '+p[1]*100/3+'%"></div>'}
function thinkerCard(t){const phases=(t.phases||[]).map(p=>'<section class="phase-block"><h4>'+esc(p.label)+' <span>'+esc(p.years||"")+'</span></h4>'+dimensionRows(p.dims)+'</section>').join("");const portrait=portraits[t.id]||(t.id==="kautilya"?{url:"assets/kautilya.webp",credit:"User-supplied image",source:"assets/kautilya.webp",alt:"User-supplied image of Kautilya",kind:"user-supplied"}:null);const visual=portrait?'<div class="thinker-visual"><img src="'+portrait.url+'" alt="'+esc(portrait.alt)+'" loading="lazy" onerror="this.parentElement.classList.add(\'image-unavailable\');this.remove()"><a href="'+portrait.source+'" target="_blank" rel="noopener noreferrer">Image source · '+esc(portrait.kind||"photograph")+'</a></div>':'<div class="thinker-visual thinker-placeholder" role="img" aria-label="Portrait not available"><span>POLITICA</span><b>Portrait<br>not supplied</b></div>';return '<article class="library-card thinker-card" data-kind="thinker"><div class="thinker-card-layout">'+visual+'<div class="thinker-card-copy"><div class="card-eyebrow">'+(t.roles?.includes("political-leader")?"Political leader":"Thinker")+' · '+esc(familyNames[t.family]||t.region||"Tradition not assigned")+'</div><h2>'+esc(t.name)+'</h2><p class="card-dates">'+esc(t.lifespan||"Dates not established")+'</p><p>'+esc(t.summary||"")+'</p><div class="tag-list">'+(t.traditions||[]).map(x=>'<span>'+esc(traditionName(x))+'</span>').join("")+'</div></div></div><details class="library-details"><summary>Explore periods, positions &amp; sources</summary>'+phases+'<section class="source-block"><h4>Sources</h4><ul>'+sourceList(t.sources)+'</ul></section></details><span class="pilot-label">AI-assisted · provisional</span></article>'}
function bookCard(b){const dims=Object.entries(b.argues||{}).map(([k,c])=>'<div class="profile-dimension"><div><b>'+esc(dimName(k))+'</b><span>'+esc(c.score>0?"+":"")+esc(c.score)+"/100 · "+esc(c.conf)+' confidence</span></div><p>'+esc(c.documented||"")+'</p><small>'+esc(c.rationale||"")+'</small></div>').join("");return '<article class="library-card book-card" data-kind="book" data-book-id="'+esc(b.id)+'"><div class="book-card-layout"><div class="book-visual">'+coverThumb(b.id,b.title)+'</div><div class="book-card-copy"><div class="card-eyebrow">Book · '+esc(familyNames[b.family]||traditionName(b.family||""))+'</div><h2>'+esc(b.title)+'</h2><p class="card-dates">'+esc(b.author)+' · '+(b.year==null?"Date uncertain":esc(b.year))+'</p><p class="book-premise">Central theme: '+esc(traditionName(b.premise||"Not assigned"))+'</p><div class="tag-list">'+(b.traditions||[]).map(x=>'<span>'+esc(traditionName(x))+'</span>').join("")+'</div></div></div>'+(dims?'<details class="library-details"><summary>View provisional dimension readings</summary>'+dims+'</details>':'<p class="survey-note">Introductory survey — no single ideological position assigned.</p>')+'<details class="library-details"><summary>Notes &amp; sources</summary><section class="source-block"><ul>'+sourceList(b.sources)+'</ul></section></details><span class="pilot-label">AI-assisted · provisional</span></article>'}
const coverCache=new Map(),coverLoading=new Set();
async function fetchOpenLibraryCover(b){
 if(coverCache.has(b.id)||coverLoading.has(b.id))return;
 coverLoading.add(b.id);
 try{
  const q="https://openlibrary.org/search.json?title="+encodeURIComponent(b.title)+"&author="+encodeURIComponent(b.author)+"&limit=5&fields=cover_i,title,author_name,first_publish_year";
  const res=await fetch(q,{headers:{Accept:"application/json"}});
  if(!res.ok)throw new Error("Open Library search failed");
  const data=await res.json();
  const expected=(b.title||"").toLowerCase().replace(/[^a-z0-9]/g,"");
  const docs=(data.docs||[]).filter(x=>x.cover_i);
  const best=docs.find(x=>(x.title||"").toLowerCase().replace(/[^a-z0-9]/g,"").includes(expected.slice(0,Math.min(12,expected.length))))||docs[0];
  if(best?.cover_i)coverCache.set(b.id,{url:"https://covers.openlibrary.org/b/id/"+best.cover_i+"-M.jpg",source:"https://openlibrary.org"+(best.key||""),alt:"Cover of "+b.title});
 }catch(e){/* Keep the designed POLITICA cover fallback if no catalogue cover is available. */}
 finally{coverLoading.delete(b.id)}
 if(coverCache.has(b.id)){
  const node=document.querySelector('[data-book-id="'+CSS.escape(b.id)+'"] .book-visual');
  if(node&&!node.querySelector(".book-cover-img")){
   const c=coverCache.get(b.id),a=document.createElement("a"),img=document.createElement("img");
   a.href=c.source||"https://openlibrary.org";a.target="_blank";a.rel="noopener noreferrer";a.className="book-cover-link";a.setAttribute("aria-label","Open Library record for "+b.title);
   img.className="book-cover-img";img.src=c.url;img.alt=c.alt;img.loading="lazy";
   img.onerror=()=>{node.innerHTML=coverThumb(b.id,b.title)};
   a.append(img);node.replaceChildren(a);
  }
 }
}
function matches(x,q,filter){if(filter&&filter!=="all"){const v=filter.startsWith("t:")?(x.traditions||[]).includes(filter.slice(2)):x.family===filter.slice(2);if(!v)return false}if(active!=="all"&&x.kind!==active.slice(0,-1))return false;if(!q)return true;const blob=[x.name,x.title,x.author,x.summary,x.region,x.family,x.premise,...(x.traditions||[]),...(x.roles||[]),...(x.sources||[]).map(s=>s.citation+" "+s.locator)].join(" ").toLowerCase();return blob.includes(q)}
let coverQueue=[];let coverWorkers=0;function scheduleBookCovers(items){coverQueue.push(...items);while(coverWorkers<3&&coverQueue.length){coverWorkers++;(async()=>{while(coverQueue.length){const b=coverQueue.shift();await fetchOpenLibraryCover(b)}coverWorkers--})()}}
function render(){const q=$("library-search").value.trim().toLowerCase(),filter=$("library-tradition").value;const visible=entries.filter(x=>matches(x,q,filter));$("library-grid").innerHTML=visible.map(x=>x.kind==="thinker"?thinkerCard(x):bookCard(x)).join("");$("library-count").textContent="Showing "+visible.length+" of "+entries.length+" entries";$("library-empty").hidden=visible.length!==0;scheduleBookCovers(visible.filter(x=>x.kind==="book"))}
document.querySelectorAll(".library-filter").forEach(b=>b.addEventListener("click",()=>{active=b.dataset.filter;document.querySelectorAll(".library-filter").forEach(x=>{const on=x===b;x.classList.toggle("active",on);x.setAttribute("aria-pressed",String(on))});render()}));
$("library-search").addEventListener("input",render);$("library-tradition").addEventListener("change",render);
render();
})();