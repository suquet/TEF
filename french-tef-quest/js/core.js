/* TEF Quest core: state, XP, quests, badges, audio (TTS), speech recognition, helpers, router. */
(function () {
  'use strict';
  const TEF = (window.TEF = window.TEF || {});
  const V = (TEF.V = {});
  const ACT = (TEF.ACT = {});
  const IN = (TEF.IN = {});

  /* ---------- storage (falls back to memory when blocked) ---------- */
  const KEY = 'tefquest.v1';
  let memStore = null;
  const DEFAULTS = () => ({
    v: 1, xp: 0, streak: 0, best: 0, lastDay: '', days: {}, srs: {}, drafts: {},
    done: { read: {}, listen: {}, speak: {}, write: {}, dict: {} },
    stats: { quizOk: 0, quizAll: 0, words: 0, writeWords: 0, boss: 0, games: 0, qc: 0, shadow: 0, nums: 0 },
    badges: {},
    settings: { help: 'off', rate: 1, voice: '', exam: '', goal: 100, theme: 'dark', sfx: true, name: '', once: false }
  });
  function merge(d, o) {
    if (!o || typeof o !== 'object') return d;
    for (const k in o) {
      if (o[k] && typeof o[k] === 'object' && !Array.isArray(o[k]) && d[k] && typeof d[k] === 'object') d[k] = merge(d[k], o[k]);
      else d[k] = o[k];
    }
    return d;
  }
  function loadRaw() {
    try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) { /* blocked */ }
    try { return memStore ? JSON.parse(memStore) : null; } catch (e) { return null; }
  }
  const S = (TEF.S = merge(DEFAULTS(), loadRaw()));
  function save() {
    const raw = JSON.stringify(S);
    try { localStorage.setItem(KEY, raw); } catch (e) { memStore = raw; }
  }
  function resetAll() {
    Object.keys(S).forEach(k => delete S[k]);
    Object.assign(S, DEFAULTS());
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    memStore = null;
  }
  function importAll(obj) {
    const fresh = merge(DEFAULTS(), obj);
    Object.keys(S).forEach(k => delete S[k]);
    Object.assign(S, fresh);
    save();
  }

  /* ---------- helpers ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const dkey = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const dayIndex = (d = new Date()) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return dkey(d); };
  const day = (k = dkey()) => S.days[k] || (S.days[k] = { xp: 0, q: {}, nw: 0, streak: false });
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const short = s => String(s).split(/[,;(]/)[0].trim();
  function toks(s, keepAccents) {
    s = String(s).toLowerCase().replace(/[’']/g, ' ');
    if (!keepAccents) s = strip(s);
    return s.replace(/[^a-z0-9àâäçéèêëîïôöùûüÿœæ ]/g, ' ').split(/\s+/).filter(Boolean);
  }
  function compare(target, said, keepAccents) {
    const a = toks(target, keepAccents), b = toks(said, keepAccents);
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    const ok = new Set();
    let i = n, j = m;
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) { ok.add(i - 1); i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
    }
    return { pct: n ? ok.size / n : 0, marks: a.map((w, k) => ({ w, ok: ok.has(k) })) };
  }
  function marksHtml(marks) { return marks.map(m => `<span class="${m.ok ? 'w-ok' : 'w-bad'}">${esc(m.w)}</span>`).join(' '); }

  /* French numbers 0-999 */
  const U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  function fr99(n) {
    if (n < 20) return U[n];
    const T = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
    if (n < 70) { const t = Math.floor(n / 10), u = n % 10; return T[t] + (u === 1 ? ' et un' : u ? '-' + U[u] : ''); }
    if (n < 80) { const u = n - 60; return 'soixante' + (u === 11 ? ' et onze' : '-' + U[u]); }
    const u = n - 80; return u === 0 ? 'quatre-vingts' : 'quatre-vingt-' + U[u];
  }
  function frNum(n) {
    if (n < 100) return fr99(n);
    const h = Math.floor(n / 100), r = n % 100;
    const s = h === 1 ? 'cent' : U[h] + ' cent' + (r === 0 ? 's' : '');
    return r ? s + ' ' + fr99(r) : s;
  }

  /* ---------- icons ---------- */
  const ICONS = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    cards: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    ear: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    vol: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    back: '<polyline points="15 18 9 12 15 6"/>',
    play: '<polygon points="5 3 19 12 5 21 5 3"/>',
    stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
    ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    swords: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
  };
  const icon = (n, s = 22) => `<svg class="i" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  /* ---------- toasts, sfx, confetti ---------- */
  function toast(msg, kind) {
    const box = document.getElementById('toasts');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.textContent = msg;
    box.appendChild(t);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2200);
  }
  let ac = null;
  function tone(f, d = 0.12, t = 0, type = 'sine', v = 0.05) {
    if (!S.settings.sfx) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(v, ac.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t + d);
      o.connect(g); g.connect(ac.destination);
      o.start(ac.currentTime + t); o.stop(ac.currentTime + t + d + 0.02);
    } catch (e) { /* no audio */ }
  }
  function sfx(k) {
    const m = {
      ok: () => { tone(660, .1); tone(880, .14, .08); },
      bad: () => tone(200, .22, 0, 'sawtooth', .035),
      quest: () => { tone(523, .1); tone(659, .1, .09); tone(784, .18, .18); },
      level: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .16, i * .1)),
      tap: () => tone(440, .03, 0, 'square', .015)
    };
    (m[k] || (() => { }))();
    if (k === 'ok' && navigator.vibrate) { try { navigator.vibrate(12); } catch (e) { /* ignore */ } }
  }
  function confetti() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cols = ['#4D94FF', '#FF8A1F', '#9CC4FF', '#FFC27A', '#ffffff'];
    const wrap = document.createElement('div');
    wrap.className = 'confetti';
    for (let i = 0; i < 38; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = cols[i % cols.length];
      p.style.animationDelay = Math.random() * 0.4 + 's';
      p.style.animationDuration = 1.4 + Math.random() * 1.2 + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 3200);
  }

  /* ---------- XP, level, streak, quests, badges ---------- */
  const LEVELS = ['Boot', 'Bit', 'Byte', 'Pixel', 'Kernel', 'Daemon', 'Compiler', 'Cyber', 'Quantum', 'Neural', 'Mainframe', 'Singularité'];
  function levelInfo(xp = S.xp) {
    const L = 1 + Math.floor(Math.sqrt(xp / 60));
    const lo = 60 * (L - 1) ** 2, hi = 60 * L ** 2;
    return { L, name: LEVELS[Math.min(L - 1, LEVELS.length - 1)], lo, hi, pct: (xp - lo) / (hi - lo) };
  }
  function curStreak() {
    if (!S.lastDay) return 0;
    const y = new Date(); y.setDate(y.getDate() - 1);
    return (S.lastDay === dkey() || S.lastDay === dkey(y)) ? S.streak : 0;
  }
  function streakCheck() {
    const d = day();
    if (d.streak || d.xp < 20) return;
    d.streak = true;
    const y = new Date(); y.setDate(y.getDate() - 1);
    if (S.lastDay === dkey(y)) S.streak++;
    else if (S.lastDay !== dkey()) S.streak = 1;
    S.lastDay = dkey();
    S.best = Math.max(S.best, S.streak);
    if (S.streak > 1) toast('🔥 ' + S.streak + '-day streak', 'lvl');
  }
  function addXP(n, why) {
    if (!n) return;
    const before = levelInfo().L;
    S.xp += n; day().xp += n;
    streakCheck(); save();
    toast('+' + n + ' XP' + (why ? ' · ' + why : ''), 'xp');
    const after = levelInfo();
    if (after.L > before) { sfx('level'); confetti(); toast('Level up → ' + after.L + ' · ' + after.name, 'lvl'); }
    checkBadges(); updateHeader();
  }
  const QUESTS = [
    { id: 'words', ico: 'cards', t: 'Learn 5 new words', s: 'Flashcards with spaced repetition', xp: 30 },
    { id: 'read', ico: 'book', t: "Read today's story", s: 'Then answer 2 questions', xp: 30 },
    { id: 'listen', ico: 'ear', t: 'Finish a listening drill', s: 'Audio plays like the real exam', xp: 30 },
    { id: 'speak', ico: 'mic', t: 'Complete a speaking mission', s: 'Talk it out loud', xp: 40 },
    { id: 'write', ico: 'pen', t: 'Write a TEF-style text', s: 'Reach the word target', xp: 40 },
    { id: 'boss', ico: 'swords', t: 'Beat the daily boss', s: '10 questions, 3 lives', xp: 60 }
  ];
  function doQuest(id) {
    const q = QUESTS.find(x => x.id === id), d = day();
    if (!q || d.q[id]) return false;
    d.q[id] = 1; save();
    addXP(q.xp, q.t); sfx('quest');
    if (QUESTS.every(x => d.q[x.id]) && !d.champ) { d.champ = 1; addXP(50, 'Daily champion'); confetti(); }
    return true;
  }
  const BADGES = [
    { id: 'first', i: '⚡', n: 'First boot', d: 'Earn your first XP', t: s => s.xp > 0 },
    { id: 's3', i: '🔥', n: '3-day streak', d: 'Study 3 days in a row', t: s => s.best >= 3 },
    { id: 's7', i: '🔥', n: '7-day streak', d: 'A full week', t: s => s.best >= 7 },
    { id: 's30', i: '🏆', n: '30-day streak', d: 'A whole month', t: s => s.best >= 30 },
    { id: 'w20', i: '🧠', n: '20 words', d: 'Learn 20 words', t: s => s.stats.words >= 20 },
    { id: 'wall', i: '📚', n: 'Full dictionary', d: 'Learn every word', t: s => s.stats.words >= TEF.words.length },
    { id: 'q20', i: '🎯', n: 'Sharpshooter', d: '20 quiz answers right', t: s => s.stats.quizOk >= 20 },
    { id: 'read4', i: '📰', n: 'Reader', d: 'Read 4 stories', t: s => Object.keys(s.done.read).length >= 4 },
    { id: 'listen3', i: '🎧', n: 'Good ear', d: 'Finish 3 listening drills', t: s => Object.keys(s.done.listen).length >= 3 },
    { id: 'speak3', i: '🎤', n: 'Talkative', d: 'Complete 3 missions', t: s => Object.keys(s.done.speak).length >= 3 },
    { id: 'write2', i: '✍️', n: 'Wordsmith', d: 'Finish 2 writing tasks', t: s => Object.keys(s.done.write).length >= 2 },
    { id: 'boss', i: '👾', n: 'Boss slayer', d: 'Beat a boss', t: s => s.stats.boss >= 1 },
    { id: 'qc', i: '🍁', n: 'Québec curious', d: 'Open the Québec corner', t: s => s.stats.qc >= 1 },
    { id: 'lvl5', i: '🚀', n: 'Level 5', d: 'Reach level 5', t: s => levelInfo(s.xp).L >= 5 }
  ];
  function checkBadges() {
    BADGES.forEach(b => {
      if (!S.badges[b.id] && b.t(S)) { S.badges[b.id] = dkey(); save(); sfx('quest'); toast(b.i + ' Badge: ' + b.n, 'lvl'); }
    });
  }
  function updateHeader() {
    const a = document.getElementById('hStreak'), b = document.getElementById('hLvl');
    if (a) a.textContent = curStreak();
    if (b) b.textContent = 'Lv ' + levelInfo().L;
  }

  /* ---------- text to speech ---------- */
  let VOICES = [], seqToken = 0;
  function loadVoices() { try { VOICES = (speechSynthesis.getVoices() || []).filter(v => /^fr/i.test(v.lang)); } catch (e) { /* none */ } }
  if ('speechSynthesis' in window) { loadVoices(); try { speechSynthesis.onvoiceschanged = () => { loadVoices(); if (location.hash === '#/settings') rerender(); }; } catch (e) { /* ignore */ } }
  function voiceList() {
    const pref = VOICES.filter(v => v.name === S.settings.voice);
    const ca = VOICES.filter(v => /fr[-_]CA/i.test(v.lang) && v.name !== S.settings.voice);
    const rest = VOICES.filter(v => !/fr[-_]CA/i.test(v.lang) && v.name !== S.settings.voice);
    return pref.concat(ca, rest);
  }
  function speak(text, o) {
    o = o || {};
    if (!('speechSynthesis' in window)) { toast('Audio is not supported in this browser', 'bad'); if (o.onend) o.onend(); return; }
    try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-CA';
    const list = voiceList();
    const v = list.length ? list[(o.voice || 0) % list.length] : null;
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = o.rate || S.settings.rate || 1;
    u.pitch = o.pitch || 1;
    u.onend = () => { if (o.onend) o.onend(); };
    u.onerror = e => { if (e && (e.error === 'interrupted' || e.error === 'canceled')) return; if (o.onend) o.onend(); };
    try { speechSynthesis.speak(u); } catch (e) { if (o.onend) o.onend(); }
  }
  function stopSpeak() { seqToken++; try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
  function speakSeq(items, done, rate) {
    const tok = ++seqToken;
    let i = 0;
    (function next() {
      if (tok !== seqToken) return;
      if (i >= items.length) { if (done) done(); return; }
      const it = items[i++];
      if (it.on) it.on();
      speak(it.t, { voice: it.voice || 0, pitch: it.pitch || 1, rate: rate || it.rate, onend: () => { if (tok === seqToken) setTimeout(next, 280); } });
    })();
  }

  /* ---------- speech recognition ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  const canListen = () => !!SR;
  function stopListen() { try { rec && rec.stop(); } catch (e) { /* ignore */ } rec = null; }
  function listenOnce(cb) {
    if (!SR) { cb({ error: 'unsupported' }); return false; }
    stopSpeak(); stopListen();
    let last = '', ended = false;
    const r = (rec = new SR());
    r.lang = 'fr-CA'; r.interimResults = true; r.maxAlternatives = 1; r.continuous = false;
    r.onresult = e => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; last = t; cb({ text: t }); };
    r.onerror = e => cb({ error: (e && e.error) || 'error' });
    r.onend = () => { if (ended) return; ended = true; cb({ end: true, text: last }); };
    try { r.start(); } catch (e) { cb({ error: 'start-failed' }); return false; }
    return true;
  }

  /* ---------- reusable UI pieces ---------- */
  function trBox(en, es) {
    return `<div class="tr" data-en="${esc(en)}" data-es="${esc(es)}"><div class="tr-btns"><button class="tb" data-act="tr" data-l="en" aria-pressed="false">EN</button><button class="tb" data-act="tr" data-l="es" aria-pressed="false">ES</button></div><div class="tr-out" hidden></div></div>`;
  }
  ACT.tr = el => {
    const box = el.closest('.tr'), l = el.dataset.l, out = box.querySelector('.tr-out');
    const btns = box.querySelectorAll('.tb');
    if (box.dataset.cur === l) { out.hidden = true; box.dataset.cur = ''; btns.forEach(b => b.setAttribute('aria-pressed', 'false')); return; }
    out.hidden = false; box.dataset.cur = l;
    out.innerHTML = '<b>' + l.toUpperCase() + '</b> ' + esc(box.dataset[l]);
    btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.l === l)));
  };
  function applyAuto(root) {
    const l = S.settings.help;
    if (l !== 'en' && l !== 'es') return;
    root.querySelectorAll('.tr').forEach(b => { const btn = b.querySelector('.tb[data-l="' + l + '"]'); if (btn && !b.dataset.cur) ACT.tr(btn); });
  }
  const sayBtn = (text, rate, cls) => `<button class="ico-btn ${cls || ''}" data-act="say" data-t="${esc(text)}" ${rate ? 'data-r="' + rate + '"' : ''} aria-label="Listen">${icon('vol', 20)}</button>`;
  ACT.say = el => { speak(el.dataset.t, { rate: el.dataset.r ? parseFloat(el.dataset.r) : undefined }); };
  const back = (href, label) => `<a class="back" href="${href}">${icon('back', 18)}<span>${esc(label || 'Back')}</span></a>`;
  const bar = pct => `<div class="bar"><i style="width:${Math.max(0, Math.min(100, pct * 100)).toFixed(0)}%"></i></div>`;
  function ring(pct, big, small) {
    const C = 2 * Math.PI * 34, off = C * (1 - Math.max(0, Math.min(1, pct)));
    return `<div class="ring" role="img" aria-label="${esc(big + ' ' + small)}"><svg viewBox="0 0 80 80" width="92" height="92"><circle cx="40" cy="40" r="34" class="ring-bg"/><circle cx="40" cy="40" r="34" class="ring-fg" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 40 40)"/></svg><div class="ring-t"><b>${esc(big)}</b><small>${esc(small)}</small></div></div>`;
  }
  function copyText(text, msg) {
    const done = () => toast(msg || 'Copied', 'xp');
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done)); }
    else fallbackCopy(text, done);
  }
  function fallbackCopy(text, done) {
    try { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); done(); } catch (e) { toast('Copy failed: select the text manually', 'bad'); }
  }
  const todayIdx = () => dayIndex();
  const todayPick = arr => arr[todayIdx() % arr.length];
  function startTimer(el, secs, onDone) {
    let left = secs; const fmt = n => pad(Math.floor(n / 60)) + ':' + pad(n % 60);
    el.textContent = fmt(left);
    const iv = setInterval(() => { left--; el.textContent = fmt(Math.max(0, left)); if (left <= 0) { clearInterval(iv); if (onDone) onDone(); } }, 1000);
    return () => clearInterval(iv);
  }

  /* ---------- router ---------- */
  let cleanups = [];
  const onLeave = fn => cleanups.push(fn);
  const TAB = { home: 'home', words: 'words', match: 'words', rush: 'words', unscramble: 'words', read: 'read', listen: 'listen', dict: 'listen', numbers: 'listen', speak: 'speak', shadow: 'speak', twisters: 'speak', write: 'write' };
  function draw(keepScroll) {
    const parts = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
    const name = parts[0];
    const args = parts.slice(1).map(decodeURIComponent);
    const v = V[name] || V.home;
    const app = document.getElementById('app');
    app.innerHTML = v.render.apply(null, args);
    if (v.mount) v.mount.apply(null, args);
    applyAuto(app);
    const tab = TAB[name] || (V[name] ? 'more' : 'home');
    document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
    if (!keepScroll) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    updateHeader();
  }
  function route() {
    cleanups.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    cleanups = [];
    stopSpeak(); stopListen();
    draw(false);
  }
  function rerender() { const y = window.scrollY; draw(true); window.scrollTo(0, y); }
  const go = h => { if (location.hash === h) route(); else location.hash = h; };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const f = ACT[el.dataset.act];
    if (f) { try { f(el, e); } catch (err) { console.error(err); } }
  });
  const onInput = e => {
    const el = e.target.closest('[data-in]');
    if (!el) return;
    const f = IN[el.dataset.in];
    if (f) { try { f(el, e); } catch (err) { console.error(err); } }
  };
  document.addEventListener('input', onInput);
  document.addEventListener('change', onInput);
  window.addEventListener('hashchange', route);

  Object.assign(TEF, {
    u: { esc, pad, dkey, dayIndex, addDays, day, shuffle, pick, strip, short, toks, compare, marksHtml, frNum, icon, toast, sfx, confetti, levelInfo, curStreak, addXP, QUESTS, doQuest, BADGES, checkBadges, updateHeader, speak, stopSpeak, speakSeq, voiceList, canListen, listenOnce, stopListen, trBox, sayBtn, back, bar, ring, copyText, todayIdx, todayPick, startTimer, save, resetAll, importAll, onLeave, rerender, go, route, applyAuto }
  });
})();
