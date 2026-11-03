/* POLITICA matching.js — rule-based thinker and book matching.
   AI-reviewed pilot entries may be displayed with provisional-status disclosure; fully reviewed entries retain stricter source/review checks.
   The distance D only orders candidates internally; it is never shown to users or mapped onto a single left-right line.
*/
const MATCH_DIMS=["economic","social","culture","democracy","liberty","global","values"];
const MATCH_CONFIG={weights:{high:1,medium:.6,low:.3},minDims:4,minWeight:2.5,close:30,different:60,maxSpread:25,mixedBelow:20,
  overlapSlots:3,contrastSlots:2,maxWestern:2,minContrastClose:2,minContrastDifferent:2,maxBooksPerFamily:2};
const _num=v=>typeof v==="number"&&isFinite(v);
/* Returns null when a cell may be published, otherwise the reason it may not. */
function cellProblem(cell,sources){
  const C=MATCH_CONFIG;
  if(!cell||!_num(cell.score)||cell.score<-100||cell.score>100)return"no score";
  if(!(cell.conf in C.weights))return"no confidence level";
  if(!cell.documented||!cell.rationale||/^DRAFT/i.test(cell.rationale))return"missing documented position or rationale";
  if(!Array.isArray(cell.sourceIds)||!cell.sourceIds.length)return"no sources";
  const ai=cell.assessment&&cell.assessment.method==="AI-assisted"&&cell.assessment.assessedOn;
  for(const id of cell.sourceIds){const s=(sources||[]).find(x=>x.id===id);if(!s||!s.citation)return"missing source citation";if(!ai&&(s.verified!==true||!s.locator))return"unverified source"}
  if(ai)return null;
  const r=cell.reviews||[];
  if(r.length<2||new Set(r.map(x=>x.reviewer)).size<r.length||r.some(x=>!_num(x.score)))return"needs two independent reviews";
  const sc=r.map(x=>x.score);
  if(Math.max(...sc)-Math.min(...sc)>C.maxSpread)return"reviewers differ by more than "+C.maxSpread+" points; further review needed";
  if(Math.abs(cell.score-sc.reduce((a,b)=>a+b,0)/sc.length)>1)return"score is not the reviewers' mean";
  return null}
function publishedPhases(t){
  if(!t||!["reviewed","ai-reviewed"].includes(t.status)||!t.reviewedOn)return[];
  return(t.phases||[]).map(p=>{const dims={};MATCH_DIMS.forEach(d=>{if(p.dims&&p.dims[d]&&!cellProblem(p.dims[d],t.sources))dims[d]=p.dims[d]});return{id:p.id,label:p.label,years:p.years,dims}}).filter(p=>Object.keys(p.dims).length)}
function publishedBooks(books){
  return(books||[]).filter(b=>b&&["reviewed","ai-reviewed"].includes(b.status)&&b.reviewedOn&&b.premise).map(b=>{const argues={};MATCH_DIMS.forEach(d=>{if(b.argues&&b.argues[d]&&!cellProblem(b.argues[d],b.sources))argues[d]=b.argues[d]});return Object.assign({},b,{argues})}).filter(b=>b.type==="survey"||Object.keys(b.argues).length)}
/* Near zero is described as mixed or less pronounced; it is never read as support for both positions. */
function orientation(dim,score){
  const d=(typeof DIMENSIONS!=="undefined"&&DIMENSIONS.find(x=>x.key===dim))||{left:"the lower pole",right:"the higher pole"};
  const a=Math.abs(score);
  if(a<MATCH_CONFIG.mixedBelow)return{level:"mixed",text:"mixed or less pronounced"};
  const level=a<50?"moderate":a<80?"clear":"strong";
  return{level,text:level+" orientation toward: "+(score<0?d.left:d.right)}}
/* D = sum(w*|u-t|) / (200*sum(w)) over dimensions where both scores exist; w = confidence weight. */
function compareProfile(user,dims){
  const C=MATCH_CONFIG,rows=[];let sw=0,sg=0,n=0,close=0,diff=0,diffW=0;
  MATCH_DIMS.forEach(d=>{
    const u=user[d],c=dims[d],uo=_num(u)?Object.assign({score:u},orientation(d,u)):null;
    if(!_num(u)||!c){rows.push({dim:d,user:uo,thinker:null,gap:null,relation:"not comparable",note:_num(u)?"no published, reviewed position for this dimension":"no user score"});return}
    const w=C.weights[c.conf],g=Math.abs(u-c.score),rel=g<=C.close?"close":g<=C.different?"partly different":"different";
    sw+=w;sg+=w*g;n++;if(rel==="close")close++;if(rel==="different"){diff++;diffW+=w}
    rows.push({dim:d,user:uo,thinker:{score:c.score,conf:c.conf,orientation:orientation(d,c.score),documented:c.documented,rationale:c.rationale,sourceIds:c.sourceIds},gap:g,relation:rel})});
  return{rows,n,sw,D:sw?sg/(200*sw):null,close,diff,diffShare:sw?diffW/sw:0,eligible:n>=C.minDims&&sw>=C.minWeight}}
