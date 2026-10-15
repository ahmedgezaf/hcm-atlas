/* =====================================================================
   HCM ATLAS — an open study site for Oracle HCM Cloud consultants
   working in Egypt and the Gulf.
   ---------------------------------------------------------------------
   HOW TO EXTEND
   • Chapters live in DATA.chapters: {id, num, title, sub, hue, labs[],
     terms[], minutes, html}. The HTML is built from Markdown source
     (chapters-*.md) by build.py; [[lab:id]] in the source embeds a lab.
   • Glossary terms live in DATA.terms: {id, name, what, trap, ch}.
   • Drill questions live in DATA.questions: {ch, q, a, terms[]}.
   • Labs are functions in LABS: {id, ch, title, lead, render(el)}.
   • Readers can add their own terms and questions in-page; those, plus
     progress and notes, live in state S (browser storage, synced to the
     page's database when available).
   ===================================================================== */
const DATA = JSON.parse(document.getElementById('hcm-data').textContent);
const CH = DATA.chapters; const chById = id => CH.find(c=>c.id===id);
const TERMS = {}; DATA.terms.forEach(t=>TERMS[t.id]=t);
const allTerms = () => [...DATA.terms, ...S.custom];

/* ---------- state ---------- */
const S = {known:{},read:{},notes:{},drill:{},custom:[],customQ:[],updatedAt:0};
const LS='hcm-atlas-v2';
try{ const raw=localStorage.getItem(LS); if(raw) Object.assign(S, JSON.parse(raw)); }catch(e){}
let db=null, saveTimer=null;
function save(){ S.updatedAt=Date.now(); try{ localStorage.setItem(LS, JSON.stringify(S)); }catch(e){} clearTimeout(saveTimer); saveTimer=setTimeout(()=>{ if(db) db.doc('progress/main').set(JSON.parse(JSON.stringify(S))).catch(()=>{}); },600); }
(async()=>{ try{ if(!window.claude||!window.claude.use) return; db=await claude.use('db'); if(!db) return;
  const snap=await db.doc('progress/main').get(); if(snap.exists){ const d=snap.data(); if((d.updatedAt||0)>(S.updatedAt||0)){ Object.assign(S,d); render(); } else save(); } else save();
  const el=document.getElementById('sync'); el.classList.add('on'); el.querySelector('span').textContent='Progress synced across devices'; }catch(e){ db=null; } })();
let sample=null;
(async()=>{ try{ if(window.claude&&window.claude.use){ sample=await claude.use('sample'); if(sample) document.querySelectorAll('.needs-sample').forEach(x=>x.hidden=false); } }catch(e){} })();

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => Math.round(n).toLocaleString('en-EG');
const fmt2 = n => n.toLocaleString('en-EG',{minimumFractionDigits:2,maximumFractionDigits:2});
function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); }
function pct(a,b){ return b?Math.round(100*a/b):0; }
function termExplain(id){ const t=TERMS[id]; if(!t) return ''; return `<b>${esc(t.name)}</b>${t.ar?` <span class="ar">${esc(t.ar)}</span>`:''}${t.say?` <span class="small muted">on the floor</span> <span class="ar">${esc(t.say)}</span>`:''}<br>${esc(t.what)}${t.trap?`<div class="muted" style="margin-top:6px"><b style="color:var(--gold)">Watch out:</b> ${esc(t.trap)}</div>`:''}`; }
/* Stable heading ids: derived from the text, so a deep link keeps working when
   a section moves or a lab is added. Deduped against ids already handed out. */
function slugId(text, taken){ const base='h-'+String(text).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60); let id=base,n=2; while(taken.has(id)) id=base+'-'+(n++); taken.add(id); return id; }
function explainBox(id, init){ return `<div class="explain" id="${id}">${init}</div>`; }
function knownBtn(id){ return `<span class="known ${S.known[id]?'on':''}" data-known="${esc(id)}" title="Mark as known" role="button" tabindex="0"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"/></svg></span>`; }
function wireKnown(root){ root.querySelectorAll('[data-known]').forEach(k=>{ const h=e=>{ e.preventDefault(); e.stopPropagation(); const id=k.dataset.known; S.known[id]=!S.known[id]; if(!S.known[id]) delete S.known[id]; save(); k.classList.toggle('on',!!S.known[id]); }; k.onclick=h; k.onkeydown=e=>{ if(e.key==='Enter'||e.key===' ') h(e); }; }); }

/* ---------- collections ----------
   A chapter belongs to a domain; everything downstream of it — its terms, labs,
   figures and drill questions — inherits that. The views show one collection at
   a time; only search reaches across all of them. */
const DOMAINS=DATA.domains;
const domById=id=>DOMAINS.find(d=>d.id===id);
const chDomain=id=>{ const c=chById(id); return c?c.domain:DOMAINS[0].id; };
let dom=DOMAINS[0].id;
const CHD=()=>CH.filter(c=>c.domain===dom);
const domTerms=()=>allTerms().filter(t=>chDomain(t.ch)===dom);
const domQuestions=()=>DATA.questions.filter(q=>chDomain(q.ch)===dom);
const domLabs=()=>LABS.filter(l=>chDomain(l.ch)===dom);
const VIEWS=['home','chapters','labs','glossary','drill','about'];
const SECTIONS=[['home','Home'],['chapters','Chapters'],['labs','Labs'],['glossary','Glossary'],['drill','Drill'],['about','About']];

/* ---------- router ----------
   #<domain>/<view>[/<id>[/<section>]] — e.g. #hcm/chapters/org/h-the-ldg.
   A hash whose first segment is a view instead (the pre-collections format)
   still resolves, against the first collection. */
let route={view:'overview'}, lastHash='';
function go(view, extra={}){
  if(extra.dom){ dom=extra.dom; delete extra.dom; }
  route={view,...extra};
  lastHash=view==='overview'?'overview':[dom,view,extra.ch||extra.lab||'',extra.sec||''].filter(Boolean).join('/');
  location.hash=lastHash; render(); if(!extra.sec) window.scrollTo({top:0});
}
function parseHash(){
  const parts=location.hash.slice(1).split('/').filter(Boolean);
  if(!parts.length||parts[0]==='overview') return {view:'overview'};
  let d=parts[0], rest=parts.slice(1);
  if(!domById(d)){ d=DOMAINS[0].id; rest=parts; }        // legacy #chapters/org
  dom=d;
  const [v,x,y]=rest; const r={view:VIEWS.includes(v)?v:'home'};
  if(r.view==='chapters'&&x){ r.ch=x; if(y) r.sec=y; }
  if(r.view==='labs'&&x) r.lab=x;
  return r;
}
window.addEventListener('hashchange',()=>{ const h=location.hash.slice(1); if(h===lastHash) return; lastHash=h; route=parseHash(); render(); window.scrollTo({top:0}); });

