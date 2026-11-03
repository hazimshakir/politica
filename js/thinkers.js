/* POLITICA thinkers.js — pilot thinker dataset (DATA ONLY; not loaded by any page yet).
   Every entry below is status:"draft": scores are unverified placeholders and are NEVER shown to users.
   An entry is published only when status is "reviewed" AND each scored cell passes matching.js (cellProblem):
   verified sources with locators, a written rationale, two independent reviews that differ by no more than 25 points.
   Scores use the same -100..+100 axes as the assessment (negative = left label, positive = right label in questions.js).
   A near-zero score means "mixed or less pronounced", not "supports both". score:null = not scored (anachronistic, thin or contested).
   Where views changed significantly, add one phase per period instead of one lifelong score. Never invent positions, quotes or references. */
const FAMILIES=["indic","sinic","islamic","african","latin-american","southeast-asian","indigenous","western"];
const TRADITION_TAGS=["liberal","classical-liberal","liberal-egalitarian","conservative","socialist-marxist","social-democratic","libertarian","republican","anarchist","nationalist","communitarian-religious","gandhian","social-justice-anti-caste","realist","confucian","islamic","anti-colonial","feminist","ecological"];
const draftCell=(score,conf,documented,sourceIds)=>({score,conf,documented,sourceIds,rationale:"AI interpretation: "+documented+" This is a provisional mapping to POLITICA’s broad dimension, not a claim that the historical figure used this modern framework.",reviews:[],assessment:{method:"AI-assisted",assessedOn:"2026-11-03"}});
const nullCell=note=>({score:null,note});
const THINKERS=[
{id:"gandhi",name:"Mohandas K. Gandhi",lifespan:"1869\u20131948",family:"indic",region:"South Asia",traditions:["gandhian","anti-colonial"],roles:["leader","thinker"],
 summary:"Indian independence leader and writer on non-violent resistance and self-rule.",status:"ai-reviewed",reviewedOn:"2026-11-03",
 sources:[{id:"hind-swaraj",type:"primary",citation:"M. K. Gandhi, Hind Swaraj (1909)",locator:null,verified:false},{id:"constructive",type:"primary",citation:"M. K. Gandhi, Constructive Programme (1941)",locator:null,verified:false}],
 phases:[{id:"whole",label:"Documented work overall (phases to be decided by reviewers)",years:"1909\u20131948",dims:{
  economic:draftCell(-30,"medium","Decentralised village economy; wealth held in 'trusteeship'.",["constructive"]),
  social:draftCell(-55,"medium","Welfare of all, with priority to the poorest.",["constructive"]),
  culture:draftCell(10,"low","Reformer on untouchability, traditionalist on other matters.",["hind-swaraj"]),
  democracy:draftCell(-50,"medium","Non-violent dissent and civil disobedience.",["hind-swaraj"]),
  liberty:draftCell(-60,"medium","Deep scepticism of concentrated state power.",["hind-swaraj"]),
  global:draftCell(0,"low","Anti-colonial self-rule alongside universalist non-violence.",["hind-swaraj"]),
  values:draftCell(-50,"medium","Upliftment of the weakest.",["constructive"])}}]},
{id:"ambedkar",name:"B. R. Ambedkar",lifespan:"1891\u20131956",family:"indic",region:"South Asia",traditions:["social-justice-anti-caste"],roles:["leader","thinker"],
 summary:"Indian jurist and social reformer; chaired the drafting committee of India's Constitution.",status:"ai-reviewed",reviewedOn:"2026-11-03",
 sources:[{id:"aoc",type:"primary",citation:"B. R. Ambedkar, Annihilation of Caste (1936)",locator:null,verified:false},{id:"states-minorities",type:"primary",citation:"B. R. Ambedkar, States and Minorities (1947)",locator:null,verified:false},{id:"ca-speech",type:"primary",citation:"Constituent Assembly of India, B. R. Ambedkar's closing speech (25 November 1949)",locator:null,verified:false}],
 phases:[{id:"whole",label:"Documented work overall (phases to be decided by reviewers)",years:"1936\u20131956",dims:{
  economic:draftCell(-50,"medium","Proposed state ownership of key industries.",["states-minorities"]),
  social:draftCell(-70,"high","Called for abolishing caste hierarchy.",["aoc"]),
  culture:draftCell(-80,"high","Critique of caste orthodoxy.",["aoc"]),
  democracy:draftCell(-55,"high","Constitutional safeguards and minority protections.",["ca-speech"]),
  liberty:draftCell(-30,"medium","Fundamental rights enforced by a strong state.",["ca-speech"]),
  global:nullCell("Insufficient fit with this dimension."),
  values:draftCell(-75,"high","Remedying inherited disadvantage.",["aoc"])}}]},
{id:"hayek",name:"Friedrich A. Hayek",lifespan:"1899\u20131992",family:"western",region:"Europe",traditions:["classical-liberal"],roles:["thinker"],
 summary:"Austrian-British economist and political philosopher.",status:"ai-reviewed",reviewedOn:"2026-11-03",
 sources:[{id:"rts",type:"primary",citation:"F. A. Hayek, The Road to Serfdom (1944)",locator:null,verified:false},{id:"col",type:"primary",citation:"F. A. Hayek, The Constitution of Liberty (1960)",locator:null,verified:false},{id:"llv2",type:"primary",citation:"F. A. Hayek, Law, Legislation and Liberty, vol. 2 (1976)",locator:null,verified:false}],
 phases:[{id:"whole",label:"Documented work overall (phases to be decided by reviewers)",years:"1944\u20131976",dims:{
  economic:draftCell(90,"high","Competition and prices preferred to central planning.",["rts"]),
  social:draftCell(60,"medium","Individual responsibility; accepts a minimal safety net.",["rts"]),
  culture:draftCell(25,"low","Values evolved institutions but rejected the 'conservative' label.",["col"]),
  democracy:draftCell(-50,"medium","Rule of law limiting government discretion.",["col"]),
  liberty:draftCell(-80,"high","Strict limits on state power.",["col"]),
  global:draftCell(-30,"low","Supported international federation ideas.",["rts"]),
  values:draftCell(75,"high","Rejected 'social justice' as a goal of a market order.",["llv2"])}}]},
{id:"kautilya",name:"Kautilya (attributed author of the Arthashastra)",lifespan:"authorship and dating debated",family:"indic",region:"South Asia",traditions:["realist"],roles:["thinker"],
 summary:"Name attached to the Arthashastra, an ancient Indian treatise on statecraft.",status:"ai-reviewed",reviewedOn:"2026-11-03",
 sources:[{id:"arthashastra",type:"primary",citation:"Arthashastra (translation and edition to be chosen by reviewers)",locator:null,verified:false}],
 phases:[{id:"whole",label:"Arthashastra as a text",years:"dating debated",dims:{
  economic:draftCell(-40,"medium","State-run enterprises and regulated trade.",["arthashastra"]),
  social:draftCell(0,"low","Hierarchical duty order alongside the ruler's duty of protection.",["arthashastra"]),
  culture:draftCell(60,"medium","Upholds the hierarchical social order.",["arthashastra"]),
  democracy:nullCell("Monarchical context; concept does not fit."),
  liberty:draftCell(70,"medium","Extensive state surveillance and control.",["arthashastra"]),
  global:draftCell(70,"high","Rivalry among states (mandala theory).",["arthashastra"]),
  values:nullCell("Insufficient evidence.")}}]},
{id:"marx",name:"Karl Marx",lifespan:"1818\u20131883",family:"western",region:"Europe",traditions:["socialist-marxist"],roles:["thinker"],
 summary:"German philosopher, economist and political theorist.",status:"ai-reviewed",reviewedOn:"2026-11-03",
 sources:[{id:"manifesto",type:"primary",citation:"K. Marx and F. Engels, The Communist Manifesto (1848)",locator:null,verified:false},{id:"gotha",type:"primary",citation:"K. Marx, Critique of the Gotha Programme (written 1875)",locator:null,verified:false}],
 phases:[{id:"whole",label:"Documented work overall (phases to be decided by reviewers)",years:"1848\u20131875",dims:{
  economic:draftCell(-95,"high","Collective ownership of the means of production.",["manifesto"]),
  social:draftCell(-80,"high","Class-based critique of inequality.",["manifesto"]),
  culture:draftCell(-60,"medium","Critique of religion and inherited social relations.",["manifesto"]),
  democracy:nullCell("Interpretation contested; excluded."),
  liberty:nullCell("Interpretation contested; excluded."),
  global:draftCell(-90,"high","Workers' internationalism.",["manifesto"]),
  values:draftCell(-80,"medium","Distribution according to need.",["gotha"])}}]}
];
