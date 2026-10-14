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
LABS.push({id:'insurance',ch:'egypt-payroll',title:'Egypt social insurance calculator',lead:'Contributions apply to the capped insurable wage, not to gross. Drag the salary and watch the cap bite. 2026 figures, from the Mercans statutory alert on the Egyptian insurable-wage limits — they rise 15% every January through 2027.',render(b){
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
LABS.push({id:'tax',ch:'egypt-payroll',title:'Egypt salary tax & bracket elimination',lead:'Tax is annual, progressive, exemption-adjusted — the monthly figure is a slice. Turn on bracket elimination to see why a naive calculator understates tax for senior staff. Figures from the Deloitte summary of Law 7/2024; verify before quoting.',render(b){
  const BR=[[40000,0],[55000,.10],[70000,.15],[200000,.20],[400000,.225],[1200000,.25],[Infinity,.275]];
  const ELIM=[[600000,1],[700000,2],[800000,3],[900000,4],[1200000,5]]; // net income above X → first N brackets eliminated
  b.innerHTML=`<div class="calc"><div class="in card" style="padding:16px"><label>Monthly gross salary (EGP)</label><input type="number" id="txN" value="30000" step="1000" min="0"><input type="range" id="txR" min="5000" max="150000" step="1000" value="30000"><label class="toggle"><input type="checkbox" id="txE" checked> Apply bracket elimination for high earners</label><div class="small muted">Personal exemption EGP 20,000/yr · employee social insurance deducted before tax</div></div><div class="out card" style="padding:16px" id="txOut"></div></div><div class="callout"><b>Interpolated thresholds.</b> Deloitte's summary of Law 7/2024 states the 600k and 700k steps explicitly and says the pattern continues to 1.2M; the 800k/900k steps here follow that pattern. Treat the exact ladder as something to confirm against the Egyptian Tax Authority.</div>`;
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
  const rungs=[[15,'1st year of service'],[21,'from 2nd year'],[30,'10+ years or aged over 50'],[45,'persons with disabilities'],['+7','hazardous / arduous / remote work']];
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
  <div class="eyebrow" style="margin:18px 0 8px">Three exit routes — different downstream calculations</div><div class="objs"><button class="node" data-t="resignation">Resignation<small>employee-initiated · withdrawable within 10 days of acceptance (Law 14/2025) · leave paid out, no severance</small></button><button class="node" data-t="termination">Termination<small>employer-initiated · with/without cause · burden of proof on employer</small></button><button class="node" data-t="end-of-contract">End of contract<small>fixed term lapses · renewal or continuing = indefinite</small></button></div></div>
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
  /* Two rows share a date, which is what the frame demo turns on, and two share
     an amount, which is what the ranking functions need in order to differ. */
  const R=[{d:'2026-01-01',amt:100},{d:'2026-01-02',amt:80},{d:'2026-01-02',amt:40},{d:'2026-01-03',amt:80}];
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
        : '<b>ROWS — one row at a time</b><br>The total steps 100, 180, 220, 300 as you would expect. If you mean row-by-row, write <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> and say so.'}
        <div class="muted" style="margin-top:8px">${rank==='ROW_NUMBER'?'ROW_NUMBER never ties — the two rows of 80 get 2 and 3, and which of them gets 2 is not stable between runs unless the ORDER BY carries a tiebreaker.':rank==='RANK'?'RANK ties and then skips — both 80s are 2, and the 40 below them is 4. Nothing is ever numbered 3.':'DENSE_RANK ties and does not skip — both 80s are 2 and the 40 is 3.'}</div></div>`;
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

/* Lab 20: the Ulrich model — the three groups, and the shape actually found */
LABS.push({id:'ulrich',ch:'hrfunction',title:'The three groups, and what each one is for',lead:'Requirements arrive from one group, get approved by another, and are run every month by a third. Click a group to see how it talks to a consultant — then compare the textbook chart with the shapes common in Egypt and the Gulf.',render(b){
  const P=[
    {n:'HR business partner',abbr:'HRBP',ar:'شريك أعمال الموارد البشرية',s:'the division’s HR advisor',
     what:'Sits with one business division — sales, operations, engineering — as its main HR contact, and thinks in business problems: attrition, performance, headcount plans. Requirements arrive framed as problems rather than as system specifications, and turning them into configuration is the consultant’s job.',
     say:'الـ HRBP قاعد مع الإدارة نفسها. مش هيقول عايز approval workflow بمستويين، هيقول المديرين زهقانين والتعيين بياخد شهرين — والترجمة لـ configuration شغل الاستشاري.',
     role:'Brings the problem, and has a strong opinion about it. Rarely holds the final sign-off on policy.',
     miss:'Building exactly what the HRBP asked for without checking with the CoE that owns it. They can ask; they usually cannot approve.',
     quote:'“Managers complain it takes two months to hire anyone.”'},
    {n:'Center of excellence',abbr:'CoE',ar:'مركز التميّز',s:'specialists who own the policy',
     what:'Specialist teams that own policy in one domain and sign off design in it: compensation and benefits, talent acquisition, learning and development, organization development. A grade structure is designed by the consultant and approved by C&amp;B — that approval is a gate, not a courtesy.',
     say:'الـ CoE هم أصحاب السياسة. أي حاجة ليها علاقة بالأجور والدرجات لازم تتعتمد من الـ C&amp;B قبل ما تتبني، وإلا هترجع تفكّها في الـ UAT.',
     role:'Owns the decision in its domain and signs off the design. The approval gate.',
     miss:'Building something the CoE has not signed off because an HRBP said it was fine. It gets reversed later, and the reversal is expensive.',
     quote:'“Grade G7’s pay range is 18–26k. Car allowance starts at G8. Approved.”',
     sub:[['Compensation &amp; benefits','التعويضات والمزايا'],['Talent acquisition','استقطاب المواهب'],['Learning &amp; development','التعلم والتطوير'],['Organization development','التطوير التنظيمي']]},
    {n:'Shared services / HR operations',abbr:'SSC',ar:'شؤون العاملين',s:'runs it every month',
     what:'The central team doing the transactional work for the whole organization: payroll processing, data entry, first-line employee queries. In Egypt this is the classic Personnel and Payroll team, and its daily work is exactly what the configuration automates.',
     say:'شؤون العاملين هما اللي بيطلّعوا استمارة ١ و٦ للتأمينات، وبيمسكوا الحضور والانصراف والجزاءات. شغلهم اليومي هو اللي السيستم هيعمله أوتوماتيك.',
     role:'Runs the process every month, and knows every exception and workaround in it. The best source of real requirements.',
     miss:'Treating them as data-entry staff. They answer exactly what they are asked and nothing more, and the gaps then surface in the parallel run.',
     quote:'“Commission is not in the insurable wage. The insurance office rejected it once in 2022.”'}];
  const ORG={
    textbook:{t:'Textbook Ulrich',note:'Clear owners, and mostly a routing exercise: each question goes to the group that owns it. Common in multinationals and the larger Gulf groups.',
      cols:[['HR business partners','شركاء الأعمال',['One per division','Brings business problems','No policy sign-off']],
            ['Centers of excellence','مراكز التميّز',['C&amp;B · pay and grades','Talent acquisition','Learning · OD']],
            ['Shared services','الخدمات المشتركة',['Payroll processing','HR data and admin','Employee helpdesk']]]},
    egypt:{t:'Common in an Egyptian company',note:'The roles are merged rather than absent. One HR manager plays HRBP and CoE at once, and payroll may sit under Finance. The org chart will not say who signs off — that has to be asked, name by name, in the first week.',
      cols:[['The HR manager’s own desk','مدير الموارد البشرية',['Talks to business heads','Approves pay and grades','A recruiter or two']],
            ['Personnel &amp; payroll','شؤون العاملين',['Insurance forms 1 and 6','Labour office file','Attendance · leave · penalties','Payroll, usually in Excel']],
            ['Finance','الإدارة المالية',['Sometimes owns payroll','Owns costing and the GL','Signs off the salary budget']]]},
    gulf:{t:'Common in a Saudi group',note:'The same three groups, with a fourth force: the government platforms. Whoever files on Qiwa, Mudad and Muqeem is a stakeholder in the design whether or not they appear on the HR org chart.',
      cols:[['HR business partners','شركاء الأعمال',['Per business line','Often also recruiters','Nationalization targets']],
            ['Personnel','شؤون الموظفين',['GOSI registration and wages','Qiwa · contracts, Nitaqat','Mudad · wage protection','Muqeem · iqama records']],
            ['Payroll &amp; finance','الرواتب والمالية',['Monthly payroll run','End-of-service settlements','Bank file and reconciliation']]]}};
  let cur=0,shape='textbook';
  const draw=()=>{const p=P[cur],o=ORG[shape];
    b.innerHTML=`<div class="plans">${P.map((x,i)=>`<button class="plan ${i===cur?'active':''}" data-p="${i}"><b>${x.n}</b><span class="ar" style="display:block;color:var(--p);font-size:14px">${x.ar}</span><small>${x.abbr} · ${x.s}</small></button>`).join('')}</div>
    <div class="two">
      <div>
        <div class="explain"><b>${p.n}</b> <span class="ar">${p.ar}</span><div style="margin-top:6px">${p.what}</div><div class="muted" style="margin-top:8px;font-style:italic">${p.quote}</div></div>
        ${p.sub?`<div class="bi">${p.sub.map(([e,a])=>`<span>${e}<span class="ar">${a}</span></span>`).join('')}</div>`:''}
      </div>
      <div>
        <div class="say"><span class="lbl">How it sounds on the floor</span><div class="ar-line">${p.say}</div></div>
        <div class="explain"><b>What they are to the project</b><div style="margin-top:4px">${p.role}</div></div>
        <div class="msg bad"><b>Common consultant mistake</b><span>${p.miss}</span></div>
      </div>
    </div>
    <div class="stepper">${Object.keys(ORG).map(k=>`<button class="${k===shape?'active':''}" data-o="${k}">${ORG[k].t}</button>`).join('')}</div>
    <div class="stage"><div class="ocols">${o.cols.map(([h,a,items])=>`<div class="ocol"><div class="oh">${h}<span class="ar">${a}</span></div>${items.map(i=>`<div class="oi">${i}</div>`).join('')}</div>`).join('')}</div></div>
    <div class="explain"><b>${o.t}.</b> ${o.note}</div>`;
    b.querySelectorAll('[data-p]').forEach(x=>x.addEventListener('click',()=>{cur=+x.dataset.p;draw();}));
    b.querySelectorAll('[data-o]').forEach(x=>x.addEventListener('click',()=>{shape=x.dataset.o;draw();}));};
  draw();
}});

/* Lab 21: who decides vs who knows — the routing drill */
LABS.push({id:'who-decides',ch:'hrfunction',title:'Who decides, and who knows',lead:'Real workshop moments. Some of these ask who owns the decision; others ask who holds the answer. They are usually different groups, and sending the question to the wrong one is how a design gets reversed late.',render(b){
  const OPTS=[['hrbp','HRBP'],['cb','C&amp;B'],['ta','Talent acquisition'],['ld','L&amp;D'],['od','Org development'],['ss','Shared services']];
  const Q=[
    {t:'decides',q:'Should grade G7 get a car allowance?',a:'cb',why:'Allowances by grade are pay policy, and pay policy belongs to compensation and benefits. An HRBP may push hard for it; that is still a request, not an approval.',ar:'البدلات حسب الدرجة = سياسة أجور = الـ C&amp;B.'},
    {t:'knows',q:'How is the insurable wage actually calculated today, with every exception?',a:'ss',why:'The law sets the rule, but only the people who file every month know how it is applied in practice, including what the insurance office has pushed back on before.',ar:'القانون بيحدد، بس اللي عارف التطبيق الفعلي هما شؤون العاملين.'},
    {t:'decides',q:'How many approval levels should a job requisition need?',a:'ta',why:'Hiring process policy belongs to talent acquisition. Managers will complain about the number of levels either way; TA still owns it.',ar:'سياسة التعيين عند الـ TA.'},
    {t:'knows',q:'Why is attrition so high in the engineering division?',a:'hrbp',why:'The HRBP sits inside that division and knows its context — the managers, the exit conversations, the local problems that never reach a report.',ar:'الـ HRBP قاعد مع الإدارة وعارف مشاكلها.'},
    {t:'decides',q:'Approve the pay ranges for the new grade structure.',a:'cb',why:'Grades and ranges are the core of C&amp;B’s remit. No configuration should start before that approval exists in writing.',ar:'سلم الدرجات ونطاقات الأجور = اعتماد الـ C&amp;B.'},
    {t:'decides',q:'Should sales be restructured into three regions or four?',a:'od',why:'Structure and job design sit with organization development, working with business leadership. The resulting hierarchy is what gets configured.',ar:'الهيكل التنظيمي عند الـ OD.'},
    {t:'knows',q:'What is the real payroll cut-off, and what happens to changes that arrive late?',a:'ss',why:'Payroll operations run the cycle. The written cut-off and the real one are often different dates, and they know both.',ar:'تاريخ الإقفال الحقيقي — مش المكتوب — عند شؤون العاملين.'},
    {t:'decides',q:'Mandatory safety training has to be assigned to every new warehouse hire. Who owns that rule?',a:'ld',why:'Mandatory learning and training policy belong to learning and development.',ar:'التدريب الإلزامي عند الـ L&amp;D.'},
    {t:'knows',q:'Who will key in 200 new hires a month once the system is live, and what slows them down?',a:'ss',why:'They are the future users of that screen. A flow designed without them is a flow that gets worked around.',ar:'هما اللي هيستخدموا الشاشة كل يوم، فالتصميم يتعمل معاهم.'},
    {t:'decides',q:'An HRBP wants a flat retention bonus for sales. Can it just be built?',a:'cb',why:'No. It is a pay element, so C&amp;B has to approve it first. The request is input to the design, not sign-off on it.',ar:'طلب الـ HRBP مدخل مش اعتماد.'}];
  let i=0,score=0,picked=null;
  const draw=()=>{
    if(i>=Q.length){
      b.innerHTML=`<div class="counter"><div><div class="big">${score} / ${Q.length}</div><div class="lbl">routed correctly</div></div></div>
      <div class="explain">${score>=8?'<b>Solid.</b> That is the level of routing a workshop needs: pay questions to C&amp;B, hiring process to talent acquisition, and “how does it really work today” to the people who run it.':'<b>Worth another pass.</b> The pattern underneath: anything about money or grades is C&amp;B, anything about the hiring process is talent acquisition, and anything beginning “how does it actually work today” belongs to shared services.'}</div>
      <div class="stepper"><button class="active" data-again="1">Start again</button></div>`;
      b.querySelector('[data-again]').addEventListener('click',()=>{i=0;score=0;picked=null;draw();});
      return;}
    const q=Q[i];
    b.innerHTML=`<div class="kv"><span class="small muted">Question ${i+1} of ${Q.length}</span><b>${score} correct</b></div>
    <div class="explain"><span class="pill p">${q.t==='decides'?'Who decides?':'Who knows?'}</span><div style="margin-top:8px;font-size:16px">${q.q}</div></div>
    <div class="opts">${OPTS.map(([v,l])=>`<button class="opt ${picked?(v===q.a?'right':(v===picked?'wrong':'')):''}" data-v="${v}" ${picked?'disabled':''}>${l}</button>`).join('')}</div>
    ${picked?`<div class="msg ${picked===q.a?'ok':'bad'}" role="status"><b>${picked===q.a?'Right.':'Not this one — it is '+OPTS.find(o=>o[0]===q.a)[1]+'.'}</b><span>${q.why}</span><div class="ar-line">${q.ar}</div></div>
    <div class="stepper"><button class="active" data-next="1">${i===Q.length-1?'See the score':'Next question'}</button></div>`:''}`;
    b.querySelectorAll('[data-v]').forEach(x=>x.addEventListener('click',()=>{if(picked)return;picked=x.dataset.v;if(picked===q.a)score++;draw();}));
    const n=b.querySelector('[data-next]'); if(n) n.addEventListener('click',()=>{i++;picked=null;draw();});};
  draw();
}});

/* Lab 22: break a link in the chain and watch one payslip react */
LABS.push({id:'payslip',ch:'payroll',title:'Break a link, read the payslip',lead:'Mona is a finance analyst in Cairo: EGP 240,000 a year, an EGP 800 transport allowance, an EGP 1,500 loan instalment, net pay split 80/20 across two accounts. Turn a link off and watch which one goes red — and, more usefully, which failures produce no error at all.',render(b){
  const CHAIN=[['element','Element'],['elig','Eligibility'],['entry','Entry'],['run','Payroll run'],['bal','Balance'],['pre','Prepayments'],['pay','Payment'],['cost','Costing']];
  const DEF={assigned:true,elig:true,entry:true,basis:'annual',loan:'vol',prepay:true,cost:true};
  const SW=[
    ['assigned','cb','Assigned to a payroll','معيّنة على دورة رواتب'],
    ['elig','cb','Transport eligibility covers her grade','أهلية بدل الانتقال تشملها'],
    ['entry','cb','Transport entry created (EGP 800)','البدل متضاف ليها'],
    ['basis','sel','Salary basis','أساس الراتب',[['annual','Annual — as loaded'],['monthly','Monthly, annual figure loaded']]],
    ['loan','sel','Loan instalment classified as','تصنيف قسط السلفة',[['vol','Voluntary deduction'],['earn','Earnings — wrong']]],
    ['prepay','cb','Prepayments has run','الـ prepayments اتشغّل'],
    ['cost','cb','Costing configured','توزيع التكاليف متظبّط']];
  let s={...DEF};
  const egp=n=>'EGP '+Math.round(n).toLocaleString('en-US');
  const draw=()=>{
    const st={element:'ok'},msg=[];
    const transport=s.elig&&s.entry;
    st.elig=s.elig?'ok':'bad';
    st.entry=transport?'ok':(s.entry?'bad':'warn');
    if(!s.elig) msg.push(['bad','Eligibility does not cover her, so the entry cannot be created at all. This is the “why can’t I add this allowance to this person?” ticket, and it is answered at the eligibility, not on the person.','الأهلية مش شاملاها، فمش هينفع تضيف البدل أصلًا.']);
    else if(!s.entry) msg.push(['warn','She is eligible and nobody created the entry, so no allowance is paid. Eligible means could, not does.','مستحقة بس مفيش entry، فالبدل مش نازل.']);
    const basic=s.basis==='annual'?20000:240000;
    if(s.basis!=='annual') msg.push(['bad','The salary basis says monthly, but the annual figure was loaded against it, so she is paid twelve times her salary. Nothing errors — the run simply calculates what it was given.','أساس الراتب شهري والرقم المحمّل سنوي، فالمرتب طلع ×12 من غير أي error.']);
    if(s.loan==='earn') msg.push(['bad','The loan instalment is classified as earnings, so EGP 1,500 is added to gross instead of deducted from it. When a result looks calculated in the wrong direction, classification is the first thing to read.','القسط متصنّف استحقاق، فبيتضاف بدل ما يتخصم.']);
    let rows=[],gross=0,net=0;
    if(!s.assigned){
      Object.assign(st,{run:'bad',bal:'off',pre:'off',pay:'off',cost:'off'});
      msg.unshift(['bad','She is not assigned to a payroll, so the run skips her silently. There is no error, no result and no payslip — she simply is not paid. This is the failure most worth recognising, because nothing reports it.','مش متعيّنة على payroll، فالـ run عدّاها من غير error — ومش هتقبض.']);
    } else {
      st.run='ok';
      const si=basic*0.11,loan=1500;
      rows.push(['Basic salary','الراتب الأساسي',basic,'']);
      rows.push(['Transport allowance','بدل انتقال',transport?800:0,transport?'':'gone']);
      if(s.loan==='earn') rows.push(['Loan instalment — added, not deducted','قسط السلفة',loan,'wrong']);
      gross=basic+(transport?800:0)+(s.loan==='earn'?loan:0);
      rows.push(['Gross pay','الإجمالي',gross,'sum']);
      rows.push(['Social insurance — illustrative 11%','التأمينات',-si,'']);
      if(s.loan!=='earn') rows.push(['Loan instalment','قسط السلفة',-loan,'']);
      net=gross-si-(s.loan==='earn'?0:loan);
      rows.push(['Net pay','الصافي',net,'net']);
      st.bal=(s.basis!=='annual'||s.loan==='earn')?'warn':'ok';
      st.pre=s.prepay?'ok':'bad'; st.pay=s.prepay?'ok':'off';
      if(!s.prepay) msg.push(['bad','The run finished and prepayments did not, so nothing was distributed to her payment methods: no bank file, no payment. Every figure above is correct and she still is not paid.','الحسبة سليمة بس الـ prepayments ماتشغلش، فمفيش ملف بنك.']);
      st.cost=s.cost?'ok':'warn';
      if(!s.cost) msg.push(['warn','She is paid, but the cost lands in a default or suspense account instead of her cost centre. Payroll looks fine; Finance finds it at month-end close.','اتصرفلها، بس التكلفة راحت على حساب معلّق.']);
    }
    if(!msg.length) msg.push(['ok','Every link is intact: calculated correctly, distributed correctly, costed correctly.','السلسلة كلها شغالة.']);
    const paid=s.assigned&&s.prepay;
    b.innerHTML=`<div class="stage"><div class="pipe">${CHAIN.map(([k,n])=>`<button class="node ${st[k]||''}" tabindex="-1">${n}<small>${st[k]==='bad'?'broken':st[k]==='warn'?'at risk':st[k]==='off'?'never ran':'ok'}</small></button>`).join('')}</div></div>
    <div class="sim">
      <div class="switches">${SW.map(([k,t,en,ar,opts])=>`<label class="sw"><span>${en}<span class="ar">${ar}</span></span>${t==='cb'?`<input type="checkbox" data-k="${k}" ${s[k]?'checked':''}>`:`<select data-k="${k}">${opts.map(([v,l])=>`<option value="${v}" ${s[k]===v?'selected':''}>${l}</option>`).join('')}</select>`}</label>`).join('')}
        <button class="node" data-reset="1">Put every link back</button></div>
      <div style="display:grid;gap:12px;min-width:0">
        <div class="slip"><div class="hd"><span>Payslip · Mona · March</span><span class="ar">قسيمة راتب · مارس</span></div>
          ${s.assigned?`<table class="dt">${rows.map(([e,a,v,c])=>`<tr class="${c}"><td>${e} <span class="ar" style="color:var(--muted);font-weight:400">${a}</span></td><td class="n">${c==='gone'?'—':egp(v)}</td></tr>`).join('')}</table>`
            :`<table class="dt"><tr class="gone"><td>Not picked up by the run</td><td class="n">—</td></tr></table>`}</div>
        <div class="accts">${[['Account 1 · 80%',.8],['Account 2 · 20%',.2]].map(([l,p])=>`<div class="acct">${l}<b>${paid?egp(net*p):'—'}</b>${paid?'in the bank file':'not paid'}</div>`).join('')}</div>
        <div style="display:grid;gap:8px">${msg.map(([c,e,a])=>`<div class="msg ${c}"><span>${e}</span><div class="ar-line">${a}</div></div>`).join('')}</div>
      </div>
    </div>
    <div class="callout"><b>On the 11%.</b> The real Egyptian calculation applies the employee share to the capped insurable wage, not to basic pay — Chapter 9 and its calculator do it properly. It is flattened here so the chain, not the arithmetic, is what moves.</div>`;
    b.querySelectorAll('[data-k]').forEach(x=>x.addEventListener('change',()=>{s[x.dataset.k]=x.type==='checkbox'?x.checked:x.value;draw();}));
    b.querySelector('[data-reset]').addEventListener('click',()=>{s={...DEF};draw();});};
  draw();
}});

/* Lab 23: balance dimensions */
LABS.push({id:'balances',ch:'payroll',title:'One result, several running totals',lead:'A balance is the same element results added up over a dimension. Drag the month: the bars are what was paid, and the three figures are the same year read three different ways. Mona receives a EGP 5,000 bonus in June.',render(b){
  const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const G=M.map((_,i)=>20800+(i===5?5000:0));
  let m=7;
  const egp=n=>'EGP '+n.toLocaleString('en-US');
  const paint=()=>{
    /* Two panels, because the two series are two orders of magnitude apart:
       what a month paid, and what the year has accumulated. One shared scale
       would flatten the bars into a line along the axis. */
    const W=560,H=250,L=46,R=548,bT=18,bB=118,bMax=26000,lT=156,lB=214,lMax=260000;
    const x=i=>L+(R-L)*(i+.5)/12,bw=(R-L)/12*.55;
    const y=v=>bB-(bB-bT)*v/bMax,ly=v=>lB-(lB-lT)*v/lMax;
    const q0=Math.floor((m-1)/3)*3;
    let sv='',cum=0,pts=[];
    sv+=`<text x="${L}" y="12" font-size="10.5" font-weight="700" fill="var(--muted)">WHAT EACH MONTH PAID</text>`;
    [0,26000].forEach(v=>{sv+=`<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line-2)"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end" font-size="10" fill="var(--muted)" font-family="var(--mono)">${v?v/1000+'k':'0'}</text>`;});
    G.forEach((g,i)=>{cum+=g;pts.push([x(i),ly(cum)]);
      const fill=i===m-1?'var(--p)':(i>=q0&&i<m)?'var(--p-soft)':i<m?'var(--line-2)':'var(--surface-2)';
      sv+=`<rect x="${x(i)-bw/2}" y="${y(g)}" width="${bw}" height="${bB-y(g)}" rx="2" fill="${fill}" stroke="${i<m?'var(--p)':'var(--line-2)'}" stroke-width="${i<m?1:0}"/>`;
      sv+=`<text x="${x(i)}" y="${bB+15}" text-anchor="middle" font-size="10" fill="${i===m-1?'var(--ink)':'var(--muted)'}">${M[i]}</text>`;});
    sv+=`<text x="${L}" y="150" font-size="10.5" font-weight="700" fill="var(--muted)">ADDED UP SINCE JANUARY</text>`;
    [0,260000].forEach(v=>{sv+=`<line x1="${L}" x2="${R}" y1="${ly(v)}" y2="${ly(v)}" stroke="var(--line-2)"/><text x="${L-6}" y="${ly(v)+4}" text-anchor="end" font-size="10" fill="var(--muted)" font-family="var(--mono)">${v?v/1000+'k':'0'}</text>`;});
    const shown=pts.slice(0,m),e=shown[shown.length-1];
    sv+=`<polyline points="${shown.map(p=>p.join(',')).join(' ')}" fill="none" stroke="var(--good)" stroke-width="2"/><circle cx="${e[0]}" cy="${e[1]}" r="4" fill="var(--good)"/>`;
    sv+=`<text x="${L}" y="${H-6}" font-size="10.5" fill="var(--muted)">two scales, because a month and a year are not the same size — the June bonus is the step in both</text>`;
    const ptd=G[m-1],qtd=G.slice(q0,m).reduce((a,c)=>a+c,0),ytd=G.slice(0,m).reduce((a,c)=>a+c,0);
    $('#balSvg').innerHTML=sv;
    $('#balLbl').textContent='Payroll period · '+M[m-1];
    $('#balQn').textContent='Q'+(q0/3+1);
    $('#balPtd').textContent=egp(ptd); $('#balQtd').textContent=egp(qtd); $('#balYtd').textContent=egp(ytd);
  };
  /* The shell is written once so the slider survives the drag. */
  b.innerHTML=`<div class="calc"><div class="in">
    <label for="balMon" id="balLbl"></label><input id="balMon" type="range" min="1" max="12" value="7">
    <div class="kv"><span>Period to date <span class="ar">الفترة</span></span><b id="balPtd" style="white-space:nowrap"></b></div>
    <div class="kv"><span>Quarter to date <span class="ar">الربع</span> · <span id="balQn"></span></span><b id="balQtd" style="white-space:nowrap"></b></div>
    <div class="kv total"><span>Year to date <span class="ar">من أول السنة</span></span><b id="balYtd" style="white-space:nowrap"></b></div>
  </div><div class="out"><div class="stage"><svg id="balSvg" viewBox="0 0 560 250" style="display:block;width:100%;min-width:480px;height:auto" role="img" aria-label="Monthly gross pay as bars, with the year-to-date total as a line beneath them"></svg></div>
  <div class="explain">Three dimensions over one set of results. The bonus enters every total that includes June and none of the others, which is why a statutory report that quotes the wrong dimension is wrong in a way that looks plausible. Balances stop at the payroll relationship: after a global transfer, or a rehire that creates a new one, these figures start again at zero. <span class="ar">الأرصدة مش بتعدّي من payroll relationship لواحدة تانية.</span></div></div></div>`;
  b.querySelector('#balMon').addEventListener('input',e2=>{ m=+e2.target.value; paint(); });
  paint();
}});

/* Lab 24: the parallel run — every difference needs a cause */
LABS.push({id:'parallel-run',ch:'payroll',title:'Reconciling a parallel run',lead:'Legacy and Oracle have both run March. Five lines differ. A parallel run is not signed off when the differences are listed — it is signed off when every one of them has a cause. Click a line to see what was found.',render(b){
  const R=[
    {p:'Mona',e:'Basic salary',l:20000,o:20000,why:'No difference. Most lines look like this, which is why the eye stops reading — the discipline is to reconcile the whole file, not the exceptions someone already noticed.',ok:true},
    {p:'Karim',e:'Social insurance',l:-2310,o:-2200,why:'Legacy applied last year’s insurable wage ceiling; Oracle applied the current one. Oracle is right, and the difference is evidence that legacy has been under-deducting since January — which the client needs to hear before go-live, not after.',ok:true},
    {p:'Yasmin',e:'Overtime',l:1450,o:0,why:'The overtime entries in batch 3 never loaded — the file failed validation and nobody read the log. Fix the load, rerun, reconcile again. A missing entry is the most common cause of a zero in this column.',ok:true},
    {p:'Omar',e:'Net pay',l:18200,o:18350,why:'Still unexplained. Until someone traces it element by element, this parallel run is not finished, no matter how small the number looks. Unexplained differences are the ones that become tickets in hypercare.',ok:false},
    {p:'Hala',e:'Housing allowance',l:3000,o:3000,why:'Equal, and equally wrong: both systems pay a flat EGP 3,000 where the policy says 25% of basic. A parallel run proves the new system matches the old one — it does not prove either matches the policy.',ok:false}];
  let open=null,seen=new Set();
  const draw=()=>{
    b.innerHTML=`<div class="stage"><table class="dt" style="min-width:560px">
      <tr><th>Person</th><th>Element</th><th class="n">Legacy</th><th class="n">Oracle</th><th class="n">Difference</th><th>Status</th></tr>
      ${R.map((r,i)=>{const d=r.o-r.l;return `<tr data-r="${i}" tabindex="0" role="button" aria-label="${esc(r.p)}, ${esc(r.e)} — show what was found" style="cursor:pointer" class="${open===i?'tie':''}"><td>${r.p}</td><td>${r.e}</td><td class="n">${r.l.toLocaleString()}</td><td class="n">${r.o.toLocaleString()}</td><td class="n" style="color:${d?'var(--bad)':'var(--muted)'}">${d?(d>0?'+':'')+d.toLocaleString():'0'}</td><td><span class="pill ${seen.has(i)?(r.ok?'ok':'no'):''}">${seen.has(i)?(r.ok?'explained':'open'):'not looked at'}</span></td></tr>`;}).join('')}
    </table></div>
    ${explainBox('prEx',open===null?'<span class="muted">Click any line — including the two that match.</span>':`<b>${R[open].p} · ${R[open].e}.</b> ${R[open].why}`)}
    <div class="kv total"><span>Lines with a cause</span><b>${R.filter((r,i)=>seen.has(i)&&r.ok).length} of ${R.length}</b></div>
    <div class="callout"><b>What sign-off means.</b> Two or three consecutive months, every line reconciled, every difference explained in writing, and the explanations reviewed by the people who will run the payroll afterwards.</div>`;
    b.querySelectorAll('[data-r]').forEach(x=>{ const h=()=>{open=+x.dataset.r;seen.add(open);draw();const f=b.querySelector(`[data-r="${open}"]`);if(f)f.focus();};
      x.addEventListener('click',h); x.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); h(); } }); });};
  draw();
}});

/* Lab 25: end-of-service, and the dates that decide it */
LABS.push({id:'gratuity',ch:'gulf',title:'End-of-service, and the dates that decide it',lead:'Two stints with a break between them, and one question: does the earlier service count? The policy answer is expressed through a seniority date. Move the sliders — the left figure is what the client’s policy owes, the right is what a fresh service clock at rehire would pay.',render(b){
  let st={s1:4,gap:12,s2:5,wage:10000,policy:'if',lim:24,exit:'term'};
  const sar=n=>Math.round(n).toLocaleString('en-US')+' SAR';
  const yr=y=>(Number.isInteger(y)?y:y.toFixed(1))+' yr';
  const months=y=>Math.min(y,5)*0.5+Math.max(y-5,0);
  const resign=y=>y<2?0:y<=5?1/3:y<10?2/3:1;
  const award=y=>{const base=months(y)*st.wage;const f=st.exit==='resign'?resign(y):1;return{amt:base*f,f,m:months(y)};};
  const calc=()=>{
    const bridged=st.policy==='always'||(st.policy==='if'&&st.gap<=st.lim);
    const counted=bridged?st.s1+st.s2:st.s2;
    const A=award(counted),B=award(st.s2),diff=A.amt-B.amt;
    const total=st.s1*12+st.gap+st.s2*12;
    const p1=st.s1*12/total*100,p2=(st.s1*12+st.gap)/total*100;
    const how=(y,a)=>`${yr(y)} → ${a.m.toFixed(2)} months${st.exit==='resign'?' × '+(a.f===0?'0':a.f===1?'1':a.f<.5?'⅓':'⅔'):''}`;
    return {bridged,counted,A,B,diff,p1,p2,how};
  };
  const LBL={s1:()=>'First stint · '+yr(st.s1),gap:()=>'Break between · '+st.gap+' months',s2:()=>'Second stint · '+yr(st.s2),wage:()=>'Final monthly wage · '+sar(st.wage),lim:()=>'Break limit · '+st.lim+' months'};
  /* The output column is its own function so one drag can repaint just it. */
  const outHTML=()=>{ const {bridged,counted,A,B,diff,p1,p2,how}=calc(); return `
        <div class="stage"><div class="tl"><div class="tl-row"><div class="tl-line">
          <div class="tl-seg${bridged?'':' old'}" style="left:0;width:${p1}%"></div>
          <div class="tl-seg" style="left:${p2}%;width:${100-p2}%"></div>
          ${p2-p1>9?`<div class="tl-lbl" style="left:${(p1+p2)/2}%;color:var(--muted);font-weight:400">${st.gap}-month break</div>`:''}
          <div class="tl-mark" style="left:0"><i></i>joins</div>
          <div class="tl-mark" style="left:${p1}%"><i></i>leaves</div>
          <div class="tl-mark${bridged?'':' warn'}" style="left:${p2}%"><i></i>rehired</div>
          <div class="tl-lbl" style="left:${p1/2}%">${bridged?'counted':'not counted'}</div>
          <div class="tl-lbl" style="left:${(100+p2)/2}%;color:var(--p)">counted</div>
        </div></div></div></div>
        <div class="vs">
          <div class="ok"><span class="lbl">What the policy owes</span><span class="amt">${sar(A.amt)}</span><span class="how">${how(counted,A)}</span></div>
          <div class="no"><span class="lbl">If the clock restarts at rehire</span><span class="amt">${sar(B.amt)}</span><span class="how">${how(st.s2,B)}</span></div>
        </div>
        <div class="msg ${bridged&&diff>0.5?'bad':'ok'}">${bridged?(diff>0.5?`<span><b>${sar(diff)} short.</b> The policy bridges the break, so a fresh service clock underpays her by ${(diff/(st.wage||1)).toFixed(1)} months’ wages — and nothing in payroll flags it, because both figures are arithmetically correct. The fix is a seniority date that means what the policy means, never a back-dated hire date.</span><div class="ar-line">التاريخ الجديد بيضيّع الخدمة القديمة، والفرق ده محدش هيلاحظه.</div>`:'<span>The policy bridges the break, but at these numbers both setups pay the same — the resignation scale can zero out short service. Lengthen the first stint to see them diverge.</span>'):`<span>Under this policy the earlier service does not count${st.policy==='if'?`, because the ${st.gap}-month break is longer than the ${st.lim}-month limit`:''}, so a fresh clock is the correct setup. Record the decision anyway: the next consultant will ask why.</span>`}</div>
        <div class="kv"><span>Enterprise hire date</span><b>unchanged — first day in the group</b></div>
        <div class="kv"><span>Legal employer start date</span><b>resets at the rehire</b></div>
        <div class="kv total"><span>Seniority date</span><b>${bridged?'moved back to cover the first stint':'same as the new start'}</b></div>
  `; };
  const draw=()=>{
    b.innerHTML=`<div class="calc">
      <div class="in">
        <label>First stint · ${yr(st.s1)}</label><input type="range" data-n="s1" min="0.5" max="15" step="0.5" value="${st.s1}">
        <label>Break between · ${st.gap} months</label><input type="range" data-n="gap" min="0" max="48" step="1" value="${st.gap}">
        <label>Second stint · ${yr(st.s2)}</label><input type="range" data-n="s2" min="0.5" max="15" step="0.5" value="${st.s2}">
        <label>Final monthly wage · ${sar(st.wage)}</label><input type="range" data-n="wage" min="3000" max="40000" step="500" value="${st.wage}">
        <label>Client policy on the earlier service</label>
        <select data-s="policy"><option value="fresh" ${st.policy==='fresh'?'selected':''}>Never counts</option><option value="if" ${st.policy==='if'?'selected':''}>Counts if the break is short enough</option><option value="always" ${st.policy==='always'?'selected':''}>Always counts</option></select>
        ${st.policy==='if'?`<label>Break limit · ${st.lim} months</label><input type="range" data-n="lim" min="0" max="36" step="1" value="${st.lim}">`:''}
        <label>How the second stint ends</label>
        <div class="stepper">${[['term','Terminated'],['resign','Resigns']].map(([v,l])=>`<button class="${st.exit===v?'active':''}" data-e="${v}">${l}</button>`).join('')}</div>
      </div>
      <div class="out">
${outHTML()}
      </div></div>
    <div class="callout"><b>A teaching model.</b> It follows the Saudi award — half a month’s wage for each of the first five years, one month for each year after, on the last wage — and the resignation scale of nothing under two years, a third from two to five, two thirds from five to ten, and the full award at ten. Check the current law and the client’s own contracts before quoting a real figure.</div>`;
    b.querySelectorAll('[data-n]').forEach(x=>x.addEventListener('input',()=>{ st[x.dataset.n]=+x.value;
      /* Repaint the label and the output column in place. Re-rendering the
         whole lab here would delete the slider the pointer is holding. */
      const lbl=x.previousElementSibling; if(lbl&&lbl.tagName==='LABEL'&&LBL[x.dataset.n]) lbl.textContent=LBL[x.dataset.n]();
      const out=b.querySelector('.out'); if(out) out.innerHTML=outHTML(); }));
    b.querySelectorAll('[data-s]').forEach(x=>x.addEventListener('change',()=>{st[x.dataset.s]=x.value;draw();}));
    b.querySelectorAll('[data-e]').forEach(x=>x.addEventListener('click',()=>{st.exit=x.dataset.e;draw();}));};
  draw();
}});

/* Lab 26: subject-area grain — where wrong OTBI numbers come from */
LABS.push({id:'grain-trap',ch:'reporting',title:'Why the headcount is too high',lead:'Seven assignment rows, three people. The subject area returns one row per assignment per dated version, so counting rows counts history and second jobs as extra humans. Add the two filters and watch the number come down to the truth.',render(b){
  const ROWS=[
    {p:'Mona Adel',d:'Finance',pr:'Y',f:'2024/01/01',t:'2025/06/30',hist:1,why:'History: the version before her July 2025 raise.'},
    {p:'Mona Adel',d:'Finance',pr:'Y',f:'2025/07/01',t:'4712/12/31',why:'Current row.'},
    {p:'Karim Samir',d:'Sales',pr:'Y',f:'2023/03/01',t:'4712/12/31',why:'Current row, primary assignment.'},
    {p:'Karim Samir',d:'Projects',pr:'N',f:'2025/01/01',t:'4712/12/31',sec:1,why:'A second, non-primary assignment — a real job, not a duplicate.'},
    {p:'Yasmin Fouad',d:'HR',pr:'Y',f:'2022/05/01',t:'2023/12/31',hist:1,why:'History: before a grade change.'},
    {p:'Yasmin Fouad',d:'HR',pr:'Y',f:'2024/01/01',t:'2025/02/28',hist:1,why:'History: before a manager change.'},
    {p:'Yasmin Fouad',d:'HR',pr:'Y',f:'2025/03/01',t:'4712/12/31',why:'Current row.'}];
  let asOf=false,prim=false;
  const draw=()=>{
    const keep=ROWS.map(r=>(!asOf||!r.hist)&&(!prim||r.pr==='Y'));
    const n=keep.filter(Boolean).length;
    const people=new Set(ROWS.filter((r,i)=>keep[i]).map(r=>r.p)).size;
    b.innerHTML=`<div class="switches" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));display:grid">
      <label class="sw"><span>Filter to today’s row<span class="ar">السطر السارى النهاردة</span></span><input type="checkbox" data-f="asOf" ${asOf?'checked':''}></label>
      <label class="sw"><span>Filter to the primary assignment<span class="ar">التعيين الأساسي بس</span></span><input type="checkbox" data-f="prim" ${prim?'checked':''}></label></div>
    <div class="stage"><table class="dt" style="min-width:600px">
      <tr><th>Person</th><th>Department</th><th>Primary</th><th>Effective from</th><th>Effective to</th></tr>
      ${ROWS.map((r,i)=>`<tr class="${keep[i]?'':'gone'}" data-r="${i}" tabindex="0" role="button" aria-label="${esc(r.p)}, ${esc(r.d)} — why this row is here" style="cursor:pointer"><td>${r.p}</td><td>${r.d}</td><td>${r.pr}</td><td>${r.f}</td><td>${r.t}</td></tr>`).join('')}
    </table></div>
    <div class="counter"><div><div class="big">${n}</div><div class="lbl">rows returned</div></div><div><div class="big">${people}</div><div class="lbl">distinct people</div></div><div><div class="big">3</div><div class="lbl">actual humans</div></div></div>
    ${explainBox('grEx',asOf&&prim?'<b>Three rows, three people.</b> Both filters are on, so history is excluded and only the primary assignment counts. This is a headcount. Note what the second filter cost: Karim’s project assignment has disappeared, which is correct for headcount and wrong for anything about workload — that question needs FTE, not a row count.':(asOf||prim?'<span class="muted">Closer. One filter is still missing — click a row to see what it is.</span>':'<span class="muted">Seven rows for three people. Click any row to see why it is there.</span>'))}
    <div class="callout"><b>The habit.</b> Before trusting a number out of a subject area, say out loud what one row means. If a row is an assignment and the question is about people, the count is wrong before any filter is applied.</div>`;
    b.querySelectorAll('[data-f]').forEach(x=>x.addEventListener('change',()=>{if(x.dataset.f==='asOf')asOf=x.checked;else prim=x.checked;draw();}));
    b.querySelectorAll('[data-r]').forEach(x=>{ const h=()=>{const r=ROWS[+x.dataset.r];$('#grEx').innerHTML=`<b>${esc(r.p)} · ${esc(r.d)}.</b> ${esc(r.why)}`;};
      x.addEventListener('click',h); x.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); h(); } }); });};
  draw();
}});

/* Lab 27: which door — including the two that are not doors */
LABS.push({id:'which-door',ch:'reporting',title:'Which door does this need?',lead:'Eight requests as a client would phrase them. Two of them are not reporting questions at all, which is exactly what makes them worth practising.',render(b){
  const O=[['otbi','OTBI'],['bip','BI Publisher'],['ext','HCM Extract'],['rest','REST API'],['hdl','HDL'],['none','None of these']];
  const Q=[
    {q:'Employee turnover by month for the last two years, as a chart.',a:'otbi',why:'Analysis for people to look at, across periods — OTBI, using a Trend subject area rather than a Real Time one. Real Time answers “now”; Trend answers “over time”.',ar:'تحليل على الشاشة عبر فترات → OTBI.'},
    {q:'Send the medical provider this week’s enrolment changes, every Friday.',a:'ext',why:'Scheduled, outbound, machine-to-machine, and changes only. That combination is what HCM Extract exists for.',ar:'ملف مجدول بالتغييرات بس → Extract.'},
    {q:'A warning letter in Arabic, printed and signed, for one employee.',a:'bip',why:'A formatted document with exact layout and right-to-left text: BI Publisher, data model plus template.',ar:'خطاب منسّق → BI Publisher.'},
    {q:'A mobile app shows an employee their leave balance the moment they open it.',a:'rest',why:'Another system asking a question and needing the answer now. Nothing scheduled or formatted about it.',ar:'تطبيق محتاج إجابة لحظية → REST.'},
    {q:'Before payroll: who is missing a national ID?',a:'otbi',why:'A quick operational list for a human, filtered on an empty field. Reaching for BI Publisher here is the classic over-engineered answer.',ar:'قائمة سريعة → OTBI.'},
    {q:'Load 10,000 employees into Oracle for go-live.',a:'hdl',why:'Data going in, not out. The four doors are all exits; inbound bulk is HCM Data Loader. Interviewers ask this to see whether the four paths were memorised or understood.',ar:'سؤال فخ: ده إدخال بيانات → HDL.'},
    {q:'A year-end certificate for every employee, emailed to each one individually.',a:'bip',why:'Per-employee formatted documents, delivered separately: BI Publisher with bursting, which splits one run into many personal outputs.',ar:'مستند لكل موظف بيتبعت لوحده → BIP مع bursting.'},
    {q:'The payroll lead wants to connect SQL Developer straight to the database.',a:'none',why:'There is no database connection to a SaaS pod, for anyone, ever. If the requirement really needs SQL, the SQL goes inside a BI Publisher data model.',ar:'مفيش اتصال مباشر بالداتابيز. الـ SQL بيتكتب جوّه BIP.'}];
  let i=0,score=0,picked=null;
  const draw=()=>{
    if(i>=Q.length){
      b.innerHTML=`<div class="counter"><div><div class="big">${score} / ${Q.length}</div><div class="lbl">routed correctly</div></div></div>
      <div class="explain">${score>=7?'<b>That is the answer an interviewer is listening for</b> — not the list of four tools, but the reason each request lands where it does.':'<b>Worth another pass.</b> Screen and ad-hoc is OTBI, formatted document is BI Publisher, scheduled or bulk outbound is Extract, live question from another system is REST — and anything coming <em>in</em> is not on that list at all.'}</div>
      <div class="stepper"><button class="active" data-again="1">Start again</button></div>`;
      b.querySelector('[data-again]').addEventListener('click',()=>{i=0;score=0;picked=null;draw();});return;}
    const q=Q[i];
    b.innerHTML=`<div class="kv"><span class="small muted">Request ${i+1} of ${Q.length}</span><b>${score} correct</b></div>
    <div class="explain" style="font-size:16px">“${q.q}”</div>
    <div class="opts">${O.map(([v,l])=>`<button class="opt ${picked?(v===q.a?'right':(v===picked?'wrong':'')):''}" data-v="${v}" ${picked?'disabled':''}>${l}</button>`).join('')}</div>
    ${picked?`<div class="msg ${picked===q.a?'ok':'bad'}" role="status"><b>${picked===q.a?'Right.':'It is '+O.find(o=>o[0]===q.a)[1]+'.'}</b><span>${q.why}</span><div class="ar-line">${q.ar}</div></div>
    <div class="stepper"><button class="active" data-next="1">${i===Q.length-1?'See the score':'Next request'}</button></div>`:''}`;
    b.querySelectorAll('[data-v]').forEach(x=>x.addEventListener('click',()=>{if(picked)return;picked=x.dataset.v;if(picked===q.a)score++;draw();}));
    const n=b.querySelector('[data-next]');if(n){n.addEventListener('click',()=>{i++;picked=null;draw();});n.focus();}};
  draw();
}});

/* Lab 28: a Fast Formula that actually runs */
LABS.push({id:'ff-run',ch:'ff',title:'Run a formula, line by line',lead:'The same language, evaluated in the page. Change an input, run it, and read which lines fired: the green ones executed, the faded ones were skipped by a condition. The last preset is the bug every beginner ships at least once.',render(b){
  const PRE=[
    {n:'Special allowance',code:'/* Special allowance for high earners */\nINPUTS ARE BASIC_SALARY\nDEFAULT FOR BASIC_SALARY IS 0\nIF BASIC_SALARY > 35000 THEN\n  SPECIAL_ALLOWANCE = 2500\nELSE\n  SPECIAL_ALLOWANCE = 0\nRETURN SPECIAL_ALLOWANCE',v:{BASIC_SALARY:'40000'}},
    {n:'Egypt social insurance',code:'/* Egypt social insurance: employee share. Limits checked 2026 — they rise each January */\nINPUTS ARE INSURABLE_WAGE\nDEFAULT FOR INSURABLE_WAGE IS 0\nFLOOR_AMT = 2700\nCEILING_AMT = 16700\nEMP_RATE = 0.11\nCAPPED_WAGE = INSURABLE_WAGE\nIF CAPPED_WAGE > CEILING_AMT THEN\n  CAPPED_WAGE = CEILING_AMT\nIF CAPPED_WAGE < FLOOR_AMT THEN\n  CAPPED_WAGE = FLOOR_AMT\nEMP_CONTRIBUTION = ROUND(CAPPED_WAGE * EMP_RATE, 2)\nRETURN EMP_CONTRIBUTION',v:{INSURABLE_WAGE:'20000'}},
    {n:'Transport by grade',code:'/* Transport allowance by grade, pro-rated on days worked */\nINPUTS ARE GRADE_LEVEL, DAYS_WORKED\nDEFAULT FOR GRADE_LEVEL IS 1\nDEFAULT FOR DAYS_WORKED IS 30\nIF GRADE_LEVEL >= 5 THEN\n  MONTHLY_AMT = 1200\nELSE\n  MONTHLY_AMT = 800\nTRANSPORT = ROUND(MONTHLY_AMT * DAYS_WORKED / 30, 2)\nRETURN TRANSPORT',v:{GRADE_LEVEL:'6',DAYS_WORKED:'20'}},
    {n:'No default — the classic failure',code:'/* Overtime pay. Try running it with the input left empty */\nINPUTS ARE OVERTIME_HOURS\nOT_PAY = OVERTIME_HOURS * 150\nRETURN OT_PAY',v:{OVERTIME_HOURS:''}}];
  let cur=0,vals={...PRE[0].v};
  /* A deliberately small interpreter: assignments, IF/THEN/ELSE by indentation,
     arithmetic, ROUND and RETURN — the subset these formulas use. */
  const parse=code=>code.split('\n').map((raw,i)=>{const t=raw.replace(/\/\*.*?\*\//g,'').replace(/\s+$/,'');return{i,raw,t:t.trim(),ind:t.length-t.replace(/^\s+/,'').length,cmt:!t.trim()};}).filter(l=>l.raw.trim());
  const toks=s=>s.match(/\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_]*|>=|<=|<>|[()+\-*/,<>=]/g)||[];
  const run=(code,vin)=>{
    const lines=parse(code),env={},trace=[],fired=new Set();let result=null,err=null;
    let F,T,E;
    E=(ts,k)=>{let[v,i]=T(ts,k);while(ts[i]==='+'||ts[i]==='-'){const o=ts[i];const[r,j]=T(ts,i+1);v=o==='+'?v+r:v-r;i=j;}return[v,i];};
    T=(ts,k)=>{let[v,i]=F(ts,k);while(ts[i]==='*'||ts[i]==='/'){const o=ts[i];const[r,j]=F(ts,i+1);v=o==='*'?v*r:v/r;i=j;}return[v,i];};
    F=(ts,k)=>{const t=ts[k];
      if(t==='(') {const[v,i]=E(ts,k+1);return[v,i+1];}
      if(t==='-'){const[v,i]=F(ts,k+1);return[-v,i];}
      if(/^[A-Za-z_]/.test(t)){
        if(t.toUpperCase()==='ROUND'){const[a,i]=E(ts,k+2);let n=0,j=i;if(ts[j]===','){const r=E(ts,j+1);n=r[0];j=r[1];}return[Math.round(a*Math.pow(10,n))/Math.pow(10,n),j+1];}
        if(!(t in env)) throw new Error(t);
        return[env[t],k+1];}
      return[parseFloat(t),k+1];};
    const val=s=>E(toks(s),0)[0];
    const cond=s=>{const m=s.match(/^(.*?)(>=|<=|<>|>|<|=)(.*)$/);const a=val(m[1]),c=val(m[3]),o=m[2];
      return o==='>'?a>c:o==='<'?a<c:o==='>='?a>=c:o==='<='?a<=c:o==='='?a===c:a!==c;};
    const block=(a,z)=>{let k=a;
      while(k<z){const L=lines[k];
        if(L.cmt){k++;continue;}
        if(/^INPUTS ARE/i.test(L.t)||/^DEFAULT FOR/i.test(L.t)){fired.add(L.i);k++;continue;}
        if(/^IF\b/i.test(L.t)){
          const c=cond(L.t.replace(/^IF\s+/i,'').replace(/\s+THEN$/i,''));
          fired.add(L.i);trace.push([L.i,'condition is '+(c?'true':'false')]);
          let te=k+1;while(te<z&&lines[te].ind>L.ind)te++;
          let es=null,ee=te;
          if(te<z&&/^ELSE$/i.test(lines[te].t)&&lines[te].ind===L.ind){es=te+1;ee=es;while(ee<z&&lines[ee].ind>L.ind)ee++;fired.add(lines[te].i);}
          if(c) block(k+1,te); else if(es!==null) block(es,ee);
          k=ee;continue;}
        if(/^RETURN\b/i.test(L.t)){const n=L.t.replace(/^RETURN\s+/i,'');result=[n,val(n)];fired.add(L.i);trace.push([L.i,'returns '+result[1]]);return;}
        const m=L.t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
        if(m){env[m[1]]=val(m[2]);fired.add(L.i);trace.push([L.i,m[1]+' = '+env[m[1]]]);k++;continue;}
        k++;}};
    const ins=(code.match(/^INPUTS ARE (.+)$/mi)||[,''])[1].split(',').map(s=>s.trim()).filter(Boolean);
    ins.forEach(n=>{const d=code.match(new RegExp('^DEFAULT FOR '+n+' IS (.+)$','mi'));
      const given=(vin[n]||'').trim();
      if(given!=='') env[n]=parseFloat(given);
      else if(d) env[n]=parseFloat(d[1]);});
    try{ block(0,lines.length); }
    catch(e){ err=e.message; }
    return{lines,trace,fired,result,err,ins};};
  const draw=()=>{
    const p=PRE[cur],out=run(p.code,vals);
    const lit=new Map(out.trace.map(([i,t])=>[i,t]));
    b.innerHTML=`<div class="stepper">${PRE.map((x,i)=>`<button class="${i===cur?'active':''}" data-p="${i}">${x.n}</button>`).join('')}</div>
    <div class="sim">
      <div class="in" style="display:grid;gap:10px;align-content:start">
        ${out.ins.map(n=>`<label style="font-size:13px;font-weight:700;color:var(--ink-2)">${n}<input type="number" data-in="${n}" value="${vals[n]===undefined?'':vals[n]}" placeholder="leave empty to test the default" style="width:100%;margin-top:4px;padding:7px 9px;border:1px solid var(--line-2);border-radius:6px;background:var(--surface);color:var(--ink);font:inherit"></label>`).join('')}
        ${out.err?`<div class="msg bad"><b>The formula fails.</b><span>${out.err} has no value, and there is no DEFAULT FOR line to fall back on. In a live run this errors for every employee whose entry is empty — which is most of them, most months.</span><div class="ar-line">من غير DEFAULT، أي قيمة فاضية بتوقّع الفورميولا.</div></div>`
          :`<div class="kv total"><span>${out.result?out.result[0]:'no RETURN'}</span><b>${out.result?out.result[1]:'—'}</b></div>`}
        <div class="explain small muted">Inputs come from the element’s input values, and the names must match them exactly. Empty one to see what a missing DEFAULT does.</div>
      </div>
      <div style="display:grid;gap:10px;min-width:0">
        <div class="code">${out.lines.map(l=>`<span class="l ${l.cmt?'cmt':(out.fired.has(l.i)?'ran':'skip')}"><span class="n">${l.i+1}</span>${esc(l.raw)||' '}${lit.has(l.i)?`<span class="note"> → ${esc(lit.get(l.i))}</span>`:''}</span>`).join('')}</div>
        <div class="legend"><span>green · executed</span><span>faded · skipped by a condition, or never reached</span></div>
      </div>
    </div>`;
    b.querySelectorAll('[data-p]').forEach(x=>x.addEventListener('click',()=>{cur=+x.dataset.p;vals={...PRE[cur].v};draw();}));
    b.querySelectorAll('[data-in]').forEach(x=>x.addEventListener('input',()=>{vals[x.dataset.in]=x.value;const k=x.dataset.in,pos=x.selectionStart;draw();const n2=b.querySelector(`[data-in="${k}"]`);if(n2){n2.focus();try{n2.setSelectionRange(pos,pos);}catch(e){}}}));};
  draw();
}});

/* Lab 29: spot the bug */
LABS.push({id:'ff-bugs',ch:'ff',title:'Spot the bug',lead:'Six formulas, each with one defect. Four of them compile and run perfectly — they simply pay the wrong amount, which is the kind only testing finds.',render(b){
  const B=[
    {code:'INPUTS ARE BASIC SALARY\nDEFAULT FOR BASIC_SALARY IS 0\nIF BASIC_SALARY > 35000 THEN\n  SPECIAL_ALLOWANCE = 2500\nELSE\n  SPECIAL_ALLOWANCE = 0\nRETURN SPECIAL_ALLOWANCE',
     o:['The input name has a space — it must be BASIC_SALARY, matching the element’s input value exactly','DEFAULT has to come before INPUTS','The amount needs a currency','ELSE is not allowed in Fast Formula'],a:0,
     why:'Input names carry no spaces and must match the element’s input value character for character. This one fails at compile, which makes it the friendliest bug here.',ar:'اسم الـ input لازم يطابق بالظبط وبالـ underscore.'},
    {code:'INPUTS ARE INSURABLE_WAGE\nDEFAULT FOR INSURABLE_WAGE IS 0\nEMP_CONTRIBUTION = INSURABLE_WAGE * 0.11\nIF EMP_CONTRIBUTION > 16700 THEN\n  EMP_CONTRIBUTION = 16700\nRETURN EMP_CONTRIBUTION',
     o:['Nothing — it is correct','The rate is applied before the wage is capped, and the ceiling is compared against the contribution instead of the wage','0.11 should be written as 11%','RETURN must come first'],a:1,
     why:'Cap and floor the wage first, then apply the rate. On a 20,000 wage this returns 2,200 where the correct figure is 1,837, and the floor never applies at all. It runs without complaint.',ar:'اعمل الـ cap والـ floor على الأجر الأول وبعدين اضرب في النسبة.'},
    {code:'INPUTS ARE OVERTIME_HOURS\nOT_PAY = OVERTIME_HOURS * 150\nRETURN OT_PAY',
     o:['150 should be a variable','There is no DEFAULT FOR OVERTIME_HOURS, so anyone without an overtime entry makes it fail','RETURN cannot return a calculated value','INPUTS ARE should be lowercase'],a:1,
     why:'Most employees have no overtime in a given month, so the input arrives empty and the formula errors for them. The neighbouring lab runs exactly this one — empty the input and watch it break.',ar:'من غير DEFAULT، اللي ماعندوش أوفر تايم هيوقّع الفورميولا.'},
    {code:'INPUTS ARE BASIC_SALARY\nDEFAULT FOR BASIC_SALARY IS 0\nIF BASIC_SALARY > 35000 THEN\n  SPECIAL_ALLOWANCE = 2500\nELSE\n  SPECIAL_ALLOWANCE = 0\nRETURN BASIC_SALARY',
     o:['It returns the wrong variable — BASIC_SALARY instead of SPECIAL_ALLOWANCE','IF needs a closing END IF','The DEFAULT is wrong','It is fine'],a:0,
     why:'The allowance is calculated and then thrown away: the element would pay every employee their whole basic salary a second time, as an allowance. It compiles. Only a QuickPay on a real person catches it.',ar:'بيرجّع الأساسي بدل البدل — مفيش error، الـ QuickPay بس هو اللي بيكشفه.'},
    {code:'/* Written January 2025, still running today */\nINPUTS ARE INSURABLE_WAGE\nDEFAULT FOR INSURABLE_WAGE IS 0\nCAPPED_WAGE = INSURABLE_WAGE\nIF CAPPED_WAGE > 14500 THEN\n  CAPPED_WAGE = 14500\nEMP_CONTRIBUTION = CAPPED_WAGE * 0.11\nRETURN EMP_CONTRIBUTION',
     o:['Nothing, the logic is sound','The ceiling is last year’s figure — Egyptian limits rise every January, and a hard-coded one quietly under-deducts','14500 should be 145','The rate should be 0.14'],a:1,
     why:'The insurable-wage limits rise every January. Hard-coded, the formula under-deducts from every high earner until someone reconciles a statutory return. Keep limits in a global value with dated versions, and the floor is missing here too.',ar:'الحد الأقصى بتاع السنة اللي فاتت. حط الحدود في global value.'},
    {code:'/* Formula type: Oracle Payroll */\n/* attached to the Annual Leave plan as its accrual formula */\nINPUTS ARE BASIC_SALARY\nACCRUAL = 1.75\nRETURN ACCRUAL',
     o:['1.75 should be 2','A payroll-type formula is plugged into an absence socket — the type decides the inputs and contexts available, so it cannot work there','A comment cannot span two lines','ACCRUAL is a reserved word'],a:1,
     why:'Formula type is the socket, not a label. An absence plan expects an absence accrual formula, which receives the accrual period and the plan’s context; a payroll formula receives neither. Start from a delivered formula of the right type.',ar:'نوع الفورميولا غلط: فورميولا payroll متركّبة في خطة إجازات.'}];
  let i=0,picked=null,score=0;
  const draw=()=>{
    if(i>=B.length){
      b.innerHTML=`<div class="counter"><div><div class="big">${score} / ${B.length}</div><div class="lbl">found</div></div></div>
      <div class="explain"><b>The pattern worth carrying out of this.</b> A formula that fails to compile costs an hour. A formula that compiles and returns the wrong number costs a payroll run, and sometimes a year of them — which is why every rule gets tested with QuickPay against a real person before it is called done.</div>
      <div class="stepper"><button class="active" data-again="1">Again</button></div>`;
      b.querySelector('[data-again]').addEventListener('click',()=>{i=0;score=0;picked=null;draw();});return;}
    const q=B[i];
    b.innerHTML=`<div class="kv"><span class="small muted">Formula ${i+1} of ${B.length}</span><b>${score} found</b></div>
    <div class="code">${q.code.split('\n').map((l,n)=>`<span class="l"><span class="n">${n+1}</span>${esc(l)||' '}</span>`).join('')}</div>
    <div style="display:grid;gap:8px">${q.o.map((o,n)=>`<button class="opt ${picked!==null?(n===q.a?'right':(n===picked?'wrong':'')):''}" data-o="${n}" ${picked!==null?'disabled':''} style="text-align:left">${o}</button>`).join('')}</div>
    ${picked!==null?`<div class="msg ${picked===q.a?'ok':'bad'}" role="status"><b>${picked===q.a?'Found it.':'Not that one.'}</b><span>${q.why}</span><div class="ar-line">${q.ar}</div></div>
    <div class="stepper"><button class="active" data-next="1">${i===B.length-1?'See the score':'Next formula'}</button></div>`:''}`;
    b.querySelectorAll('[data-o]').forEach(x=>x.addEventListener('click',()=>{if(picked!==null)return;picked=+x.dataset.o;if(picked===q.a)score++;draw();}));
    const n2=b.querySelector('[data-next]');if(n2){n2.addEventListener('click',()=>{i++;picked=null;draw();});n2.focus();}};
  draw();
}});

/* Lab 30: import and load are two different checks */
LABS.push({id:'import-load',ch:'hdl',title:'Import checks the shape, load checks the meaning',lead:'A load is two inspections with a waiting room between them. Import reads the file and puts well-formed lines in staging; load turns staging into real records. Send a file through and watch where each kind of problem stops it.',render(b){
  const ST=[['sheet','Client’s spreadsheet','one row per employee'],['dat','.dat files','one per business object'],['zip','Flat zip, uploaded','no folders inside'],['imp','Import','is the format readable?'],['stg','Staging','a waiting room'],['load','Load','is the content valid?'],['db','Live records','in the real tables']];
  const CASE={
    clean:{n:'A clean file',stop:null,
      t:'All the way through.',
      d:'Import reads every line, staging holds them, load resolves each reference and writes the records. The count that matters is the one at the end: rows in the file against rows in Oracle, reconciled by source key.',
      ar:'الملف عدّى: الشكل سليم والمحتوى سليم.'},
    fmt:{n:'A line with a missing pipe',stop:'imp',
      t:'Stopped at import, before staging.',
      d:'One MERGE line carries five values where its METADATA declares six. HDL cannot line the values up with their column names, so the line never reaches staging and never becomes a record. Format errors are the cheap kind: the file is wrong, the fix is in the file, and nothing has been written anywhere.',
      ar:'عدد الـ pipes غلط، فالسطر مادخلش الـ staging أصلًا.'},
    date:{n:'Dates as 2018-01-01',stop:'imp',
      t:'Stopped at import.',
      d:'Dates are YYYY/MM/DD with slashes, always. A spreadsheet that helpfully reformats a column to 2018-01-01 or 01/01/2018 breaks every row it touched — which is why the dates column is the first thing to check when a file that worked last week suddenly does not.',
      ar:'التاريخ لازم يكون بالـ slash: سنة/شهر/يوم.'},
    parent:{n:'A job whose family is not loaded yet',stop:'load',
      t:'Through import, stopped at load.',
      d:'The file is well-formed, so import passes and the line sits in staging. Load then tries to resolve JobFamilyId(SourceSystemId) and finds nothing to point at, because JobFamily.dat has not been loaded. The record waits in staging with an error; load the parent, then reload the failures. This is what load order is for.',
      ar:'الشكل سليم بس الأب مش موجود — حمّل JobFamily الأول وبعدين أعد المحاولة.'},
    case:{n:'jobFamilyCode instead of JobFamilyCode',stop:'imp',
      t:'Stopped at import.',
      d:'Attribute names are case-sensitive and must match Oracle’s spelling exactly. There is no fuzzy matching and no warning that a column was nearly right — an unrecognised attribute name is simply not an attribute.',
      ar:'أسماء الأعمدة حساسة للكابيتال.'}};
  let cur='clean';
  const draw=()=>{
    const c=CASE[cur],at=ST.findIndex(s=>s[0]===c.stop);
    b.innerHTML=`<div class="stepper">${Object.keys(CASE).map(k=>`<button class="${k===cur?'active':''}" data-c="${k}">${CASE[k].n}</button>`).join('')}</div>
    <div class="stage"><div class="pipe">${ST.map((s,i)=>`<button class="node ${c.stop===null?'ok':(i<at?'ok':i===at?'bad':'off')}" tabindex="-1">${s[1]}<small>${i===at?'stops here':s[2]}</small></button>`).join('')}</div></div>
    <div class="msg ${c.stop?'bad':'ok'}"><b>${c.t}</b><span>${c.d}</span><div class="ar-line">${c.ar}</div></div>
    <div class="two">
      <div class="explain"><b>Import</b><div style="margin-top:4px">Reads the file and checks its shape: pipes, METADATA before MERGE, one METADATA per component, attribute spelling, date format. Good lines land in staging tables — a holding area that is not yet HR data.</div></div>
      <div class="explain"><b>Load</b><div style="margin-top:4px">Groups staged lines into whole objects and checks what they mean: does the job exist, is the grade valid on that date, does the parent this record points at exist? Then it writes them into the live tables.</div></div>
    </div>
    <div class="callout"><b>Reading an error report.</b> Thirty errors are rarely thirty problems. Group them: one misspelt department name in a source spreadsheet produces an error per employee in it. Fix the source file and reload — never patch the records by hand in Oracle, or the file and the system stop agreeing and the next load undoes the patch.</div>`;
    b.querySelectorAll('[data-c]').forEach(x=>x.addEventListener('click',()=>{cur=x.dataset.c;draw();}));};
  draw();
}});

/* Lab 31: keys — why the legacy id is kept */
LABS.push({id:'source-keys',ch:'hdl',title:'Match them back: name, or key',lead:'Eight employees came from the old payroll and four records failed the load. To fix them, each failure has to be matched back to its source row. Switch how the match is made — two of these people share a name.',render(b){
  const L=[['EMP_0411','Sara Mostafa','1041'],['EMP_0412','Mohamed Ahmed','1042'],['EMP_0413','Nour Hassan','1043'],['EMP_0414','Omar Khaled','1044'],['EMP_0415','Mohamed Ahmed','1045'],['EMP_0416','Yasmin Adel','1046'],['EMP_0417','Karim Samir','1047'],['EMP_0418','Hana Fathy','1048']];
  const FAILED=[1,3,4,6];
  let by='key';
  const draw=()=>{
    const counts={};L.forEach(([,n])=>counts[n]=(counts[n]||0)+1);
    const amb=r=>by==='name'&&counts[L[r][1]]>1;
    const bad=FAILED.filter(r=>amb(r)).length;
    b.innerHTML=`<div class="stepper">${[['key','Match on the source key'],['name','Match on the name']].map(([v,l])=>`<button class="${by===v?'active':''}" data-b="${v}">${l}</button>`).join('')}</div>
    <div class="stage"><table class="dt" style="min-width:560px">
      <tr><th>Legacy id</th><th>Name</th><th>Person number in Oracle</th><th>Failed the load</th><th>Matched back</th></tr>
      ${L.map(([id,n,p],i)=>`<tr class="${amb(i)?'tie':''}"><td>${by==='key'?`<b>${id}</b>`:id}</td><td>${by==='name'?`<b>${n}</b>`:n}</td><td>${p}</td><td>${FAILED.includes(i)?'yes':'—'}</td><td>${FAILED.includes(i)?(amb(i)?'<span class="pill no">two rows match</span>':'<span class="pill ok">one row</span>'):''}</td></tr>`).join('')}
    </table></div>
    <div class="msg ${by==='key'?'ok':'bad'}">${by==='key'
      ?'<b>Every failure resolves to exactly one source row.</b><span>SourceSystemOwner names the old system and SourceSystemId is the record’s id inside it. Together they are the source key: a label Oracle stores alongside the record, so any later load, correction or reconciliation can find the same row again. It is the reason a reload updates records instead of duplicating them.</span><div class="ar-line">المفتاح المصدري بيخلي كل سجل يرجع لأصله بالظبط.</div>'
      :`<b>${bad} of the four failures are ambiguous.</b><span>Two employees are both called Mohamed Ahmed. Matching on the name gives no way to tell which is which, so the correction is applied to the wrong person, to both, or to neither — and nothing in the load reports that anything went wrong. Names are not keys: they repeat, they get re-spelled, and they change with marriage.</span><div class="ar-line">في اتنين بنفس الاسم، فالتصحيح ممكن يروح على الشخص الغلط.</div>`}</div>
    <div class="two">
      <div class="explain"><b>Source key</b><div style="margin-top:4px">SourceSystemOwner plus SourceSystemId — where the record came from. Used for migrated data, and the only practical way to reconcile a load against the file that produced it.</div></div>
      <div class="explain"><b>User key</b><div style="margin-top:4px">The business code the client already recognises: JobCode, GradeCode, LocationCode. Natural for reference data that has a real code, and readable in the file without a lookup.</div></div>
    </div>
    <div class="callout"><b>The migration rule.</b> Key on something that is unique and never changes. In Egypt and the Gulf the national identifier is usually the only field in a legacy system that satisfies both — employee numbers get reissued, and names do not identify anyone.</div>`;
    b.querySelectorAll('[data-b]').forEach(x=>x.addEventListener('click',()=>{by=x.dataset.b;draw();}));};
  draw();
}});

/* Lab 32: fit-gap decisions */
LABS.push({id:'fit-gap',ch:'method',title:'Fit, configure, work around, extend, descope',lead:'Six requirements from a real-looking workshop. Every gap needs a decision and a name, because the name sets the cost and who has to agree to it.',render(b){
  const O=[['fit','Fit'],['configure','Configure'],['workaround','Work around'],['extend','Extend'],['descope','Descope']];
  const Q=[
    {q:'Employees request annual leave and their manager approves it.',a:'fit',why:'Standard absence functionality, working out of the box once the plan is set up. Writing “fit” next to it is what stops it being re-litigated in month four.',ar:'Oracle بيعملها جاهزة.'},
    {q:'Transport allowance only for grades G1 to G6.',a:'configure',why:'Element eligibility on grade. No code, no design document, no extra testing beyond the normal script — the cheapest kind of gap.',ar:'مجرد eligibility بالدرجة = configuration.'},
    {q:'Calculate Egyptian social insurance with this year’s floor and ceiling.',a:'extend',why:'There is no maintained Egyptian localization, so the rule is written as a Fast Formula. That is a build: it needs a design, a test script, and an owner when the limits change next January.',ar:'مفيش localization لمصر، فبتتكتب Fast Formula.'},
    {q:'A salary certificate in Arabic on the company letterhead.',a:'extend',why:'A custom BI Publisher report — data model plus template. Small in effort, still a build, and still needs someone named to maintain it.',ar:'تقرير BIP مخصوص = extension.'},
    {q:'Payroll used to edit a finalized payslip directly, and wants to keep doing that.',a:'workaround',why:'Oracle does not allow editing finalized results, and that is the product working as intended: corrections go through retro or an off-cycle QuickPay. The gap is closed by agreeing the new process, not by building anything.',ar:'Oracle مش بيسمح، فبنتفق على طريقة بديلة.'},
    {q:'A different motivational quote on every payslip each month.',a:'descope',why:'Real cost, negligible value. Descoping is a decision with the client, written down — not a request quietly dropped, which is how it returns in user acceptance testing as a defect.',ar:'قيمة قليلة وتكلفة حقيقية، فبيتشال من النطاق باتفاق.'}];
  let i=0,score=0,picked=null;
  const draw=()=>{
    if(i>=Q.length){
      b.innerHTML=`<div class="counter"><div><div class="big">${score} / ${Q.length}</div><div class="lbl">named correctly</div></div></div>
      <div class="explain"><b>Why the label matters more than it looks.</b> Fit and configure sit inside the estimate. Extend adds design, testing and a maintenance owner. Work around changes how people work, so it needs the process owner to agree rather than the project manager. Descope is a decision someone has to sign. A gap with no label is a scope argument scheduled for later.</div>
      <div class="stepper"><button class="active" data-again="1">Again</button></div>`;
      b.querySelector('[data-again]').addEventListener('click',()=>{i=0;score=0;picked=null;draw();});return;}
    const q=Q[i];
    b.innerHTML=`<div class="kv"><span class="small muted">Requirement ${i+1} of ${Q.length}</span><b>${score} correct</b></div>
    <div class="explain" style="font-size:16px">“${q.q}”</div>
    <div class="opts">${O.map(([v,l])=>`<button class="opt ${picked?(v===q.a?'right':(v===picked?'wrong':'')):''}" data-v="${v}" ${picked?'disabled':''}>${l}</button>`).join('')}</div>
    ${picked?`<div class="msg ${picked===q.a?'ok':'bad'}" role="status"><b>${picked===q.a?'Right.':'This one is “'+O.find(o=>o[0]===q.a)[1]+'”.'}</b><span>${q.why}</span><div class="ar-line">${q.ar}</div></div>
    <div class="stepper"><button class="active" data-next="1">${i===Q.length-1?'See the score':'Next requirement'}</button></div>`:''}`;
    b.querySelectorAll('[data-v]').forEach(x=>x.addEventListener('click',()=>{if(picked)return;picked=x.dataset.v;if(picked===q.a)score++;draw();}));
    const n=b.querySelector('[data-next]');if(n){n.addEventListener('click',()=>{i++;picked=null;draw();});n.focus();}};
  draw();
}});

/* Lab 33: change request, defect, or just a question */
LABS.push({id:'cr-or-defect',ch:'method',title:'Change request, defect, or question',lead:'Six things a client says during testing. The three answers cost very different amounts, and misfiling them is how a project quietly absorbs work nobody agreed to.',render(b){
  const O=[['cr','Change request'],['defect','Defect'],['question','Just a question']];
  const Q=[
    {q:'“Can you just add a field for each employee’s car plate number? It’s small.”',a:'cr',why:'New requirement, not in the fit-gap. Size is not the test — agreement is. It goes through a change request so the impact is assessed and someone with authority accepts it.',ar:'طلب جديد مش في النطاق → change request.'},
    {q:'“The transport allowance isn’t showing on the test payslip.”',a:'defect',why:'It was agreed, designed and built, and it does not work. Fix it, and trace why testing found it rather than the build — usually eligibility, an entry, or a date.',ar:'حاجة متفق عليها ومش شغالة → defect.'},
    {q:'“While you’re at it, can we also roll out the performance module?”',a:'cr',why:'An entire module, and almost certainly a new phase rather than a change to this one. The polite version of the answer still goes on the change log.',ar:'موديول جديد كامل → change request كبير.'},
    {q:'“What happens if an employee’s hire date is in the future?”',a:'question',why:'A question. Answer it, or find out and come back. Treating questions as scope items makes people stop asking, and the questions are where requirements hide.',ar:'سؤال عادي، مفيش تغيير في النطاق.'},
    {q:'“Can the payslip come in English as well, not just Arabic?”',a:'cr',why:'Check the fit-gap first. If only the Arabic layout was agreed, a second layout is new scope — a small change request, but still one, because it carries its own template, testing and maintenance.',ar:'لو مش متفق عليه، ده scope جديد.'},
    {q:'“Grade G7’s allowance is 1,000 and we agreed 1,200 in the workbook.”',a:'defect',why:'The build does not match the documented decision, so it is a defect and the workbook is the proof. This is the argument the configuration workbook exists to end.',ar:'البناء مش مطابق للـ workbook → defect.'}];
  let i=0,score=0,picked=null;
  const draw=()=>{
    if(i>=Q.length){
      b.innerHTML=`<div class="counter"><div><div class="big">${score} / ${Q.length}</div><div class="lbl">filed correctly</div></div></div>
      <div class="explain"><b>The test, in one line.</b> Was it agreed and written down? If yes and it does not work, it is a defect. If it was never agreed, it is a change request however small it sounds. If nothing is being asked for, it is a question — answer it and move on. Filing change requests as defects is the most common way a project runs out of time without anyone being able to say where it went.</div>
      <div class="stepper"><button class="active" data-again="1">Again</button></div>`;
      b.querySelector('[data-again]').addEventListener('click',()=>{i=0;score=0;picked=null;draw();});return;}
    const q=Q[i];
    b.innerHTML=`<div class="kv"><span class="small muted">Item ${i+1} of ${Q.length}</span><b>${score} correct</b></div>
    <div class="explain" style="font-size:16px">${q.q}</div>
    <div class="opts">${O.map(([v,l])=>`<button class="opt ${picked?(v===q.a?'right':(v===picked?'wrong':'')):''}" data-v="${v}" ${picked?'disabled':''}>${l}</button>`).join('')}</div>
    ${picked?`<div class="msg ${picked===q.a?'ok':'bad'}" role="status"><b>${picked===q.a?'Right.':'It is a '+O.find(o=>o[0]===q.a)[1].toLowerCase()+'.'}</b><span>${q.why}</span><div class="ar-line">${q.ar}</div></div>
    <div class="stepper"><button class="active" data-next="1">${i===Q.length-1?'See the score':'Next item'}</button></div>`:''}`;
    b.querySelectorAll('[data-v]').forEach(x=>x.addEventListener('click',()=>{if(picked)return;picked=x.dataset.v;if(picked===q.a)score++;draw();}));
    const n=b.querySelector('[data-next]');if(n){n.addEventListener('click',()=>{i++;picked=null;draw();});n.focus();}};
  draw();
}});