function renderNav(){
  const over=route.view==='overview';
  // Set on the root so fixed overlays outside .app — the speech bar, the
  // palette — resolve --p too. Chapters and labs override it further down.
  const r=document.documentElement;
  r.setAttribute('data-h',''); r.style.setProperty('--h', domById(dom).hue);
  $('#domainNav').innerHTML=DOMAINS.map(d=>`<button class="dtab ${!over&&d.id===dom?'on':''}" data-h style="--h:${d.hue}" data-dom="${d.id}" aria-current="${!over&&d.id===dom}">${icon('domain-'+d.id)}<span>${esc(d.short)}</span></button>`).join('');
  $('#sectionNav').innerHTML=over?'':SECTIONS.map(([v,l])=>`<button class="sec-btn ${v===route.view?'on':''}" data-go="${v}" aria-current="${v===route.view}">${icon('nav-'+v)}<span>${l}</span></button>`).join('');
  $('#domainNav').querySelectorAll('[data-dom]').forEach(b=>b.addEventListener('click',()=>go('home',{dom:b.dataset.dom})));
  $('#sectionNav').querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
}
function render(){
  speechStop();
  renderNav();
  ({overview:renderOverview,home:renderHome,chapters:renderChapters,labs:renderLabs,glossary:renderGlossary,drill:renderDrill,about:renderAbout}[route.view]||renderOverview)($('#view'));
}
document.querySelectorAll('[data-go]').forEach(b=>{ if(b.closest('.topbar')&&!b.closest('#sectionNav')) b.addEventListener('click',()=>go(b.dataset.go)); });
$('#themeBtn').addEventListener('click',()=>{ const r=document.documentElement; const cur=r.getAttribute('data-theme'); const next=cur==='dark'?'light':cur==='light'?'':'dark'; if(next) r.setAttribute('data-theme',next); else r.removeAttribute('data-theme'); try{localStorage.setItem('hcm-theme',next);}catch(e){} });
try{ const th=localStorage.getItem('hcm-theme'); if(th) document.documentElement.setAttribute('data-theme',th); }catch(e){}

/* ---------- progress ---------- */
function cardIds(d=dom){ const ids=[];
  allTerms().forEach(t=>{ if(chDomain(t.ch)===d) ids.push('t:'+t.id); });
  DATA.questions.forEach((q,i)=>{ if(chDomain(q.ch)===d) ids.push('q:'+i); });
  S.customQ.forEach(q=>{ if(chDomain(q.ch)===d) ids.push('c:'+q.id); });
  return ids; }
function progress(d=dom){ const chs=CH.filter(c=>c.domain===d), ts=allTerms().filter(t=>chDomain(t.ch)===d);
  const cards=cardIds(d);
  return {total:ts.length, known:ts.filter(t=>S.known[t.id]).length,
          read:chs.filter(c=>S.read[c.id]).length, chapters:chs.length,
          cards:cards.length, solid:cards.filter(c=>S.drill[c]===2).length,
          shaky:cards.filter(c=>S.drill[c]===1).length}; }

/* ================= HOME ================= */
/* Per-chapter progress: one column per chapter, filled by the share of its
   terms marked known, ticked when the chapter is read. Clicking opens it. */
function chapterProgress(){
  const rows=CHD().map(c=>{ const t=c.terms.length, k=c.terms.filter(id=>S.known[id]).length;
    return {c,t,k,pct:t?Math.round(100*k/t):0,read:!!S.read[c.id]}; });
  const done=rows.filter(r=>r.read).length, allKnown=rows.filter(r=>r.t&&r.k===r.t).length;
  return `<div class="pchart card">
    <div class="pchart-head"><div><div class="eyebrow">Where you are, chapter by chapter</div><p class="small muted">Column height is the share of that chapter's terms you have marked known. A tick means you marked the chapter read.</p></div>
      <div class="pchart-key"><span>${done} read</span><span>${allKnown} fully known</span></div></div>
    <div class="pchart-grid" style="--cols:${rows.length}">${rows.map(r=>`<button class="pcol ${r.read?'read':''}" data-h style="--h:${r.c.hue}" data-ch="${r.c.id}" aria-label="Chapter ${r.c.num}, ${esc(r.c.title)} — ${r.k} of ${r.t} terms known${r.read?', read':''}"><span class="pcol-v">${r.pct}%</span><span class="pcol-trk"><i style="height:${r.pct}%"></i></span><span class="pcol-n">${r.c.num}</span>${r.read?'<span class="pcol-ok">✓</span>':'<span class="pcol-ok off"></span>'}</button>`).join('')}</div>
  </div>`;
}

/* Each collection's home map is laid out by hand — the arrangement carries
   meaning a generated grid cannot. A collection without one falls back to a
   plain grouping by track. The build checks every chapter appears on one. */
