/* POLITICA scoring.js — the questions, the scoring rules and the plain-language summaries.
   Contains no page (DOM) code. Loaded first. */
/* Each question is [text, kind, scenario, direction]. direction sets how agreeing moves the score on that section's axis:
   -1 = toward the axis's left label, +1 = toward its right label, 0 = shown but not scored. */
const sections = [
{title:"Economic philosophy",short:"Economics",desc:"Markets, taxation, public services and economic opportunity.",questions:[
["A government should guarantee access to healthcare and education, even if this requires higher taxes or public spending.","scenario","Imagine public hospitals and schools are underfunded. The government can raise revenue or leave more services to private providers.",-1],
["Private enterprise and competition are generally the best engines of innovation and economic growth.","plain",null,1],
["People with very high incomes should pay a larger share of their income in tax to fund public services.","plain",null,-1],
["Workers need strong legal protections, even when those rules increase costs for employers.","plain",null,-1],
["When an essential service is failing, public ownership or direct public provision should be considered.","plain",null,-1]
]},
{title:"Social philosophy",short:"Society",desc:"Individual autonomy, equal opportunity and shared responsibilities.",questions:[
["Adults should be free to make personal choices as long as they do not violate other people's rights.","plain",null,-1],
["Government should actively address disadvantages linked to caste, class, gender or family background.","plain",null,-1],
["Public policy should focus more on equal opportunity than on making everyone's outcomes equal.","plain",null,1],
["A society has obligations to people who cannot meet basic needs through no fault of their own.","plain",null,-1],
["People should generally be responsible for the consequences of their own choices, with limited exceptions.","plain",null,1]
]},
{title:"Cultural philosophy",short:"Culture",desc:"Tradition, social change, identity and personal freedom.",questions:[
["Longstanding cultural traditions deserve respect, but should not be immune from criticism.","plain",null,-1],
["Social change should generally happen gradually, with care for community continuity.","plain",null,1],
["Personal freedom should take priority when a tradition conflicts with an adult's fundamental rights.","scenario","A long-standing custom is challenged because some members of the community say it restricts their choices.",-1],
["Schools should teach students to examine competing cultural and moral viewpoints rather than promote one worldview.","plain",null,-1],
["A society can preserve cultural heritage while becoming more inclusive and changing its practices.","plain",null,-1]
]},
{title:"Democratic philosophy",short:"Democracy",desc:"Opposition, free expression, institutions and political accountability.",questions:[
["Peaceful protest and criticism of the government should be protected, even when deeply unpopular.","plain",null,-1],
["A party or movement I support should be criticised if it violates democratic principles.","plain",null,-1],
["Independent courts, media and oversight institutions should be able to scrutinise elected governments.","plain",null,-1],
["An elected government should usually be able to carry out its programme even when independent institutions disagree.","plain",null,1],
["A political leader should never be treated as beyond criticism or accountability.","plain",null,-1]
]},
{title:"Government & individual liberty",short:"Governance",desc:"The appropriate reach of the state and limits on public power.",questions:[
["Government regulation is necessary to prevent companies from exploiting consumers, workers or the environment.","plain",null,1],
["The state should have limited powers to restrict speech, privacy or peaceful assembly.","plain",null,-1],
["Public safety rules are justified when they are evidence-based, proportionate and open to review.","plain",null,1],
["People and communities should be able to make many decisions without unnecessary government interference.","plain",null,-1],
["In a crisis, emergency powers should have strict time limits and independent oversight.","scenario","A government announces temporary emergency powers after a serious threat. What safeguards should apply?",-1]
]},
{title:"National & global outlook",short:"World outlook",desc:"National identity, international cooperation, migration and borders.",questions:[
["International cooperation is essential for addressing problems such as climate change, pandemics and conflict.","plain",null,-1],
["A government should prioritise its citizens' interests when making major policy decisions.","plain",null,1],
["Immigration policy should balance border management with humanitarian obligations and fair treatment.","plain",null,-1],
["A strong sense of national identity can coexist with respect for other countries and cultures.","plain",null,-1],
["International rules and institutions should influence national policy when countries have freely agreed to them.","plain",null,-1]
]},
{title:"Personal values",short:"Values",desc:"Fairness, merit, responsibility and how you judge political proposals.",questions:[
["People should be rewarded for effort, skill and innovation, while recognising that opportunity is not equally distributed.","plain",null,1],
["Reducing severe poverty is a more urgent priority than reducing every difference in wealth.","plain",null,-1],
["When judging a policy, its real-world effects matter more than which political party proposes it.","plain",null,0],
["Fairness sometimes requires treating people differently to account for unequal starting conditions.","plain",null,-1],
["I am comfortable changing my political view when credible evidence challenges it.","plain",null,0]
]}
];
const scale=[["Strongly disagree",1],["Disagree",2],["Neither / unsure",3],["Agree",4],["Strongly agree",5]];
const all=[]; sections.forEach((s,si)=>s.questions.forEach((q,qi)=>all.push({section:si,index:qi,text:q[0],kind:q[1],scenario:q[2],dir:q[3]})));
const polarities=[
{section:0,key:"economic",label:"Economic orientation",left:"More public provision & redistribution",right:"More market-led allocation"},
{section:1,key:"social",label:"Social equality & responsibility",left:"Collective support & equality",right:"Individual responsibility & opportunity"},
{section:2,key:"culture",label:"Cultural outlook",left:"More open to social change",right:"More emphasis on continuity"},
{section:3,key:"democracy",label:"Democratic pluralism",left:"Checks, dissent & accountability",right:"Greater executive latitude"},
{section:4,key:"liberty",label:"State power & civil liberty",left:"More safeguards for liberty",right:"More scope for state intervention"},
{section:5,key:"global",label:"Global outlook",left:"International cooperation",right:"National priority & sovereignty"},
{section:6,key:"values",label:"Fairness & merit",left:"Correct unequal starting points",right:"Emphasise individual merit"}
];

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
