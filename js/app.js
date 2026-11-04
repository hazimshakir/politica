/* POLITICA app.js — assessment page: state and user actions. Needs scoring.js, storage.js and render.js loaded first. */
let answers={},current=0,reviewMode=false,finished=false;
function persist(){saveProgress(answers,current,finished)}
function render(){renderQuiz(current,answers)}
function focusQuestion(){const f=document.getElementById("questionSet");if(f)f.focus({preventScroll:true})}
function show(){render();focusQuestion();persist()}
function jumpSection(i){const n=sectionStart(i);const nx=all.findIndex((q,j)=>j>=n&&answers[j]===undefined);current=nx<0?n:nx;show()}
function choose(v){answers[current]=v;render();const c=document.querySelector("#quizCard input:checked");if(c)c.focus({preventScroll:true});persist()}
function previous(){if(current>0){current--;show()}}
function next(){
  if(answers[current]===undefined)return;
  if(reviewMode){
    const m=firstUnanswered(answers);
    if(m===-1){reviewMode=false;showResults()}else{current=m;show()}
    return}
  if(current<all.length-1){current++;show();return}
  const missing=firstUnanswered(answers);
  if(missing===-1){showResults();return}
  reviewMode=true;current=missing;show();
  const left=all.length-Object.keys(answers).length;
  toast(`Please answer all questions first: ${left} left. Going to question ${missing+1}.`)}
function showResults(restoring){
  finished=true;if(!restoring)persist();
  document.getElementById("assessment").classList.add("hidden");
  const scores=calculateAll(answers);
  renderResults(scores);
  window.lastScores=scores;
  const resultHeading=document.querySelector("#results h1");if(resultHeading){resultHeading.setAttribute("tabindex","-1");resultHeading.focus({preventScroll:true})}}
