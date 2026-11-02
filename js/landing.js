/* POLITICA landing.js — home page: shows a "welcome back" banner when saved progress exists. */
(function(){
  const box=document.getElementById("resumeBox"),btn=document.getElementById("beginBtn"),txt=document.getElementById("resumeText"),off=document.getElementById("resumeClear");
  if(!box||!btn||!txt)return;
  const saved=loadSaved(),n=saved?Object.keys(saved.answers).length:0;
  if(n>0){txt.textContent=`Welcome back — ${n} of ${all.length} answers are saved in this browser.`;box.classList.remove("hidden");btn.innerHTML="Resume assessment&nbsp; →"}
  if(off)off.addEventListener("click",function(){
    if(!confirm("Clear your saved answers and start again?"))return;
    clearProgress();btn.innerHTML="Begin assessment&nbsp; →";txt.textContent="Saved answers cleared.";off.classList.add("hidden");
    setTimeout(function(){box.classList.add("hidden");off.classList.remove("hidden")},2600)})
})();
