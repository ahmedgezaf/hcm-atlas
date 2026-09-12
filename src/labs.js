/* Lab 1: org structures */
LABS.push({id:'org',ch:'org',title:'Org structure tree',lead:'Oracle separates the legal view (who is registered, who pays, who reports) from the operational view (who runs what, who sees what). Delta Group is the running example. Click any box.',render(b){
  b.innerHTML=`<div class="stage"><div class="tree">
    <div class="tier"><button class="node" data-t="enterprise">Enterprise<small>Delta Group — one per implementation</small></button></div>
    <div class="tier split"><button class="node" data-t="legal-entity">Legal entity<small>Delta Manufacturing S.A.E.</small></button><button class="node" data-t="legal-entity">Legal entity<small>Delta Trading LLC</small></button><button class="node ghost" data-t="legal-entity">Legal entity<small>Delta Properties — owns buildings, employs nobody</small></button></div>
    <div class="tier split"><button class="node" data-t="legal-employer">Legal employer<small>classification switched ON</small></button><button class="node" data-t="payroll-statutory-unit-psu">PSU<small>pays &amp; remits to NOSI</small></button><button class="node" data-t="tax-reporting-unit-tru">TRU<small>registration number reports hang on</small></button></div>
    <div class="tier" style="gap:24px"><div class="ldg-box"><span class="lg">LDG · Egypt</span><button class="node" data-t="legislative-data-group-ldg">Egypt elements, balances, formulas<small>never leak across</small></button></div><div class="ldg-box"><span class="lg">LDG · Saudi Arabia</span><button class="node" data-t="legislative-data-group-ldg">Saudi elements, balances, formulas<small>rebuilt from scratch</small></button></div></div>
    <div class="tier split"><button class="node" data-t="business-unit-bu">Business unit<small>operational — can span legal entities</small></button><button class="node" data-t="department">Department<small>the box a person sits in</small></button><button class="node" data-t="location">Location<small>10th of Ramadan Plant</small></button></div>
  </div></div>${explainBox('orgEx','<span class="muted">Click a box. The one most people get wrong: a legal entity employs nobody until it is classified as a legal employer.</span>')}`;
  b.querySelectorAll('[data-t]').forEach(n=>n.addEventListener('click',()=>{b.querySelectorAll('.node').forEach(x=>x.classList.remove('active')); n.classList.add('active'); $('#orgEx').innerHTML=termExplain(n.dataset.t);}));
}});

/* Lab 2: employment model + global transfer */
LABS.push({id:'model',ch:'model',title:'Employment model & global transfer',lead:'There is no employee table. A human, their link to an employer, and their job details are three objects. Step through a worker, Omar, moving from Delta Egypt to the Saudi entity and count what survives.',render(b){
  const steps=[
    {t:'Hired in Egypt',d:'Delta Manufacturing S.A.E. hires Omar. One person record, one work relationship (employee), one assignment, one payroll relationship to the Delta Egypt PSU.',o:{person:'live',wr1:'new',asg1:'new',pr1:'new',wr2:'off',asg2:'off',pr2:'off'},c:[1,1,1]},
    {t:'Promoted',d:'A promotion is a dated change against the assignment only. Nothing else is touched — the person and the work relationship stay as they are.',o:{person:'live',wr1:'live',asg1:'new',pr1:'live',wr2:'off',asg2:'off',pr2:'off'},c:[1,1,1]},
    {t:'Global transfer',d:'Moving to the Saudi legal employer is legally a new employment. The Egyptian work relationship is terminated (end-dated, not deleted). A new work relationship, assignment and payroll relationship are created under the Saudi PSU — different country, different LDG.',o:{person:'live',wr1:'dead',asg1:'dead',pr1:'dead',wr2:'new',asg2:'new',pr2:'new'},c:[1,2,2]},
    {t:'Year-end in Riyadh',d:'Balances never span payroll relationships, so year-to-date figures started fresh in Saudi Arabia. The Egyptian history is intact and reportable. Person records at the end: still one.',o:{person:'live',wr1:'dead',asg1:'dead',pr1:'dead',wr2:'live',asg2:'live',pr2:'live'},c:[1,2,2]}];
  let i=0;
  const draw=()=>{const s=steps[i]; const o=s.o; b.innerHTML=`<div class="stepper">${steps.map((x,k)=>`<button class="${k===i?'active':''}" data-s="${k}">${k+1}. ${x.t}</button>`).join('')}</div>
   <div class="stage" style="display:grid;gap:14px">
     <div class="objs"><div class="obj ${o.person}"><div class="t">Person</div><div class="v">Omar · DOB, national ID, nationality</div></div></div>
     <div class="objs">
       <div class="obj ${o.wr1}"><div class="t">Work relationship</div><div class="v">Employee · Delta Manufacturing (EG)</div></div>
       <div class="obj ${o.asg1}"><div class="t">Assignment</div><div class="v">${i>=1?'Senior Analyst · G6':'Analyst · G5'} · Finance · Cairo</div></div>
       <div class="obj ${o.pr1}"><div class="t">Payroll relationship</div><div class="v">Delta Egypt PSU · Egypt LDG</div></div>
     </div>
     <div class="objs">
       <div class="obj ${o.wr2}"><div class="t">Work relationship</div><div class="v">Employee · Delta Saudi (SA)</div></div>
       <div class="obj ${o.asg2}"><div class="t">Assignment</div><div class="v">Senior Analyst · Finance · Riyadh</div></div>
       <div class="obj ${o.pr2}"><div class="t">Payroll relationship</div><div class="v">Delta Saudi PSU · Saudi LDG</div></div>
     </div>
     <div class="counter"><div><div class="big num">${s.c[0]}</div><div class="lbl">person records</div></div><div><div class="big num">${s.c[1]}</div><div class="lbl">work relationships (ever)</div></div><div><div class="big num">${s.c[2]}</div><div class="lbl">payroll relationships (ever)</div></div></div>
   </div>${explainBox('mEx',`<b>${esc(s.t)}.</b> ${esc(s.d)}`)}
   <div class="legend"><span><i class="obj live" style="padding:0 8px;font-size:11px">live</i> unchanged</span><span><i class="obj new" style="padding:0 8px;font-size:11px">new</i> created / changed this step</span><span><i class="obj dead" style="padding:0 8px;font-size:11px">ended</i> end-dated, history kept</span></div>`;
   b.querySelectorAll('[data-s]').forEach(x=>x.addEventListener('click',()=>{i=+x.dataset.s; draw();}));};
  draw();
}});

