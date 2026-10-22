/* =====================================================================
   SPEECH — read a chapter aloud.
   ---------------------------------------------------------------------
   Uses the browser's own SpeechSynthesis, so there is no API key, no
   network call and nothing to pay for; the voices are whatever the
   reader's operating system ships. That is also the limitation: voice
   quality varies wildly between machines, and on some Linux builds there
   are no voices at all — the control simply does not appear there.

   Reads paragraph by paragraph rather than in one long utterance, so the
   current paragraph can be highlighted, progress is meaningful, and a
   long chapter does not hit the per-utterance length limits some engines
   impose. Labs, figures and the sources list are skipped: they are to be
   looked at, not listened to.
   ===================================================================== */

const SPEECH_OK = typeof window !== 'undefined' && 'speechSynthesis' in window;
const SP = { chunks: [], at: -1, playing: false, voice: null, rate: 1, title: '' };

/* Voices arrive asynchronously on most browsers. */
let VOICES = [];
function loadVoices() {
  if (!SPEECH_OK) return;
  VOICES = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
  if (!VOICES.length) VOICES = speechSynthesis.getVoices();
  const sel = $('#sbVoice');
  if (!sel || !VOICES.length) return;
  const want = S.voice || '';
  sel.innerHTML = VOICES.map(v => `<option value="${esc(v.name)}">${esc(v.name.replace(/\s*\(.*\)$/, ''))}</option>`).join('');
  const match = VOICES.find(v => v.name === want);
  if (match) sel.value = match.name;
  SP.voice = match || VOICES.find(v => v.default) || VOICES[0];
}
if (SPEECH_OK) {
  speechSynthesis.addEventListener('voiceschanged', loadVoices);
  loadVoices();
}

/* The readable body of the chapter, in order, as [element, text] pairs. */
function speechChunks(root) {
  const out = [];
  root.querySelectorAll('h2, p, li, blockquote').forEach(el => {
    if (el.closest('.sources') || el.closest('.lab') || el.closest('.fig-embed')) return;
    if (el.querySelector('p, li')) return;                 // container, not a leaf
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    if (text.length < 2) return;
    out.push({ el, text: el.tagName === 'H2' ? text + '.' : text });
  });
  return out;
}

function speechButton(c) {
  if (!SPEECH_OK) return '';
  return `<button class="listen" id="listenBtn" aria-label="Read this chapter aloud">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 010 7"/><path d="M19 6a8.5 8.5 0 010 12"/></svg>
    <span>Listen</span><span class="listen-min">${chMins(c)} min</span></button>`;
}

function speechStart(c) {
  const prose = $('#prose');
  if (!SPEECH_OK || !prose) return;
  SP.chunks = speechChunks(prose);
  if (!SP.chunks.length) return;
  SP.title = c.title; SP.at = -1; SP.playing = true;
  SP.rate = parseFloat(S.rate || 1) || 1;
  const bar = $('#speechBar');
  bar.hidden = false;
  $('#sbTitle').textContent = c.title;
  $('#sbRate').value = String(SP.rate);
  speechNext();
}

function speechNext() {
  SP.at += 1;
  if (SP.at >= SP.chunks.length) return speechStop(true);
  speechPaint();
  const chunk = SP.chunks[SP.at];
  const u = new SpeechSynthesisUtterance(chunk.text);
  if (SP.voice) u.voice = SP.voice;
  u.rate = SP.rate;
  u.onend = () => { if (SP.playing) speechNext(); };
  u.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled') speechStop(); };
  speechSynthesis.speak(u);
}

function speechPaint() {
  SP.chunks.forEach((c, i) => c.el.classList.toggle('speaking', i === SP.at));
  const cur = SP.chunks[SP.at];
  if (cur) {
    const box = cur.el.getBoundingClientRect();
    if (box.top < 90 || box.bottom > window.innerHeight - 120) cur.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  const done = SP.at + 1;
  $('#sbPos').textContent = `${done} of ${SP.chunks.length}`;
  $('#sbFill').style.width = pct(done, SP.chunks.length) + '%';
  const play = $('#sbPlay');
  if (play) { play.classList.toggle('paused', !SP.playing); play.setAttribute('aria-label', SP.playing ? 'Pause' : 'Play'); }
}

function speechPause() {
  if (!SP.playing) return;
  SP.playing = false; speechSynthesis.pause(); speechPaint();
}
function speechResume() {
  if (SP.playing || !SP.chunks.length) return;
  SP.playing = true; speechSynthesis.resume(); speechPaint();
}

/* `finished` distinguishes reaching the end from being cut off. */
function speechStop(finished) {
  if (!SPEECH_OK) return;
  speechSynthesis.cancel();
  SP.chunks.forEach(c => c.el.classList.remove('speaking'));
  SP.chunks = []; SP.at = -1; SP.playing = false;
  const bar = $('#speechBar');
  if (bar) bar.hidden = true;
  const btn = $('#listenBtn');
  if (btn) btn.classList.remove('on');
  if (finished) toast('Finished reading');
}

function speechJump(fraction) {
  if (!SP.chunks.length) return;
  speechSynthesis.cancel();
  SP.at = Math.max(-1, Math.min(SP.chunks.length - 1, Math.round(fraction * SP.chunks.length) - 1));
  SP.playing = true;
  speechNext();
}

/* ---------- wiring (the bar lives in the shell, so wire it once) ---------- */
if (SPEECH_OK) {
  $('#sbPlay').addEventListener('click', () => (SP.playing ? speechPause() : speechResume()));
  $('#sbStop').addEventListener('click', () => speechStop());
  $('#sbRate').addEventListener('change', e => {
    SP.rate = parseFloat(e.target.value) || 1; S.rate = SP.rate; save();
    if (SP.chunks.length) { const at = SP.at; speechSynthesis.cancel(); SP.at = at - 1; SP.playing = true; speechNext(); }
  });
  $('#sbVoice').addEventListener('change', e => {
    SP.voice = VOICES.find(v => v.name === e.target.value) || SP.voice;
    S.voice = e.target.value; save();
    if (SP.chunks.length) { const at = SP.at; speechSynthesis.cancel(); SP.at = at - 1; SP.playing = true; speechNext(); }
  });
  $('#sbTrack').addEventListener('click', e => {
    const box = e.currentTarget.getBoundingClientRect();
    speechJump((e.clientX - box.left) / box.width);
  });
  // Chrome stops speaking if the tab is hidden for a while; keep state honest.
  document.addEventListener('visibilitychange', () => { if (document.hidden && SP.playing) speechPause(); });
  window.addEventListener('beforeunload', () => speechSynthesis.cancel());
}
