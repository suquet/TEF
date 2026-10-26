/* Speaking: missions, shadowing, twisters */
(function () {
  'use strict';
  const { V, ACT, IN, S, u } = TEF;
  const { esc, icon, trBox, sayBtn, back, bar, addXP, doQuest, sfx, confetti, rerender, speak, stopSpeak, todayPick, onLeave, save, toast, compare, marksHtml, canListen, listenOnce, stopListen } = u;

  function hub() {
    const t = todayPick(TEF.roles);
    return `<h1 class="page">Speak</h1>
    <p class="muted small">Missions are short role-plays like the TEF oral. A partner talks, you answer out loud. Use a headset and a quiet place.</p>
    <div class="list">${TEF.roles.map(r => `<a class="card art ${S.done.speak[r.id] ? 'done' : ''}" href="#/speak/${r.id}">
      <div class="row between"><span class="tag">Section ${r.type}</span><span class="mono muted small">${r.steps.length} steps${r.id === t.id ? ' · today' : ''}</span></div>
      <b>${esc(r.title)}</b><span class="muted small">${esc(r.sub)}</span>${S.done.speak[r.id] ? '<span class="mono ok small">completed</span>' : ''}</a>`).join('')}</div>
    <h2 class="sec">Pronunciation</h2>
    <div class="list">
      <a class="card link" href="#/shadow"><span class="q-t"><b>Shadowing</b><small>Listen, repeat, get a score</small></span></a>
      <a class="card link" href="#/twisters"><span class="q-t"><b>Tongue twisters</b><small>Virelangues for crisp French sounds</small></span></a>
    </div>
    ${canListen() ? '' : '<p class="muted small">Your browser has no speech recognition. You can still type your answers. Chrome, Edge and Safari support it.</p>'}`;
  }

  /* shared mic widget helpers */
  let said = '', listening = false;
  function micUi() {
    return `<div class="micbox"><button class="mic ${listening ? 'on' : ''}" data-act="mic" aria-label="${listening ? 'Stop recording' : 'Speak'}">${icon('mic', 30)}</button>
      <div class="said" id="said" aria-live="polite">${said ? esc(said) : '<span class="muted">' + (canListen() ? 'Tap the mic and speak French' : 'Type your answer below') + '</span>'}</div>
      <div class="typed"><input id="typed" class="area one" type="text" placeholder="…or type it" autocomplete="off" spellcheck="false"><button class="btn ghost" data-act="usetyped">Use</button></div></div>`;
  }
  let micCb = null;
  ACT.mic = () => {
    if (listening) { stopListen(); listening = false; rerender(); return; }
    if (!canListen()) { toast('No speech recognition here. Type your answer instead.', 'bad'); return; }
    said = ''; listening = true; rerender();
    listenOnce(ev => {
      if (ev.error) { listening = false; if (ev.error !== 'aborted' && ev.error !== 'no-speech') toast('Mic error: ' + ev.error + '. Type instead.', 'bad'); rerender(); return; }
      if (ev.text) { said = ev.text; const e = document.getElementById('said'); if (e) e.textContent = said; }
      if (ev.end) { listening = false; if (micCb) micCb(said); rerender(); }
    });
  };
  ACT.usetyped = () => { const v = document.getElementById('typed').value.trim(); if (!v) return; said = v; if (micCb) micCb(said); rerender(); };

  /* ---- mission ---- */
  let sp = null;
  function mission(id) {
    const r = TEF.roles.find(x => x.id === id);
    if (!r) return hub();
    if (!sp || sp.id !== id) {
      sp = { id, i: 0, shown: false, paid: [] };
      said = ''; listening = false;
      onLeave(() => { sp = null; said = ''; listening = false; micCb = null; });
    }
    micCb = () => { };
    if (sp.i >= r.steps.length) return `<div class="card center"><div class="emo-lg">🎤</div><h2>Mission complete</h2><p class="muted">${esc(r.title)}</p><a class="btn" href="#/speak">More missions</a></div>`;
    const st = r.steps[sp.i];
    const cmp = sp.shown && said ? compare(st.m[0], said, false) : null;
    return `${back('#/speak', 'Speak')}${bar(sp.i / r.steps.length)}
    <span class="tag">Section ${r.type}</span><h1 class="page">${esc(r.title)}</h1>
    <div class="bubble them"><div class="row">${sayBtn(st.p[0])}<span class="fr">${esc(st.p[0])}</span></div>${trBox(st.p[1], st.p[2])}</div>
    <div class="goal"><span class="mono">your move</span> ${esc(st.hint)}</div>
    ${micUi()}
    ${sp.shown ? `<div class="bubble you"><div class="row">${sayBtn(st.m[0])}<span class="fr">${esc(st.m[0])}</span></div>${trBox(st.m[1], st.m[2])}${cmp ? `<p class="mono small">Overlap with the model: ${Math.round(cmp.pct * 100)}%. You do not need to match it word for word.</p>` : ''}</div>
      <button class="btn wide" data-act="snext">${sp.i === r.steps.length - 1 ? 'Finish mission' : 'Next'}</button>`
      : `<div class="rate"><button class="btn blue" data-act="sshow">Show model answer</button><button class="btn ghost" data-act="skip">Skip</button></div>`}`;
  }
  V.speak = {
    render(id) { return id ? mission(id) : hub(); },
    mount(id) { if (id && sp && sp.id === id && !sp.shown && !said && !sp.spoke) { sp.spoke = true; const r = TEF.roles.find(x => x.id === id); setTimeout(() => { if (sp) speak(r.steps[sp.i].p[0]); }, 350); } }
  };
  ACT.sshow = () => { sp.shown = true; rerender(); };
  ACT.skip = () => { sp.i++; sp.shown = false; sp.spoke = false; said = ''; rerender(); };
  ACT.snext = () => {
    const r = TEF.roles.find(x => x.id === sp.id);
    if (said && !sp.paid[sp.i]) { sp.paid[sp.i] = 1; addXP(8, 'Speaking'); }
    sp.i++; sp.shown = false; sp.spoke = false; said = '';
    if (sp.i >= r.steps.length) {
      S.done.speak[r.id] = 1; save();
      if (sp.paid.filter(Boolean).length) { addXP(15, 'Mission'); doQuest('speak'); confetti(); }
      else toast('Say or type at least one answer to earn XP', 'bad');
    }
    rerender();
  };

  /* ---- shadowing & twisters ---- */
  let sh = null;
  function shadowItems() { const o = []; TEF.roles.forEach(r => r.steps.forEach(s => o.push(s.m))); return o; }
  function shadowView(kind) {
    const list = kind === 'twisters' ? TEF.twisters : shadowItems();
    if (!sh || sh.kind !== kind) { sh = { kind, list, i: 0, res: null }; said = ''; listening = false; onLeave(() => { sh = null; said = ''; listening = false; micCb = null; }); }
    const t = sh.list[sh.i];
    micCb = txt => {
      const c = compare(t[0], txt, false);
      sh.res = c;
      if (c.pct >= 0.75) { sfx('ok'); S.stats.shadow++; addXP(kind === 'twisters' ? 8 : 6, kind === 'twisters' ? 'Twister' : 'Shadowing'); if (c.pct > 0.95) confetti(); } else sfx('bad');
    };
    return `${back('#/speak', 'Speak')}${bar(sh.i / sh.list.length)}<h1 class="page">${kind === 'twisters' ? 'Tongue twisters' : 'Shadowing'}</h1>
    <p class="muted">${kind === 'twisters' ? 'Start slow, then speed up.' : 'Listen once, then say it with the same rhythm.'}</p>
    <div class="card center"><div class="big-fr sm">${esc(t[0])}</div>
      <div class="row center-row"><button class="btn" data-act="shplay" data-r="1">${icon('play', 18)} Listen</button><button class="btn ghost" data-act="shplay" data-r="0.65">Slow</button></div>${trBox(t[1], t[2])}</div>
    ${micUi()}
    ${sh.res ? `<div class="card"><div class="marks">${marksHtml(sh.res.marks)}</div><p class="mono">${Math.round(sh.res.pct * 100)}% match ${sh.res.pct >= 0.75 ? '· great' : '· try again'}</p></div>` : ''}
    <div class="rate"><button class="btn ghost" data-act="shprev" ${sh.i === 0 ? 'disabled' : ''}>Previous</button><button class="btn" data-act="shnext">${sh.i === sh.list.length - 1 ? 'Restart' : 'Next'}</button></div>`;
  }
  V.shadow = { render() { return shadowView('shadow'); } };
  V.twisters = { render() { return shadowView('twisters'); } };
  ACT.shplay = el => speak(sh.list[sh.i][0], { rate: parseFloat(el.dataset.r) });
  ACT.shnext = () => { sh.i = (sh.i + 1) % sh.list.length; sh.res = null; said = ''; rerender(); };
  ACT.shprev = () => { sh.i = Math.max(0, sh.i - 1); sh.res = null; said = ''; rerender(); };
})();