const MAPS = {
  hcm: (node, sec) => `
    ${sec('functional','Functional','What the business configures and runs: the structures people sit in, the record that describes them, and the money, time and law that follow.')}
    <div class="sysmap-scroll"><div class="sysmap-inner">
      <div class="layer-lbl">Structure — what exists before anyone is hired</div>${node('org')}${node('workforce','two')}
      <div class="layer-lbl">People — the data model everything reads from</div>${node('model','two')}${node('hrfunction')}
      ${node('dating','wide')}
      <div class="layer-lbl">Money &amp; time — what the model feeds</div>${node('payroll')}${node('absence')}${node('lifecycle')}
      <div class="layer-lbl">Law — the rules configured per country</div>${node('egypt-payroll')}${node('egypt-leave')}${node('gulf')}${node('uae','full')}
      <div class="layer-lbl">The rest of the suite — enough to follow the conversation</div>${node('modules','full')}
      <div class="layer-lbl">Delivery — how the project is run</div>${node('method','full')}
    </div></div>
    ${sec('technical','Technical','What the consultant builds with: loading data in bulk, writing the calculation logic, getting information back out, extending without customizing, and controlling who sees what.')}
    <div class="sysmap-scroll"><div class="sysmap-inner">
      <div class="layer-lbl">The consultant’s toolkit</div>${node('hdl')}${node('ff')}${node('reporting')}${node('approvals')}${node('extend','two')}${node('security')}
    </div></div>`,

  analytics: (node, sec) => `
    ${sec('functional')}
    <div class="sysmap-scroll"><div class="sysmap-inner">
      <div class="layer-lbl">Before the tool — what a row means</div>${node('tables','full')}
      <div class="layer-lbl">And after it — what a reader takes away</div>${node('excel')}${node('question-to-chart','two')}
      <div class="layer-lbl">Where this collection meets the other one</div>${node('people-data','full')}
    </div></div>
    ${sec('technical')}
    <div class="sysmap-scroll"><div class="sysmap-inner">
      <div class="layer-lbl">SQL — getting the rows out, in three passes</div>${node('sql-shape')}${node('sql-joins')}${node('sql-windows')}
      <div class="layer-lbl">Power BI — the model decides whether the numbers are right</div>${node('powerbi-model','two')}${node('dax')}
    </div></div>`,
};

function renderHome(v){
  const d=domById(dom), pr=progress();
  const node=(id,cls='')=>{const c=chById(id);return `<button class="mnode ${cls}" data-h style="--h:${c.hue}" data-ch="${id}"><span class="k">${c.num}</span><div class="t">${icon(c.id)}<span>${esc(c.title)}</span></div><div class="s">${esc(c.sub)}</div>${S.read[id]?'<span class="done">✓</span>':''}</button>`;};
  const stat=(to,val,p2,lbl)=>`<button class="hstat" data-go2="${to}"><div class="ring" style="--v:${p2}"><b>${p2}%</b></div><div><div class="big num">${val}</div><div class="lbl">${lbl}</div></div></button>`;
  const L=t=>d.tracks[t];
  const sec=(track,name,blurb)=>`<div class="sec-lbl"><span class="sec-k ${track}">${name||L(track).name}</span>${(blurb||L(track).blurb)?`<p>${blurb||L(track).blurb}</p>`:''}</div>`;
  const auto=()=>['functional','technical'].map(t=>{ const list=CHD().filter(c=>c.track===t); if(!list.length) return '';
      return sec(t)+`<div class="sysmap-scroll"><div class="sysmap-inner">${list.map(c=>node(c.id)).join('')}</div></div>`; }).join('');
  const first=CHD()[0];
  v.innerHTML=`<section class="hero" data-h style="--h:${d.hue}">
    <div class="hero-side">${stat('chapters',`${pr.read} / ${pr.chapters}`,pct(pr.read,pr.chapters),'chapters read')}${stat('glossary',`${pr.known} / ${pr.total}`,pct(pr.known,pr.total),'terms marked known')}${stat('drill',`${pr.solid} / ${pr.cards}`,pct(pr.solid,pr.cards),'drill cards solid')}</div>
    <div class="hero-main"><div class="eyebrow">${esc(d.name)}</div><h1>${esc(d.tagline)}</h1><p>${esc(d.blurb)}</p><div class="cta">${first?`<button class="btn gold" data-go2="chapters" data-ch2="${first.id}">Start with Chapter 1</button>`:''}${domLabs().length?'<button class="btn" data-go2="labs">Open the labs</button>':''}</div></div>
  </section>
  ${chapterProgress()}
  <div class="eyebrow" style="margin:22px 0 10px">The whole collection on one screen — each block is a chapter</div>
  <div class="sysmap card">
    ${MAPS[dom]?MAPS[dom](node,sec):auto()}
    <div class="legend"><span>Colour is consistent everywhere: the chapter’s colour marks its labs, its glossary terms and its drill cards.</span><span>Dashed = a foundation that runs under every record above it.</span></div>
  </div>
  ${dom==='hcm'?`<div class="paths3">
    <button class="path3 card" data-go2="chapters" data-ch2="model"><span class="n">If you read one chapter</span><h3>The Employment Data Model</h3><p>Person, work relationship, assignment, payroll relationship. Everything else reads from it.</p></button>
    <button class="path3 card" data-go2="chapters" data-ch2="egypt-payroll"><span class="n">If you work in Egypt</span><h3>Social Insurance &amp; Salary Tax</h3><p>Oracle does not ship these rules. Knowing them is the differentiator.</p></button>
    <button class="path3 card" data-go2="chapters" data-ch2="hdl"><span class="n">If you want to be useful on day one</span><h3>Loading Data: HDL</h3><p>Bulk loads land on functional consultants. Most avoid them.</p></button>
  </div>
  <div class="callout" style="margin-top:22px"><b>Numbers move.</b> Egyptian insurable-wage limits rise every January; Saudi GOSI rates are phasing up through 2028; labour-law summaries still disagree on details. Statutory figures here were verified in 2026 and each chapter lists its sources. Re-check with the authority before quoting a figure to a client.</div>`:''}`;
  v.querySelectorAll('[data-ch]').forEach(b=>b.addEventListener('click',()=>go('chapters',{ch:b.dataset.ch})));
  v.querySelectorAll('[data-go2]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go2, b.dataset.ch2?{ch:b.dataset.ch2}:{})));
}

/* ================= OVERVIEW ================= */
function renderOverview(v){
  const card=d=>{ const pr=progress(d.id), chs=CH.filter(c=>c.domain===d.id);
    const labs=LABS.filter(l=>chDomain(l.ch)===d.id).length;
    const mins=chs.reduce((a,c)=>a+c.minutes,0);
    return `<button class="dcard glass" data-h style="--h:${d.hue}" data-open="${d.id}">
      <div class="dcard-top"><span class="dcard-ico">${icon('domain-'+d.id)}</span><div><div class="dcard-name">${esc(d.name)}</div><div class="dcard-tag">${esc(d.tagline)}</div></div></div>
      <p class="dcard-blurb">${esc(d.blurb)}</p>
      <div class="dcard-stats"><span><b class="num">${chs.length}</b> chapters</span><span><b class="num">${mins}</b> min</span><span><b class="num">${pr.total}</b> terms</span>${labs?`<span><b class="num">${labs}</b> labs</span>`:''}</div>
      <div class="dcard-prog"><div class="bar"><i style="width:${pct(pr.read,pr.chapters)}%"></i></div><span>${pr.read} of ${pr.chapters} chapters read</span></div>
    </button>`; };
  const started=CH.filter(c=>S.read[c.id]);
  v.innerHTML=`<section class="over-hero">
    <div class="eyebrow">Moon Learning</div>
    <h1>Everything I am studying, in one place.</h1>
    <p class="over-lede">Two collections so far. Each is written to be read in order, with interactive labs for the ideas that only make sense once they move, a glossary of the vocabulary, and a drill deck to make it stick. Nothing here is a copied cheat sheet — it is written out, and every chapter says where it came from.</p>
  </section>
  <div class="dgrid">${DOMAINS.map(card).join('')}</div>
  ${started.length?`<div class="over-cont"><div class="eyebrow">Pick up where you left off</div><div class="cont-row">${started.slice(-4).reverse().map(c=>`<button class="cont card" data-h style="--h:${c.hue}" data-jump="${c.id}">${icon(c.id)}<div><b>${esc(c.title)}</b><span>${esc(domById(c.domain).short)} · Ch. ${c.num}</span></div></button>`).join('')}</div></div>`:''}
  <p class="over-foot">Progress, notes and anything you add are kept in this browser. Open a collection above, or press <span class="kbd" data-mod>Ctrl K</span> to search across all of them at once.</p>`;
  v.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>go('home',{dom:b.dataset.open})));
  v.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>{ const c=chById(b.dataset.jump); go('chapters',{dom:c.domain,ch:c.id}); }));
}

