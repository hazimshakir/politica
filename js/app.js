/* POLITICA app.js — assessment page: state and user actions. Needs scoring.js, storage.js and render.js loaded first. */
let answers={},current=0,reviewMode=false;
function persist(){saveProgress(answers,current)}
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
function showResults(){
  document.getElementById("assessment").classList.add("hidden");
  const scores=calculateAll(answers);
  renderResults(scores);
  window.lastScores=scores}
function answerLabel(i){const s=scale.find(x=>x[1]===answers[i]);return s?s[0]:null}
function answerText(){return all.map((q,i)=>`${i+1}. [${sections[q.section].title}] ${q.text}\nAnswer: ${answerLabel(i)?answerLabel(i)+" ("+answers[i]+"/5)":"Not answered"}`).join("\n\n")}
function copyPrompt(){let prompt=`Please provide a politically neutral, nuanced interpretation of my voluntary political self-assessment. Do not recommend parties, candidates or votes. Treat this as self-reflection, not a validated psychological test. Analyse each dimension separately, identify evidence from my answers, explain mixed or contradictory preferences without forcing a label, distinguish established ideologies carefully, and state what cannot be inferred. Do not infer my identity, religion, caste or voting preference.\n\nMY ANSWERS:\n${answerText()}\n\nPlease discuss economic philosophy, social equality, culture, democracy, government and civil liberties, national/global outlook, and personal values. End with a cautious summary and useful follow-up questions.`;navigator.clipboard.writeText(prompt).then(()=>toast("Copied. Open ChatGPT and paste your prompt." )).catch(()=>{let t=document.createElement("textarea");t.value=prompt;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();toast("Copied. Open ChatGPT and paste your prompt.")});}
function downloadAnswers(){let data={product:"POLITICA",notice:"Voluntary self-assessment; not validated.",answers:all.map((q,i)=>({section:sections[q.section].title,question:q.text,answer:answerLabel(i),value:answers[i]})),scores:window.lastScores};let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="politica-assessment.json";a.click();URL.revokeObjectURL(a.href)}
function startOver(){
  if(Object.keys(answers).length&&!confirm("Clear your saved answers and start again?"))return;
  answers={};current=0;reviewMode=false;
  document.getElementById("results").classList.add("hidden");document.getElementById("assessment").classList.remove("hidden");
  show();toast("Saved answers cleared.")}
function restart(){answers={};current=0;reviewMode=false;document.getElementById("results").classList.add("hidden");document.getElementById("assessment").classList.remove("hidden");show();document.getElementById("assessment").scrollIntoView({behavior:"smooth"})}
(function init(){
  const s=loadSaved();
  if(s){answers=s.answers;current=s.current}
  render();
  if(s)toast(`Saved progress restored: ${Object.keys(answers).length} of ${all.length} answered.`)
})();