/* Lab 3: payroll chain */
LABS.push({id:'payroll',ch:'payroll',title:'Payroll object chain',lead:'Each link depends on the one before it. Click a stage to see what it does and what breaks when it is missing — that is most payroll debugging.',render(b){
  const chain=[['element','Element','define it'],['element-eligibility-element-link','Eligibility','who could get it'],['element-entry','Entry','who does, how much'],['payroll-run','Payroll run','gross → net'],['balance','Balance','running totals'],['prepayments','Prepayments','split to bank accounts'],['payment-process-bank-file','Payment','bank file / WPS SIF'],['costing','Costing','to the ledger']];
  const breaks={'element':'Nothing exists to put on a payslip.','element-eligibility-element-link':'“Why can’t I add this allowance to this employee?” — the element cannot be given to anyone.','element-entry':'The element is allowed but nobody actually has it, so nothing is paid.','payroll-run':'No results, no balances. Errors here usually mean a missing entry, missing eligibility, or a formula problem.','balance':'Statutory reports and year-end reconciliation show wrong totals — the balance feed is where the problem lives.','prepayments':'Calculation is done but nothing is distributed to payment methods; the payment fails and people forget this step exists.','payment-process-bank-file':'Salaries calculated, nobody paid. In the Gulf a bad SIF file is a classic go-live delay.','costing':'Finance cannot see payroll cost by department or cost centre — HR and Finance stop agreeing.'};
  b.innerHTML=`<div class="stage"><div class="pipe">${chain.map(([id,n,s])=>`<button class="node" data-c="${id}">${n}<small>${s}</small></button>`).join('')}</div></div>${explainBox('pEx','<span class="muted">Click a stage. Also: QuickPay runs the whole chain for one person — the main testing tool; a parallel run proves the chain matches legacy before go-live.</span>')}`;
  b.querySelectorAll('[data-c]').forEach(n=>n.addEventListener('click',()=>{b.querySelectorAll('.node').forEach(x=>x.classList.remove('active')); n.classList.add('active'); $('#pEx').innerHTML=termExplain(n.dataset.c)+`<div style="margin-top:8px"><b style="color:var(--bad)">If this link is missing:</b> ${esc(breaks[n.dataset.c])}</div>`;}));
}});