/* ================= CHAPTERS ================= */
function renderChapters(v){
  if(route.ch) return renderReader(v, chById(route.ch)||CH[0]);
  const row=c=>`<button class="chrow card" data-h style="--h:${c.hue}" data-ch="${c.id}"><div class="n">${icon(c.id)}<span>${c.num}</span></div><div><h3>${esc(c.title)}</h3><div class="s">${esc(c.sub)}</div></div><div class="m">${S.read[c.id]?'<span class="ok">✓ Read</span>':''}<span>${c.minutes} min</span><span>${c.terms.length} terms</span>${c.labs.length?`<span>${c.labs.length} lab${c.labs.length>1?'s':''}</span>`:''}</div></button>`;
  const group=(track,name,blurb)=>{ const list=CHD().filter(c=>c.track===track); if(!list.length) return '';
    const read=list.filter(c=>S.read[c.id]).length;
    return `<section class="chgroup"><div class="chgroup-head"><span class="sec-k ${track}">${name}</span><p>${blurb}</p><span class="n num">${read} of ${list.length} read · ${list.reduce((a,c)=>a+c.minutes,0)} min</span></div><div class="chlist">${list.map(row).join('')}</div></section>`; };
  v.innerHTML=`<div class="view-head"><div><div class="eyebrow">${CHD().length} chapters · about ${CHD().reduce((a,c)=>a+c.minutes,0)} minutes of reading</div><h1>Chapters</h1><p>Read in order the first time — each chapter assumes the ones before it. After that, jump to whatever the project needs.</p></div></div>
  ${['functional','technical'].map(t=>{const L=domById(dom).tracks[t]; return group(t,L.name,L.blurb);}).join('')}`;
  v.querySelectorAll('[data-ch]').forEach(b=>b.addEventListener('click',()=>go('chapters',{ch:b.dataset.ch})));
}
function renderReader(v,c){
  const sib=CHD(); const i=sib.indexOf(c); const prev=sib[i-1], next=sib[i+1];
  const terms=[...c.terms.map(id=>TERMS[id]).filter(Boolean), ...S.custom.filter(t=>t.ch===c.id)];
  v.innerHTML=`<div class="reader" data-h style="--h:${c.hue}"><article>
    <div class="ch-cover">${c.cover?`<img class="cover-img" src="${c.cover}" alt="">`:coverArt(c.num)}<div class="ch-cover-in"><span class="ch-cover-ico">${icon(c.id)}</span><span class="ch-cover-n num">${String(c.num).padStart(2,'0')}</span></div></div>
    <div class="ch-head"><div class="eyebrow">Chapter ${c.num} of ${sib.length}</div><h1>${esc(c.title)}</h1><p class="sub">${esc(c.sub)}</p><div class="meta"><span>${c.minutes} min read</span><span>·</span><span>${terms.length} key terms</span>${c.labs.length?`<span>·</span><span>${c.labs.length} interactive lab${c.labs.length>1?'s':''}</span>`:''}${speechButton(c)}<label class="toggle" style="margin-left:auto"><input type="checkbox" id="readChk" ${S.read[c.id]?'checked':''}> Mark as read</label></div></div>
    <div class="prose" id="prose">${c.html}</div>
    <section class="keyterms"><h2>Key terms in this chapter</h2><div class="kt">${terms.map(t=>`<div class="row">${knownBtn(t.id)}<div><b>${esc(t.name)}${t.ar?` <span class="ar">${esc(t.ar)}</span>`:''}${t.mine?' <span class="mine">yours</span>':''}</b><span>${esc(t.what)}</span></div></div>`).join('')}</div>
    <div style="margin-top:12px"><button class="btn sm" id="addTermBtn">+ Add a term to this chapter</button><div id="addTermForm"></div></div></section>
    <div class="ch-foot">
      <div class="notes"><span class="eyebrow">My notes on this chapter</span><textarea id="chNote" placeholder="Examples from the client, things the trainer said, questions to chase…">${esc(S.notes[c.id]||'')}</textarea></div>
      <div class="ask-box needs-sample" ${sample?'':'hidden'}><span class="eyebrow">Ask about this chapter</span><input type="text" id="askQ" placeholder="e.g. give me a Saudi example of this, or explain the PSU/TRU split like I'm the client"><div class="ans muted" id="askA">Answers are grounded in this chapter's text.</div></div>
      <div class="ch-nav">${prev?`<button class="btn" data-ch="${prev.id}">← ${esc(prev.title)}</button>`:'<span></span>'}${next?`<button class="btn primary" data-ch="${next.id}">${esc(next.title)} →</button>`:`<button class="btn primary" data-go2="drill">Go to Drill →</button>`}</div>
    </div></article>
    <aside class="reader-toc" id="toc"></aside></div>`;
  // embed labs
  v.querySelectorAll('.lab-embed').forEach(el=>{ const lab=LABS.find(l=>l.id===el.dataset.lab); if(!lab){ el.remove(); return; } el.innerHTML=`<div class="lab card"><div class="lab-head"><span class="eyebrow">Try it</span><h2>${esc(lab.title)}</h2><p>${esc(lab.lead)}</p></div><div class="lab-body"></div></div>`; lab.render(el.querySelector('.lab-body')); });
  // embed figures
  v.querySelectorAll('.fig-embed').forEach(el=>{ const f=FIGS.find(x=>x.id===el.dataset.fig); if(!f){ el.remove(); return; } el.id='fig-'+f.id; el.innerHTML=`<div class="fig-scroll">${f.svg()}</div><figcaption><b>${esc(f.title)}</b>${esc(f.caption)}</figcaption>`; });
  // toc
  const taken=new Set(); const hs=[...v.querySelectorAll('.prose h2')].filter(h=>!h.closest('.sources')&&!h.closest('.lab')); hs.forEach(h=>{ h.id=slugId(h.textContent,taken); });
  $('#toc').innerHTML=`<div class="tt">On this page</div>${hs.map(h=>`<a href="#${h.id}" data-a="${h.id}">${esc(h.textContent)}</a>`).join('')}`;
  $('#toc').querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); document.getElementById(a.dataset.a).scrollIntoView({behavior:'smooth',block:'start'});}));
  const io=new IntersectionObserver(es=>{ es.forEach(en=>{ if(en.isIntersecting){ $('#toc').querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.dataset.a===en.target.id)); } }); },{rootMargin:'-10% 0px -80% 0px'}); hs.forEach(h=>io.observe(h));
  // A deep link like #chapters/hdl/h-load-order lands on that section. Consumed
  // once, so a later re-render (adding a term, say) does not yank the page back.
  if(route.sec){ const target=document.getElementById(route.sec); delete route.sec; if(target) requestAnimationFrame(()=>target.scrollIntoView({block:'start'})); }
  // wiring
  $('#listenBtn')?.addEventListener('click',e=>{ const b=e.currentTarget; if(b.classList.contains('on')){ speechStop(); } else { b.classList.add('on'); speechStart(c); } });
  $('#readChk').addEventListener('change',e=>{ if(e.target.checked) S.read[c.id]=1; else delete S.read[c.id]; save(); toast(e.target.checked?'Chapter marked as read':'Unmarked'); });
  let nt; $('#chNote').addEventListener('input',e=>{ S.notes[c.id]=e.target.value; clearTimeout(nt); nt=setTimeout(save,400); });
  v.querySelectorAll('[data-ch]').forEach(b=>b.addEventListener('click',()=>go('chapters',{ch:b.dataset.ch})));
  v.querySelectorAll('[data-go2]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go2)));
  wireKnown(v);
  $('#addTermBtn').addEventListener('click',()=>{ $('#addTermBtn').hidden=true; $('#addTermForm').innerHTML=`<form class="add-form" id="termForm"><div><label>Term</label><input type="text" name="name" required placeholder="e.g. Rate definition"></div><div><label>Definition</label><textarea name="what" required></textarea></div><div><label>Watch out (optional)</label><textarea name="trap"></textarea></div><div style="display:flex;gap:8px"><button class="btn primary" type="submit">Save term</button><button class="btn ghost" type="button" id="cancelTerm">Cancel</button></div></form>`;
    $('#cancelTerm').addEventListener('click',()=>renderReader(v,c)); $('#termForm').addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(e.target); const name=fd.get('name').trim(); if(!name) return; const id='my-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString(36); S.custom.push({id,ch:c.id,mine:true,name,what:fd.get('what').trim(),trap:fd.get('trap').trim()}); save(); renderReader(v,c); toast('Term added'); }); });
  $('#askQ').addEventListener('keydown',async e=>{ if(e.key!=='Enter'||!e.target.value.trim()||!sample) return; const ans=$('#askA'); ans.textContent='Thinking…'; ans.classList.add('muted');
    try{ const text=$('#prose').innerText.slice(0,9000); const r=await sample(`You are a plain-spoken Oracle HCM Cloud trainer answering a question from a junior functional consultant working in Egypt or the Gulf. Ground the answer in the chapter text below; if the chapter does not cover it, say so and give your best general answer clearly labelled. Under 160 words, concrete, no filler.\n\nCHAPTER: ${c.title}\n${text}\n\nQUESTION: ${e.target.value.trim()}`,{onText:({text})=>{ans.textContent=text;ans.classList.remove('muted');},modelTier:'quick'}); ans.textContent=r.text; ans.classList.remove('muted'); }
    catch(err){ ans.textContent=err&&err.code==='not_granted'?'Asking is not enabled for this view.':'Could not get an answer right now.'; } });
}

/* ================= GLOSSARY ================= */
let glQ='', glCh=null;
function renderGlossary(v){
  const list=domTerms().filter(t=>(!glCh||t.ch===glCh)&&(!glQ||(t.name+' '+t.what+' '+(t.trap||'')+' '+(t.ar||'')+' '+(t.say||'')).toLowerCase().includes(glQ.toLowerCase()))).sort((a,b)=>a.name.localeCompare(b.name));
  let letter=''; const rows=list.map(t=>{ const c=chById(t.ch); const L=t.name[0].toUpperCase(); const head=L!==letter?`<div class="gl-letter">${L}</div>`:''; letter=L; return head+`<div class="gterm card" data-h style="--h:${c?c.hue:210}">${knownBtn(t.id)}<div><b>${esc(t.name)}${t.mine?' <span class="mine">yours</span>':''}</b><div class="d">${esc(t.what)}</div>${t.ar||t.say?`<div class="ar-row">${t.ar?`<span>Arabic <span class="ar">${esc(t.ar)}</span></span>`:''}${t.say?`<span>On the floor <span class="ar">${esc(t.say)}</span></span>`:''}</div>`:''}${t.trap?`<div class="w"><b>Watch out</b> · ${esc(t.trap)}</div>`:''}</div>${c?`<a class="go" href="#chapters/${c.id}" data-ch="${c.id}">Ch. ${c.num} →</a>`:''}${t.mine?`<button class="btn sm ghost" data-del="${t.id}">Delete</button>`:''}</div>`; }).join('');
  v.innerHTML=`<div class="view-head"><div><div class="eyebrow">${domTerms().length} terms · A to Z</div><h1>Glossary</h1><p>One definition per term, the trap that usually comes with it, and the chapter that explains it properly. Tick a term when you can say it out loud without looking.${domTerms().some(t=>t.ar)?' Each HCM term also carries the formal Arabic, and most carry what is actually said on the floor. That is the business vocabulary of a project in Egypt or the Gulf, not Oracle\'s Arabic interface labels, which differ.':''}</p></div></div>
  <div class="gl-top"><input type="search" id="glSearch" placeholder="Search terms…" value="${esc(glQ)}"><div class="chk">${CHD().map(c=>`<label class="${glCh===c.id?'on':''}" data-h style="--h:${c.hue}"><input type="checkbox" hidden data-gc="${c.id}">${c.num}</label>`).join('')}<span class="small muted" style="align-self:center">${glCh?chById(glCh).title:'all chapters'}</span></div></div>
  <div class="gl">${rows||'<div class="empty">No term matches.</div>'}</div>`;
  const si=$('#glSearch'); si.addEventListener('input',()=>{ glQ=si.value; const pos=si.selectionStart; renderGlossary(v); const e=$('#glSearch'); e.focus(); e.setSelectionRange(pos,pos); });
  v.querySelectorAll('[data-gc]').forEach(b=>b.addEventListener('change',()=>{ glCh=glCh===b.dataset.gc?null:b.dataset.gc; renderGlossary(v); }));
  v.querySelectorAll('[data-ch]').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); go('chapters',{ch:a.dataset.ch}); }));
  v.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',()=>{ S.custom=S.custom.filter(t=>t.id!==b.dataset.del); save(); renderGlossary(v); toast('Term removed'); }));
  wireKnown(v);
}

