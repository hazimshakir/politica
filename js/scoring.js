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
function ideology(scores){let e=scores.economic,c=scores.culture,d=scores.democracy,l=scores.liberty,g=scores.global;
let tags=[];
if(e<=-20)tags.push("Social-democratic themes");else if(e>=20)tags.push("Market-liberal themes");else tags.push("Mixed-economy themes");
if(c<=-20)tags.push("Socially progressive themes");else if(c>=20)tags.push("Culturally traditionalist themes");
if(d<=-15)tags.push("Pluralist-democratic themes");
if(l<=-15)tags.push("Civil-libertarian themes");
if(g<=-20)tags.push("Internationalist themes");else if(g>=20)tags.push("National-priority themes");
return tags}
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