/* Lab 4: effective dating */
LABS.push({id:'dating',ch:'dating',title:'Update vs correction vs retro',lead:'Oracle is date-effective: changes are recorded with the date they became true, not the date someone typed them. Toggle the three cases and watch what happens to history.',render(b){
  const modes={update:{t:'Update — a promotion effective 1 July',rows:`<div class="tl-row"><div class="tl-line"><div class="tl-seg old" style="left:0;width:50%"></div><div class="tl-seg" style="left:50%;width:50%"></div><div class="tl-mark" style="left:0"><i></i>1 Jan</div><div class="tl-mark" style="left:50%"><i></i>1 Jul</div><div class="tl-mark" style="left:100%"><i></i>end of time 4712</div><div class="tl-lbl" style="left:25%">Grade G5 (kept as history)</div><div class="tl-lbl" style="left:75%;color:var(--p)">Grade G6 (new record)</div></div></div>`,d:'A new dated record is created and the old one is end-dated on 30 June. Both grades are in history — because both were true.'},
    correction:{t:'Correction — the grade was a typo',rows:`<div class="tl-row"><div class="tl-line"><div class="tl-seg gone" style="left:0;width:100%"></div><div class="tl-seg" style="left:0;width:100%;opacity:.35"></div><div class="tl-mark" style="left:0"><i></i>1 Jan</div><div class="tl-mark" style="left:100%"><i></i>4712</div><div class="tl-lbl" style="left:50%"><s class="muted">Grade G7</s> → <span style="color:var(--p)">Grade G5</span> (overwritten, no trace)</div></div></div>`,d:'The existing record is overwritten as if the old value was never true. Correct for mistakes; catastrophic for real events — it destroys legitimate history and can mis-fire retroactive payroll.'},
    retro:{t:'Retro — raise approved in July, effective 1 May',rows:`<div class="tl-row"><div class="tl-line"><div class="tl-seg old" style="left:0;width:33%"></div><div class="tl-seg" style="left:33%;width:67%"></div><div class="tl-mark" style="left:0"><i></i>1 Jan</div><div class="tl-mark" style="left:33%"><i></i>1 May (effective)</div><div class="tl-mark warn" style="left:66%"><i></i>July (entered)</div><div class="tl-mark" style="left:100%"><i></i>4712</div><div class="tl-lbl" style="left:16%">old salary</div><div class="tl-lbl" style="left:50%;color:var(--p)">new salary — May &amp; June already paid at old rate</div></div></div>`,d:'May and June payrolls already ran. The July run calculates the arrears for both months and pays them — Oracle’s retropay process. It also re-states balances, social insurance and tax for those periods. Retro can recover money too, when a change reduces pay.'}};
  let m='update';
  const draw=()=>{b.innerHTML=`<div class="stepper">${Object.keys(modes).map(k=>`<button class="${k===m?'active':''}" data-m="${k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}</div><div class="stage"><div class="tl"><div style="font-weight:700;font-family:var(--display);margin-bottom:26px">${modes[m].t}</div>${modes[m].rows}</div></div>${explainBox('dEx',esc(modes[m].d))}<div class="callout"><b>The rule.</b> Real-world event → update. Data-entry mistake → correction. Never delete: end-date, correct, or reverse.</div>`; b.querySelectorAll('[data-m]').forEach(x=>x.addEventListener('click',()=>{m=x.dataset.m;draw();}));};
  draw();
}});

/* Lab 5: social insurance calculator */
LABS.push({id:'insurance',ch:'egypt-payroll',title:'Egypt social insurance calculator',lead:'Contributions apply to the capped insurable wage, not to gross. Drag the salary and watch the cap bite. 2026 figures from the handbook — they rise 15% every January through 2027.',render(b){
  const FLOOR=2700, CEIL=16700, EMP=0.11, ER=0.1875;
  b.innerHTML=`<div class="calc"><div class="in card" style="padding:16px"><label>Monthly gross salary (EGP)</label><input type="number" id="siN" value="25000" min="0" step="500"><input type="range" id="siR" min="1000" max="60000" step="500" value="25000"><div class="small muted">Floor EGP ${fmt(FLOOR)} · Ceiling EGP ${fmt(CEIL)} · Employee 11% · Employer 18.75%</div></div><div class="out card" style="padding:16px" id="siOut"></div></div><div class="callout"><b>Why this matters.</b> “Contributions apply to full gross salary” is the most common calculation error in Egyptian payroll. Also note the mandatory 3% annual increment is calculated on this insurable wage — so it is effectively capped for high earners.</div>`;
  const n=$('#siN'), r=$('#siR');
  const calc=()=>{const g=Math.max(0,+n.value||0); const iw=Math.min(CEIL,Math.max(FLOOR,g)); const e=iw*EMP, er=iw*ER; const capped=g>CEIL; const w=x=>Math.min(100,100*x/Math.max(g,CEIL));
    $('#siOut').innerHTML=`<div class="hbar"><div class="row"><span>Gross salary</span><div class="trk"><div class="fill" style="width:${w(g)}%;opacity:.35"></div></div><span class="v">${fmt(g)}</span></div><div class="row"><span>Insurable wage</span><div class="trk"><div class="fill" style="width:${w(iw)}%"></div>${capped?`<div class="fill cap" style="position:absolute;left:${w(iw)}%;top:0;width:${w(g)-w(iw)}%"></div>`:''}</div><span class="v">${fmt(iw)}</span></div></div>
    <div class="kv"><span>Employee 11% of insurable</span><b>EGP ${fmt2(e)}</b></div><div class="kv"><span>Employer 18.75% of insurable</span><b>EGP ${fmt2(er)}</b></div><div class="kv total"><span>Total remitted to NOSI</span><b>EGP ${fmt2(e+er)}</b></div>
    <div class="small" style="margin-top:6px">${capped?`<b style="color:var(--warm)">Capped.</b> Salary is above the ceiling, so the employee pays EGP ${fmt2(CEIL*EMP)} whether they earn ${fmt(g)} or 200,000. A naive 11% of gross would be EGP ${fmt2(g*EMP)} — wrong by EGP ${fmt2(g*EMP-e)}.`:g<FLOOR?`<b style="color:var(--warm)">Floored.</b> Salary is below the minimum insurable wage, so contributions are calculated on EGP ${fmt(FLOOR)}.`:`Within the band — contributions are 11% / 18.75% of gross here.`}</div>`;};
  n.addEventListener('input',()=>{r.value=n.value;calc();}); r.addEventListener('input',()=>{n.value=r.value;calc();}); calc();
}});

/* Lab 6: tax brackets */
LABS.push({id:'tax',ch:'egypt-payroll',title:'Egypt salary tax & bracket elimination',lead:'Tax is annual, progressive, exemption-adjusted — the monthly figure is a slice. Turn on bracket elimination to see why a naive calculator understates tax for senior staff. Figures per the handbook (Law 7/2024); verify before quoting.',render(b){
  const BR=[[40000,0],[55000,.10],[70000,.15],[200000,.20],[400000,.225],[1200000,.25],[Infinity,.275]];
  const ELIM=[[600000,1],[700000,2],[800000,3],[900000,4],[1200000,5]]; // net income above X → first N brackets eliminated
  b.innerHTML=`<div class="calc"><div class="in card" style="padding:16px"><label>Monthly gross salary (EGP)</label><input type="number" id="txN" value="30000" step="1000" min="0"><input type="range" id="txR" min="5000" max="150000" step="1000" value="30000"><label class="toggle"><input type="checkbox" id="txE" checked> Apply bracket elimination for high earners</label><div class="small muted">Personal exemption EGP 20,000/yr · employee social insurance deducted before tax</div></div><div class="out card" style="padding:16px" id="txOut"></div></div><div class="callout"><b>Interpolated thresholds.</b> The handbook states the 600k and 700k steps explicitly and says the pattern continues to 1.2M; the 800k/900k steps here follow that pattern. Treat the exact ladder as something to confirm against the Egyptian Tax Authority.</div>`;
  const n=$('#txN'), r=$('#txR'), e=$('#txE');
  const calc=()=>{const gm=Math.max(0,+n.value||0); const iw=Math.min(16700,Math.max(2700,gm)); const si=iw*.11*12; const gross=gm*12; const net=Math.max(0,gross-20000-si);
    let elim=0; if(e.checked) ELIM.forEach(([th,k])=>{ if(net>th) elim=k; });
    let prev=0, total=0; const rows=BR.map(([up,rate],i)=>{ const dead=i<elim; const span=Math.max(0,Math.min(net,up)-prev); const inBand=span; let amt; if(dead){ amt=inBand*BR[elim][1]; } else amt=inBand*rate; total+=amt; const w=up===Infinity?(net>prev?100:0):Math.min(100,100*Math.max(0,Math.min(net,up)-prev)/(up-prev)); const row=`<div class="brk ${dead?'dead':''}"><span class="num">${fmt(prev)}–${up===Infinity?'∞':fmt(up)}</span><div class="trk"><div class="fill" style="width:${w}%"></div></div><span class="rate">${(rate*100).toFixed(rate*100%1?1:0)}%</span><span class="amt">${inBand>0?'EGP '+fmt(amt):'—'}</span></div>`; prev=up; return row;}).join('');
    $('#txOut').innerHTML=`<div class="kv"><span>Annual gross</span><b>EGP ${fmt(gross)}</b></div><div class="kv"><span>− personal exemption</span><b>EGP 20,000</b></div><div class="kv"><span>− employee social insurance (12 × 11% of insurable)</span><b>EGP ${fmt(si)}</b></div><div class="kv"><span>= Net taxable income</span><b>EGP ${fmt(net)}</b></div>
    <div class="brackets">${rows}</div>${elim?`<div class="small" style="color:var(--bad);margin-top:6px">Net income above EGP ${fmt(ELIM[elim-1][0])}: the first ${elim} bracket${elim>1?'s':''} ${elim>1?'are':'is'} eliminated — that income is taxed at the ${(BR[elim][1]*100).toFixed(1)}% band instead.</div>`:''}
    <div class="kv total" style="margin-top:8px"><span>Annual tax</span><b>EGP ${fmt(total)}</b></div><div class="kv"><span>Monthly slice (÷12)</span><b>EGP ${fmt(total/12)}</b></div>`;};
  n.addEventListener('input',()=>{r.value=n.value;calc();}); r.addEventListener('input',()=>{n.value=r.value;calc();}); e.addEventListener('change',calc); calc();
}});

/* Lab 7: leave */
LABS.push({id:'leave',ch:'absence',title:'Leave ladder & plan types',lead:'Every entitlement in the labour law becomes a plan with rules, and every rule becomes a test script. The Egyptian annual-leave ladder is the classic accrual-band exercise; sick leave is the classic qualification plan.',render(b){
  const rungs=[[15,'1st year of service'],[21,'from 2nd year'],[30,'10+ years or age 50+'],[45,'persons with disabilities'],['+7','hazardous / arduous / remote work']];
  const plans=[['accrual-plan','Accrual','earned over time — annual leave'],['qualification-plan','Qualification','triggered by an event, paid in bands — sick, maternity'],['no-entitlement-plan','No entitlement','tracked, no balance — unpaid leave'],['compensatory-plan','Compensatory','time off instead of overtime pay'],[null,'Agreement','Know the name — one of the six'],[null,'Donation','Know the name — one of the six']];
  b.innerHTML=`<div class="grid g2"><div class="stage"><div class="eyebrow" style="margin-bottom:6px">Egyptian annual leave · Law 14/2025 · accrual bands</div><div class="ladder">${rungs.map(([d,l],i)=>`<div class="rung" data-i="${i}"><div class="col" style="height:${typeof d==='number'?d*3.4:60}px">${d}</div><div class="lbl">${l}</div></div>`).join('')}</div><div class="small muted" style="margin-top:8px">Days per year. Test the boundary cases: the person who crosses 10 years mid-year, and the one who turns 50 mid-year. Casual leave (max 7/yr, 2 consecutive) is counted <em>within</em> this, not on top.</div></div>
  <div class="stage"><div class="eyebrow" style="margin-bottom:6px">Sick leave · qualification bands · % of insurable wage</div><div class="bands"><div style="flex:90">75% · days 1–90</div><div style="flex:90">85% · days 91–180</div></div><div class="small muted" style="margin-top:8px">Up to 180 days in a calendar year, medical certification required. Employers offset what NOSI already paid.</div>
  <div class="eyebrow" style="margin:16px 0 6px">Maternity · qualification plan</div><div class="bands"><div style="flex:4">4 months paid</div><div style="flex:1;background:var(--muted)">max ×3 in service</div></div><div class="small muted" style="margin-top:8px">The “three times in service” cap must be enforced in configuration, not just documented. Fathers: one paid day at birth, up to three times.</div></div></div>
  <div class="eyebrow">The six absence plan types — most beginners only know two</div><div class="plans">${plans.map(([id,n,s])=>`<button class="plan" ${id?`data-t="${id}"`:''}><b>${n}</b><small>${s}</small></button>`).join('')}</div>${explainBox('lvEx','<span class="muted">Click a plan type. Carryover rules and leave encashment on exit are where absence meets payroll — pin them down in writing early.</span>')}`;
  b.querySelectorAll('[data-t]').forEach(x=>x.addEventListener('click',()=>{b.querySelectorAll('.plan').forEach(y=>y.classList.remove('active')); x.classList.add('active'); $('#lvEx').innerHTML=termExplain(x.dataset.t);}));
}});

/* Lab 8: lifecycle */
LABS.push({id:'lifecycle',ch:'lifecycle',title:'Employment lifecycle & exits',lead:'Every event is a dated transaction against the assignment, with an approver and a payroll consequence. Three exit routes look alike and are not — click each.',render(b){
  b.innerHTML=`<div class="stage"><div class="pipe" style="min-width:680px"><button class="node" data-t="probation">Hire + probation<small>≤3 months, once, in the contract</small></button><button class="node" data-t="assignment">Working life<small>promotions, transfers, hours — dated changes</small></button><button class="node" data-t="notice-period">Notice<small>written, counts as service</small></button><button class="node" data-t="final-settlement">Final settlement<small>off-cycle QuickPay</small></button></div>
  <div class="eyebrow" style="margin:18px 0 8px">Three exit routes — different downstream calculations</div><div class="objs"><button class="node" data-t="resignation">Resignation<small>employee-initiated · withdrawable within 1 week · leave paid out, no severance</small></button><button class="node" data-t="termination">Termination<small>employer-initiated · with/without cause · burden of proof on employer</small></button><button class="node" data-t="end-of-contract">End of contract<small>fixed term lapses · renewal or continuing = indefinite</small></button></div></div>
  ${explainBox('lcEx','<span class="muted">Click a stage. Final settlement = final salary + unused leave payout + any EOSB/severance − outstanding loans. Egypt has no Gulf-style gratuity; do not import EOSB logic.</span>')}`;
  b.querySelectorAll('[data-t]').forEach(x=>x.addEventListener('click',()=>{b.querySelectorAll('.node').forEach(y=>y.classList.remove('active')); x.classList.add('active'); $('#lcEx').innerHTML=termExplain(x.dataset.t);}));
}});

/* Lab 9: reporting decision */
LABS.push({id:'reporting',ch:'reporting',title:'OTBI vs BIP & the four query paths',lead:'There is no SQL Developer connection to a SaaS pod. Pick a scenario and see which of the four paths wins — and why the other three lose.',render(b){
  const paths=[['otbi','OTBI','ad-hoc analysis, dashboards, quick lists'],['bip','BI Publisher','formatted, per-employee, statutory documents; complex SQL'],['ext','HCM Extract','scheduled or large-volume outbound files'],['rest','REST API','real-time integration']];
  const sc=[['A headcount dashboard by department','otbi','Live, ad-hoc, no layout requirement. Pick the Worker Assignment Real Time subject area.'],['Monthly payslips emailed to 4,000 employees','bip','Pixel-controlled layout, one per person — BIP with bursting. OTBI cannot produce a payslip.'],['A nightly file of new hires to the access-control system','ext','Scheduled, outbound, changes-only. A REST call every night would be the wrong shape.'],['The intranet needs a live check of employment status','rest','Real time — a scheduled file is too slow. This is where the technical team usually takes over.'],['A one-off list of everyone in grade G7 and above','otbi','Quick operational list; OTBI in minutes. BIP would be over-engineering.'],['A 200,000-row extract of all assignment history','ext','Past OTBI’s row limit (which truncates silently). Extract, or BIP with hand-written SQL.'],['A salary certificate in Arabic with the company letterhead','bip','Formatted, per-employee, printable — the BIP template layer is exactly for this.']];
  let cur=0;
  const draw=()=>{const s=sc[cur]; b.innerHTML=`<div class="grid g2"><div class="scen">${sc.map((x,i)=>`<button class="${i===cur?'active':''}" data-i="${i}">${x[0]}</button>`).join('')}</div><div><div class="paths">${paths.map(([id,n,d])=>`<div class="path ${id===s[1]?'win':'lose'}"><b>${n}</b>${d}</div>`).join('')}</div>${explainBox('rpEx',`<b>${paths.find(p=>p[0]===s[1])[1]}.</b> ${esc(s[2])}`)}<div class="callout" style="margin-top:12px"><b>The boundary.</b> HDL, simple formulas, OTBI and basic BIP are expected of a strong functional consultant. OIC integrations and complex BIP development are the genuine hand-off.</div></div></div>`; b.querySelectorAll('[data-i]').forEach(x=>x.addEventListener('click',()=>{cur=+x.dataset.i;draw();}));};
  draw();
}});

/* Lab 10: HDL */
LABS.push({id:'hdl',ch:'hdl',title:'HDL file anatomy & load order',lead:'One .dat per business object, zipped flat. METADATA declares the columns, MERGE carries the data, pipes separate everything. Hover any token; then put the files in a valid load order.',render(b){
  const tip={METADATA:'Instruction keyword: this line declares the column list for the discriminator that follows. Must come before its MERGE lines.',MERGE:'Instruction keyword: create the record if it does not exist, update it if it does. (DELETE is the other one.)',JobFamily:'The discriminator — which business object / component this line is about. Two METADATA lines for the same component in one file = rejected.',JobFamilyCode:'A user key: a natural business key. Attribute names are case-sensitive.',JobFamilyName:'Attribute — must appear in the MERGE line in the same position.',EffectiveStartDate:'Date-effective start. Format yyyy/mm/dd.',EffectiveEndDate:'Date-effective end.',SALES:'Value for JobFamilyCode — this is the user key identifying the record.',Sales:'Value for JobFamilyName.','2000/01/01':'Effective from 1 January 2000.','4712/12/31':'Oracle’s “end of time”. You will see it constantly.',Worker:'Discriminator for the top of the worker hierarchy. PersonName, WorkRelationship, Assignment follow as further METADATA/MERGE pairs in the same file.',SourceSystemOwner:'Source key, part 1: which legacy system the record came from. If you use source keys, both attributes must be in METADATA.',SourceSystemId:'Source key, part 2: the record’s id in that legacy system. This is what makes reconciliation possible.',PersonNumber:'Oracle’s own identifier.',ActionCode:'HIRE, and the like — the action this row performs.',StartDate:'Start of the work relationship.',DateOfBirth:'Person-level attribute — lives on the person, not the assignment.',XXTEST:'Value of SourceSystemOwner.',XXTEST_PER1:'Value of SourceSystemId — the legacy key reconciliation runs against.',XXTEST1:'Value of PersonNumber.',HIRE:'The action.','2018/01/01':'Date value.','1975/01/01':'Date of birth.','JobFamilyId(SourceSystemId)':'Foreign reference: point at another object by naming the attribute with the key type in brackets. This is how children attach to parents.'};
  const line=(kw,parts)=>`<div class="ln"><span class="tok kw" data-tip="${kw}">${kw}</span>${parts.map(p=>`<span class="pipe-c">|</span><span class="tok ${p==='4712/12/31'?'eot':''}" data-tip="${esc(p)}">${esc(p)}</span>`).join('')}</div>`;
  const files=['Grade','Job','JobFamily','Worker']; const valid=o=>{const i=x=>o.indexOf(x); return i('JobFamily')<i('Job') && i('Grade')<i('Worker') && i('Job')<i('Worker');};
  let picked=[];
  const draw=()=>{b.innerHTML=`<div class="stage"><div class="eyebrow" style="margin-bottom:8px">JobFamily.dat — user keys</div><div class="hdl">${line('METADATA',['JobFamily','JobFamilyCode','JobFamilyName','EffectiveStartDate','EffectiveEndDate'])}${line('MERGE',['JobFamily','SALES','Sales','2000/01/01','4712/12/31'])}</div>
    <div class="eyebrow" style="margin:16px 0 8px">Worker.dat — source keys</div><div class="hdl">${line('METADATA',['Worker','SourceSystemOwner','SourceSystemId','EffectiveStartDate','EffectiveEndDate','PersonNumber','ActionCode','StartDate','DateOfBirth'])}${line('MERGE',['Worker','XXTEST','XXTEST_PER1','2018/01/01','4712/12/31','XXTEST1','HIRE','2018/01/01','1975/01/01'])}</div>
    <div class="eyebrow" style="margin:16px 0 8px">Job.dat — referencing a parent</div><div class="hdl">${line('METADATA',['Job','JobCode','JobName','JobFamilyId(SourceSystemId)','EffectiveStartDate','EffectiveEndDate'])}</div></div>
    ${explainBox('hdlEx','<span class="muted">Hover a token. Rejection reasons to memorise: METADATA after its MERGE lines; two METADATA lines for the same component; MERGE attributes not matching METADATA order; wrong case in an attribute name.</span>')}
    <div class="stage"><div class="eyebrow" style="margin-bottom:8px">Load order — files import in parallel but load sequentially; referenced data must exist first</div><div class="orderer">${files.map(f=>`<button class="node ${picked.includes(f)?'picked':''}" data-f="${f}">${f}.dat</button>`).join('')}<button class="btn sm ghost" id="hdlReset">Reset</button></div><div class="order-out" style="margin-top:10px">${picked.length?picked.map((f,i)=>`${i?'<span class="arrow">→</span>':''}<span class="node">${f}.dat</span>`).join(''):'<span class="muted small">Click the files in the order they should be loaded.</span>'}</div>${picked.length===files.length?`<div class="verdict ${valid(picked)?'ok':'no'}" style="margin-top:8px">${valid(picked)?'Valid. JobFamily before Job (Job references it); Grade and Job before Worker (assignments reference both).':'Something is referenced before it exists. Job needs JobFamily first; Worker needs Grade and Job first.'}</div>`:''}</div>`;
    b.querySelectorAll('[data-tip]').forEach(t=>t.addEventListener('mouseenter',()=>{$('#hdlEx').innerHTML=`<b><code>${esc(t.dataset.tip)}</code></b><br>${esc(tip[t.dataset.tip]||'A value in this column.')}`;}));
    b.querySelectorAll('[data-f]').forEach(x=>x.addEventListener('click',()=>{picked.push(x.dataset.f);draw();})); $('#hdlReset').addEventListener('click',()=>{picked=[];draw();});};
  draw();
}});

/* Lab 11: Fast Formula */
LABS.push({id:'ff',ch:'ff',title:'Fast Formula anatomy',lead:'Inputs, defaults, logic, return — that is the whole shape. Below: the delivered-style example, then the Egyptian social insurance formula from the Day 5 drill, colour-coded by section.',render(b){
  const blk=(c,l,code)=>`<div class="blk ${c}"><div class="lb">${l}</div>${esc(code)}</div>`;
  b.innerHTML=`<div class="grid g2"><div class="stage"><div class="eyebrow" style="margin-bottom:8px">Minimal example</div><div class="ff">${blk('i','1 · Inputs','INPUTS ARE BASIC_SALARY')}${blk('d','2 · Defaults','DEFAULT FOR BASIC_SALARY IS 0')}${blk('l','3 · Logic','IF BASIC_SALARY > 35000 THEN\n  SPECIAL_ALLOWANCE = 2500\nELSE\n  SPECIAL_ALLOWANCE = 0')}${blk('r','4 · Return','RETURN SPECIAL_ALLOWANCE')}</div></div>
  <div class="stage"><div class="eyebrow" style="margin-bottom:8px">Egypt social insurance — employee share (Day 5 drill)</div><div class="ff">${blk('i','1 · Inputs','INPUTS ARE INSURABLE_WAGE')}${blk('d','2 · Defaults','DEFAULT FOR INSURABLE_WAGE IS 0\nFLOOR_AMT   = 2700\nCEILING_AMT = 16700\nEMP_RATE    = 0.11')}${blk('l','3 · Logic  (cap, then floor, THEN the rate)','CAPPED_WAGE = INSURABLE_WAGE\nIF CAPPED_WAGE > CEILING_AMT THEN\n  CAPPED_WAGE = CEILING_AMT\nIF CAPPED_WAGE < FLOOR_AMT THEN\n  CAPPED_WAGE = FLOOR_AMT\nEMP_CONTRIBUTION = CAPPED_WAGE * EMP_RATE')}${blk('r','4 · Return','RETURN EMP_CONTRIBUTION')}</div></div></div>
  <div class="grid g3"><div class="card" style="padding:12px 14px;font-size:14px"><b>Inputs vs database items.</b> Values arrive as runtime inputs, database items, or globals. Oracle prefers INPUTS where possible — no database read, faster payroll run. Worth saying in an interview.</div><div class="card" style="padding:12px 14px;font-size:14px"><b>Formula types.</b> The type fixes which inputs and contexts exist. A formula for one context will not run in another — which is why the language is learned by reading delivered formulas, not grammar.</div><div class="card" style="padding:12px 14px;font-size:14px"><b>Recognise on sight.</b> DEFAULT FOR (null fallback), ALIAS (shorten a database item), and formula-calling-formula via SET_INPUT / EXECUTE / GET_OUTPUT.</div></div>`;
}});

/* Lab 12: security */
LABS.push({id:'security',ch:'security',title:'Function vs data scope',lead:'Function and data scope are separate questions. A job role says what you can do; a security profile (via the data role) says which records you can do it to.',render(b){
  b.innerHTML=`<div class="stage"><div class="secgrid">
   <div class="cell"><h4 style="color:var(--p)">WHAT you can do — function</h4><ul><li><b>Job role</b> — HR Specialist, Payroll Manager: reflects the work someone does</li><li><b>Abstract role</b> — Employee, Line Manager: held by being a person in the system; self-service</li><li><b>Duty role</b> — granular privileges, composed into the two above</li></ul></div>
   <div class="cell"><h4 style="color:var(--p)">WHOSE data — scope</h4><ul><li><b>Data role + security profile</b> — scoped by legal employer, BU, department, position, country</li><li><b>Area of Responsibility</b> — “this HR rep owns the Alexandria plant”; drives access and routing</li></ul></div>
   <div class="cell" style="grid-column:1/-1;background:var(--p-soft);border-color:var(--p)"><b>Worked case.</b> An HR specialist in Egypt has the <em>same job role</em> as one in Saudi Arabia — same screens, same tasks. Their <em>security profiles</em> differ, so neither sees the other country’s records. Same function, different scope.</div>
  </div></div>${explainBox('scEx','<span class="muted">One line to remember: “Job role controls function; security profile controls data.” Then add AOR as the increasingly preferred way to scope HR representative access.</span>')}`;
}});

/* Lab 13: methodology */
LABS.push({id:'method',ch:'method',title:'How a project actually runs',lead:'The vocabulary of a live implementation, in order. Click a phase. Hypercare and the first live payroll are the real finish line — not the go-live date.',render(b){
  const ph=[['fit-gap-analysis','Fit-gap','requirements vs product'],['configuration-workbook','Configure','the workbook records every decision'],['crp-conference-room-pilot','CRP 1 · 2','client sees it with their data'],['sit-system-integration-testing','SIT','end to end, project team'],['uat-user-acceptance-testing','UAT','client executes the scripts'],['parallel-run','Parallel run','2–3 months vs legacy, reconciled'],['cutover','Cutover + freeze','final loads, go/no-go'],['hypercare','Hypercare','first 1–2 live payrolls']];
  b.innerHTML=`<div class="stage"><div class="phases">${ph.map(([id,n,s])=>`<button class="phase" data-t="${id}"><b>${n}</b><small>${s}</small></button>`).join('')}</div></div>${explainBox('mtEx','<span class="muted">Running alongside all of it: the RAID log, change requests, test scripts, and reconciliation. Legacy AIM codes still heard on projects: BR100 setup, MD050 functional design, TE040 test script.</span>')}`;
  b.querySelectorAll('[data-t]').forEach(x=>x.addEventListener('click',()=>{b.querySelectorAll('.phase').forEach(y=>y.classList.remove('active')); x.classList.add('active'); $('#mtEx').innerHTML=termExplain(x.dataset.t);}));
}});

/* Lab 14: headcount vs FTE */
LABS.push({id:'fte',ch:'hrfunction',title:'Headcount vs FTE',lead:'Headcount counts humans; FTE measures workload. Click a person to switch them between full-time and half-time and watch the two numbers diverge.',render(b){
  let ppl=[1,1,1,1,1,1,.5,.5,.5,.5];
  const draw=()=>{const hc=ppl.length, fte=ppl.reduce((a,x)=>a+x,0); b.innerHTML=`<div class="stage"><div class="people">${ppl.map((x,i)=>`<button class="person ${x<1?'half':''}" data-i="${i}" title="${x<1?'Half-time':'Full-time'} — click to switch"></button>`).join('')}</div><div class="counter" style="margin-top:16px"><div><div class="big num">${hc}</div><div class="lbl">headcount</div></div><div><div class="big num">${fte.toFixed(1)}</div><div class="lbl">FTE</div></div></div></div>
   <div class="grid g2" style="margin-top:0"><button class="btn sm" id="fAdd">+ Add a person</button><span class="small muted">FTE is stored on the assignment. When a client asks for “headcount”, ask which of these two they mean — they are different numbers and both are correct.</span></div>`;
   b.querySelectorAll('[data-i]').forEach(x=>x.addEventListener('click',()=>{ppl[+x.dataset.i]=ppl[+x.dataset.i]<1?1:.5;draw();})); $('#fAdd').addEventListener('click',()=>{ppl.push(1);draw();});};
  draw();
}});

/* Lab: job vs position */
LABS.push({id:'jobpos',ch:'workforce',title:'Job vs position',lead:'The single most tested distinction. A job is what the work is, defined once. A position is a specific seat doing it, which exists whether or not anyone is in it.',render(b){
  let vac=false;
  const draw=()=>{b.innerHTML=`<div class="stage"><div class="tree" style="min-width:560px"><div class="tier"><button class="node active">Job: Accountant<small>defined once · grade range G4–G7 · job family Finance</small></button></div><div class="tier split"><button class="node">Position: Accountant #1<small>Finance · Cairo HO · Samir</small></button><button class="node">Position: Accountant #2<small>Finance · 10th of Ramadan · Mona</small></button><button class="node ${vac?'ghost':''}">Position: Accountant #3<small>Finance · Alexandria · ${vac?'VACANT — seat still exists, still budgeted':'Youssef'}</small></button></div></div></div>
   <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn sm" id="jpBtn">${vac?'Hire someone into #3':'Youssef resigns'}</button><span class="small muted">${vac?'The position survived the leaver: that is why position management gives vacancy reporting and headcount control — standard in government, oil &amp; gas, banking, and most Gulf entities.':'In a job-based organisation the assignment carries job + department + location as separate fields, and no seat exists independently. Common in Egyptian private companies.'}</span></div>`;
   $('#jpBtn').addEventListener('click',()=>{vac=!vac;draw();});};
  draw();
}});

/* ===================== DATA & ANALYTICS ===================== */

LABS.push({id:'query-order',ch:'sql-shape',title:'What the engine does, in its own order',lead:'The same query, stepped through the order the database actually resolves it in. Watch the rows disappear before SELECT ever runs — that is why an alias defined in SELECT cannot be used in WHERE.',render(b){
  const ROWS=[{id:101,cust:'Amal',amt:120,st:'shipped'},{id:102,cust:'Amal',amt:60,st:'shipped'},
              {id:103,cust:'Karim',amt:200,st:'cancelled'},{id:104,cust:'Karim',amt:90,st:'shipped'},
              {id:105,cust:'Nour',amt:45,st:'shipped'},{id:106,cust:'Nour',amt:30,st:'pending'}];
  const STEPS=[
    {k:'FROM',   t:'orders',                         say:'Every row in the table, before anything is discarded.'},
    {k:'WHERE',  t:"status = 'shipped'",             say:'Rows are thrown away first. This is why a filter here cannot reference an alias from SELECT — SELECT has not run yet.'},
    {k:'GROUP BY',t:'customer',                      say:'The survivors collapse into one row per customer. From here on there are groups, not rows.'},
    {k:'HAVING', t:'SUM(amount) > 100',              say:'Groups are thrown away. A condition on an aggregate can only live here, because the aggregate did not exist until GROUP BY ran.'},
    {k:'SELECT', t:'customer, SUM(amount) AS total', say:'Only now are the output columns worked out — and only now does the alias `total` exist.'},
    {k:'ORDER BY',t:'total DESC',                    say:'Sorting is last, which is the one place the alias from SELECT is usually allowed.'}];
  let at=0;
  const draw=()=>{
    const kept=ROWS.filter(r=>at<1||r.st==='shipped');
    let grouped=null;
    if(at>=2){ const m={}; kept.forEach(r=>{ m[r.cust]=(m[r.cust]||0)+r.amt; });
      grouped=Object.entries(m).map(([cust,total])=>({cust,total})); }
    if(at>=3) grouped=grouped.filter(g=>g.total>100);
    if(at>=5) grouped=[...grouped].sort((x,y)=>y.total-x.total);
    const table = at<2
      ? `<table class="dt"><thead><tr><th>id</th><th>customer</th><th>amount</th><th>status</th></tr></thead><tbody>${ROWS.map(r=>{
          const gone=at>=1&&r.st!=='shipped';
          return `<tr class="${gone?'gone':''}"><td>${r.id}</td><td>${r.cust}</td><td class="n">${r.amt}</td><td>${r.st}</td></tr>`;}).join('')}</tbody></table>`
      : `<table class="dt"><thead><tr><th>customer</th><th>${at>=4?'total':'SUM(amount)'}</th></tr></thead><tbody>${grouped.map(g=>
          `<tr><td>${g.cust}</td><td class="n">${g.total}</td></tr>`).join('')}</tbody></table>`;
    b.innerHTML=`<div class="stepper" style="margin-bottom:14px">${STEPS.map((s,i)=>
        `<button class="${i===at?'active':''}" data-s="${i}">${s.k}</button>`).join('')}</div>
      <div class="stage"><div style="min-width:420px">
        <div class="qline">${STEPS.slice(0,at+1).map(s=>`<span><b>${s.k}</b> ${esc(s.t)}</span>`).join('')}</div>
        ${table}
        <div class="qcount">${at<2?`${ROWS.filter(r=>at<1||r.st==='shipped').length} rows`:`${grouped.length} groups`}</div>
      </div></div>
      <div class="explain" style="margin-top:12px"><b>${STEPS[at].k}</b><br>${STEPS[at].say}</div>`;
    b.querySelectorAll('[data-s]').forEach(x=>x.addEventListener('click',()=>{ at=+x.dataset.s; draw(); }));
  };
  draw();
}});

LABS.push({id:'joins',ch:'sql-joins',title:'Which rows survive, and which multiply',lead:'Three customers, four orders, one of them orphaned. Change the join and watch what happens to the row count — then look at what fan-out does to a total.',render(b){
  const C=[{id:1,name:'Amal'},{id:2,name:'Karim'},{id:3,name:'Nour'}];
  const O=[{id:'A-1',cid:1,amt:120},{id:'A-2',cid:1,amt:60},{id:'K-1',cid:2,amt:90},{id:'X-9',cid:99,amt:75}];
  const KINDS={
    inner:{lbl:'INNER JOIN', say:'Only rows that matched on both sides. Nour has no orders and disappears; the orphaned order X-9 disappears too. Rows vanish silently — that is how records go missing from a report.'},
    left: {lbl:'LEFT JOIN',  say:'Every customer survives. Nour gets NULLs where the order columns would be. The orphaned order is still dropped, because it is on the right.'},
    right:{lbl:'RIGHT JOIN', say:'Every order survives, including the orphan X-9 whose customer does not exist. Almost nobody writes this deliberately — a LEFT JOIN with the tables swapped reads better.'},
    full: {lbl:'FULL OUTER', say:'Nothing is lost from either side. Useful for reconciling two sources: the NULLs on each side are exactly the rows that failed to match.'},
    trap: {lbl:'LEFT + WHERE',say:'A LEFT JOIN with a condition on the right table in WHERE. Nour’s NULL fails the comparison and she is discarded — so this returns exactly what an INNER JOIN returns. Put the condition in ON instead.'}};
  let k='inner';
  const rowsFor=()=>{
    const out=[];
    if(k==='right'||k==='full'){
      O.forEach(o=>{ const c=C.find(x=>x.id===o.cid); out.push({c:c||null,o}); });
      if(k==='full') C.forEach(c=>{ if(!O.some(o=>o.cid===c.id)) out.push({c,o:null}); });
      return out;
    }
    C.forEach(c=>{ const mine=O.filter(o=>o.cid===c.id);
      if(mine.length) mine.forEach(o=>out.push({c,o}));
      else if(k==='left') out.push({c,o:null}); });
    return out;
  };
  const draw=()=>{
    const rows=rowsFor();
    const total=rows.reduce((a,r)=>a+(r.o?r.o.amt:0),0);
    const dupes=rows.filter(r=>r.c&&rows.filter(x=>x.c&&x.c.id===r.c.id).length>1).length;
    b.innerHTML=`<div class="stepper" style="margin-bottom:14px">${Object.entries(KINDS).map(([id,v])=>
        `<button class="${id===k?'active':''}" data-k="${id}">${v.lbl}</button>`).join('')}</div>
      <div class="stage"><table class="dt" style="min-width:430px"><thead><tr><th>customer</th><th>order</th><th>amount</th></tr></thead><tbody>${rows.map(r=>
        `<tr><td class="${r.c?'':'nul'}">${r.c?r.c.name:'NULL'}</td><td class="${r.o?'':'nul'}">${r.o?r.o.id:'NULL'}</td><td class="n ${r.o?'':'nul'}">${r.o?r.o.amt:'NULL'}</td></tr>`).join('')}</tbody></table></div>
      <div class="counter" style="margin-top:12px">
        <div><div class="big num">${rows.length}</div><div class="lbl">rows out (3 customers, 4 orders in)</div></div>
        <div><div class="big num">${total}</div><div class="lbl">SUM(amount)</div></div>
        <div><div class="big num">${dupes}</div><div class="lbl">rows where a customer repeats</div></div>
      </div>
      <div class="explain" style="margin-top:12px"><b>${KINDS[k].lbl}</b><br>${KINDS[k].say}
        ${dupes?'<div class="muted" style="margin-top:6px"><b style="color:var(--gold)">Fan-out:</b> Amal has two orders, so her row is repeated. Any customer-level column — a credit limit, a region, an annual fee — would now be counted twice by a SUM.</div>':''}</div>`;
    b.querySelectorAll('[data-k]').forEach(x=>x.addEventListener('click',()=>{ k=x.dataset.k; draw(); }));
  };
  draw();
}});

LABS.push({id:'windows',ch:'sql-windows',title:'The frame nobody writes, and the bug it hides',lead:'A running total over four days, two of which fall on the same date. Switch the frame between ROWS and RANGE — the default — and watch the tied rows disagree.',render(b){
  const R=[{d:'2026-01-01',amt:100},{d:'2026-01-02',amt:80},{d:'2026-01-02',amt:40},{d:'2026-01-03',amt:60}];
  let frame='RANGE', rank='ROW_NUMBER';
  const running=()=>R.map((r,i)=>{
    if(frame==='ROWS') return R.slice(0,i+1).reduce((a,x)=>a+x.amt,0);
    return R.filter(x=>x.d<=r.d).reduce((a,x)=>a+x.amt,0);   // RANGE: peers share a value
  });
  const ranks=()=>{ const sorted=[...R].map((r,i)=>({...r,i})).sort((a,c)=>c.amt-a.amt);
    const out=Array(R.length); let prev=null, rk=0, dense=0;
    sorted.forEach((r,n)=>{ if(r.amt!==prev){ rk=n+1; dense+=1; prev=r.amt; }
      out[r.i]= rank==='ROW_NUMBER'?n+1 : rank==='RANK'?rk : dense; });
    return out; };
  const draw=()=>{
    const run=running(), rk=ranks();
    const tie=frame==='RANGE';
    b.innerHTML=`<div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">
        <div><div class="eyebrow" style="margin-bottom:5px">Frame</div><div class="stepper">${['ROWS','RANGE'].map(f=>
          `<button class="${f===frame?'active':''}" data-f="${f}">${f}${f==='RANGE'?' (default)':''}</button>`).join('')}</div></div>
        <div><div class="eyebrow" style="margin-bottom:5px">Ranking</div><div class="stepper">${['ROW_NUMBER','RANK','DENSE_RANK'].map(f=>
          `<button class="${f===rank?'active':''}" data-r="${f}">${f}</button>`).join('')}</div></div></div>
      <div class="stage"><table class="dt" style="min-width:470px"><thead><tr><th>order_date</th><th>amount</th><th>running total</th><th>${rank}() by amount</th></tr></thead><tbody>${R.map((r,i)=>
        `<tr class="${tie&&r.d==='2026-01-02'?'tie':''}"><td>${r.d}</td><td class="n">${r.amt}</td><td class="n"><b>${run[i]}</b></td><td class="n">${rk[i]}</td></tr>`).join('')}</tbody></table></div>
      <div class="explain" style="margin-top:12px">${frame==='RANGE'
        ? '<b>RANGE — what you get if you write no frame at all</b><br>RANGE treats every row sharing the ordering value as one unit, so both rows dated 2 January show 220: the total including <em>both</em> of them. Nothing is wrong with the SQL, and on data with no ties this is identical to ROWS — which is exactly why the bug survives testing and turns up in production.'
        : '<b>ROWS — one row at a time</b><br>The total steps 100, 180, 220, 280 as you would expect. If you mean row-by-row, write <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> and say so.'}
        <div class="muted" style="margin-top:8px">${rank==='ROW_NUMBER'?'ROW_NUMBER never ties — the two 80/40 rows get distinct numbers, and with no tiebreaker in ORDER BY, which one comes first is not stable between runs.':rank==='RANK'?'RANK ties and then skips: 1, 2, 2, 4.':'DENSE_RANK ties and does not skip: 1, 2, 2, 3.'}</div></div>`;
    b.querySelectorAll('[data-f]').forEach(x=>x.addEventListener('click',()=>{ frame=x.dataset.f; draw(); }));
    b.querySelectorAll('[data-r]').forEach(x=>x.addEventListener('click',()=>{ rank=x.dataset.r; draw(); }));
  };
  draw();
}});

LABS.push({id:'dax-context',ch:'dax',title:'The same measure, a different answer every time',lead:'One measure, six rows of sales. Move the slicers and watch what the filter context does to it — then see why CALCULATE ignores the slicer you just set.',render(b){
  const S=[{cat:'Books',reg:'Cairo',amt:120},{cat:'Books',reg:'Alexandria',amt:80},
           {cat:'Toys',reg:'Cairo',amt:200},{cat:'Toys',reg:'Alexandria',amt:60},
           {cat:'Toys',reg:'Cairo',amt:40},{cat:'Books',reg:'Cairo',amt:30}];
  let cat='All', reg='All';
  const draw=()=>{
    const inCtx=S.filter(r=>(cat==='All'||r.cat===cat)&&(reg==='All'||r.reg===reg));
    const total=inCtx.reduce((a,r)=>a+r.amt,0);
    const cairo=S.filter(r=>(cat==='All'||r.cat===cat)&&r.reg==='Cairo').reduce((a,r)=>a+r.amt,0);
    const keep=inCtx.filter(r=>r.reg==='Cairo').reduce((a,r)=>a+r.amt,0);
    b.innerHTML=`<div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">
        <div><div class="eyebrow" style="margin-bottom:5px">Category slicer</div><div class="stepper">${['All','Books','Toys'].map(v=>
          `<button class="${v===cat?'active':''}" data-c="${v}">${v}</button>`).join('')}</div></div>
        <div><div class="eyebrow" style="margin-bottom:5px">Region slicer</div><div class="stepper">${['All','Cairo','Alexandria'].map(v=>
          `<button class="${v===reg?'active':''}" data-g="${v}">${v}</button>`).join('')}</div></div></div>
      <div class="stage"><table class="dt" style="min-width:380px"><thead><tr><th>category</th><th>region</th><th>amount</th></tr></thead><tbody>${S.map(r=>{
        const on=(cat==='All'||r.cat===cat)&&(reg==='All'||r.reg===reg);
        return `<tr class="${on?'':'gone'}"><td>${r.cat}</td><td>${r.reg}</td><td class="n">${r.amt}</td></tr>`;}).join('')}</tbody></table></div>
      <div class="out" style="margin-top:14px">
        <div class="kv"><span><code>Total Sales = SUM(Sales[Amount])</code></span><b>${total}</b></div>
        <div class="kv"><span><code>Sales Cairo = CALCULATE([Total Sales], Region = "Cairo")</code></span><b>${cairo}</b></div>
        <div class="kv total"><span><code>… with KEEPFILTERS</code></span><b>${keep}</b></div>
      </div>
      <div class="explain" style="margin-top:12px"><b>${inCtx.length} of ${S.length} rows are in the filter context</b><br>
        The measure is one expression. It is evaluated again under whatever filters apply, which is why the same measure returns a different number in every cell of a matrix — and why a total row is a different context rather than the sum of the rows above it.
        ${reg==='Alexandria'?'<div class="muted" style="margin-top:8px"><b style="color:var(--gold)">Look at the second line.</b> The region slicer says Alexandria, and <code>Sales Cairo</code> still returns Cairo. CALCULATE’s filter arguments <em>replace</em> existing filters on the same column rather than adding to them. <code>KEEPFILTERS</code> on the third line intersects instead, which is why it returns 0.</div>':'<div class="muted" style="margin-top:8px">Set the region slicer to Alexandria and compare the second and third lines — that is the difference between replacing a filter and intersecting with it.</div>'}</div>`;
    b.querySelectorAll('[data-c]').forEach(x=>x.addEventListener('click',()=>{ cat=x.dataset.c; draw(); }));
    b.querySelectorAll('[data-g]').forEach(x=>x.addEventListener('click',()=>{ reg=x.dataset.g; draw(); }));
  };
  draw();
}});