/* ================= LABS ================= */
const LABS=[];
function renderLabs(v){
  const mine=domLabs(); if(!mine.length){ v.innerHTML='<div class="view-head"><div><h1>Labs</h1><p>This collection has no interactive labs yet.</p></div></div>'; return; }
  const cur=mine.some(l=>l.id===route.lab)?route.lab:(mine.some(l=>l.id===S.lastLab)?S.lastLab:mine[0].id); S.lastLab=cur;
  const lab=mine.find(l=>l.id===cur); const c=chById(lab.ch);
  v.innerHTML=`<div class="view-head"><div><div class="eyebrow">${mine.length} interactive labs</div><h1>See it move</h1><p>Each lab is one idea from a chapter you can push on. Click, drag, change the numbers — the aim is to make the shape obvious, not to memorise words.</p></div></div>
  <div class="labs-nav">${mine.map(l=>{const cc=chById(l.ch);return `<button data-h style="--h:${cc.hue}" class="${l.id===lab.id?'active':''}" data-lab="${l.id}">${esc(l.title)}</button>`;}).join('')}</div>
  <div class="lab card" data-h style="--h:${c.hue}"><div class="lab-head"><span class="eyebrow">Chapter ${c.num} · <a href="#chapters/${c.id}" data-ch="${c.id}" style="color:inherit">${esc(c.title)}</a></span><h2>${esc(lab.title)}</h2><p>${esc(lab.lead)}</p></div><div class="lab-body" id="labBody"></div></div>`;
  v.querySelectorAll('[data-lab]').forEach(b=>b.addEventListener('click',()=>go('labs',{lab:b.dataset.lab})));
  v.querySelectorAll('[data-ch]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();go('chapters',{ch:a.dataset.ch});}));
  lab.render($('#labBody'));
}
/* @include labs.js */

/* ================= DRILL ================= */
const D={mode:'questions',ch:null,queue:[],idx:0,flipped:false,rebuild:true};
function buildCards(){
  let cards=[];
  if(D.mode==='terms') cards=domTerms().filter(t=>!D.ch||t.ch===D.ch).map(t=>({id:'t:'+t.id,q:t.name,ch:t.ch,back:[{lb:'Definition',tx:t.what},t.trap?{lb:'Watch out',tx:t.trap,warn:true}:null].filter(Boolean)}));
  else if(D.mode==='questions') cards=DATA.questions.filter(q=>chDomain(q.ch)===dom&&(!D.ch||q.ch===D.ch)).map((q,i)=>({id:'q:'+DATA.questions.indexOf(q),q:q.q,ch:q.ch,back:[{lb:'Model answer',tx:q.a},...q.terms.map(id=>TERMS[id]).filter(Boolean).slice(0,2).map(t=>({lb:t.name,tx:t.what}))]}));
  else cards=S.customQ.filter(q=>chDomain(q.ch)===dom).map(q=>({id:'c:'+q.id,q:q.q,ch:q.ch,back:[{lb:'Your answer',tx:q.a}],mine:true}));
  const m=c=>S.drill[c.id]||0, rnd=()=>Math.random()-.5;
  return [...cards.filter(c=>m(c)===0).sort(rnd),...cards.filter(c=>m(c)===1).sort(rnd),...cards.filter(c=>m(c)===2).sort(rnd)];
}
function renderDrill(v){
  if(D.rebuild){ D.queue=buildCards(); D.idx=0; D.flipped=false; D.rebuild=false; }
  const pr=progress(); const c=D.queue[D.idx]; const ch=c?chById(c.ch):CH[0]; const counts={0:0,1:0,2:0}; D.queue.forEach(x=>counts[S.drill[x.id]||0]++);
  v.innerHTML=`<div class="view-head"><div><div class="eyebrow">Retrieval practice · out loud, not in your head</div><h1>Drill</h1><p>Read the front, answer aloud in a sentence or two, flip, then grade yourself honestly. Missed cards come back first. "Solid" means it was said fluently twice.</p></div></div>
  <div class="drill-top"><div class="seg">${[['questions','Questions'],['terms','Terms'],['mine','Mine']].map(([k,l])=>`<button class="${D.mode===k?'active':''}" data-mode="${k}">${l}</button>`).join('')}</div>
  <div class="chk">${CHD().map(x=>`<label class="${D.ch===x.id?'on':''}" data-h style="--h:${x.hue}"><input type="checkbox" hidden data-pf="${x.id}">${x.num}</label>`).join('')}<span class="small muted" style="align-self:center">${D.ch?chById(D.ch).title:'all chapters'}</span></div>
  <button class="btn sm ghost" id="shuffle" style="margin-left:auto">Reshuffle</button></div>
  ${!c?`<div class="empty">${D.mode==='mine'?'No questions of your own yet. Add one below.':'No cards match this filter.'}</div>`:`
  <div class="fc-wrap"><div>
    <div class="fc ${D.flipped?'flipped':''}" id="fc" data-h style="--h:${ch.hue}"><div class="fc-inner">
      <div class="face front"><div class="meta"><span class="chip">Ch. ${ch.num} · ${esc(ch.title)}</span>${c.mine?'<span class="mine">yours</span>':''}<span style="margin-left:auto" class="num">${D.idx+1} / ${D.queue.length}</span></div><div class="q">${esc(c.q)}</div><div class="hint">Say it out loud · click to flip · <span class="kbd">space</span></div></div>
      <div class="face back"><div class="meta"><span class="chip p">Answer</span></div><div class="a">${c.back.map(x=>`<div><div class="lb" ${x.warn?'style="color:var(--gold)"':''}>${esc(x.lb)}</div><div>${esc(x.tx)}</div></div>`).join('')}</div></div>
    </div></div>
    <div class="grade" style="margin-top:12px"><button class="btn no" data-g="0">Not yet</button><button class="btn" id="flipBtn">${D.flipped?'Show front':'Flip'}</button><button class="btn yes" data-g="1">Got it</button></div>
    <div class="selfans card needs-sample" style="padding:14px;margin-top:14px" ${sample?'':'hidden'}><span class="eyebrow">Type an answer and have it checked</span><textarea id="selfA" placeholder="One or two sentences, the way it would be said in an interview…"></textarea><div style="display:flex;gap:8px;align-items:center"><button class="btn sm primary" id="checkA">Check my answer</button><span class="small muted">Graded against the model answer, not the internet.</span></div><div class="feedback" id="fb" hidden></div></div>
  </div>
  <aside class="drill-side"><div class="card" style="padding:14px"><div class="eyebrow" style="margin-bottom:8px">This deck</div><div class="mastery"><div class="m0"><div class="big num">${counts[0]}</div><div class="lbl">new</div></div><div class="m1"><div class="big num">${counts[1]}</div><div class="lbl">shaky</div></div><div class="m2"><div class="big num">${counts[2]}</div><div class="lbl">solid</div></div></div><div class="sbar" style="margin-top:10px"><i class="s2" style="width:${pct(counts[2],D.queue.length)}%"></i><i class="s1" style="width:${pct(counts[1],D.queue.length)}%"></i><i class="s0" style="width:${pct(counts[0],D.queue.length)}%"></i></div></div>
   <div class="card" style="padding:14px"><div class="eyebrow" style="margin-bottom:6px">All cards</div><div class="small">${pr.solid} solid · ${pr.shaky} shaky · ${pr.cards-pr.solid-pr.shaky} new</div></div>
   <div class="card" style="padding:14px;font-size:14px;color:var(--ink-2)"><b style="color:var(--ink)">The rule.</b> For every card that is not fluent, go back to that one section of the chapter — not the whole chapter.</div>
  </aside></div>`}
  <div style="margin-top:22px"><button class="btn sm" id="addQBtn">+ Add your own question</button><div id="addQForm"></div></div>`;
  v.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{D.mode=b.dataset.mode;D.rebuild=true;renderDrill(v);}));
  v.querySelectorAll('[data-pf]').forEach(b=>b.addEventListener('change',()=>{ D.ch=D.ch===b.dataset.pf?null:b.dataset.pf; D.rebuild=true; renderDrill(v); }));
  $('#shuffle').addEventListener('click',()=>{D.rebuild=true;renderDrill(v);});
  const flip=()=>{ D.flipped=!D.flipped; $('#fc')?.classList.toggle('flipped',D.flipped); const fb=$('#flipBtn'); if(fb) fb.textContent=D.flipped?'Show front':'Flip'; };
  $('#fc')?.addEventListener('click',flip); $('#flipBtn')?.addEventListener('click',flip);
  v.querySelectorAll('[data-g]').forEach(b=>b.addEventListener('click',()=>{ const m=S.drill[c.id]||0; S.drill[c.id]=b.dataset.g==='1'?Math.min(2,m+1):0; save(); D.idx=(D.idx+1)%D.queue.length; D.flipped=false; if(D.idx===0){ D.rebuild=true; toast('Deck finished — reshuffled, misses first'); } renderDrill(v); }));
  $('#checkA')?.addEventListener('click',async()=>{ const ta=$('#selfA'); if(!ta.value.trim()||!sample) return; const fb=$('#fb'); fb.hidden=false; fb.textContent='Checking…';
    try{ const r=await sample(`You are a strict but fair Oracle HCM trainer checking a junior consultant's spoken-style answer. Grade it against ONLY the reference below. Format:\nVerdict: Solid / Nearly / Missing the point\nRight: one line\nMissing or wrong: one or two concrete lines\nSay it like this: one crisp interview-ready sentence.\nUnder 120 words. No praise padding.\n\nQUESTION: ${c.q}\n\nREFERENCE:\n${c.back.map(x=>x.lb+': '+x.tx).join('\n\n')}\n\nCANDIDATE ANSWER: ${ta.value.trim()}`,{onText:({text})=>{fb.textContent=text;},modelTier:'quick'}); fb.textContent=r.text; }
    catch(err){ fb.textContent=err&&err.code==='not_granted'?'Checking is not enabled for this view.':'Could not check right now.'; } });
  $('#addQBtn').addEventListener('click',()=>{ $('#addQBtn').hidden=true; $('#addQForm').innerHTML=`<form class="add-form" id="qForm"><div><label>Question</label><input type="text" name="q" required placeholder="e.g. What does a TRU reference that a PSU does not?"></div><div><label>Answer (in your own words)</label><textarea name="a" required></textarea></div><div><label>Chapter</label><select name="ch">${CHD().map(x=>`<option value="${x.id}">${x.num} · ${esc(x.title)}</option>`).join('')}</select></div><div style="display:flex;gap:8px"><button class="btn primary" type="submit">Save question</button><button class="btn ghost" type="button" id="qCancel">Cancel</button></div></form>`;
    $('#qCancel').addEventListener('click',()=>renderDrill(v)); $('#qForm').addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(e.target); S.customQ.push({id:Date.now().toString(36),q:fd.get('q').trim(),a:fd.get('a').trim(),ch:fd.get('ch')}); save(); D.mode='mine'; D.rebuild=true; renderDrill(v); toast('Question added'); }); });
}
document.addEventListener('keydown',e=>{ if(route.view!=='drill'||e.target.matches('input,textarea')) return; if(e.key===' '){ e.preventDefault(); $('#flipBtn')?.click(); } if(e.key==='ArrowRight') document.querySelector('[data-g="1"]')?.click(); if(e.key==='ArrowLeft') document.querySelector('[data-g="0"]')?.click(); });