function _card(x){
  const {t,p,c,others}=x,src=id=>{const s=t.sources.find(y=>y.id===id);return{id,citation:s.citation,locator:s.locator}};
  const by=r=>c.rows.filter(w=>w.relation===r).map(w=>w.dim);
  return{thinkerId:t.id,name:t.name,lifespan:t.lifespan,family:t.family,summary:t.summary,phase:{id:p.id,label:p.label,years:p.years},otherPhases:others,
    rows:c.rows.map(r=>r.thinker?Object.assign({},r,{thinker:Object.assign({},r.thinker,{sources:r.thinker.sourceIds.map(src)})}):r),
    overlaps:by("close"),partlyDifferent:by("partly different"),differences:by("different"),notComparable:by("not comparable"),internal:{D:c.D}}}
function matchThinkers(user,thinkers,cfg){
  const C=Object.assign({},MATCH_CONFIG,cfg||{}),notes=[],cands=[];
  (thinkers||[]).forEach(t=>{const ph=publishedPhases(t);let best=null;
    ph.forEach(p=>{const c=compareProfile(user,p.dims);if(!c.eligible)return;if(!best||c.D<best.c.D-1e-12||(Math.abs(c.D-best.c.D)<1e-12&&p.id<best.p.id))best={t,p,c,others:ph.length-1}});
    if(best)cands.push(best)});
  const byId=(a,b)=>a.t.id<b.t.id?-1:a.t.id>b.t.id?1:0;let west=0;
  const take=(arr,n,list)=>{for(const x of arr){if(list.length>=n)break;if(x.t.family==="western"&&west>=C.maxWestern)continue;list.push(x);if(x.t.family==="western")west++}};
  const overlap=[];take(cands.slice().sort((a,b)=>a.c.D-b.c.D||byId(a,b)),C.overlapSlots,overlap);
  const fams=new Set(overlap.map(x=>x.t.family));
  const pool=cands.filter(x=>!overlap.includes(x)&&x.c.close>=C.minContrastClose&&x.c.diff>=C.minContrastDifferent)
    .sort((a,b)=>(fams.has(a.t.family)-fams.has(b.t.family))||((b.t.family==="indic")-(a.t.family==="indic"))||b.c.diffShare-a.c.diffShare||byId(a,b));
  const contrast=[];take(pool,C.contrastSlots,contrast);
  if(overlap.length<C.overlapSlots||contrast.length<C.contrastSlots)notes.push("Showing fewer thinkers than the usual "+(C.overlapSlots+C.contrastSlots)+": not enough sufficiently reviewed, comparable entries. The evidence standard is not lowered.");
  if(cands.length&&![...overlap,...contrast].some(x=>x.t.family==="indic"))notes.push("No reviewed Indian thinker met the comparison rules for this profile.");
  return{overlap:overlap.map(_card),contrast:contrast.map(_card),notes,eligibleCount:cands.length}}
function selectBooks(user,books,cfg){
  const C=Object.assign({},MATCH_CONFIG,cfg||{}),pub=publishedBooks(books),notes=[],picks=[],used=new Set(),authors=new Set(),fam={};
  const focus=MATCH_DIMS.filter(d=>_num(user[d])).sort((a,b)=>Math.abs(user[b])-Math.abs(user[a])||MATCH_DIMS.indexOf(a)-MATCH_DIMS.indexOf(b)).slice(0,2);
  const ok=b=>!used.has(b.id)&&!authors.has(b.author)&&(fam[b.family]||0)<C.maxBooksPerFamily;
  const gap=(b,d)=>Math.abs(b.argues[d].score-user[d]),idc=(a,b)=>a.id<b.id?-1:a.id>b.id?1:0;
  const take=(slot,b,dim)=>{picks.push({slot,dimension:dim,id:b.id,title:b.title,author:b.author,year:b.year,type:b.type,family:b.family,traditions:b.traditions,premise:b.premise,stance:dim?Object.assign({},b.argues[dim]):null,sources:b.sources.filter(s=>b.argues[dim].sourceIds.includes(s.id))});used.add(b.id);authors.add(b.author);fam[b.family]=(fam[b.family]||0)+1};
  const eng=[];
  focus.forEach(d=>{const b=pub.filter(x=>x.argues[d]&&ok(x)&&!eng.some(e=>e.premise===x.premise)).sort((a,c)=>gap(a,d)-gap(c,d)||idc(a,c))[0];
    if(b){eng.push(b);take("engages your view",b,d)}else notes.push("No sufficiently reviewed book engages your view on: "+d+".")});
  const dia=b=>eng.some(e=>(b.dialogueWith||[]).includes(e.id)||(e.dialogueWith||[]).includes(b.id))?1:0;
  focus.forEach(d=>{const b=pub.filter(x=>x.argues[d]&&ok(x)&&gap(x,d)>C.close&&!eng.some(e=>e.premise===x.premise||e.traditions.some(t=>x.traditions.includes(t))))
    .sort((a,c)=>dia(c)-dia(a)||gap(a,d)-gap(c,d)||idc(a,c))[0];
    if(b)take("different tradition and premise",b,d);else notes.push("No sufficiently reviewed book offers a different tradition and premise on: "+d+".")});
  const sv=pub.filter(x=>x.type==="survey"&&!used.has(x.id)&&!authors.has(x.author)).sort(idc)[0];
  if(sv)take("broad survey",sv,null);else notes.push("No sufficiently reviewed survey is available.");
  if(picks.length<5)notes.push("Showing "+picks.length+" of the usual 5 books: fewer sufficiently reviewed books available. The evidence standard is not lowered.");
  return{focusDimensions:focus,picks,notes}}
