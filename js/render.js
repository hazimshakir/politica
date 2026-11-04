/* POLITICA render.js — builds the page HTML (quiz screen, sidebar, results). No scoring rules here. */
function toast(t){let el=document.getElementById("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function renderSteps(current,answers){
  document.getElementById("steps").innerHTML=sections.map((s,i)=>{
    const start=sectionStart(i);
    const n=s.questions.filter((q,j)=>answers[start+j]!==undefined).length;
    const done=n===s.questions.length,active=i===all[current].section;
    return `<button class="step ${active?'active':''} ${done?'done':''}" onclick="jumpSection(${i})" aria-label="Section ${i+1}: ${s.short}, ${n} of ${s.questions.length} answered"${active?' aria-current="step"':''}><span class="dot" aria-hidden="true">${i+1}</span>${s.short}</button>`}).join("")}
function renderQuiz(current,answers){
  let q=all[current],s=sections[q.section],answered=Object.keys(answers).length;
  document.getElementById("progressFill").style.width=(answered/all.length*100)+"%";
  const track=document.getElementById("progressTrack");track.setAttribute("aria-valuemax",all.length);track.setAttribute("aria-valuenow",answered);track.setAttribute("aria-valuetext",`${answered} of ${all.length} answered`);
  document.getElementById("progressCopy").textContent=`${answered} of ${all.length} answered`;
  renderSteps(current,answers);
  let opts=scale.map(([label,val])=>`<label class="option ${answers[current]===val?'selected':''}"><input type="radio" name="answer" value="${val}"${answers[current]===val?' checked':''} onchange="choose(${val})"><span class="radio" aria-hidden="true"></span><span>${label}</span></label>`).join("");
  document.getElementById("quizCard").innerHTML=`<div class="quiz-head"><span class="tag">${String(q.section+1).padStart(2,'0')} / ${s.title}</span><span class="counter">QUESTION ${current+1} OF ${all.length}</span></div><h2>${s.title}</h2><p class="hint">${s.desc}</p>${q.scenario?`<div class="scenario" id="scenarioText">${q.scenario}</div>`:''}<fieldset class="fs" id="questionSet" tabindex="-1"${q.scenario?' aria-describedby="scenarioText"':''}><legend class="qtext"><span class="sr-only">Question ${current+1} of ${all.length}. </span>${q.text}</legend><div class="options">${opts}</div><p class="keyboard-hint">Keyboard: ↑ / ↓ or ← / → to choose · Enter to continue</p></fieldset><div class="navrow"><button class="btn btn-light" onclick="previous()" ${current===0?'disabled':''}>← Back</button><button class="btn btn-dark" onclick="next()" ${answers[current]===undefined?'disabled':''}>${current===all.length-1?'View my profile':'Continue →'}</button></div>`}
/* Thinker and book panel. Shows AI-assessed pilot entries with a clear provisional-status disclosure. */
function recEsc(v){return String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
/* Rotating discovery picks broaden the list without pretending unscored profiles are measured matches. */
function explorationThinkers(scores,excludedIds){
 const map={
 economic:scores.economic<=-25?["socialist-marxist","social-democratic","gandhian"]:scores.economic>=25?["classical-liberal","liberal","libertarian"]:[],
 social:scores.social<=-25?["social-justice-anti-caste","feminist","social-justice"]:scores.social>=25?["liberal","classical-liberal"]:[],
 culture:scores.culture<=-25?["feminist","rationalist","secular-nationalist"]:scores.culture>=25?["conservative","gandhian"]:[],
 democracy:scores.democracy<=-25?["liberal","republican"]:[],
 liberty:scores.liberty<=-25?["libertarian","anarchist","liberal"]:[],
 global:scores.global<=-25?["anti-colonial","nationalist"]:scores.global>=25?["nationalist"]:[],
 values:scores.values<=-25?["social-justice-anti-caste","gandhian","feminist"]:scores.values>=25?["liberal","classical-liberal"]:[]
 };
 const wanted=new Set(Object.values(map).flat()),pool=(THINKERS||[]).filter(t=>!excludedIds.has(t.id)&&!publishedPhases(t).length);
 const ranked=pool.map(t=>({t,matched:(t.traditions||[]).filter(tag=>wanted.has(tag))})).filter(x=>x.matched.length);
 let candidates=ranked.length?ranked:pool.map(t=>({t,matched:[]}));
 const key="politica.exploration.recent.v1";let history=[];try{history=JSON.parse(sessionStorage.getItem(key)||"[]")}catch{}
 const fresh=candidates.filter(x=>!history.includes(x.t.id));if(fresh.length>=3)candidates=fresh;
 const shuffled=candidates.slice().sort((a,b)=>b.matched.length-a.matched.length||Math.random()-.5),picks=[],families=new Set();
 for(const x of shuffled){if(picks.length>=3)break;if(!families.has(x.t.family)){picks.push(x);families.add(x.t.family)}}
 for(const x of shuffled){if(picks.length>=3)break;if(!picks.some(y=>y.t.id===x.t.id))picks.push(x)}
 try{sessionStorage.setItem(key,[...picks.map(x=>x.t.id),...history].slice(0,9).join("|"))}catch{}
 return picks.map(x=>({...x,reason:x.matched.length?"Related themes in your answers: "+x.matched.map(v=>v.replace(/-/g," ")).join(", ")+".":"A rotating discovery pick from the wider collection."}));
}
function explorationHtml(scores,excludedIds){
 const picks=explorationThinkers(scores,excludedIds);if(!picks.length)return "";
 return '<section class="rec-explore"><div class="rec-section-label">Explore beyond the scored matches</div><p class="rec-explore-intro">These profiles broaden your reading list. They are selected by broad themes and rotation, not numerical similarity; their positions have not been scored against your answers.</p><div class="rec-explore-grid">'+picks.map(({t,reason})=>{
  const initials=recEsc((t.name||"?").split(/\\s+/).map(v=>v[0]).slice(0,2).join(""));
  const tags=(t.traditions||[]).map(v=>recEsc(v.replace(/-/g," "))).join(" · ");
  return '<article class="rec-explore-card"><div class="rec-explore-avatar" aria-hidden="true">'+initials+'</div><span class="rec-badge">Discovery pick</span><h3>'+recEsc(t.name)+'</h3><p class="rec-explore-years">'+recEsc(t.lifespan||"Historical profile")+' · '+recEsc(t.region||"")+'</p><p>'+recEsc(t.summary||"Explore this profile in the library.")+'</p><p class="rec-explore-reason">'+recEsc(reason)+'</p><small>Traditions: '+(tags||"Not assigned")+'</small></article>';
 }).join("")+'</div><a class="rec-library-link" href="thinkers-library.html">Explore the full collection →</a></section>';
}
function recommendationsHtml(scores){
 const head='<section class="recommendations-section" aria-labelledby="recommendations-title"><div class="recommendations-head"><div><span class="rec-kicker">Further reading</span><h2 id="recommendations-title">People &amp; books to explore</h2><p>Short comparisons to help you explore ideas — not endorsements.</p><a class="rec-library-link" href="thinkers-library.html">Browse the full thinkers &amp; library collection&nbsp; →</a></div></div>';
 const none=head+'<p class="rec-empty">Personalised matches are not available for this profile yet. The pilot entries remain provisional and require further verification.</p></section>';
 try{
  if(typeof matchThinkers!=="function"||typeof selectBooks!=="function"||typeof validateData!=="function")return none;
  const errs=validateData(THINKERS,BOOKS);
  if(errs.length){console.error("POLITICA recommendations hidden: data check failed",errs);return none}
  const lab=k=>{const p=polarities.find(x=>x.key===k);return p?p.label:k};
  const labs=a=>a&&a.length?a.map(lab).map(recEsc).join(" · "):"—";
  const src=a=>(a||[]).map(s=>(s.url?'<a href="'+recEsc(s.url)+'" target="_blank" rel="noopener noreferrer">'+recEsc(s.citation)+'</a>':recEsc(s.citation))+(s.locator?" — "+recEsc(s.locator):"")).join("</li><li>");
  const okT=id=>{const t=THINKERS.find(x=>x.id===id);return t&&["reviewed","ai-reviewed"].includes(t.status)};
  const okB=id=>{const b=BOOKS.find(x=>x.id===id);return b&&["reviewed","ai-reviewed"].includes(b.status)};
  const commonsPortrait=(file,alt)=>({url:"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width=480",credit:"Wikimedia Commons · see file page",source:"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file),alt});
  const portrait={
   gandhi:commonsPortrait("Mohandas K. Gandhi, portrait.jpg","Archival portrait of Mohandas K. Gandhi"),
   ambedkar:commonsPortrait("Dr B R Ambedkar as Barrister in 1922.jpg","Portrait of B. R. Ambedkar"),
   hayek:commonsPortrait("Friedrich Hayek portrait.jpg","Portrait of Friedrich A. Hayek"),
   marx:commonsPortrait("Karl Marx Portrait.jpg","Portrait of Karl Marx"),
   nehru:commonsPortrait("Shri Jawaharlal Nehru.jpg","Official portrait of Jawaharlal Nehru"),
   kautilya:{url:"assets/kautilya.webp",credit:"Portrait image supplied by the POLITICA project",source:null,alt:"User-supplied portrait of Kautilya"}
  };
  const tm=matchThinkers(scores,THINKERS),bm=selectBooks(scores,BOOKS);
  const cards=[...tm.overlap.map(c=>["Closest overlap",c]),...tm.contrast.map(c=>["Useful contrast",c])].filter(([,c])=>okT(c.thinkerId));
  const shownIds=new Set(cards.map(([,c])=>c.thinkerId));
  const books=bm.picks.filter(p=>okB(p.id));
  let h=head;
  if(cards.length){
   h+='<div class="rec-section-label">Thinkers</div><div class="thinker-rec-grid">'+cards.map(([slot,c])=>{
    const person=THINKERS.find(t=>t.id===c.thinkerId),photo=portrait[c.thinkerId];
    const initials=recEsc(c.name.split(/\s+/).map(x=>x[0]).slice(0,2).join(""));
    const image=photo?'<img class="thinker-photo" src="'+photo.url+'" alt="Portrait of '+recEsc(c.name)+'" loading="lazy" onerror="this.closest(\'.thinker-photo-wrap\').classList.add(\'no-photo\');this.remove()">' : '';
    const close=labs(c.overlaps),different=labs(c.differences),partial=labs(c.partlyDifferent);
    const evidence=c.rows.map(r=>'<li><b>'+recEsc(lab(r.dim))+'</b> · '+recEsc(r.relation)+'. '+(r.thinker? 'Them: '+recEsc(r.thinker.orientation.text)+'. '+recEsc(r.thinker.documented)+' Confidence: '+recEsc(r.thinker.conf)+'. Sources: '+src(r.thinker.sources)+'.':recEsc(r.note||"No comparable evidence."))+'</li>').join("");
    const credits=photo?(photo.source?'<a class="image-credit" href="'+photo.source+'" target="_blank" rel="noopener noreferrer">'+photo.credit+'</a>':'<span class="image-credit">'+photo.credit+'</span>'):'<span class="image-credit">No verified historical portrait available</span>';
    return '<article class="thinker-rec-card"><div class="thinker-rec-top"><div class="thinker-photo-wrap '+(photo?'':'no-photo')+'">'+image+'<span class="thinker-initials" aria-hidden="true">'+initials+'</span>'+'</div><div class="thinker-rec-title"><span class="rec-badge">'+recEsc(slot)+'</span><h3>'+recEsc(c.name)+'</h3><p>'+recEsc(c.lifespan)+' · '+recEsc(c.phase.label)+(c.phase.years?' · '+recEsc(c.phase.years):'')+'</p>'+credits+'</div></div><ul class="rec-bullets"><li><b>Overlap:</b> '+close+'</li><li><b>Different:</b> '+(partial!=="—"?"Partly: "+partial+" · ":"")+different+'</li><li><b>Not comparable:</b> '+labs(c.notComparable)+'</li></ul><details class="rec-details"><summary>View comparison &amp; sources</summary><ul class="rec-evidence">'+evidence+'</ul></details></article>';
   }).join("")+'</div>';
  }else h+='<p class="rec-empty">No thinker match is available for this profile yet.</p>';
  h+=explorationHtml(scores,shownIds);
  if(tm.notes.length)h+='<p class="rec-match-note">'+tm.notes.map(recEsc).join(" ")+"</p>";
  if(books.length){
   h+='<div class="rec-section-label books-label">Books</div><div class="book-rec-grid">'+books.map(p=>{
    const why=p.stance?'Useful comparison: '+lab(p.dimension)+'.':'Broad introductory survey.';
    const focus=p.premise||"Explore the arguments and context.";
    const traditions=(p.traditions||[]).map(x=>x.replace(/-/g," ")).join(" · ");
    const sourceList=src(p.sources);
    const year=p.year==null?"Date uncertain":p.year;
    const query=encodeURIComponent(p.title+" "+p.author);
    return '<article class="book-rec-card"><div class="book-cover-column"><a class="book-cover-link" href="https://openlibrary.org/search?q='+query+'" target="_blank" rel="noopener noreferrer" aria-label="Find '+recEsc(p.title)+' on Open Library"><div class="book-cover-placeholder" data-book-id="'+recEsc(p.id)+'" data-book-title="'+recEsc(p.title)+'" data-book-author="'+recEsc(p.author)+'"><span class="cover-mark">P</span><span class="cover-title">'+recEsc(p.title)+'</span><span class="cover-author">'+recEsc(p.author)+'</span></div></a><span class="cover-rights-note">Cover via Open Library · © respective publisher / rights holder</span></div><div class="book-rec-info"><span class="rec-badge">'+recEsc(p.slot)+'</span><h3>'+recEsc(p.title)+'</h3><p class="book-byline">'+recEsc(p.author)+' · '+recEsc(year)+'</p><ul class="rec-bullets"><li><b>Why it appears:</b> '+recEsc(why)+'</li><li><b>Explore:</b> '+recEsc(focus)+'</li><li><b>Traditions:</b> '+recEsc(traditions||"Not assigned")+'</li></ul><details class="rec-details"><summary>Notes &amp; sources</summary><p>'+recEsc(p.stance?(p.stance.documented||"Read the cited passages to examine the argument."):"A broad survey, not assigned a single ideological position.")+'</p><ul class="rec-sources"><li>'+sourceList+'</li></ul></details></div></article>';
   }).join("")+'</div><p class="rec-credit">Book-cover images are provided by <a href="https://openlibrary.org/" target="_blank" rel="noopener noreferrer">Open Library</a> when an edition image is available. Select a cover to find the title.</p>';
  }else h+='<p class="rec-empty">No book recommendations are available for this profile yet.</p>';
  h+='<p class="rec-disclaimer">These are AI-reviewed pilot comparisons, not independently validated scholarly assessments. Historical figures may have changed their views over time; the selected period is shown where available. Similarity is assessed dimension by dimension, not as an overall score or political identity.</p></section>';
  return h;
 }catch(e){console.error("POLITICA recommendations error",e);return none}
}
function hydrateBookCovers(){
 const positions={
  "hind-swaraj":[0,0],"annihilation-of-caste":[1,0],"road-to-serfdom":[2,0],"communist-manifesto":[3,0],
  "reflections":[0,1],"theory-of-justice":[1,1],"arthashastra":[2,1],"analects":[3,1],
  "on-liberty":[0,2],"the-federalist":[1,2],"political-ideologies":[2,2],"muqaddimah":[3,2],
  "wretched-of-the-earth":[0,3],"seven-essays-peruvian-reality":[1,3]
 };
 document.querySelectorAll(".book-cover-placeholder[data-book-id]").forEach(el=>{
  const pos=positions[el.dataset.bookId];
  if(!pos)return;
  el.style.backgroundImage="url('/assets/book-covers.svg')";
  el.style.backgroundSize="400% 400%";
  el.style.backgroundPosition=(pos[0]*100/3)+"% "+(pos[1]*100/3)+"%";
  el.classList.add("has-cover");
  el.setAttribute("role","img");
  el.setAttribute("aria-label","Original book cover: "+el.dataset.bookTitle+" by "+el.dataset.bookAuthor);
  el.querySelectorAll(".cover-mark,.cover-title,.cover-author").forEach(node=>node.hidden=true);
  const credit=el.closest(".book-cover-column")?.querySelector(".cover-rights-note");
  if(credit)credit.textContent="Cover image supplied by POLITICA · © respective rights holders";
 });
}
/* Milestone 4: two-axis compass and cross-dimensional reflection. */
function politicalTendencyHtml(scores){
 const e=scores.economic,s=scores.social,c=scores.culture,d=scores.democracy,l=scores.liberty,g=scores.global,v=scores.values;
 const secondary=[];
 const add=(label,reason)=>secondary.push({label,reason});
 // Primary placement uses the two relevant dimensions independently; it does not calculate a composite left-right score.
 let primary,primaryWhy;
 if(e<=-25&&s<=-20){
   primary="Centre-left tendency";
   primaryWhy="Both your economic and social answers lean toward public provision, collective support or reducing disadvantage.";
 }else if(e>=25&&s>=20){
   primary="Centre-right tendency";
   primaryWhy="Both your economic and social answers lean toward market allocation, individual responsibility or opportunity.";
 }else if(e<=-25&&s>=20){
   primary="Mixed: economically left, responsibility-oriented socially";
   primaryWhy="Your economic answers favour public provision and redistribution, while your social answers place more weight on individual responsibility and opportunity.";
 }else if(e>=25&&s<=-20){
   primary="Mixed: market-oriented economics, stronger social protection";
   primaryWhy="Your economic answers lean toward market allocation, while your social answers emphasise collective support and reducing disadvantage.";
 }else if(Math.abs(e)<25&&Math.abs(s)<20){
   primary="Centrist / mixed-economy tendency";
   primaryWhy="Both scores are relatively close to the middle. Your answers suggest a mixed approach rather than a strong one-sided position.";
 }else if(e<=-25){
   primary="Economically centre-left";
   primaryWhy="Your economic answers favour more public provision and redistribution, while your social answers are closer to the middle or point in another direction.";
 }else if(e>=25){
   primary="Economically centre-right";
   primaryWhy="Your economic answers favour market-led allocation, while your social answers are closer to the middle or point in another direction.";
 }else if(s<=-20){
   primary="Socially egalitarian";
   primaryWhy="Your social answers emphasise collective support and reducing unequal starting points, while your economic answers are closer to the middle.";
 }else if(s>=20){
   primary="Individual-responsibility oriented";
   primaryWhy="Your social answers place relatively greater weight on individual responsibility and opportunity, while your economic answers are closer to the middle.";
 }else{
   primary="Mixed / cross-pressured";
   primaryWhy="Your economic and social answers do not form a strong shared direction.";
 }

 if(c<=-25&&s<=-15)add("Socially liberal / progressive themes","Your answers combine openness to social change with support for individual autonomy or reducing social disadvantage.");
 else if(c>=25)add("Culturally conservative / gradualist themes","Your answers place relatively greater weight on continuity, tradition and gradual social change.");
 if(d<=-25&&l<=-20)add("Liberal-democratic / civil-libertarian themes","Your answers place weight on pluralism, accountability, limits on state power and individual liberties.");
 else if(d<=-25)add("Pluralist-democratic emphasis","Your answers strongly value dissent, institutional checks and accountability.");
 else if(d>=25)add("Executive-capacity emphasis","Your answers give comparatively more weight to an elected government's ability to act. This does not by itself imply opposition to democracy.");
 if(g<=-25)add("Internationalist themes","Your answers lean toward international cooperation and shared rules.");
 else if(g>=25)add("National-priority themes","Your answers give relatively greater weight to national sovereignty and domestic priorities.");
 if(v<=-30)add("Equity-focused approach to fairness","Your answers place greater weight on correcting unequal starting points.");
 else if(v>=30)add("Merit-focused approach to fairness","Your answers place greater weight on individual effort and merit.");
 const rows=secondary.length?secondary.map(t=>'<div class="tendency-item"><span class="chip">'+recEsc(t.label)+'</span><p>'+recEsc(t.reason)+'</p></div>').join(""):'<p class="sub">No additional secondary tendency crossed the exploratory thresholds. Your seven dimension scores remain available below.</p>';
 return '<section class="tendency-panel"><h3>Your broad political orientation</h3><p class="sub">A cautious summary based on your economic and social dimensions — not a definitive ideology or party identity.</p><div class="primary-tendency"><span class="primary-kicker">Primary pattern</span><h4>'+recEsc(primary)+'</h4><p>'+recEsc(primaryWhy)+'</p></div><h4 class="secondary-heading">Other tendencies in your answers</h4>'+rows+'<p class="tendency-caveat"><b>Important limits:</b> This primary description is a rule-based reading of two separate dimensions, not a combined score. Secondary tendencies can coexist with it. The questionnaire may suggest broad centre-left, centre-right, liberal, conservative, socialist-leaning or internationalist themes, but it cannot reliably classify someone as a communist, fascist, far-right extremist or member of a party. Those traditions require beliefs and commitments this assessment does not measure. “Democratic” describes support for a political system, not one point on the left–right spectrum. No label here is a party recommendation.</p></section>';
}
function compassHtml(scores){
  const cx=350,cy=285,r=178,labelR=245;
  const fmt=n=>(n>0?"+":"")+n;
  const point=(index,value,radius)=>{
    const angle=(-90+index*360/polarities.length)*Math.PI/180;
    const rr=radius*(value/100);
    return [cx+Math.cos(angle)*rr,cy+Math.sin(angle)*rr];
  };
  const polygon=level=>polarities.map((p,i)=>point(i,level,r)).map(([x,y])=>x.toFixed(1)+","+y.toFixed(1)).join(" ");
  const axes=polarities.map((p,i)=>{
    const [x,y]=point(i,100,r);
    const [lx,ly]=point(i,100,labelR);
    const score=scores[p.key],normalised=(score+100)/2;
    const [px,py]=point(i,normalised,r);
    const anchor=Math.abs(lx-cx)<18?"middle":lx>cx?"start":"end";
    const labelY=ly+(ly<cy?-5:ly>cy?13:4);
    return {p,score,normalised,x,y,lx,ly:labelY,px,py,anchor};
  });
  const valuePoints=axes.map(a=>a.px.toFixed(1)+","+a.py.toFixed(1)).join(" ");
  const grid=[20,40,60,80,100].map(v=>'<polygon points="'+polygon(v)+'" class="radar-grid"/>').join("");
  const spokes=axes.map(a=>'<line x1="'+cx+'" y1="'+cy+'" x2="'+a.x.toFixed(1)+'" y2="'+a.y.toFixed(1)+'" class="radar-spoke"/>').join("");
  const labels=axes.map(a=>'<text x="'+a.lx.toFixed(1)+'" y="'+a.ly.toFixed(1)+'" text-anchor="'+a.anchor+'" class="radar-label">'+recEsc(a.p.label)+'</text><text x="'+a.lx.toFixed(1)+'" y="'+(a.ly+17).toFixed(1)+'" text-anchor="'+a.anchor+'" class="radar-value">'+fmt(a.score)+'</text>').join("");
  const dots=axes.map(a=>'<circle cx="'+a.px.toFixed(1)+'" cy="'+a.py.toFixed(1)+'" r="5" class="radar-dot"><title>'+recEsc(a.p.label)+': '+fmt(a.score)+'</title></circle>').join("");
  return '<section class="radar-panel" aria-labelledby="radar-title"><div class="radar-heading"><span class="compass-kicker">Your results at a glance</span><h2 id="radar-title">Your political outlook, across seven dimensions</h2><p>Each spoke represents a separate dimension. The centre is −100; the outer edge is +100. The middle ring marks 0. No single left–right label is used to combine your answers.</p></div><div class="radar-chart-wrap"><svg class="radar-svg" viewBox="0 0 700 570" role="img" aria-labelledby="radar-svg-title radar-svg-desc"><title id="radar-svg-title">Seven-dimensional political outlook radar chart</title><desc id="radar-svg-desc">'+axes.map(a=>recEsc(a.p.label)+' '+fmt(a.score)).join('; ')+'. Each dimension is scored independently from minus 100 to plus 100; zero is the middle ring.</desc>'+grid+spokes+'<polygon points="'+valuePoints+'" class="radar-area"/>'+dots+labels+'</svg></div><div class="radar-scale"><span>Centre: −100</span><span>Middle ring: 0</span><span>Outer edge: +100</span></div><p class="compass-note">This chart is a visual summary of seven independent scores, not a validated political test. The filled area is only a visual aid: its size and shape are not an overall ideology score, and dimensions should be read separately.</p></section>';
}
function crossPressuresHtml(scores){
  const items=[];
  if(scores.economic<=-20&&scores.liberty<=-20)items.push(["Public provision and civil-liberty safeguards","Your answers favour a stronger public role in economic provision while also favouring limits on state power. A practical question is how public services can be delivered with strong rights, oversight and privacy protections."]);
  if(scores.democracy>=20&&scores.liberty<=-20)items.push(["Government capacity and limits on state power","Your answers give relatively more weight to an elected government's ability to act, while also favouring limits on state power. The design of safeguards and accountability may matter especially to you."]);
  if(scores.democracy<=-20&&scores.liberty>=20)items.push(["Institutional checks and active government","Your answers favour checks on executive power while also allowing a broader role for state action and regulation. This raises questions about how independent oversight and effective implementation can work together."]);
  if(scores.economic>=20&&scores.social<=-20)items.push(["Market-led economics and collective support","Your answers lean toward market-led allocation while also emphasising collective support or reducing disadvantage. This may point to interest in combining private enterprise with targeted social protections."]);
  if(!items.length)return '<div class="insight"><strong>No prominent cross-pressure identified</strong><p>These simple comparison rules did not identify a strong tension in the dimensions shown. That does not mean your views are perfectly consistent; it only means no listed pattern crossed the exploratory thresholds.</p></div>';
  return items.map(([title,text])=>'<div class="insight"><strong>'+recEsc(title)+'</strong><p>'+recEsc(text)+'</p></div>').join("");
}
function renderResults(scores){
  const overall=headline(scores),summary=buildSummary(scores);
  let html='<div class="report-meta"><span>POLITICA · POLITICAL SELF-REFLECTION</span><span>RESULTS REPORT · '+recEsc(new Date().toLocaleDateString())+'</span></div>'+`<div class="result-hero"><span class="profile-pill">Your POLITICA profile</span><h1 tabindex="-1">${overall}</h1><p>This is a provisional description of patterns in your responses — not a fixed identity, a scientific diagnosis or a recommendation about any party or candidate.</p></div>`+compassHtml(scores)+politicalTendencyHtml(scores)+`<div class="result-grid"><div class="panel dimensions-panel"><h3>Your dimensions</h3><p class="sub dimensions-intro">Seven independent scales. Each shows where your answers sit between two broad tendencies.</p>${polarities.map(p=>{let v=scores[p.key],pct=50+v/2;return `<div class="dimension-row"><div class="rowtop"><span>${p.label}</span><span>${descriptor(p,v)}</span></div><div class="bar" role="img" aria-label="${p.label}: ${descriptor(p,v)}"><i style="width:${pct}%"></i></div><div class="scale-labels"><span>${p.left}</span><span>${p.right}</span></div><details class="dimension-detail"><summary>What this scale means</summary><p><b>Lower:</b> ${p.explain.lower}</p><p><b>Higher:</b> ${p.explain.higher}</p><p><b>Centre:</b> ${p.explain.centre}</p></details></div>`}).join("")}</div><div class="panel"><h3>Summary of your answers</h3><p class="sub">A transparent, questionnaire-based summary</p>${summary.map(x=>`<div class="insight"><strong>${x.title}</strong><p>${x.text}</p></div>`).join("")}<div class="insight"><strong>Themes in your answers</strong><p>These are exploratory similarities between patterns in your answers and broad political traditions. They are not political identity labels or a judgement of which view is better. Scores run from \u2212100 to +100, and a theme appears when a score reaches the threshold shown.</p>${ideology(scores).map(t=>`<p><span class="chip">${t.label}</span> ${t.why}</p>`).join("")}</div></div></div><div class="panel"><h3>What your answers suggest</h3><p class="sub">A concise reading across the seven sections</p><div class="insight"><strong>Potential strengths in your reasoning</strong><p>Your answers can reveal where you balance competing principles — for example, economic freedom and social protection, or public safety and individual liberty. Look at the dimensions with mixed scores as places where context matters to you.</p></div><div class="insight"><strong>Cross-dimensional patterns to reflect on</strong><p>These observations compare separate dimensions. They describe possible policy-design questions, not contradictions or diagnoses.</p></div>${crossPressuresHtml(scores)}<div class="insight"><strong>What this assessment cannot tell you</strong><p>It cannot infer your party preference, vote, religion, caste, identity or political behaviour. It does not measure knowledge, morality or intelligence. Some statements are broad and may mean different things in different countries.</p></div></div>${recommendationsHtml(scores)}<div class="report-endnote">POLITICA · A non-partisan, experimental self-reflection tool · Not a validated psychometric instrument · No party or voting recommendation.</div><div class="caveat"><b>Method note:</b> This demo uses transparent, simple scoring rules to summarise your selections. It does not call an AI model, and the result is not a validated psychometric instrument. For a deeper interpretation, you can copy your answers into ChatGPT using the optional prompt below. Avoid sharing identifying or sensitive details.</div><div class="caveat" role="note"><b>Privacy warning:</b> Copied, exported or printed results may reveal your personal political views. Share them carefully, and only with tools or people you trust.</div><div class="actions"><button class="btn btn-dark" onclick="copyPrompt()">Copy answers + AI analysis prompt</button><button class="btn btn-light" onclick="copySummary()">Copy summary (text only)</button><button class="btn btn-light" onclick="downloadShareCard()">Download share card (PNG)</button><button class="btn btn-light" onclick="window.print()">Save report as PDF / Print</button><button class="btn btn-light" onclick="downloadAnswers()">Export answers (JSON)</button><button class="btn btn-light" onclick="restart()">Retake assessment</button></div>`;
  document.getElementById("results").innerHTML=html;document.getElementById("results").classList.remove("hidden");hydrateBookCovers();document.getElementById("results").scrollIntoView({behavior:"smooth"});const h=document.querySelector("#results h1");if(h)h.focus({preventScroll:true})}