/* ================= ABOUT ================= */
const ABOUT_SOURCES = {
  hcm: `<h2>Where this collection comes from</h2>
  <p>Product behaviour follows Oracle's own documentation — <em>Implementing Global Human Resources</em>, <em>Implementing Absence Management</em>, <em>Administering Global Payroll</em>, <em>Securing HCM</em> and the HCM Data Loader guides — with practitioner write-ups where Oracle's text is terse. Egyptian statutory figures were checked against PwC Worldwide Tax Summaries, Deloitte and Mercans statutory alerts, and the EY, Andersen and Amereller summaries of Labour Law No. 14 of 2025. Saudi figures follow GOSI's published rates and the Mudad and WPS employer guides. Every chapter lists what it used.</p>
  <h2>What to distrust</h2>
  <p>The statutory numbers. Egyptian insurable-wage limits rise every January under a fixed schedule; Saudi GOSI rates are phasing up through 2028; the notice period under Law 14/2025 is still summarised differently by different firms. The figures here were verified in 2026. Before configuring or quoting one, verify it against the authority itself — NOSI, the Egyptian Tax Authority, GOSI, the Ministry of Human Resources — or the client's legal counsel. A consultant who says "I would confirm this against the statute" is giving a strong answer, not a weak one.</p>`,
  analytics: `<h2>Where this collection comes from</h2>
  <p>Syntax and behaviour follow the vendors' own references — Microsoft Learn for T-SQL, Power BI, DAX and Excel, and the PostgreSQL manual where the standard and the dialects differ. Where a chapter states an opinion rather than a fact — which join to reach for, when a measure beats a calculated column, when a spreadsheet is genuinely the right answer — it says so in those words.</p>
  <h2>What to distrust</h2>
  <p>Anything dialect-specific. SQL is a standard that no two engines implement identically, and a query that runs in T-SQL may not in PostgreSQL or BigQuery. Where the chapters use a dialect they name it. Power BI ships monthly, so a menu path is the detail most likely to be stale; the concepts underneath move far more slowly than the interface does.</p>`,
};