/* Targets only (never a reason to publish weak entries). */
function datasetReport(thinkers){
  const pub=(thinkers||[]).filter(t=>publishedPhases(t).length),n=pub.length,count=f=>pub.filter(f).length;
  const poles={};MATCH_DIMS.forEach(d=>{let lo=0,hi=0;pub.forEach(t=>{const ph=publishedPhases(t);if(ph.some(p=>p.dims[d]&&p.dims[d].score<=-30))lo++;if(ph.some(p=>p.dims[d]&&p.dims[d].score>=30))hi++});poles[d]={lowSide:lo,highSide:hi,target5BothSides:lo>=5&&hi>=5}});
  return{published:n,westernShare:n?count(t=>t.family==="western")/n:null,indian:count(t=>t.family==="indic"),
    targets:{westernAtMostOneThird:n?count(t=>t.family==="western")/n<=1/3:false,indianAtLeast25pct:n?count(t=>t.family==="indic")/n>=.25:false},poles}}
/* Structural checks for data files; returns a list of error strings (empty = OK). Reviewed entries must pass every cell check. */
function validateData(thinkers,books){
  const e=[],ids=new Set(),bad=(m)=>e.push(m);
  (thinkers||[]).forEach(t=>{const w="thinker "+(t.id||"?");
    if(!t.id||ids.has(t.id))bad(w+": missing or duplicate id");ids.add(t.id);
    if(!["draft","reviewed","ai-reviewed"].includes(t.status))bad(w+": bad status");
    if(!FAMILIES.includes(t.family))bad(w+": unknown family");
    (t.traditions||[]).forEach(x=>{if(!TRADITION_TAGS.includes(x))bad(w+": unknown tradition "+x)});
    if(t.status==="reviewed"&&!t.reviewedOn)bad(w+": reviewed without reviewedOn");
    if(!Array.isArray(t.phases)||!t.phases.length)bad(w+": no phases");
    (t.phases||[]).forEach(p=>MATCH_DIMS.forEach(d=>{const c=p.dims&&p.dims[d];
      if(!c){bad(w+"/"+p.id+": dimension "+d+" missing (use nullCell)");return}
      if(c.score===null){if(!c.note)bad(w+"/"+d+": null needs a note");return}
      if(!Number.isInteger(c.score)||c.score<-100||c.score>100)bad(w+"/"+d+": bad score");
      if(t.status==="reviewed"||t.status==="ai-reviewed"){const m=cellProblem(c,t.sources);if(m)bad(w+"/"+d+": "+m+" (use nullCell if unresolved)") }}))});
  const bids=new Set();
  (books||[]).forEach(b=>{const w="book "+(b.id||"?");
    if(!b.id||bids.has(b.id))bad(w+": missing or duplicate id");bids.add(b.id);
    if(!["draft","reviewed","ai-reviewed"].includes(b.status))bad(w+": bad status");
    if(!BOOK_PREMISES.includes(b.premise))bad(w+": unknown premise");
    if(!FAMILIES.includes(b.family))bad(w+": unknown family");
    (b.traditions||[]).forEach(x=>{if(!TRADITION_TAGS.includes(x))bad(w+": unknown tradition "+x)});
    Object.keys(b.argues||{}).forEach(d=>{if(!MATCH_DIMS.includes(d))bad(w+": unknown dimension "+d);else if(b.status==="reviewed"||b.status==="ai-reviewed"){const m=cellProblem(b.argues[d],b.sources);if(m)bad(w+"/"+d+": "+m)}})});
  return e}
