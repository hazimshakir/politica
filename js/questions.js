/* POLITICA questions.js — all assessment content in one place: answer options, the seven dimensions and the questions.
   Contains data only; scoring.js validates it and builds everything else from it. Loaded before scoring.js.

   HOW TO EDIT
   - Each question belongs to a dimension (its "dimension" must match a dimension key below) and carries its own scoring direction:
       direction -1 = agreeing moves the score toward the dimension's LEFT label
       direction +1 = agreeing moves the score toward the dimension's RIGHT label
       direction  0 = shown to the user but not scored
   - "id" must be unique and permanent: saved progress is stored by id. Never reuse the id of a removed question.
   - Questions may be added, removed or reordered freely; scoring.js groups them by dimension (dimension order below,
     then the order written here), and stops with a clear error if the data is invalid. */

const scale=[["Strongly disagree",1],["Disagree",2],["Neither / unsure",3],["Agree",4],["Strongly agree",5]];

/* "explain" = plain-language text shown under each dimension in the results: lower end, higher end, and near the centre. */
const DIMENSIONS=[
{key:"economic",title:"Economic philosophy",short:"Economics",desc:"Markets, taxation, public services and economic opportunity.",label:"Economic orientation",left:"More public provision & redistribution",right:"More market-led allocation",explain:{lower:"The state is seen as having a larger role in providing services, regulating and redistributing resources.",higher:"Markets and private enterprise are seen as the main way to allocate resources, with a smaller state role.",centre:"You mix both views or weigh them case by case."}},
{key:"social",title:"Social philosophy",short:"Society",desc:"Individual autonomy, equal opportunity and shared responsibilities.",label:"Social equality & responsibility",left:"Collective support & equality",right:"Individual responsibility & opportunity",explain:{lower:"Emphasises shared support and reducing inequality between groups.",higher:"Emphasises personal responsibility and equal opportunity to succeed.",centre:"You see both support and responsibility as important."}},
{key:"culture",title:"Cultural philosophy",short:"Culture",desc:"Tradition, social change, identity and personal freedom.",label:"Cultural outlook",left:"More open to social change",right:"More emphasis on continuity",explain:{lower:"More comfortable with social change and evolving norms.",higher:"Places more value on continuity, tradition and established norms.",centre:"You weigh change and continuity depending on the issue."}},
{key:"democracy",title:"Democratic philosophy",short:"Democracy",desc:"Opposition, free expression, institutions and political accountability.",label:"Democratic pluralism",left:"Emphasis on checks, dissent & accountability",right:"Emphasis on government's ability to act",explain:{lower:"Gives more weight to checks on power, open dissent and institutional accountability.",higher:"Gives more weight to elected governments being able to act decisively.",centre:"You balance accountability with the capacity to govern."}},
{key:"liberty",title:"Government & individual liberty",short:"Governance",desc:"The appropriate reach of the state and limits on public power.",label:"State power & civil liberty",left:"Emphasis on limits to state power",right:"Emphasis on state action & regulation",explain:{lower:"Gives more weight to limiting state power and protecting individual freedoms.",higher:"Gives more weight to state action and regulation for safety and order.",centre:"You balance personal freedom and state action depending on context."}},
{key:"global",title:"National & global outlook",short:"World outlook",desc:"National identity, international cooperation, migration and borders.",label:"Global outlook",left:"International cooperation",right:"National priority & sovereignty",explain:{lower:"Favours international cooperation and shared rules across countries.",higher:"Favours national priorities and sovereignty in decision-making.",centre:"You see value in both cooperation and national independence."}},
{key:"values",title:"Personal values",short:"Values",desc:"Fairness, merit, responsibility and how you judge political proposals.",label:"Fairness & merit",left:"Correct unequal starting points",right:"Emphasise individual merit",explain:{lower:"Focuses on correcting unequal starting points so people have fairer chances.",higher:"Focuses on individual effort and merit as the basis for outcomes.",centre:"You see both fair starting points and merit as important."}}
];

