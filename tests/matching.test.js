/* Run with: node tests/matching.test.js  (no dependencies; all fixtures are hypothetical) */
const fs=require("fs"),vm=require("vm"),path=require("path");
const c={};vm.createContext(c);
const src=["questions","thinkers","books","matching"].map(f=>fs.readFileSync(path.join(__dirname,"..","js",f+".js"),"utf8")).join("\n");
vm.runInContext(src+";this.X={THINKERS,BOOKS,matchThinkers,selectBooks,compareProfile,cellProblem,publishedPhases,publishedBooks,validateData,datasetReport,orientation,MATCH_DIMS}",c);
const X=c.X;let fails=0,total=0;
const ok=(cond,msg)=>{total++;if(!cond){fails++;console.log("FAIL:",msg)}};
const near=(a,b)=>Math.abs(a-b)<1e-3;
const S=[{id:"s1",type:"primary",citation:"x",locator:"ch.1",verified:true}];
const cell=(s,conf,rv)=>({score:s,conf,documented:"d",rationale:"r",sourceIds:["s1"],reviews:rv||[{reviewer:"R1",score:s},{reviewer:"R2",score:s}]});
const dims=o=>{const r={};Object.entries(o).forEach(([k,v])=>r[k]=v===null?{score:null,note:"n"}:cell(v[0],v[1],v[2]));return r};
const T=(id,family,d,o)=>Object.assign({id,name:id,lifespan:"",family,traditions:[],roles:[],summary:"",status:"reviewed",reviewedOn:"2026-01-01",sources:S,phases:[{id:"p",label:"all",years:"",dims:dims(d)}]},o||{});
const M="medium",H="high",L="low";
const user={economic:-40,social:-20,culture:10,democracy:-50,liberty:-60,global:-30,values:-30};
const A=T("A","indic",{economic:[-30,M],social:[-55,M],culture:[10,L],democracy:[-50,M],liberty:[-60,M],global:[0,L],values:[-50,M]});
const B=T("B","indic",{economic:[90,H],social:[60,M],culture:[25,L],democracy:[-50,M],liberty:[-80,H],global:[-30,L],values:[75,H]});
const Cc=T("C","indic",{economic:[-95,H],social:[-80,H],culture:[-60,M],democracy:null,liberty:null,global:[-90,H],values:[-80,M]});
// 1. draft data never appears; pilot data structurally valid
ok(X.validateData(X.THINKERS,X.BOOKS).length===0,"pilot data valid: "+X.validateData(X.THINKERS,X.BOOKS).join("; "));
ok(X.THINKERS.every(t=>t.status==="draft")&&X.BOOKS.every(b=>b.status==="draft"),"all pilot entries draft");
let r=X.matchThinkers(user,X.THINKERS);ok(Array.isArray(r.overlap)&&Array.isArray(r.contrast)&&typeof r.eligibleCount==="number","provisional thinker matching remains callable");
ok(X.selectBooks(user,X.BOOKS).picks.length===0,"draft books never selected");
const forced=X.THINKERS.map(t=>Object.assign({},t,{status:"reviewed",reviewedOn:"2026-01-01"}));
ok(X.matchThinkers(user,forced).eligibleCount===0,"status alone cannot publish (cells unverified)");
// 2. worked example
const A2=Object.assign({},A,{id:"A2"}),A3=Object.assign({},A,{id:"A3"});
const rr=X.matchThinkers(user,[A,A2,A3,B,Cc]),r3=X.matchThinkers(user,[A,B,Cc]);
const dA=X.compareProfile(user,X.publishedPhases(A)[0].dims),dB=X.compareProfile(user,X.publishedPhases(B)[0].dims),dC=X.compareProfile(user,X.publishedPhases(Cc)[0].dims);
ok(near(dA.D,48/720)&&near(dB.D,307.5/960)&&near(dC.D,247/840),"D values A/B/C");
ok(dA.close===6&&dB.close===4&&dB.diff===3&&dC.close===0,"relation counts");
ok(rr.overlap[0].thinkerId==="A","A is closest overlap");
ok(rr.contrast.length===1&&rr.contrast[0].thinkerId==="B","B contrast; C excluded (no shared ground)");
ok(r3.overlap.some(x=>x.thinkerId==="C"),"C appears as overlap (3 slots) with nulls shown");
const cardC=r3.overlap.find(x=>x.thinkerId==="C");ok(cardC.notComparable.length===2&&cardC.rows.length===7,"C: 7 rows, 2 not comparable");
// 3. missing dimensions and eligibility
const few=T("F","indic",{economic:[-30,H],social:[-30,H],culture:[-30,H],democracy:null,liberty:null,global:null,values:null});
ok(!X.compareProfile(user,X.publishedPhases(few)[0].dims).eligible,"3 comparable dims ineligible");
const lowW=T("W","indic",{economic:[-30,L],social:[-30,L],culture:[-30,L],democracy:[-30,L],liberty:null,global:null,values:null});
const cw=X.compareProfile(user,X.publishedPhases(lowW)[0].dims);ok(cw.n===4&&near(cw.sw,1.2)&&!cw.eligible,"4 low-confidence dims: weight 1.2 < 2.5 ineligible");
ok(X.matchThinkers(user,[few,lowW]).eligibleCount===0,"ineligible not matched");
// 4. confidence weighting
const hi=T("H","indic",{economic:[-40,H],social:[-20,H],culture:[10,H],democracy:[-50,H],liberty:[-60,H],global:[30,H],values:[-30,H]});
const lo=T("O","indic",{economic:[-40,H],social:[-20,H],culture:[10,H],democracy:[-50,H],liberty:[-60,H],global:[30,L],values:[-30,H]});
ok(near(X.compareProfile(user,X.publishedPhases(hi)[0].dims).D,60/1400)&&near(X.compareProfile(user,X.publishedPhases(lo)[0].dims).D,18/(200*6.3)),"low confidence lowers a gap's weight");
// 5. publication gates
const wide=T("G","indic",{economic:[-30,M,[{reviewer:"R1",score:-50},{reviewer:"R2",score:-10}]],social:[-55,M],culture:[10,L],democracy:[-50,M],liberty:[-60,M],global:[0,L],values:[-50,M]});
ok(X.cellProblem(wide.phases[0].dims.economic,S)&&!X.publishedPhases(wide)[0].dims.economic&&X.publishedPhases(wide)[0].dims.social,"reviewer spread >25 unpublishes that dimension only");
ok(X.cellProblem(cell(-30,M,[{reviewer:"R1",score:-30},{reviewer:"R2",score:-5}]),S)===null?false:true,"spread 25+ rejected");
ok(X.cellProblem(cell(-30,M,[{reviewer:"R1",score:-40},{reviewer:"R2",score:-20}]),S)===null,"spread 20 accepted");
ok(X.cellProblem(cell(-30,M,[{reviewer:"R1",score:-30},{reviewer:"R1",score:-30}]),S),"same reviewer twice rejected");
ok(X.cellProblem(cell(-30,M),[{id:"s1",verified:false,locator:"x"}]),"unverified source rejected");
ok(X.cellProblem(cell(-30,M),[{id:"s1",verified:true,locator:null}]),"missing locator rejected");
ok(X.validateData([wide],[]).some(m=>/differ by more than/.test(m)),"validateData flags unresolved disagreement");
ok(!X.publishedPhases(T("D","indic",{economic:[0,H]},{status:"draft"})).length,"draft entry unpublished");
// 6. phases
const P=T("PH","indic",{economic:[-30,M],social:[-55,M],culture:[10,L],democracy:[-50,M],liberty:[-60,M],global:[0,L],values:[-50,M]});
P.phases.push({id:"late",label:"later",years:"",dims:dims({economic:[60,H],social:[60,H],culture:[60,H],democracy:[60,H],liberty:[60,H],global:[60,H],values:[60,H]})});
const rp=X.matchThinkers(user,[P]);ok(rp.overlap[0].phase.id==="p"&&rp.overlap[0].otherPhases===1,"best phase chosen; other phases flagged");
// 7. near-zero wording
ok(X.orientation("economic",10).level==="mixed"&&!/both/.test(X.orientation("economic",10).text)&&X.orientation("economic",-35).level==="moderate"&&X.orientation("economic",60).level==="clear"&&X.orientation("economic",85).level==="strong","orientation levels");
// 8. mirrored profiles on a mirrored dataset
const base=[[-60,20,-30,-40,10,30,-20],[40,-50,60,20,-30,-10,50],[-10,70,-40,30,50,-60,0],[80,-20,10,-70,-20,40,-40]];
const ks=X.MATCH_DIMS,mk=(id,v)=>T(id,"indic",Object.fromEntries(ks.map((k,i)=>[k,[v[i],M]])));
const ds=[];base.forEach((v,i)=>{ds.push(mk("t"+i,v));ds.push(mk("m"+i,v.map(x=>-x)))});
const mir=id=>id[0]==="m"?"t"+id.slice(1):"m"+id.slice(1);
const u1={economic:-47,social:15,culture:-20,democracy:-30,liberty:20,global:25,values:-35},u2=Object.fromEntries(ks.map(k=>[k,-u1[k]]));
const r1=X.matchThinkers(u1,ds),r2=X.matchThinkers(u2,ds);
const sh=r=>[r.overlap.length,r.contrast.length,r.eligibleCount,r.overlap.map(x=>x.internal.D.toFixed(6)).join(),r.contrast.map(x=>x.internal.D.toFixed(6)).join()].join("|");
ok(sh(r1)===sh(r2),"mirrored user gets same structure and distances");
ok(r1.overlap.map(x=>mir(x.thinkerId)).join()===r2.overlap.map(x=>x.thinkerId).join()&&r1.contrast.map(x=>mir(x.thinkerId)).join()===r2.contrast.map(x=>x.thinkerId).join(),"mirrored user gets mirrored thinkers");
ok(r1.overlap.every(x=>x.rows.length===7)&&r2.overlap.every(x=>x.rows.length===7),"every card shows all 7 dimensions");
// 9. Western cap and books
const W=i=>T("w"+i,"western",{economic:[-40,H],social:[-20,H],culture:[10,H],democracy:[-50,H],liberty:[-60,H],global:[-30,H],values:[-30,H]});
const rw=X.matchThinkers(user,[W(1),W(2),W(3),W(4),A]);ok([...rw.overlap,...rw.contrast].filter(x=>x.family==="western").length<=2,"at most 2 Western of 5");
const bk=(id,author,fam,tr,premise,args,type)=>({id,title:id,author,year:1900,type:type||"primary",family:fam,traditions:[tr],premise,dialogueWith:[],status:"reviewed",reviewedOn:"2026-01-01",sources:S,argues:Object.fromEntries(Object.entries(args).map(([k,v])=>[k,cell(v,M)]))});
const books=[bk("b1","a1","indic","gandhian","self-rule",{economic:-40,liberty:-60}),bk("b2","a2","western","classical-liberal","limits-of-knowledge",{economic:90,liberty:-20}),bk("b3","a3","sinic","confucian","communal-duty",{economic:20,liberty:40}),bk("b4","a4","western","liberal-egalitarian","fair-terms-of-cooperation",{liberty:-65,economic:-45}),bk("b5","a5","islamic","islamic","religious-law",{economic:70,liberty:60}),bk("b6","a6","indic","realist","state-order",{},"survey")];
books[5].argues={economic:cell(0,M)};
const sb=X.selectBooks({economic:-45,social:0,culture:0,democracy:0,liberty:-60,global:0,values:0},books);
const eng=sb.picks.filter(p=>p.slot==="engages your view"),con=sb.picks.filter(p=>p.slot==="different tradition and premise");
ok(sb.picks.length<=5&&new Set(sb.picks.map(p=>p.author)).size===sb.picks.length,"no repeated author, at most 5");
ok(eng.length===2&&eng[0].premise!==eng[1].premise,"two engage picks with different premises");
ok(con.every(p=>!eng.some(e=>e.premise===p.premise||e.traditions.some(t=>p.traditions.includes(t)))),"contrast picks differ in premise and tradition");
ok(con.every(p=>Math.abs(p.stance.score-(-60))>30||Math.abs(p.stance.score-(-45))>30),"contrast picks genuinely differ on the dimension");
const few2=X.selectBooks(user,books.slice(0,2));ok(few2.picks.length<=2&&few2.notes.some(n=>/fewer|No sufficiently/.test(n)),"fewer books shown, never lowered standard");
const bm=X.selectBooks(Object.fromEntries(ks.map(k=>[k,5])),books);ok(bm.picks.length>0&&bm.focusDimensions.length===2,"near-zero user still gets same structure");
// 10. dataset report
ok(X.datasetReport([A,B,Cc]).published===3&&X.datasetReport([]).published===0,"datasetReport counts published only");
console.log(fails?fails+" of "+total+" FAILED":"all "+total+" checks passed");process.exit(fails?1:0)
