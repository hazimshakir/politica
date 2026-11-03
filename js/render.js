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
      h+='<h4>Thinkers</h4>'+cards.map(([slot,c])=>'<div class="insight"><strong>'+recEsc(c.name)+'</strong> <span class="chip">'+slot+'</span><p>'+recEsc(c.lifespan)+' \u00b7 Period compared: '+recEsc(c.phase.label)+(c.phase.years?' ('+recEsc(c.phase.years)+')':'')+(c.otherPhases?'. Other documented periods exist; the closest is shown.':'')+'</p><p><b>Where you overlap:</b> '+labs(c.overlaps)+'.<br><b>Partly different:</b> '+labs(c.partlyDifferent)+'.<br><b>Where you differ:</b> '+labs(c.differences)+'.<br><b>Not comparable:</b> '+labs(c.notComparable)+'.</p>'+c.rows.map(r=>'<p><b>'+recEsc(lab(r.dim))+'</b> \u2014 '+recEsc(r.relation)+'. You: '+recEsc(r.user?r.user.text:"no score")+(r.thinker?'. Them: '+recEsc(r.thinker.orientation.text)+'. Documented: '+recEsc(r.thinker.documented)+' Interpretive confidence: '+recEsc(r.thinker.conf)+'. Sources: '+src(r.thinker.sources)+'.':'. '+recEsc(r.note||""))+'</p>').join("")+'</div>').join("");
    }else h+='<p class="sub">No AI-reviewed thinkers are comparable with your results yet.</p>';
    if(tm.notes.length&&cards.length)h+='<p class="sub">'+tm.notes.map(recEsc).join(" ")+'</p>';
    if(books.length){
      h+='<h4>Books</h4>'+books.map(p=>'<div class="insight"><strong>'+recEsc(p.title)+'</strong> <span class="chip">'+recEsc(p.slot)+'</span><p>'+recEsc(p.author)+', '+recEsc(p.year==null?'date uncertain':p.year)+' \u00b7 Tradition: '+p.traditions.map(recEsc).join(", ")+' \u00b7 Grounded in: '+recEsc(p.premise)+'</p><p>'+(p.stance?'On <b>'+recEsc(lab(p.dimension))+'</b> the book argues: '+recEsc(orientation(p.dimension,p.stance.score).text)+'. '+recEsc(p.stance.documented||""):'A broad introductory survey of major political ideologies; it is not scored as if it represented one political position.')+' Sources: '+src(p.sources)+'.</p></div>').join("");
    }else h+='<p class="sub">No AI-reviewed books are available for your results yet.</p>';
    if(bm.notes.length&&books.length)h+='<p class="sub">'+bm.notes.map(recEsc).join(" ")+'</p>';
    return h+'</div>';
  }catch(e){console.error("POLITICA recommendations error",e);return none}}