function answerLabel(i){const s=scale.find(x=>x[1]===answers[i]);return s?s[0]:null}
function answerText(){return all.map((q,i)=>`${i+1}. [${sections[q.section].title}] ${q.text}\nAnswer: ${answerLabel(i)?answerLabel(i)+" ("+answers[i]+"/5)":"Not answered"}`).join("\n\n")}
function copyPrompt(){if(!confirm("Privacy warning: your copied answers may reveal personal political views. Share them carefully. Copy anyway?"))return;let prompt=`Please provide a politically neutral, nuanced interpretation of my voluntary political self-assessment. Do not recommend parties, candidates or votes. Treat this as self-reflection, not a validated psychological test. Analyse each dimension separately, identify evidence from my answers, explain mixed or contradictory preferences without forcing a label, distinguish established ideologies carefully, and state what cannot be inferred. Do not infer my identity, religion, caste or voting preference.\n\nMY ANSWERS:\n${answerText()}\n\nPlease discuss economic philosophy, social equality, culture, democracy, government and civil liberties, national/global outlook, and personal values. End with a cautious summary and useful follow-up questions.`;navigator.clipboard.writeText(prompt).then(()=>toast("Copied. Open ChatGPT and paste your prompt." )).catch(()=>{let t=document.createElement("textarea");t.value=prompt;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();toast("Copied. Open ChatGPT and paste your prompt.")});}
function downloadAnswers(){let data={product:"POLITICA",exportVersion:1,exportedAt:new Date().toISOString(),privacyWarning:"This file contains your individual answers and may reveal personal political views. Share it carefully, and only with people or tools you trust.",notice:"Voluntary self-assessment; not validated.",answers:all.map((q,i)=>({section:sections[q.section].title,question:q.text,answer:answerLabel(i),value:answers[i]})),scores:window.lastScores};let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="politica-assessment.json";a.click();URL.revokeObjectURL(a.href)}
function politicalTendencyLines(sc){
  const e=sc.economic,s=sc.social,c=sc.culture,d=sc.democracy,l=sc.liberty,g=sc.global,out=[];
  if(e<=-30&&s<=-20)out.push("Left-leaning: economic and social answers both favour public provision, collective support or reducing inequality.");
  else if(e>=30&&s>=20)out.push("Right-leaning: economic and social answers both favour market allocation, individual responsibility or merit.");
  else if((e<=-30&&s>=20)||(e>=30&&s<=-20))out.push("Economically / socially mixed: economic and social preferences point in different directions.");
  else if(Math.abs(e)<20&&Math.abs(s)<20)out.push("Centrist on economic / social axes: both scores are relatively near the middle.");
  if(e<=-65&&s<=-45)out.push("Socialist-leaning themes: strong support for public provision and collective equality; this alone does not establish a complete socialist ideology.");
  if(d<=-25&&l<=-25)out.push("Liberal-democratic / civil-libertarian themes: emphasis on democratic checks, dissent, accountability and limits on state power.");
  if(d>=30&&l>=25)out.push("Executive-authority leaning: comparatively greater weight on government capacity and state action; this does not imply support for dictatorship.");
  if(c>=30)out.push("Culturally conservative / continuity-oriented: greater weight on tradition and gradual change.");
  else if(c<=-30)out.push("Socially progressive / change-oriented: greater openness to social change and evolving norms.");
  if(g<=-30)out.push("Internationalist themes: preference for international cooperation and shared rules.");
  else if(g>=30)out.push("National-priority themes: greater weight on national priorities and sovereignty.");
  if(!out.length)out.push("Mixed / pragmatic combination: scores do not cross the thresholds for the tendencies listed.");
  return out;
}
function copySummary(){
  const sc=window.lastScores;if(!sc)return;
  const note="Privacy note: this summary may reveal personal political views. Share it carefully.";
  const authority=Math.round((sc.democracy+sc.liberty)/2);
  const text=["POLITICA – Summary of my answers ("+new Date().toLocaleDateString()+")","","Political profile: "+headline(sc),"Compass position: economic "+sc.economic+" / authority-restraint "+authority,"","Political tendencies (qualified descriptions, not identity labels):",
    ...politicalTendencyLines(sc).map(x=>"- "+x),"","Dimension scores (-100 to +100):",
    ...polarities.map(p=>"- "+p.label+": "+sc[p.key]+" ("+descriptor(p,sc[p.key])+")"),"",
    ...buildSummary(sc).map(x=>x.title+": "+x.text),"","Themes in your answers (exploratory, not identity labels):",
    ...ideology(sc).map(t=>"- "+t.label+": "+t.why),"",
    "A voluntary, non-validated self-reflection tool. Individual answers are not included.",note].join("\n");
  const done=()=>toast("Summary copied (no individual answers included).");
  navigator.clipboard.writeText(text).then(done).catch(()=>{let t=document.createElement("textarea");t.value=text;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();done()});
}
function downloadShareCard(){
  const sc=window.lastScores;
  if(!sc){toast("Complete the assessment first.");return}
  if(!confirm("This card displays political assessment results and may reveal personal political views. Download it only if you are comfortable sharing that information."))return;
  const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=630;
  const ctx=canvas.getContext("2d");
  const bg=ctx.createLinearGradient(0,0,1200,630);bg.addColorStop(0,"#122540");bg.addColorStop(1,"#081321");ctx.fillStyle=bg;ctx.fillRect(0,0,1200,630);
  ctx.strokeStyle="rgba(255,255,255,.12)";ctx.lineWidth=2;ctx.strokeRect(35,35,1130,560);
  ctx.fillStyle="#e8b75a";ctx.font="700 18px Arial";ctx.fillText("POLITICA / POLITICAL SELF-REFLECTION",75,85);
  ctx.fillStyle="#ffffff";ctx.font="48px Georgia";ctx.fillText("My political profile",75,155);
  ctx.fillStyle="#9fe3d7";ctx.font="bold 27px Arial";ctx.fillText(headline(sc),75,205);
  const left=650,top=225,size=360,half=size/2;
  ctx.fillStyle="rgba(139,52,56,.55)";ctx.fillRect(left,top,half,half);
  ctx.fillStyle="rgba(165,106,39,.45)";ctx.fillRect(left+half,top,half,half);
  ctx.fillStyle="rgba(8,127,120,.42)";ctx.fillRect(left,top+half,half,half);
  ctx.fillStyle="rgba(36,92,160,.48)";ctx.fillRect(left+half,top+half,half,half);
  ctx.strokeStyle="rgba(255,255,255,.55)";ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(left+half,top);ctx.lineTo(left+half,top+size);ctx.moveTo(left,top+half);ctx.lineTo(left+size,top+half);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle="#f3e7d0";ctx.font="bold 15px Arial";ctx.textAlign="center";
  ctx.fillText("LEFT + EXECUTIVE",left+half/2,top+55);ctx.fillText("RIGHT + EXECUTIVE",left+half+half/2,top+55);
  ctx.fillText("LEFT + PLURALIST",left+half/2,top+size-35);ctx.fillText("RIGHT + PLURALIST",left+half+half/2,top+size-35);
  const authority=Math.round((sc.democracy+sc.liberty)/2);
  const px=left+(sc.economic+100)/200*size,py=top+(100-authority)/200*size;
  ctx.beginPath();ctx.arc(px,py,12,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.lineWidth=5;ctx.strokeStyle="#8fe4d8";ctx.stroke();
  ctx.textAlign="left";ctx.fillStyle="#dce6f2";ctx.font="16px Arial";
  ctx.fillText("Economic: "+sc.economic+" | Authority / restraint: "+authority,75,285);
  polarities.forEach(function(p,i){const yy=340+i*30,v=sc[p.key];ctx.fillStyle="#a9bad0";ctx.font="13px Arial";ctx.fillText(p.label,75,yy);ctx.fillStyle="rgba(255,255,255,.14)";ctx.fillRect(290,yy-11,245,7);ctx.fillStyle="#7fd6c8";ctx.fillRect(290,yy-11,245*(v+100)/200,7);ctx.fillStyle="#fff";ctx.fillText((v>0?"+":"")+v,550,yy)});
  ctx.fillStyle="#9fb0c4";ctx.font="13px Arial";ctx.fillText("Illustrative, non-validated result · Not a party or voting recommendation",75,575);
  const link=document.createElement("a");link.download="politica-share-card.png";link.href=canvas.toDataURL("image/png");link.click();
  toast("Share card downloaded. Check it before sharing.");
}
function startOver(){
  if(Object.keys(answers).length&&!confirm("Clear your saved answers and start again?"))return;
  answers={};current=0;reviewMode=false;finished=false;clearProgress();
  document.getElementById("results").classList.add("hidden");document.getElementById("assessment").classList.remove("hidden");
  show();toast("Saved answers cleared.")}
function restart(){answers={};current=0;reviewMode=false;finished=false;clearProgress();document.getElementById("results").classList.add("hidden");document.getElementById("assessment").classList.remove("hidden");show();document.getElementById("assessment").scrollIntoView({behavior:"smooth"})}
/* Keyboard controls: arrows choose a response; Enter advances. */
document.addEventListener("keydown",function(e){
  const card=document.getElementById("quizCard"),assessment=document.getElementById("assessment");
  if(!card||finished||!assessment||assessment.classList.contains("hidden"))return;
  const target=e.target;
  if(target&&(/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))&&target.type!=="radio")return;
  if(!card.contains(target)&&target!==document.body)return;
  if(["ArrowLeft","ArrowUp","ArrowRight","ArrowDown"].includes(e.key)&&!(target&&target.closest("button"))){
    e.preventDefault();
    const values=scale.map(x=>x[1]);let index=values.indexOf(answers[current]);
    if(e.key==="ArrowRight"||e.key==="ArrowDown")index=(index+1)%values.length;
    else index=index<=0?values.length-1:index-1;
    choose(values[index]);return;
  }
  if(e.key==="Enter"&&answers[current]!==undefined&&!(target&&target.closest("button"))){e.preventDefault();next();}
});
(function init(){
  const s=loadSaved();
  if(s){answers=s.answers;current=s.current}
  render();
  if(s&&s.finished){showResults(true);toast("Your saved results were restored.");return}
  if(s)toast(`Saved progress restored: ${Object.keys(answers).length} of ${all.length} answered.`)
})();