function renderAbout(v){
  const d=domById(dom);
  v.innerHTML=`<div class="view-head"><div><div class="eyebrow">About</div><h1>What Moon Learning is, and how it is kept honest</h1></div></div>
  <div class="about">
  <p>Moon Learning is where I write up what I am studying, properly, instead of leaving it in scattered notes. Each collection covers one subject; right now there are ${DOMAINS.length} — ${DOMAINS.map(x=>esc(x.name)).join(' and ')}. The test of whether I understand something is whether I can write it out so that it teaches, so that is the form everything takes.</p>
  <h2>How a collection is organised</h2>
  <p><strong>Chapters</strong> are written to be read, in order the first time. Each one ends with the mistakes beginners actually make and the sources it was checked against. <strong>Labs</strong> are the same ideas made movable: things to click, drag and push numbers through, for the concepts that only land once you see them change. <strong>Figures</strong> are the ones that are better looked at than listened to — diagrams drawn into the text where it explains a shape. The <strong>Glossary</strong> is one definition per term with the trap attached, and on the HCM side it is bilingual: the formal Arabic term and, for most of them, what people actually say on a project — workshop and payroll-team vocabulary, not Oracle's Arabic interface labels, which differ. <strong>Drill</strong> is retrieval practice: answer out loud, flip, grade yourself honestly, and missed cards come back first.</p>
  <h2>Reading and listening</h2>
  <p>Every chapter has a <strong>Listen</strong> control that reads it aloud using your browser's own speech engine — no account, no network, and it works offline. It reads paragraph by paragraph and highlights where it is, so you can follow along or put the phone down. The voices are whatever your operating system provides, which is why the quality varies between machines; pick a different one from the bar at the bottom if the default grates.</p>
  ${ABOUT_SOURCES[dom]||''}
  <h2>Adding to it</h2>
  <p>You can add your own terms from any chapter and your own drill questions from the Drill deck; they are kept with your progress in this browser. The site itself is a single HTML file. Chapters are written as Markdown and compiled in, and the build refuses to run if a chapter references a term, lab or figure that does not exist — so a broken cross-reference never ships. New knowledge is meant to arrive as a chapter with its own sources, not as loose notes.</p>
  <h2>Design</h2>
  <p>Navy and gold, a serif for reading and a grotesque for the interface, and one colour per chapter carried through its labs, glossary terms and drill cards so the colour becomes a memory cue. The collections carry their own accent in the bar at the top. Light and dark are both designed rather than inverted, wide diagrams scroll inside their own frame so the page never scrolls sideways, and a chapter prints as a clean document if you would rather read it on paper.</p>
  <p class="about-foot">Currently ${CH.length} chapters across ${DOMAINS.length} collections · ${allTerms().length} glossary terms · ${LABS.length} labs · ${FIGS.length} figures · ${DATA.questions.length} drill questions.</p>
  </div>`;
}

/* @include speech.js */

/* @include icons.js */

/* @include figures.js */

/* @include search.js */

/* ---------- boot ---------- */
route=parseHash(); lastHash=location.hash.slice(1); render();