/* Milestone 4: two-axis compass and cross-dimensional reflection. */
function compassHtml(scores){
  const xScore=scores.economic;
  const authority=Math.round((scores.democracy+scores.liberty)/2);
  const x=280+xScore*2, y=240-authority*2;
  const fmt=n=>(n>0?"+":"")+n;
  const position=xScore<=-20?"Public-provision leaning":xScore>=20?"Market-oriented leaning":"Economically mixed";
  const vertical=authority>=20?"More state-authority leaning":authority<=-20?"More liberty / institutional-restraint leaning":"Mixed authority and restraint";
  return `<section class="compass-panel" aria-labelledby="compass-title">
    <div class="compass-heading"><span class="compass-kicker">Your results at a glance</span><h2 id="compass-title">Your political compass</h2>
    <p>Two broad axes show where your answers sit. The marker is calculated from your economic score and the average of your democracy and liberty scores.</p></div>
    <div class="compass-layout">
      <div class="compass-y compass-y-top">MORE STATE AUTHORITY<br><span>Executive capacity · state intervention</span></div>
      <div class="compass-chart-wrap">
        <svg class="compass-svg" viewBox="0 0 560 500" role="img" aria-labelledby="compass-svg-title compass-svg-desc">
          <title id="compass-svg-title">POLITICA two-axis political compass</title>
          <desc id="compass-svg-desc">Your marker is at economic score ${fmt(xScore)} and authority-restraint score ${fmt(authority)}. The horizontal axis runs from public provision to market-led allocation. The vertical axis runs from individual liberty and institutional restraint to state authority.</desc>
          <rect x="80" y="40" width="200" height="200" fill="#8b3438" fill-opacity=".48"/>
          <rect x="280" y="40" width="200" height="200" fill="#a56a27" fill-opacity=".38"/>
          <rect x="80" y="240" width="200" height="200" fill="#087f78" fill-opacity=".34"/>
          <rect x="280" y="240" width="200" height="200" fill="#245ca0" fill-opacity=".38"/>
          <g stroke="rgba(255,255,255,.13)" stroke-width="1">
            <path d="M130 40V440 M180 40V440 M230 40V440 M330 40V440 M380 40V440 M430 40V440 M80 90H480 M80 140H480 M80 190H480 M80 290H480 M80 340H480 M80 390H480"/>
          </g>
          <rect x="80" y="40" width="400" height="400" rx="5" fill="none" stroke="rgba(255,255,255,.48)" stroke-width="1.5"/>
          <path d="M280 40V440 M80 240H480" stroke="rgba(255,255,255,.7)" stroke-width="1.4" stroke-dasharray="5 5"/>
          <g fill="#f3e7d0" font-family="Georgia,serif" font-size="13" letter-spacing="2" text-anchor="middle">
            <text x="180" y="135">PUBLIC PROVISION</text><text x="380" y="135">MARKET-LED</text>
            <text x="180" y="345">PUBLIC PROVISION</text><text x="380" y="345">MARKET-LED</text>
          </g>
          <circle cx="${x}" cy="${y}" r="27" fill="#d9f5f2" fill-opacity=".09"/>
          <circle cx="${x}" cy="${y}" r="15" fill="#d9f5f2" fill-opacity=".2"/>
          <circle cx="${x}" cy="${y}" r="7" fill="#fff" stroke="#8fe4d8" stroke-width="3"/>
          <circle cx="${x}" cy="${y}" r="3" fill="#0a1220"/>
        </svg>
        <div class="compass-axis-x"><span>← PUBLIC PROVISION</span><span>MARKET-LED →</span></div>
      </div>
      <div class="compass-y compass-y-bottom">MORE INDIVIDUAL LIBERTY &amp; INSTITUTIONAL RESTRAINT<br><span>Limits on state power · civil-liberty safeguards</span></div>
    </div>
    <div class="compass-readout"><span><b>Economic:</b> ${position} (${fmt(xScore)})</span><span><b>Authority / restraint:</b> ${vertical} (${fmt(authority)})</span></div>
    <p class="compass-note">This is an illustrative map, not a standard or scientifically validated political-compass test. The vertical coordinate averages two separate dimensions—democratic checks and state power/civil liberty—so it can simplify differences between them. Read the seven individual scores below for the fuller picture.</p>
  </section>`;
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
  let html=compassHtml(scores)+`<div class="result-hero"><span class="profile-pill">Your POLITICA profile</span><h1 tabindex="-1">${overall}</h1><p>This is a provisional description of patterns in your responses — not a fixed identity, a scientific diagnosis or a recommendation about any party or candidate.</p></div><div class="result-grid"><div class="panel"><h3>Your dimensions</h3><p class="sub">Each line compares two broad tendencies. These are descriptive axes, not a ranking.</p>${polarities.map(p=>{let v=scores[p.key],pct=50+v/2;return `<div class="dimension-row"><div class="rowtop"><span>${p.label}</span><span>${descriptor(p,v)}</span></div><div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div><div class="scale-labels"><span>${p.left}</span><span>${p.right}</span></div><p class="sub"><b>Lower end:</b> ${p.explain.lower} <b>Higher end:</b> ${p.explain.higher} <b>Near the centre:</b> ${p.explain.centre}</p></div>`}).join("")}</div><div class="panel"><h3>Summary of your answers</h3><p class="sub">A transparent, questionnaire-based summary</p>${summary.map(x=>`<div class="insight"><strong>${x.title}</strong><p>${x.text}</p></div>`).join("")}<div class="insight"><strong>Themes in your answers</strong><p>These are exploratory similarities between patterns in your answers and broad political traditions. They are not political identity labels or a judgement of which view is better. Scores run from \u2212100 to +100, and a theme appears when a score reaches the threshold shown.</p>${ideology(scores).map(t=>`<p><span class="chip">${t.label}</span> ${t.why}</p>`).join("")}</div></div></div><div class="panel"><h3>What your answers suggest</h3><p class="sub">A concise reading across the seven sections</p><div class="insight"><strong>Potential strengths in your reasoning</strong><p>Your answers can reveal where you balance competing principles — for example, economic freedom and social protection, or public safety and individual liberty. Look at the dimensions with mixed scores as places where context matters to you.</p></div><div class="insight"><strong>Cross-dimensional patterns to reflect on</strong><p>These observations compare separate dimensions. They describe possible policy-design questions, not contradictions or diagnoses.</p></div>${crossPressuresHtml(scores)}<div class="insight"><strong>What this assessment cannot tell you</strong><p>It cannot infer your party preference, vote, religion, caste, identity or political behaviour. It does not measure knowledge, morality or intelligence. Some statements are broad and may mean different things in different countries.</p></div></div>${recommendationsHtml(scores)}<div class="caveat"><b>Method note:</b> This demo uses transparent, simple scoring rules to summarise your selections. It does not call an AI model, and the result is not a validated psychometric instrument. For a deeper interpretation, you can copy your answers into ChatGPT using the optional prompt below. Avoid sharing identifying or sensitive details.</div><div class="caveat" role="note"><b>Privacy warning:</b> Copied, exported or printed results may reveal your personal political views. Share them carefully, and only with tools or people you trust.</div><div class="actions"><button class="btn btn-dark" onclick="copyPrompt()">Copy answers + AI analysis prompt</button><button class="btn btn-light" onclick="copySummary()">Copy summary (text only)</button><button class="btn btn-light" onclick="window.print()">Download / print report</button><button class="btn btn-light" onclick="downloadAnswers()">Export answers (JSON)</button><button class="btn btn-light" onclick="restart()">Retake assessment</button></div>`;
  document.getElementById("results").innerHTML=html;document.getElementById("results").classList.remove("hidden");document.getElementById("results").scrollIntoView({behavior:"smooth"});const h=document.querySelector("#results h1");if(h)h.focus({preventScroll:true})}
