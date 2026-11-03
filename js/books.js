/* POLITICA books.js — pilot book dataset (DATA ONLY; not loaded by any page yet). All entries are status:"draft" and never shown.
   "argues" gives the work's own stance (-100..+100, same axes as the assessment) on the dimensions it substantively addresses.
   "premise" = what the work grounds legitimacy or value in; "traditions" = the work's own tradition (never the reader's).
   "dialogueWith" = reviewer-curated ids of books genuinely in dialogue (critique or alternative). Requires thinkers.js first. */
const BOOK_PREMISES=["individual-rights","limits-of-knowledge","communal-duty","welfare-consequences","historical-materialism","religious-law","civilisational-continuity","self-rule","equal-dignity","fair-terms-of-cooperation","state-order"];
const BOOKS=[
{id:"hind-swaraj",title:"Hind Swaraj",author:"M. K. Gandhi",year:1909,type:"primary",family:"indic",traditions:["gandhian","anti-colonial"],premise:"self-rule",dialogueWith:[],status:"draft",reviewedOn:null,
 sources:[{id:"b",type:"primary",citation:"M. K. Gandhi, Hind Swaraj (1909)",locator:null,verified:false}],argues:{liberty:draftCell(-60,"medium","Distrust of concentrated state power.",["b"])}},
{id:"annihilation-of-caste",title:"Annihilation of Caste",author:"B. R. Ambedkar",year:1936,type:"primary",family:"indic",traditions:["social-justice-anti-caste"],premise:"equal-dignity",dialogueWith:[],status:"draft",reviewedOn:null,
 sources:[{id:"b",type:"primary",citation:"B. R. Ambedkar, Annihilation of Caste (1936)",locator:null,verified:false}],argues:{social:draftCell(-70,"high","Abolition of caste hierarchy.",["b"]),culture:draftCell(-80,"high","Critique of caste orthodoxy.",["b"])}},
{id:"road-to-serfdom",title:"The Road to Serfdom",author:"F. A. Hayek",year:1944,type:"primary",family:"western",traditions:["classical-liberal"],premise:"limits-of-knowledge",dialogueWith:[],status:"draft",reviewedOn:null,
 sources:[{id:"b",type:"primary",citation:"F. A. Hayek, The Road to Serfdom (1944)",locator:null,verified:false}],argues:{economic:draftCell(90,"high","Competition over central planning.",["b"]),liberty:draftCell(-80,"high","Limits on state power.",["b"])}},
{id:"communist-manifesto",title:"The Communist Manifesto",author:"K. Marx and F. Engels",year:1848,type:"primary",family:"western",traditions:["socialist-marxist"],premise:"historical-materialism",dialogueWith:[],status:"draft",reviewedOn:null,
 sources:[{id:"b",type:"primary",citation:"K. Marx and F. Engels, The Communist Manifesto (1848)",locator:null,verified:false}],argues:{economic:draftCell(-95,"high","Collective ownership.",["b"])}},
{id:"reflections",title:"Reflections on the Revolution in France",author:"E. Burke",year:1790,type:"primary",family:"western",traditions:["conservative"],premise:"civilisational-continuity",dialogueWith:[],status:"draft",reviewedOn:null,
 sources:[{id:"b",type:"primary",citation:"E. Burke, Reflections on the Revolution in France (1790)",locator:null,verified:false}],argues:{culture:draftCell(80,"high","Weight on inherited institutions and gradual change.",["b"])}},
{id:"theory-of-justice",title:"A Theory of Justice",author:"J. Rawls",year:1971,type:"primary",family:"western",traditions:["liberal-egalitarian"],premise:"fair-terms-of-cooperation",dialogueWith:[],status:"draft",reviewedOn:null,
 sources:[{id:"b",type:"primary",citation:"J. Rawls, A Theory of Justice (1971)",locator:null,verified:false}],argues:{values:draftCell(-50,"medium","Inequalities justified only if they benefit the least advantaged.",["b"])}}
];
