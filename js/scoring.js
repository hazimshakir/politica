/* POLITICA scoring.js — validates the question data (questions.js, loaded first) and builds the structures the pages use.
   Contains no page (DOM) code. */
function validateQuestionData(){
  const bad=m=>{throw new Error("POLITICA question data error: "+m)};
  if(!Array.isArray(scale)||!scale.length)bad("scale is empty");
  const keys={};
  DIMENSIONS.forEach(d=>{
    ["key","title","short","desc","label","left","right"].forEach(f=>{if(!d[f])bad(`dimension "${d.key||"?"}" is missing "${f}"`)});
    if(keys[d.key])bad(`duplicate dimension key "${d.key}"`);keys[d.key]=0});
  const ids={};
  QUESTIONS.forEach((q,n)=>{
    const w=`question #${n+1} (${q.id||"no id"})`;
    if(!q.id||ids[q.id])bad(`${w} has a missing or duplicate id`);ids[q.id]=1;
    if(!(q.dimension in keys))bad(`${w} has unknown dimension "${q.dimension}"`);
    if(![-1,0,1].includes(q.direction))bad(`${w} needs direction -1, 0 or 1`);
    if(!q.text)bad(`${w} has no text`);
    if(q.direction!==0)keys[q.dimension]++});
  DIMENSIONS.forEach(d=>{if(!keys[d.key])bad(`dimension "${d.key}" has no scored question`)})}
validateQuestionData();
/* Questions are grouped by dimension (dimension order, then written order) so sections stay contiguous. */
const sections=DIMENSIONS.map(d=>({title:d.title,short:d.short,desc:d.desc,questions:QUESTIONS.filter(q=>q.dimension===d.key)}));
const all=[]; sections.forEach((s,si)=>s.questions.forEach((q,qi)=>all.push({id:q.id,section:si,index:qi,text:q.text,kind:q.kind,scenario:q.scenario,dir:q.direction})));
const polarities=DIMENSIONS.map((d,i)=>({section:i,key:d.key,label:d.label,left:d.left,right:d.right}));

/* ---------- Scoring and text summaries (no page/DOM code in this file) ---------- */
function sectionStart(i){return sections.slice(0,i).reduce((n,s)=>n+s.questions.length,0)}
function firstUnanswered(answers){return all.findIndex((q,i)=>answers[i]===undefined)}
function calculate(p,answers){
  const vals=[];
  all.forEach((q,i)=>{
    if(q.section!==p.section||!q.dir)return;
    const a=answers[i];
    if(a!==undefined)vals.push((a-3)*q.dir)});
  if(!vals.length)return 0;
  return Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*50)}
function calculateAll(answers){const scores={};polarities.forEach(p=>scores[p.key]=calculate(p,answers));return scores}
/* Thresholds for the "Themes in your answers" list. A theme appears when that dimension's score (-100 to +100) reaches the value. */
const THEME_THRESHOLDS={economic:20,culture:20,global:20,democracy:15,liberty:15};
function ideology(scores){
  const fmt=n=>n<0?"\u2212"+(-n):String(n);
  const out=[];
  const add=(key,v,leftTag,rightTag,midTag)=>{
    const t=THEME_THRESHOLDS[key],name=polarities.find(p=>p.key===key).label,s=`${name} score ${fmt(v)}`;
    if(v<=-t)out.push({label:leftTag,why:`${s} (shown at \u2212${t} or lower).`});
    else if(v>=t)out.push({label:rightTag,why:`${s} (shown at +${t} or higher).`});
    else if(midTag)out.push({label:midTag,why:`${s} (between \u2212${t-1} and +${t-1}).`})};
  add("economic",scores.economic,"Social-democratic themes","Market-liberal themes","Mixed-economy themes");
  add("culture",scores.culture,"Socially progressive themes","Culturally traditionalist themes");
  add("democracy",scores.democracy,"Pluralist-democratic themes","Executive-capacity themes");
  add("liberty",scores.liberty,"Civil-libertarian themes","State-capacity themes");
  add("global",scores.global,"Internationalist themes","National-priority themes");
  return out}
function descriptor(p,v){let abs=Math.abs(v);if(abs<15)return"Mixed / balanced";let strength=abs<35?"Some tendency":abs<60?"Clear tendency":"Strong tendency";return strength+" · "+(v<0?p.left:p.right)}
function headline(scores){const e=scores.economic,cult=scores.culture;return e<-20?(cult<-15?"Pluralist centre-left themes":"Centre-left economic themes"):e>20?"Market-oriented themes":"Mixed / cross-pressured political outlook"}
function buildSummary(scores){
  const e=scores.economic,dem=scores.democracy,lib=scores.liberty,cult=scores.culture;
  return [
    {title:"Economic outlook",text:e<-20?"Your answers lean toward a stronger public role in the economy, including public services, regulation or redistribution.":e>20?"Your answers lean toward market-led economic organisation and a more limited role for public provision or redistribution.":"Your economic answers combine market mechanisms with public responsibilities, without a strong one-sided tilt."},
    {title:"Democratic values",text:dem<-20?"You place notable weight on dissent, checks on executive power and institutional accountability.":dem>20?"Your democratic answers give relatively more weight to the ability of elected governments to act, with comparatively less emphasis on institutional checks.":"Your democratic answers show a more mixed balance between institutional checks and executive discretion."},
    {title:"Civil liberties",text:lib<-20?"You favour stronger safeguards for civil liberties and limits on state power.":lib>20?"Your answers allow a comparatively broader role for state action in the liberty-versus-intervention trade-off.":"Your answers on civil liberties and state power are relatively balanced, without a strong tilt either way."},
    {title:"Cultural outlook",text:cult<-20?"Your cultural answers lean toward openness to social change and individual autonomy.":cult>20?"Your cultural answers place relatively more weight on continuity and tradition.":"Your cultural answers are relatively balanced between openness to change and continuity of tradition."}
  ]}