const QUESTIONS=[
// Economic philosophy
{id:"economic-1",dimension:"economic",direction:-1,kind:"scenario",text:"A government should guarantee access to healthcare and education, even if this requires higher taxes or public spending.",scenario:"Imagine public hospitals and schools are underfunded. The government can raise revenue or leave more services to private providers."},
{id:"economic-2",dimension:"economic",direction:1,kind:"plain",text:"Private enterprise and competition are generally the best engines of innovation and economic growth."},
{id:"economic-3",dimension:"economic",direction:-1,kind:"plain",text:"People with very high incomes should pay a larger share of their income in tax to fund public services."},
{id:"economic-4",dimension:"economic",direction:-1,kind:"plain",text:"Workers need strong legal protections, even when those rules increase costs for employers."},
{id:"economic-5",dimension:"economic",direction:-1,kind:"plain",text:"When an essential service is failing, public ownership or direct public provision should be considered."},
// Social philosophy
{id:"social-1",dimension:"social",direction:-1,kind:"plain",text:"Adults should be free to make personal choices as long as they do not violate other people's rights."},
{id:"social-2",dimension:"social",direction:-1,kind:"plain",text:"Government should actively address disadvantages linked to caste, class, gender or family background."},
{id:"social-3",dimension:"social",direction:1,kind:"plain",text:"Public policy should focus more on equal opportunity than on making everyone's outcomes equal."},
{id:"social-4",dimension:"social",direction:-1,kind:"plain",text:"A society has obligations to people who cannot meet basic needs through no fault of their own."},
{id:"social-5",dimension:"social",direction:1,kind:"plain",text:"People should generally be responsible for the consequences of their own choices, with limited exceptions."},
// Cultural philosophy
{id:"culture-1",dimension:"culture",direction:-1,kind:"plain",text:"Longstanding cultural traditions deserve respect, but should not be immune from criticism."},
{id:"culture-2",dimension:"culture",direction:1,kind:"plain",text:"Social change should generally happen gradually, with care for community continuity."},
{id:"culture-3",dimension:"culture",direction:-1,kind:"scenario",text:"Personal freedom should take priority when a tradition conflicts with an adult's fundamental rights.",scenario:"A long-standing custom is challenged because some members of the community say it restricts their choices."},
{id:"culture-4",dimension:"culture",direction:-1,kind:"plain",text:"Schools should teach students to examine competing cultural and moral viewpoints rather than promote one worldview."},
{id:"culture-5",dimension:"culture",direction:-1,kind:"plain",text:"A society can preserve cultural heritage while becoming more inclusive and changing its practices."},
// Democratic philosophy
{id:"democracy-1",dimension:"democracy",direction:-1,kind:"plain",text:"Peaceful protest and criticism of the government should be protected, even when deeply unpopular."},
{id:"democracy-2",dimension:"democracy",direction:-1,kind:"plain",text:"A party or movement I support should be criticised if it violates democratic principles."},
{id:"democracy-3",dimension:"democracy",direction:-1,kind:"plain",text:"Independent courts, media and oversight institutions should be able to scrutinise elected governments."},
{id:"democracy-4",dimension:"democracy",direction:1,kind:"plain",text:"An elected government should usually be able to carry out its programme even when independent institutions disagree."},
{id:"democracy-5",dimension:"democracy",direction:-1,kind:"plain",text:"A political leader should never be treated as beyond criticism or accountability."},
// Government & individual liberty
{id:"liberty-1",dimension:"liberty",direction:1,kind:"plain",text:"Government regulation is necessary to prevent companies from exploiting consumers, workers or the environment."},
{id:"liberty-2",dimension:"liberty",direction:-1,kind:"plain",text:"The state should have limited powers to restrict speech, privacy or peaceful assembly."},
{id:"liberty-3",dimension:"liberty",direction:1,kind:"plain",text:"Public safety rules are justified when they are evidence-based, proportionate and open to review."},
{id:"liberty-4",dimension:"liberty",direction:-1,kind:"plain",text:"People and communities should be able to make many decisions without unnecessary government interference."},
{id:"liberty-5",dimension:"liberty",direction:-1,kind:"scenario",text:"In a crisis, emergency powers should have strict time limits and independent oversight.",scenario:"A government announces temporary emergency powers after a serious threat. What safeguards should apply?"},
// National & global outlook
{id:"global-1",dimension:"global",direction:-1,kind:"plain",text:"International cooperation is essential for addressing problems such as climate change, pandemics and conflict."},
{id:"global-2",dimension:"global",direction:1,kind:"plain",text:"A government should prioritise its citizens' interests when making major policy decisions."},
{id:"global-3",dimension:"global",direction:-1,kind:"plain",text:"Immigration policy should balance border management with humanitarian obligations and fair treatment."},
{id:"global-4",dimension:"global",direction:-1,kind:"plain",text:"A strong sense of national identity can coexist with respect for other countries and cultures."},
{id:"global-5",dimension:"global",direction:-1,kind:"plain",text:"International rules and institutions should influence national policy when countries have freely agreed to them."},
// Personal values
{id:"values-1",dimension:"values",direction:1,kind:"plain",text:"People should be rewarded for effort, skill and innovation, while recognising that opportunity is not equally distributed."},
{id:"values-2",dimension:"values",direction:-1,kind:"plain",text:"Reducing severe poverty is a more urgent priority than reducing every difference in wealth."},
{id:"values-3",dimension:"values",direction:0,kind:"plain",text:"When judging a policy, its real-world effects matter more than which political party proposes it."},
{id:"values-4",dimension:"values",direction:-1,kind:"plain",text:"Fairness sometimes requires treating people differently to account for unequal starting conditions."},
{id:"values-5",dimension:"values",direction:0,kind:"plain",text:"I am comfortable changing my political view when credible evidence challenges it."}
];
