/* Speaking: live missions (the partner listens and reacts), shadowing, twisters */
(function () {
  'use strict';
  const { V, ACT, S, u } = TEF;
  const { esc, icon, trBox, sayBtn, back, bar, addXP, doQuest, sfx, confetti, rerender, speak, speakSeq, stopSpeak, todayPick, onLeave, save, toast, compare, marksHtml, canListen, listen, stopListen, strip, pick, checkBadges } = u;
  const RE = TEF.reactions;

  function hub() {
    const t = todayPick(TEF.roles);
    const ai = TEF.ai && TEF.ai.has();
    return `<h1 class="page">Speak</h1>
    <a class="card link talk-cta" href="#/talk"><span class="q-t"><b>Free conversation</b><small>${ai ? 'Chat out loud with an AI partner who reacts to what you say' : 'Open-ended chat with an AI partner (needs your own API key)'}</small></span><span class="pill mono">${ai ? 'ready' : 'set up'}</span></a>
    <h2 class="sec">Missions</h2>
    <p class="muted small">Role-plays like the TEF oral. The partner speaks, you answer out loud, and they react to what you actually said. Use a headset in a quiet place.</p>
    <div class="list">${TEF.roles.map(r => `<a class="card art ${S.done.speak[r.id] ? 'done' : ''}" href="#/speak/${r.id}">
      <div class="row between"><span class="tag">Section ${r.type}</span><span class="mono muted small">${r.steps.length} steps${r.id === t.id ? ' · today' : ''}</span></div>
      <b>${esc(r.title)}</b><span class="muted small">${esc(r.sub)}</span>${S.done.speak[r.id] ? '<span class="mono ok small">completed</span>' : ''}</a>`).join('')}</div>
    <h2 class="sec">Pronunciation</h2>
    <div class="list">
      <a class="card link" href="#/shadow"><span class="q-t"><b>Shadowing</b><small>Hear it, repeat it, watch each word light up</small></span></a>
      <a class="card link" href="#/twisters"><span class="q-t"><b>Tongue twisters</b><small>Virelangues for crisp French sounds</small></span></a>
    </div>
    ${canListen() ? '' : '<p class="muted small">Your browser has no speech recognition, so you will type your answers. Chrome, Edge and Safari support it.</p>'}`;
  }

  /* ---------- matching what the learner said against the concepts ---------- */
  const norm = s => strip(String(s).toLowerCase()).replace(/[’'-]/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  function hit(text, toks, kw) {
    const k = norm(kw);
    if (!k) return false;
    if (k.indexOf(' ') >= 0) return (' ' + text + ' ').indexOf(' ' + k + ' ') >= 0;
    return toks.some(t => t === k || (k.length >= 5 && t.startsWith(k)));
  }
  function evalConcepts(said, cx) {
    const text = norm(said), toks = text.split(' ').filter(Boolean);
    const hits = cx.c.map(c => c.k.some(k => hit(text, toks, k)));
    const reqs = cx.c.map((c, i) => (c.req ? hits[i] : null)).filter(x => x !== null);
    const pass = reqs.length ? reqs.every(Boolean) : hits.some(Boolean);
    return { hits, pass };
  }

  /* ---------- shared mic widget ---------- */
  let said = '', listening = false, ctl = null;
  function micUi() {
    return `<div class="micbox"><button class="mic ${listening ? 'on' : ''}" data-act="mic" aria-label="${listening ? 'Stop listening' : 'Start speaking'}" aria-pressed="${listening}">${icon('mic', 30)}</button>
      <div class="said ${listening ? 'live' : ''}" id="said" aria-live="polite">${said ? esc(said) : '<span class="muted">' + (listening ? 'Listening… speak in French' : canListen() ? 'Tap the mic and speak French' : 'Type your answer below') + '</span>'}</div>
      <div class="typed"><input id="typed" class="area one" type="text" placeholder="…or type it" autocomplete="off" spellcheck="false"><button class="btn ghost" data-act="usetyped">Use</button></div></div>`;
  }
  const setSaid = t => { said = t; const e = document.getElementById('said'); if (e) { e.textContent = t || ''; e.classList.toggle('live', listening); } };

  /* ---------- live mission ---------- */
  let sp = null;
  const role = () => TEF.roles.find(x => x.id === sp.id);
  const cxOf = () => TEF.concepts[sp.id][sp.i];
  const alive = tok => sp && sp.tok === tok;

  function newMission(id) {
    sp = { id, tok: Math.random(), i: 0, log: [], hf: !!S.settings.hf && canListen(), phase: 'idle', tries: 0, pass: [], reveal: false, done: false, hfUsed: false, started: false };
    said = ''; listening = false; ctl = null;
    onLeave(() => { if (sp) sp.tok = null; sp = null; said = ''; listening = false; ctl = null; });
  }

  function bubbles() {
    return sp.log.map(b => {
      if (b.who === 'them') return `<div class="bubble them"><div class="row">${sayBtn(b.fr, 0, '', 'A')}<span class="fr">${esc(b.fr)}</span></div>${trBox(b.en, b.es)}</div>`;
      if (b.who === 'model') return `<div class="bubble model"><span class="mono small">a way to say it</span><div class="row">${sayBtn(b.fr, 0, '', 'B')}<span class="fr">${esc(b.fr)}</span></div>${trBox(b.en, b.es)}</div>`;
      return `<div class="bubble you"><span class="fr">${esc(b.text)}</span>${b.chips ? `<div class="chips wrap tiny">${b.chips.map(c => `<span class="cchip ${c.ok ? 'hit' : ''}">${c.ok ? '✓' : '·'} ${esc(c.l)}</span>`).join('')}</div>` : ''}</div>`;
    }).join('');
  }
  function targets() {
    const cx = cxOf(), ev = evalConcepts(said, cx);
    if (S.settings.hard && !sp.reveal) return `<div class="targets"><span class="mono small muted">Challenge mode: targets hidden · ${ev.hits.filter(Boolean).length} found</span></div>`;
    return `<div class="targets" id="targets">${cx.c.map((c, i) => `<span class="cchip ${ev.hits[i] ? 'hit' : ''}" data-ci="${i}">${ev.hits[i] ? '✓' : c.req ? '●' : '○'} ${esc(c.l)}</span>`).join('')}</div>`;
  }
  function paintLive() {
    setSaid(said);
    const t = document.getElementById('targets');
    if (t && sp && sp.phase === 'you') { const ev = evalConcepts(said, cxOf()); t.querySelectorAll('.cchip').forEach((el, i) => { el.classList.toggle('hit', ev.hits[i]); el.firstChild.textContent = (ev.hits[i] ? '✓' : cxOf().c[i].req ? '●' : '○') + ' '; }); }
  }

  function mission(id) {
    const r = TEF.roles.find(x => x.id === id);
    if (!r) return hub();
    if (!sp || sp.id !== id) newMission(id);
    const head = `${back('#/speak', 'Speak')}${bar(sp.i / r.steps.length)}<span class="tag">Section ${r.type}</span><h1 class="page">${esc(r.title)}</h1>`;
    if (!sp.started) {
      return `${head}<p class="muted">${esc(r.sub)}. ${r.steps.length} steps. The partner listens to your answer, reacts, and keeps the conversation going.</p>
      <div class="card form"><label class="check"><input type="checkbox" data-in="hf" ${sp.hf ? 'checked' : ''} ${canListen() ? '' : 'disabled'}> Hands-free: the mic opens by itself after the partner speaks</label>
      <label class="check"><input type="checkbox" data-in="hard" ${S.settings.hard ? 'checked' : ''}> Challenge: hide the targets while I answer</label></div>
      <button class="btn wide" data-act="mstart">Start mission</button>
      ${canListen() ? '<p class="muted small">Your browser will ask for microphone access. Headphones stop the partner voice from being picked up.</p>' : '<p class="muted small">No speech recognition here: you will type your answers.</p>'}`;
    }
    if (sp.done) return `${head}<div class="chatlog">${bubbles()}</div>${summary(r)}`;
    const st = r.steps[sp.i];
    const ph = sp.phase;
    return `${head}<div class="chatlog">${bubbles()}</div>
    ${ph === 'review' ? `<button class="btn wide" data-act="mcont">Continue</button>` : `
    <div class="goal"><span class="mono">your move</span> ${esc(st.hint)}</div>
    ${targets()}
    ${micUi()}
    <div class="toolrow"><button class="chip ${sp.hf ? 'on' : ''}" data-act="mhf" ${canListen() ? '' : 'disabled'}>Hands-free ${sp.hf ? 'on' : 'off'}</button><button class="chip" data-act="mmodel">Show model</button><button class="chip" data-act="mskip">Skip</button></div>`}`;
  }
  function summary(r) {
    const n = sp.pass.filter(Boolean).length;
    return `<div class="card center sum"><div class="emo-lg">${n === r.steps.length ? '🏆' : '🎤'}</div><h2>${n} of ${r.steps.length} steps answered well</h2><p class="muted">${n === r.steps.length ? 'Every step covered. Try the challenge mode next.' : 'Replay the missed steps to lock them in.'}</p>
      <div class="rate"><button class="btn" data-act="mrestart">Practice again</button><a class="btn ghost" href="#/speak">More missions</a></div></div>`;
  }
  V.speak = { render(id) { return id ? mission(id) : hub(); } };

  /* --- flow --- */
  ACT.mstart = () => { sp.started = true; sp.hfUsed = sp.hf; beginStep(); };
  ACT.mrestart = () => { const id = sp.id; sp.tok = null; sp = null; newMission(id); sp.started = true; sp.hfUsed = !!S.settings.hf && canListen(); sp.hf = sp.hfUsed; beginStep(); };
  function beginStep() {
    const tok = sp.tok, st = role().steps[sp.i];
    sp.log.push({ who: 'them', fr: st.p[0], en: st.p[1], es: st.p[2] });
    sp.phase = 'partner'; sp.tries = 0; sp.reveal = false; said = '';
    rerender();
    speak(st.p[0], { role: 'A', onend: () => { if (alive(tok)) afterPartner(); } });
  }
  function afterPartner() {
    const tok = sp.tok;
    sp.phase = 'you'; rerender();
    if (sp.hf) setTimeout(() => { if (alive(tok) && sp.phase === 'you' && !listening) startMic(); }, 250);
  }
  function startMic() {
    if (!canListen()) { toast('No speech recognition here. Type your answer.', 'bad'); return; }
    const tok = sp.tok;
    stopSpeak();
    sp.phase = 'you'; said = ''; listening = true;
    rerender();
    ctl = listen(ev => {
      if (!alive(tok)) return;
      if (ev.type === 'interim') { said = ev.text; paintLive(); }
      else if (ev.type === 'end') { listening = false; ctl = null; handleAnswer(ev.text); }
      else if (ev.type === 'error') {
        listening = false; ctl = null;
        if (/not-allowed|service-not-allowed|start-failed/.test(ev.error)) { sp.hf = false; toast('The browser blocked the microphone. Tap the mic to try again.', 'bad'); }
        else if (ev.error !== 'unsupported') toast('Mic problem (' + ev.error + '). You can type instead.', 'bad');
        rerender();
      }
    });
    if (!ctl && listening) { listening = false; rerender(); }
  }
  ACT.mic = () => {
    if (!sp) return;
    if (listening) { if (ctl) ctl.stop(); return; }
    startMic();
  };
  ACT.usetyped = () => {
    const el = document.getElementById('typed'), v = el ? el.value.trim() : '';
    if (!v || !sp || sp.phase !== 'you') return;
    stopListen(); stopSpeak(); listening = false; said = v;
    handleAnswer(v);
  };
  ACT.mhf = () => { sp.hf = !sp.hf; S.settings.hf = sp.hf; if (sp.hf) sp.hfUsed = true; save(); if (sp.hf && sp.phase === 'you' && !listening) startMic(); else rerender(); };
  IN_hf();
  function IN_hf() {
    TEF.IN.hf = el => { if (sp) { sp.hf = el.checked; } S.settings.hf = el.checked; save(); };
    TEF.IN.hard = el => { S.settings.hard = el.checked; save(); };
  }

  function partnerSay(lines, cb) {
    const tok = sp.tok;
    sp.log.push({ who: 'them', fr: lines.map(l => l[0]).join(' '), en: lines.map(l => l[1]).join(' '), es: lines.map(l => l[2]).join(' ') });
    sp.phase = 'partner'; rerender();
    speakSeq(lines.map(l => ({ t: l[0], role: 'A' })), () => { if (alive(tok) && cb) cb(); });
  }

  function handleAnswer(text) {
    const tok = sp.tok, r = role(), cx = cxOf();
    if (!text) {
      sp.silent = (sp.silent || 0) + 1;
      if (sp.silent >= 2 && sp.hf) { sp.hf = false; toast('Hands-free paused. Tap the mic when you are ready.', 'lvl'); }
      sp.phase = 'partner';
      setTimeout(() => { if (alive(tok)) partnerSay([RE.silence[0]], afterPartner); }, 300);
      return;
    }
    sp.silent = 0;
    const ev = evalConcepts(text, cx);
    sp.log.push({ who: 'you', text, chips: cx.c.map((c, i) => ({ l: c.l, ok: ev.hits[i] })) });
    said = '';
    sp.phase = 'react'; rerender();
    if (ev.pass) {
      sp.pass[sp.i] = 1;
      addXP(sp.tries === 0 ? 8 : 5, 'Nice answer'); sfx('ok');
      setTimeout(() => {
        if (!alive(tok)) return;
        const last = sp.i === r.steps.length - 1;
        if (last) { partnerSay([pick(RE.ok)], () => alive(tok) && finish()); }
        else { partnerSay([pick(RE.ok)], () => { if (alive(tok)) { sp.i++; beginStep(); } }); }
      }, 350);
    } else {
      sp.tries++; sfx('bad');
      setTimeout(() => {
        if (!alive(tok)) return;
        if (sp.tries >= 2) { showModel(true); }
        else partnerSay([pick(RE.again), cx.nudge], afterPartner);
      }, 350);
    }
  }
  function showModel(auto) {
    const tok = sp.tok, st = role().steps[sp.i];
    stopListen(); stopSpeak(); listening = false; said = '';
    sp.log.push({ who: 'model', fr: st.m[0], en: st.m[1], es: st.m[2] });
    sp.phase = 'review'; sp.reveal = true; rerender();
    speak(st.m[0], { role: 'B', onend: () => { if (alive(tok) && auto) { /* wait for the learner to continue */ } } });
  }
  ACT.mmodel = () => showModel(false);
  ACT.mcont = () => advance();
  ACT.mskip = () => { stopListen(); stopSpeak(); listening = false; advance(); };
  function advance() {
    const r = role();
    stopSpeak();
    if (sp.i >= r.steps.length - 1) { finish(); return; }
    sp.i++; beginStep();
  }
  function finish() {
    const r = role(), tok = sp.tok;
    sp.done = true; sp.phase = 'done'; listening = false;
    const n = sp.pass.filter(Boolean).length;
    S.done.speak[r.id] = 1;
    if (n >= Math.ceil(r.steps.length / 2)) {
      addXP(15, 'Mission');
      doQuest('speak');
      if (sp.hfUsed) { S.stats.hf++; }
      if (n === r.steps.length) confetti();
    } else toast('Answer at least half the steps well to earn mission XP', 'bad');
    save(); checkBadges(); rerender();
    speak(RE.end[0][0], { role: 'A', onend: () => { if (!alive(tok)) return; } });
  }

  /* ---------- shadowing & twisters with live word highlighting ---------- */
  let sh = null;
  const shadowItems = () => { const o = []; TEF.roles.forEach(r => r.steps.forEach(s => o.push(s.m))); return o; };
  function liveMarks(target, text, final) {
    const c = compare(target, text, false);
    return c.marks.map(m => `<span class="${m.ok ? 'w-ok' : final ? 'w-bad' : 'w-pend'}">${esc(m.w)}</span>`).join(' ');
  }
  function shadowView(kind) {
    const list = kind === 'twisters' ? TEF.twisters : shadowItems();
    if (!sh || sh.kind !== kind) {
      sh = { kind, list, i: 0, res: null, tok: Math.random() };
      said = ''; listening = false; ctl = null;
      onLeave(() => { if (sh) sh.tok = null; sh = null; said = ''; listening = false; ctl = null; });
    }
    const t = sh.list[sh.i];
    const roleOf = kind === 'twisters' ? 'A' : 'B';
    return `${back('#/speak', 'Speak')}${bar(sh.i / sh.list.length)}<h1 class="page">${kind === 'twisters' ? 'Tongue twisters' : 'Shadowing'}</h1>
    <p class="muted">${kind === 'twisters' ? 'Start slow, then speed up.' : 'Listen once, then say it with the same rhythm.'} Words turn green as you say them.</p>
    <div class="card center"><div class="marks big" id="shmarks">${sh.res ? liveMarks(t[0], sh.res.text, true) : t[0].split(/\s+/).map(w => `<span class="w-pend">${esc(w)}</span>`).join(' ')}</div>
      <div class="row center-row">${sayBtn(t[0], 0, '', roleOf)}<button class="btn" data-act="shgo">${icon('play', 18)} Listen, then repeat</button><button class="btn ghost" data-act="shslow">Slow</button></div>${trBox(t[1], t[2])}</div>
    ${micUi()}
    ${sh.res ? `<p class="mono center">${Math.round(sh.res.pct * 100)}% of the words matched ${sh.res.pct >= 0.75 ? '· great' : '· try again'}</p>` : ''}
    <div class="rate"><button class="btn ghost" data-act="shprev" ${sh.i === 0 ? 'disabled' : ''}>Previous</button><button class="btn" data-act="shnext">${sh.i === sh.list.length - 1 ? 'Restart' : 'Next'}</button></div>`;
  }
  V.shadow = { render() { return shadowView('shadow'); } };
  V.twisters = { render() { return shadowView('twisters'); } };

  function shListen() {
    const tok = sh.tok, t = sh.list[sh.i];
    stopSpeak(); said = ''; listening = true; sh.res = null; rerender();
    ctl = listen(ev => {
      if (!sh || sh.tok !== tok) return;
      if (ev.type === 'interim') { said = ev.text; setSaid(ev.text); const m = document.getElementById('shmarks'); if (m) m.innerHTML = liveMarks(t[0], ev.text, false); }
      else if (ev.type === 'end') {
        listening = false; ctl = null;
        if (!ev.text) { toast('Did not hear anything. Try again.', 'bad'); rerender(); return; }
        const c = compare(t[0], ev.text, false);
        sh.res = { pct: c.pct, text: ev.text };
        if (c.pct >= 0.75) { sfx('ok'); S.stats.shadow++; addXP(sh.kind === 'twisters' ? 8 : 6, sh.kind === 'twisters' ? 'Twister' : 'Shadowing'); if (c.pct > 0.95) confetti(); } else sfx('bad');
        save(); rerender();
      } else if (ev.type === 'error') { listening = false; ctl = null; toast('Mic problem (' + ev.error + '). You can type instead.', 'bad'); rerender(); }
    }, { patience: 1400 });
  }
  ACT.shgo = () => {
    const tok = sh.tok, t = sh.list[sh.i];
    speak(t[0], { role: sh.kind === 'twisters' ? 'A' : 'B', onend: () => { if (sh && sh.tok === tok && canListen()) setTimeout(() => { if (sh && sh.tok === tok) shListen(); }, 200); } });
  };
  ACT.shslow = () => speak(sh.list[sh.i][0], { role: sh.kind === 'twisters' ? 'A' : 'B', rate: 0.65 });
  ACT.shnext = () => { stopListen(); stopSpeak(); sh.i = (sh.i + 1) % sh.list.length; sh.res = null; said = ''; listening = false; rerender(); };
  ACT.shprev = () => { stopListen(); stopSpeak(); sh.i = Math.max(0, sh.i - 1); sh.res = null; said = ''; listening = false; rerender(); };

  // the shared mic and typed buttons also drive shadowing
  const baseMic = ACT.mic, baseTyped = ACT.usetyped;
  ACT.mic = el => { if (sh && !sp) { if (listening) { if (ctl) ctl.stop(); } else shListen(); return; } baseMic(el); };
  ACT.usetyped = el => {
    if (sh && !sp) {
      const inp = document.getElementById('typed'), v = inp ? inp.value.trim() : '';
      if (!v) return;
      const c = compare(sh.list[sh.i][0], v, false);
      sh.res = { pct: c.pct, text: v };
      if (c.pct >= 0.75) { sfx('ok'); S.stats.shadow++; addXP(4, 'Typed'); } else sfx('bad');
      save(); rerender(); return;
    }
    baseTyped(el);
  };
})();
