/* POLITICA thinkers.js — pilot thinker dataset (DATA ONLY; not loaded by any page yet).
   AI-reviewed entries are provisional interpretations; source-locator verification and score validation are separate tasks.
   AI-reviewed pilot entries may be displayed with a provisional disclaimer. A verified source locator does not mean the interpretation or score has been independently validated.
   Scores use the same -100..+100 axes as the assessment (negative = left label, positive = right label in questions.js).
   A near-zero score means "mixed or less pronounced", not "supports both". score:null = not scored (anachronistic, thin or contested).
   Where views changed significantly, add one phase per period instead of one lifelong score. Never invent positions, quotes or references. */
const FAMILIES=["indic","sinic","islamic","african","latin-american","caribbean","southeast-asian","indigenous","western","west-asian"];
const TRADITION_TAGS=["liberal","classical-liberal","liberal-egalitarian","conservative","socialist-marxist","social-democratic","libertarian","republican","anarchist","nationalist","communitarian-religious","gandhian","social-justice-anti-caste","realist","confucian","islamic","anti-colonial","feminist","ecological","rationalist","secular-nationalist","authoritarian","anti-slavery","fascist","racist-nationalist","totalitarian","authoritarian-nationalist","social-justice","nonviolent","revolutionary","social-liberal","constitutionalism","black-nationalist"];
const draftCell=(score,conf,documented,sourceIds)=>({score,conf,documented,sourceIds,rationale:"AI interpretation: "+documented+" This is a provisional mapping to POLITICA’s broad dimension, not a claim that the historical figure used this modern framework.",reviews:[],assessment:{method:"AI-assisted",assessedOn:"2026-11-03"}});
const nullCell=note=>({score:null,note});
const THINKERS=[
{id:"gandhi",name:"Mohandas K. Gandhi",lifespan:"1869\u20131948",family:"indic",region:"South Asia",traditions:["gandhian","anti-colonial"],roles:["leader","thinker"],
 summary:"Indian independence leader and writer on non-violent resistance and self-rule.",status:"ai-reviewed",reviewedOn:"2026-11-03",
 sources:[
 {id:"hind-swaraj",type:"primary",citation:"M. K. Gandhi, Hind Swaraj (Gujarati original, 1909); English rendering, Indian Home Rule (1910)",locator:"Chs. IV, VI, XIII, XIV, XVII and XIX. The 1909 text is a polemical critique of modern civilisation, not a complete statement of Gandhi's later economic views.",verified:true},
 {id:"constructive",type:"primary",citation:"M. K. Gandhi, Constructive Programme: Its Meaning and Place (1941)",locator:"Sections: Removal of Untouchability; Khadi; Other Village Industries; Economic Equality; Peasants; Labour. The 1941 text is a later programme and should not be read back into 1909.",verified:false},
 {id:"varna",type:"primary",citation:"M. K. Gandhi, writings on varna and hereditary occupation, including Young India (27 October 1927) and Harijan (7 July 1946)",locator:"Contemporaneous statements affirming varna by birth/hereditary occupation while opposing untouchability and caste restrictions; verify against Collected Works issue pagination before scholarly publication.",verified:false},
 {id:"machinery",type:"primary",citation:"M. K. Gandhi, statements on machinery (1919–1947), reproduced in Gandhi: Hind Swaraj and Other Writings, ed. Anthony J. Parel",locator:"Cambridge edition, pp. 162–168; includes 1919 acceptance of mills alongside handlooms and later arguments about technology's effects on village employment.",verified:true}
 ],
 phases:[
 {id:"early",label:"Early critique of modern civilisation",years:"1909–1918",dims:{
  economic:draftCell(-25,"low","Hind Swaraj strongly criticises industrial machinery and modern economic civilisation; this does not translate directly into a modern public-ownership score.",["hind-swaraj"]),
  social:nullCell("The text does not provide a sufficient basis for scoring this modern equality-versus-individual-responsibility axis."),
  culture:draftCell(65,"medium","The text defends civilisational and religious continuity while criticising selected social practices; this is not equivalent to opposition to all reform.",["hind-swaraj"]),
  democracy:draftCell(-35,"low","Gandhi's insistence on non-violent resistance and self-rule suggests a check on coercive authority, but the text is not a developed account of modern constitutional democracy.",["hind-swaraj"]),
  liberty:draftCell(-65,"medium","The text rejects concentrated modern state power and places moral self-restraint and self-rule at the centre.",["hind-swaraj"]),
  global:draftCell(-10,"low","Anti-colonial self-rule coexists with universal moral claims; the text does not map cleanly onto contemporary sovereignty/cooperation choices.",["hind-swaraj"]),
  values:nullCell("The text's ethical vocabulary does not map directly onto the questionnaire's starting-points-versus-merit axis.")}},
 {id:"later",label:"Constructive programme and later writings",years:"1919–1948",dims:{
  economic:draftCell(-20,"low","Village industries, economic equality and trusteeship favour decentralised livelihoods; Gandhi's later acceptance of some machinery makes a categorical anti-technology or anti-market score misleading.",["constructive","machinery"]),
  social:draftCell(-25,"low","Gandhi campaigned against untouchability and for the uplift of the poorest, but continued to defend a form of varna based on birth/hereditary occupation. This tension prevents a stronger equality score.",["constructive","varna"]),
  culture:draftCell(65,"medium","Gandhi opposed untouchability but continued to defend varna and hereditary occupation; reformist and traditionalist positions coexisted.",["constructive","varna"]),
  democracy:draftCell(-35,"low","Non-violent mass action and decentralised self-rule suggest participatory checks, but his model is not identical to parliamentary pluralism.",["constructive"]),
  liberty:draftCell(-55,"medium","Continued suspicion of concentrated state power and preference for self-governing communities.",["constructive"]),
  global:draftCell(-15,"low","Universal non-violence and communal unity sit alongside national self-rule; contemporary global-policy mapping remains weak.",["constructive"]),
  values:draftCell(-35,"low","Trusteeship and economic equality prioritise social obligations, while Gandhi also accepted unequal talents and earnings subject to moral responsibility.",["constructive"])
 }}
 ]},
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
 sources:[{id:"rts",type:"primary",citation:"F. A. Hayek, The Road to Serfdom (1944), Bruce Caldwell ed., definitive edition (University of Chicago Press, 2007/2009)",locator:"Ch. III (Individualism and Collectivism), pp. 83–90; IV–VI, pp. 91–123 (planning, democracy and rule of law); VII–IX, pp. 124–156 (economic control, power and security); XV, p. 223 onward (international order), in the Caldwell definitive edition. Page references are edition-specific.",verified:true},{id:"col",type:"primary",citation:"F. A. Hayek, The Constitution of Liberty (1960), definitive edition edited by Ronald Hamowy (University of Chicago Press, 2011)",locator:"Part I, chs. 1–8 (freedom, tradition, responsibility, equality and majority rule); Part II, chs. 9–16 (coercion, state, rule of law and constitutionalism); Part III, chs. 17–24 (welfare state, social security, taxation and education).",verified:true},{id:"llv2",type:"primary",citation:"F. A. Hayek, Law, Legislation and Liberty, vol. 2: The Mirage of Social Justice (1976)",locator:"Chs. 7–11, especially ch. 9 on social/distributive justice; do not infer that Hayek opposed all public provision from this critique.",verified:true}],
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
 sources:[{id:"arthashastra",type:"primary",citation:"The Arthaśāstra attributed to Kauṭilya, translated by Patrick Olivelle, King, Governance, and Law in Ancient India (Oxford University Press, 2013)",locator:"Olivelle introduction, pp. 1–60, on composition, date and authorship; Book II, pp. 99–178, on superintendents and administration; Book VII, pp. 277–330, on sixfold foreign policy. Treat as a text/tradition, not a securely identified single-author biography.",verified:true}],
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
  values:nullCell("Marx’s critique of distributive justice and his account of communist distribution do not map cleanly onto the questionnaire’s starting-points-versus-merit axis.")}}]},
{id:"phule",name:"Jyotirao Phule",lifespan:"1827–1890",family:"indic",region:"South Asia",traditions:["social-justice-anti-caste","feminist"],roles:["reformer","thinker"],
 summary:"Indian social reformer whose writing and educational work challenged caste hierarchy and the exclusion of women and oppressed communities from education.",
 status:"ai-reviewed",reviewedOn:"2026-11-04",
 sources:[
  {id:"phule-gulamgiri",type:"primary",citation:"Jyotirao Phule, Gulamgiri (Slavery), 1873; translated by G. P. Deshpande in Selected Writings of Jotirao Phule (LeftWord, 2002)",locator:"Read the dialogue as a polemical critique of Brahmanical social hierarchy and the historical legitimation of caste. Translation and edition wording should be checked before quoting.",verified:false},
  {id:"phule-shetkaryacha",type:"primary",citation:"Jyotirao Phule, Shetkaryacha Asud (Cultivator's Whipcord), 1881",locator:"Sections on agrarian exploitation, revenue administration, education and the condition of cultivators; interpretations should remain tied to the specific edition.",verified:false}
 ],
 phases:[{id:"documented",label:"Anti-caste and educational reform writings",years:"1873–1881",dims:{
  economic:draftCell(-35,"low","Phule criticised the exploitation of cultivators and the social structures that sustained rural inequality; these writings do not amount to a complete modern economic programme.",["phule-shetkaryacha"]),
  social:draftCell(-85,"high","Gulamgiri attacks caste hierarchy and inherited social domination, while Phule's educational work sought wider access for women and oppressed communities.",["phule-gulamgiri"]),
  culture:draftCell(-80,"medium","His polemic challenged religious and customary authority used to justify caste hierarchy; this is a critique of specific structures, not a rejection of every inherited practice.",["phule-gulamgiri"]),
  values:draftCell(-70,"medium","His reform arguments emphasise equal human dignity and the claims of people subordinated by inherited status.",["phule-gulamgiri"]),
  democracy:nullCell("These texts do not provide a sufficiently direct basis for scoring modern institutional democracy."),
  liberty:nullCell("The selected texts do not support a stable general score on the modern state-versus-liberty axis."),
  global:nullCell("The selected texts do not provide a sufficiently direct basis for this contemporary dimension.")
 }}]},
{id:"periyar",name:"E. V. Ramasamy (Periyar)",lifespan:"1879–1973",family:"indic",region:"South Asia",traditions:["social-justice-anti-caste","feminist"],roles:["reformer","thinker"],
 summary:"Tamil social reformer associated with the Self-Respect Movement, rationalist critique and opposition to caste hierarchy and patriarchy.",
 status:"ai-reviewed",reviewedOn:"2026-11-04",
 sources:[
  {id:"periyar-collected",type:"primary",citation:"E. V. Ramasamy (Periyar), selected speeches and writings in The Collected Works of Periyar E. V. Ramasamy, compiled by K. Veeramani (The Periyar Self-Respect Propaganda Institution)",locator:"Use dated speeches and essays on caste, self-respect, women's rights, religion and social reform. This is a collected corpus; any future score should cite the exact dated text and edition rather than treating the collection as one continuous argument.",verified:false},
  {id:"periyar-women",type:"primary",citation:"Periyar, Why Women Should Be Emancipated? and related essays on women's liberation, collected in English translations of his writings",locator:"Consult the specific essay and translation for arguments about marriage, property, education and women's autonomy; translation and publication details vary between collections.",verified:false}
 ],
 phases:[{id:"documented",label:"Self-Respect and rationalist reform",years:"1920s–1970s",dims:{
  social:draftCell(-85,"medium","Periyar's movement challenged caste hierarchy and advocated women's emancipation; the exact scope varied across speeches and periods.",["periyar-collected","periyar-women"]),
  culture:draftCell(-90,"high","His rationalist critique directly challenged inherited religious and caste authority where it sustained social hierarchy.",["periyar-collected"]),
  democracy:draftCell(-25,"low","His political activity included mass mobilisation and social reform, but the collected writings do not justify a single stable score on modern institutional-democracy preferences.",["periyar-collected"]),
  liberty:draftCell(-25,"low","Arguments for self-respect and women's autonomy support limits on social coercion, but his broader political positions require period-specific assessment.",["periyar-women"]),
  economic:nullCell("The selected writings do not establish a sufficiently specific modern economic programme."),
  global:nullCell("The selected writings do not establish a sufficiently specific position on contemporary international cooperation."),
  values:nullCell("A modern merit-versus-circumstance score would oversimplify the selected writings.")
 }}]},
{id:"nehru",name:"Jawaharlal Nehru",lifespan:"1889–1964",family:"indic",region:"South Asia",traditions:["social-democratic","secular-nationalist"],roles:["leader","thinker"],
 summary:"India's first prime minister; a central figure in the independence movement who wrote on secularism, parliamentary democracy, planning and international non-alignment.",
 status:"ai-reviewed",reviewedOn:"2026-11-04",
 sources:[
  {id:"nehru-discovery",type:"primary",citation:"Jawaharlal Nehru, The Discovery of India (1946)",locator:"Use the chapters on India's historical development, cultural pluralism and the freedom movement; the work is a wide-ranging interpretation, not a precise policy manifesto.",verified:false},
  {id:"nehru-tryst",type:"primary",citation:"Jawaharlal Nehru, 'A Tryst with Destiny', Constituent Assembly speech, 14 August 1947",locator:"Official Constituent Assembly address on independence, democratic responsibility and the ending of poverty, ignorance, disease and inequality.",verified:false},
  {id:"nehru-foreign",type:"primary",citation:"Jawaharlal Nehru, selected parliamentary speeches on foreign policy and non-alignment",locator:"Read dated speeches in their Cold War context; do not infer a timeless position from a single statement.",verified:false}
 ],
 phases:[{id:"early-prime-minister",label:"Early independence and institution-building",years:"1947–1964",dims:{
  economic:draftCell(-55,"medium","Nehru's governments used public-sector investment and national planning alongside a mixed economy in which private enterprise continued.",["nehru-discovery"]),
  social:draftCell(-45,"low","His public programme emphasised reducing poverty and expanding opportunity, but this broad orientation does not establish a complete position on every welfare or redistribution question.",["nehru-tryst"]),
  democracy:draftCell(-55,"medium","Nehru publicly defended parliamentary institutions and constitutional government in the early republic; practice and policy should be assessed separately from stated principles.",["nehru-tryst"]),
  global:draftCell(-55,"medium","Non-alignment sought independent foreign-policy judgement and cooperation beyond Cold War blocs; it should not be equated with neutrality on every international issue.",["nehru-foreign"]),
  culture:nullCell("The book is historically broad; a single score on tradition versus change would flatten its plural and evolving account."),
  liberty:nullCell("The selected sources do not establish a sufficiently precise overall score on this modern axis."),
  values:nullCell("The selected sources do not map cleanly onto this assessment dimension.")
 }}]}

];

const EXCLUDED_THINKER_IDS = new Set(["periyar","phule","ram-manohar-lohia","deendayal-upadhyaya","ramakrishna-paramahamsa","ems-namboodiripad","k-karunakaran","ak-gopalan","jean-jacques-rousseau","edmund-burke","karl-popper","hannah-arendt","abul-ala-maududi","al-farabi","emmanuel-macron","atal-bihari-vajpayee"]);
THINKERS.splice(0, THINKERS.length, ...THINKERS.filter(t => !EXCLUDED_THINKER_IDS.has(t.id)));
