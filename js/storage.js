/* POLITICA storage.js — saved progress, shared by the home page and the assessment page.
   Stores only answer numbers and the current question, in this browser only. Needs scoring.js loaded first. */
const STORE_KEY="politica.progress.v1",STORE_DAYS=30;
function saveProgress(answers,current){
  try{
    if(!Object.keys(answers).length)localStorage.removeItem(STORE_KEY);
    else localStorage.setItem(STORE_KEY,JSON.stringify({v:1,answers:answers,current:current,savedAt:Date.now()}))
  }catch(e){}}
function clearProgress(){try{localStorage.removeItem(STORE_KEY)}catch(e){}}
function loadSaved(){
  try{
    const raw=localStorage.getItem(STORE_KEY);if(!raw)return null;
    const d=JSON.parse(raw);
    if(!d||d.v!==1||!d.answers||typeof d.answers!=="object"||!(Date.now()-d.savedAt<STORE_DAYS*864e5)){clearProgress();return null}
    const clean={};
    Object.keys(d.answers).forEach(k=>{const i=Number(k),v=d.answers[k];if(Number.isInteger(i)&&i>=0&&i<all.length&&Number.isInteger(v)&&v>=1&&v<=5)clean[i]=v});
    if(!Object.keys(clean).length){clearProgress();return null}
    const cur=Number.isInteger(d.current)&&d.current>=0&&d.current<all.length?d.current:Math.max(0,firstUnanswered(clean));
    return {answers:clean,current:cur}
  }catch(e){return null}}
