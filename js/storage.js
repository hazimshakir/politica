/* POLITICA storage.js — saved progress, shared by the home page and the assessment page.
   Stores only answer numbers and the current question, in this browser only. Needs scoring.js loaded first. */
const STORE_KEY="politica.progress.v1",STORE_DAYS=30;
/* Saved by question id (v2) so adding, removing or reordering questions cannot misplace answers. Older index-based saves (v1) are still read. */
function saveProgress(answers,current,finished){
  try{
    const byId={};Object.keys(answers).forEach(k=>{if(all[k])byId[all[k].id]=answers[k]});
    if(!Object.keys(byId).length)localStorage.removeItem(STORE_KEY);
    else localStorage.setItem(STORE_KEY,JSON.stringify({v:2,answers:byId,current:all[current]?all[current].id:null,finished:!!finished,savedAt:Date.now()}))
  }catch(e){}}
function clearProgress(){try{localStorage.removeItem(STORE_KEY)}catch(e){}}
function loadSaved(){
  try{
    const raw=localStorage.getItem(STORE_KEY);if(!raw)return null;
    const d=JSON.parse(raw);
    if(!d||(d.v!==1&&d.v!==2)||!d.answers||typeof d.answers!=="object"||!(Date.now()-d.savedAt<STORE_DAYS*864e5)){clearProgress();return null}
    const idx=Object.create(null);all.forEach((q,i)=>idx[q.id]=i);
    const pos=k=>d.v===2?idx[k]:Number(k);
    const clean={};
    Object.keys(d.answers).forEach(k=>{const i=pos(k),v=d.answers[k];if(Number.isInteger(i)&&i>=0&&i<all.length&&Number.isInteger(v)&&v>=1&&v<=scale.length)clean[i]=v});
    if(!Object.keys(clean).length){clearProgress();return null}
    const c=pos(d.current);
    const cur=Number.isInteger(c)&&c>=0&&c<all.length?c:Math.max(0,firstUnanswered(clean));
    return {answers:clean,current:cur,finished:d.finished===true&&Object.keys(clean).length===all.length}
  }catch(e){return null}}
