/* POLITICA thinkers.js — pilot thinker dataset (DATA ONLY; not loaded by any page yet).
   AI-reviewed entries are provisional interpretations; source-locator verification and score validation are separate tasks.
   AI-reviewed pilot entries may be displayed with a provisional disclaimer. A verified source locator does not mean the interpretation or score has been independently validated.
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
 sources:[{id:"hind-swaraj",type:"primary",citation:"M. K. Gandhi, Hind Swaraj (Gujarati original, 1909); English rendering, Indian Home Rule (1922 fifth edition)",locator:"Chs. IV (What is Swaraj?), VI (Civilization), XIII (True Civilization), XIV (How India Can Become Free), XVII (Passive Resistance), XIX (Machinery); Gandhi's 1919 foreword and 1922 Reply to Critics qualify how the 1908 text should be read.",verified:true},{id:"constructive",type:"primary",citation:"M. K. Gandhi, Constructive Programme: Its Meaning and Place (1941)",locator:"Sections on removal of untouchability, khadi, village industries, economic equality and trusteeship; section headings should be checked against the chosen Navajivan edition before adding page numbers.",verified:false}],
 phases:[{id:"whole",label:"Documented work overall (phases to be decided by reviewers)",years:"1909\u20131948",dims:{
  economic:draftCell(-15,"low","Gandhi advocated village industries, decentralised production and trusteeship, but these do not map neatly onto the modern public-provision versus market-allocation axis.",["constructive"]),
  social:draftCell(-55,"medium","Welfare of all, with priority to the poorest.",["constructive"]),
  culture:draftCell(10,"low","Reformer on untouchability, traditionalist on other matters.",["hind-swaraj"]),
  democracy:draftCell(-50,"medium","Non-violent dissent and civil disobedience.",["hind-swaraj"]),
  liberty:draftCell(-60,"medium","Deep scepticism of concentrated state power.",["hind-swaraj"]),
  global:draftCell(0,"low","Anti-colonial self-rule alongside universalist non-violence.",["hind-swaraj"]),
  values:draftCell(-50,"medium","Upliftment of the weakest.",["constructive"])}}]},
{id:"ambedkar",name:"B. R. Ambedkar",lifespan:"1891\u20131956",family:"indic",region:"South Asia",traditions:["social-justice-anti-caste"],roles:["leader","thinker"],
 summary:"Indian jurist and social reformer; chaired the drafting committee of India's Constitution.",status:"ai-reviewed",reviewedOn:"2026-11-03",
 sources:[{id:"aoc",type:"primary",citation:"B. R. Ambedkar, Annihilation of Caste (1936), Columbia University classroom edition based on Writings and Speeches, vol. 1 (1979), pp. 25–96",locator:"Full address; especially discussion of caste as graded inequality, religious authority, endogamy and social reform. Columbia notes that square-bracketed section headings are editorial.",verified:true},{id:"states-minorities",type:"primary",citation:"B. R. Ambedkar, States and Minorities (1947), reproduced in Dr. Babasaheb Ambedkar: Writings and Speeches, vol. 1",locator:"Proposed Constitution: Article II, section I (Fundamental Rights); section II (Remedies against Invasion of Fundamental Rights), including State Socialism/Economic Democracy; section IV (Safeguards for Scheduled Castes).",verified:true},{id:"ca-speech",type:"primary",citation:"Constituent Assembly Debates, 25 November 1949, vol. XI, closing speech by B. R. Ambedkar",locator:"Closing speech: constitutional methods, social democracy, liberty-equality-fraternity, and risks of hero-worship and abandoning constitutional methods; official Lok Sabha Secretariat reprint.",verified:true}],
 phases:[{id:"whole",label:"Documented work overall (phases to be decided by reviewers)",years:"1936\u20131956",dims:{
  economic:draftCell(-50,"medium","Proposed state ownership of key industries.",["states-minorities"]),
  social:draftCell(-70,"high","Called for abolishing caste hierarchy.",["aoc"]),
  culture:draftCell(-80,"high","Critique of caste orthodoxy.",["aoc"]),
  democracy:draftCell(-55,"high","Constitutional safeguards and minority protections.",["ca-speech"]),
  liberty:draftCell(25,"medium","Ambedkar defended enforceable fundamental rights while also proposing an active state to protect citizens from social and economic domination; this is a qualified, not maximal, state-action position.",["states-minorities","ca-speech"]),
  global:nullCell("Insufficient fit with this dimension."),
  values:draftCell(-75,"high","Remedying inherited disadvantage.",["aoc"])}}]},
{id:"hayek",name:"Friedrich A. Hayek",lifespan:"1899\u20131992",family:"western",region:"Europe",traditions:["classical-liberal"],roles:["thinker"],
 summary:"Austrian-British economist and political philosopher.",status:"ai-reviewed",reviewedOn:"2026-11-03",
 sources:[{id:"rts",type:"primary",citation:"F. A. Hayek, The Road to Serfdom (1944), Bruce Caldwell ed., definitive edition (University of Chicago Press, 2007/2009)",locator:"Chs. III–IX (individualism, planning, democracy, rule of law, economic control, distribution, security and freedom) and XV (international order).",verified:true},{id:"col",type:"primary",citation:"F. A. Hayek, The Constitution of Liberty (1960), definitive edition edited by Ronald Hamowy (University of Chicago Press, 2011)",locator:"Part I, chs. 1–8 (freedom, tradition, responsibility, equality and majority rule); Part II, chs. 9–16 (coercion, state, rule of law and constitutionalism); Part III, chs. 17–24 (welfare state, social security, taxation and education).",verified:true},{id:"llv2",type:"primary",citation:"F. A. Hayek, Law, Legislation and Liberty, vol. 2: The Mirage of Social Justice (1976)",locator:"Chs. 7–11, especially ch. 9 on social/distributive justice; do not infer that Hayek opposed all public provision from this critique.",verified:true}],
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
 sources:[{id:"arthashastra",type:"primary",citation:"The Arthaśāstra attributed to Kauṭilya, translated by Patrick Olivelle, King, Governance, and Law in Ancient India (Oxford University Press, 2013)",locator:"Olivelle introduction, pp. 1–60, on composition, date and authorship; Book II, pp. 99–178, on superintendents and administration; Books VI–VII on the circle of states and sixfold foreign policy. Treat as a text/tradition, not a securely identified single-author biography.",verified:true}],
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
 sources:[{id:"manifesto",type:"primary",citation:"Karl Marx and Friedrich Engels, Manifesto of the Communist Party (1848), Samuel Moore translation revised with Engels (1888)",locator:"Part I (Bourgeois and Proletarians) and Part II (Proletarians and Communists); use joint authorship in attribution.",verified:true},{id:"gotha",type:"primary",citation:"Karl Marx, Critique of the Gotha Programme (written 1875; first published 1891)",locator:"Part I, especially discussion of common ownership, social deductions from the total product, and lower and higher phases of communist society.",verified:true}],
 phases:[{id:"whole",label:"Documented work overall (phases to be decided by reviewers)",years:"1848\u20131875",dims:{
  economic:draftCell(-95,"high","Collective ownership of the means of production.",["manifesto"]),
  social:draftCell(-80,"high","Class-based critique of inequality.",["manifesto"]),
  culture:nullCell("The Manifesto critiques inherited class relations, but that alone does not establish a sufficiently direct position on POLITICA’s tradition-versus-social-change axis."),
  democracy:nullCell("Interpretation contested; excluded."),
  liberty:nullCell("Interpretation contested; excluded."),
  global:draftCell(-90,"high","Workers' internationalism.",["manifesto"]),
  values:nullCell("Marx’s critique of distributive justice and his account of communist distribution do not map cleanly onto the questionnaire’s starting-points-versus-merit axis.")}}]}
];
