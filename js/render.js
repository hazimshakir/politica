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
  document.getElementById("quizCard").innerHTML=`<div class="quiz-head"><span class="tag">${String(q.section+1).padStart(2,'0')} / ${s.title}</span><span class="counter">QUESTION ${current+1} OF ${all.length}</span></div><h2>${s.title}</h2><p class="hint">${s.desc}</p>${q.scenario?`<div class="scenario" id="scenarioText">${q.scenario}</div>`:''}<fieldset class="fs" id="questionSet" tabindex="-1"${q.scenario?' aria-describedby="scenarioText"':''}><legend class="qtext"><span class="sr-only">Question ${current+1} of ${all.length}. </span>${q.text}</legend><div class="options">${opts}</div></fieldset><div class="navrow"><button class="btn btn-light" onclick="previous()" ${current===0?'disabled':''}>← Back</button><button class="btn btn-dark" onclick="next()" ${answers[current]===undefined?'disabled':''}>${current===all.length-1?'View my profile':'Continue →'}</button></div>`}
/* Thinker and book panel. Shows AI-assessed pilot entries with a clear provisional-status disclosure. */
function recEsc(v){return String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function recommendationsHtml(scores){
  const head='<div class="panel"><h3>Thinkers and books to explore</h3>';
  const none=head+'<p class="sub">Recommendations are not available yet. The pilot book entries have been reviewed by AI. These assessments are provisional: interpretations and source references still require final verification before publication. No entries are currently eligible to display. Your results above are not affected.</p></div>';
  try{
    if(typeof matchThinkers!=="function"||typeof selectBooks!=="function"||typeof validateData!=="function")return none;
    const errs=validateData(THINKERS,BOOKS);
    if(errs.length){console.error("POLITICA recommendations hidden: data check failed",errs);return none}
    const lab=k=>{const p=polarities.find(x=>x.key===k);return p?p.label:k};
    const labs=a=>a.length?a.map(lab).map(recEsc).join(", "):"none among the comparable dimensions";
    const src=a=>(a||[]).map(s=>(s.url?'<a href="'+recEsc(s.url)+'" target="_blank" rel="noopener noreferrer">'+recEsc(s.citation)+'</a>':recEsc(s.citation))+(s.locator?" ("+recEsc(s.locator)+")":"")).join("; ");
    const okT=id=>{const t=THINKERS.find(x=>x.id===id);return t&&["reviewed","ai-reviewed"].includes(t.status)};
    const okB=id=>{const b=BOOKS.find(x=>x.id===id);return b&&["reviewed","ai-reviewed"].includes(b.status)};
    const tm=matchThinkers(scores,THINKERS),bm=selectBooks(scores,BOOKS);
    const cards=[...tm.overlap.map(c=>["Closest overlap",c]),...tm.contrast.map(c=>["Informative contrast",c])].filter(([,c])=>okT(c.thinkerId));
    const books=bm.picks.filter(p=>okB(p.id));
    if(!cards.length&&!books.length){
      const thinkerList=THINKERS.filter(t=>t&&t.status==="ai-reviewed").map(t=>{
        const dims=(t.phases||[]).flatMap(p=>Object.keys(p.dims||{})).filter((d,i,a)=>a.indexOf(d)===i);
        return '<div class="insight"><strong>'+recEsc(t.name)+'</strong><p>'+recEsc(t.lifespan)+' · '+recEsc(t.summary)+'</p><p><b>Available comparison areas:</b> '+labs(dims)+'.</p></div>';
      }).join("");
      const bookList=BOOKS.filter(b=>b&&b.status==="ai-reviewed").map(b=>{
        const dims=Object.keys(b.argues||{});
        return '<div class="insight"><strong>'+recEsc(b.title)+'</strong><p>'+recEsc(b.author)+', '+recEsc(b.year==null?'date uncertain':b.year)+' · '+(b.type==='survey'?'Broad introductory survey':recEsc(b.premise||''))+'</p><p><b>Available areas:</b> '+(b.type==='survey'?'Not assigned a single ideological position':labs(dims))+'.</p><p>Sources: '+src(b.sources)+'.</p></div>';
      }).join("");
      return head+'<p class="sub">The current pilot dataset does not have enough comparable dimensions to generate a personalised match for this profile. You can still explore these AI-reviewed pilot entries. They are provisional interpretations; source locators and assessments require further verification. They are not rankings or political identity labels.</p><h4>Pilot thinkers</h4>'+thinkerList+'<h4>Pilot books</h4>'+bookList+'</div>';
    }
    let h=head+'<p class="sub">AI-reviewed pilot recommendations. These are provisional interpretations based on cited works, not definitive scholarly assessments, political identity labels or rankings. Source locators may require further verification. Each dimension is compared separately.</p>';
    if(cards.length){
      h+='<h4>Thinkers</h4>'+cards.map(([slot,c])=>'<div class="insight"><strong>'+recEsc(c.name)+'</strong> <span class="chip">'+slot+'</span><p>'+recEsc(c.lifespan)+' \u00b7 Period compared: '+recEsc(c.phase.label)+(c.phase.years?' ('+recEsc(c.phase.years)+')':'')+(c.otherPhases?'. Other documented periods exist; the closest is shown.':'')+'</p><p><b>Comparison at a glance:</b> '+c.overlaps.length+' close dimension(s), '+c.partlyDifferent.length+' partly different, '+c.differences.length+' clearly different, '+c.notComparable.length+' not comparable. Descriptive comparison only, not endorsement or an overall similarity score.</p><p><b>Where you overlap:</b> '+labs(c.overlaps)+'.<br><b>Partly different:</b> '+labs(c.partlyDifferent)+'.<br><b>Where you differ:</b> '+labs(c.differences)+'.<br><b>Not comparable:</b> '+labs(c.notComparable)+'.</p>'+c.rows.map(r=>'<p><b>'+recEsc(lab(r.dim))+'</b> \u2014 '+recEsc(r.relation)+'. You: '+recEsc(r.user?r.user.text:"no score")+(r.thinker?'. Them: '+recEsc(r.thinker.orientation.text)+'. Documented: '+recEsc(r.thinker.documented)+' Interpretive confidence: '+recEsc(r.thinker.conf)+'. Sources: '+src(r.thinker.sources)+'.':'. '+recEsc(r.note||""))+'</p>').join("")+'</div>').join("");
    }else h+='<p class="sub">No AI-reviewed thinkers are comparable with your results yet.</p>';
    if(tm.notes.length&&cards.length)h+='<p class="sub">'+tm.notes.map(recEsc).join(" ")+'</p>';
    if(books.length){
      h+='<h4>Books</h4>'+books.map(p=>'<div class="insight"><strong>'+recEsc(p.title)+'</strong> <span class="chip">'+recEsc(p.slot)+'</span><p>'+recEsc(p.author)+', '+recEsc(p.year==null?'date uncertain':p.year)+' \u00b7 Tradition: '+p.traditions.map(recEsc).join(", ")+' \u00b7 Focus: '+recEsc(p.premise)+'</p><p><b>Why it appears:</b> '+(p.stance?'It offers a useful comparison on <b>'+recEsc(lab(p.dimension))+'</b>. Its argument has a '+recEsc(orientation(p.dimension,p.stance.score).text)+'; this does not mean you agree with every argument in the book.':'It provides a broad introductory survey across political ideologies. It is included for context, not because it has one ideological score.')+'</p><p><b>What to look for:</b> '+(p.stance?recEsc(p.stance.documented||"Read the cited passages to examine the argument and its historical context."):'Use it to compare traditions and concepts across the political spectrum.')+' Sources: '+src(p.sources)+'.</p></div>').join("");
    }else h+='<p class="sub">No AI-reviewed books are available for your results yet.</p>';
    if(bm.notes.length&&books.length)h+='<p class="sub">'+bm.notes.map(recEsc).join(" ")+'</p>';
    return h+'</div>';
  }catch(e){console.error("POLITICA recommendations error",e);return none}}
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
  let html='<div class="report-meta"><span>POLITICA · POLITICAL SELF-REFLECTION</span><span>RESULTS REPORT · '+recEsc(new Date().toLocaleDateString())+'</span></div>'+`<div class="result-hero"><span class="profile-pill">Your POLITICA profile</span><h1 tabindex="-1">${overall}</h1><p>This is a provisional description of patterns in your responses — not a fixed identity, a scientific diagnosis or a recommendation about any party or candidate.</p></div>`+compassHtml(scores)+politicalTendencyHtml(scores)+`<div class="result-grid"><div class="panel"><h3>Your dimensions</h3><p class="sub">Each line compares two broad tendencies. These are descriptive axes, not a ranking.</p>${polarities.map(p=>{let v=scores[p.key],pct=50+v/2;return `<div class="dimension-row"><div class="rowtop"><span>${p.label}</span><span>${descriptor(p,v)}</span></div><div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div><div class="scale-labels"><span>${p.left}</span><span>${p.right}</span></div><p class="sub"><b>Lower end:</b> ${p.explain.lower} <b>Higher end:</b> ${p.explain.higher} <b>Near the centre:</b> ${p.explain.centre}</p></div>`}).join("")}</div><div class="panel"><h3>Summary of your answers</h3><p class="sub">A transparent, questionnaire-based summary</p>${summary.map(x=>`<div class="insight"><strong>${x.title}</strong><p>${x.text}</p></div>`).join("")}<div class="insight"><strong>Themes in your answers</strong><p>These are exploratory similarities between patterns in your answers and broad political traditions. They are not political identity labels or a judgement of which view is better. Scores run from \u2212100 to +100, and a theme appears when a score reaches the threshold shown.</p>${ideology(scores).map(t=>`<p><span class="chip">${t.label}</span> ${t.why}</p>`).join("")}</div></div></div><div class="panel"><h3>What your answers suggest</h3><p class="sub">A concise reading across the seven sections</p><div class="insight"><strong>Potential strengths in your reasoning</strong><p>Your answers can reveal where you balance competing principles — for example, economic freedom and social protection, or public safety and individual liberty. Look at the dimensions with mixed scores as places where context matters to you.</p></div><div class="insight"><strong>Cross-dimensional patterns to reflect on</strong><p>These observations compare separate dimensions. They describe possible policy-design questions, not contradictions or diagnoses.</p></div>${crossPressuresHtml(scores)}<div class="insight"><strong>What this assessment cannot tell you</strong><p>It cannot infer your party preference, vote, religion, caste, identity or political behaviour. It does not measure knowledge, morality or intelligence. Some statements are broad and may mean different things in different countries.</p></div></div>${recommendationsHtml(scores)}<div class="report-endnote">POLITICA · A non-partisan, experimental self-reflection tool · Not a validated psychometric instrument · No party or voting recommendation.</div><div class="caveat"><b>Method note:</b> This demo uses transparent, simple scoring rules to summarise your selections. It does not call an AI model, and the result is not a validated psychometric instrument. For a deeper interpretation, you can copy your answers into ChatGPT using the optional prompt below. Avoid sharing identifying or sensitive details.</div><div class="caveat" role="note"><b>Privacy warning:</b> Copied, exported or printed results may reveal your personal political views. Share them carefully, and only with tools or people you trust.</div><div class="actions"><button class="btn btn-dark" onclick="copyPrompt()">Copy answers + AI analysis prompt</button><button class="btn btn-light" onclick="copySummary()">Copy summary (text only)</button><button class="btn btn-light" onclick="downloadShareCard()">Download share card (PNG)</button><button class="btn btn-light" onclick="window.print()">Save report as PDF / Print</button><button class="btn btn-light" onclick="downloadAnswers()">Export answers (JSON)</button><button class="btn btn-light" onclick="restart()">Retake assessment</button></div>`;
  document.getElementById("results").innerHTML=html;document.getElementById("results").classList.remove("hidden");document.getElementById("results").scrollIntoView({behavior:"smooth"});const h=document.querySelector("#results h1");if(h)h.focus({preventScroll:true})}
