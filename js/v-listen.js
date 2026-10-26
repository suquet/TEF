/* Listening: drills, dictation, number ninja */
(function () {
  'use strict';
  const { V, ACT, S, u } = TEF;
  const { esc, icon, shuffle, pick, trBox, sayBtn, back, bar, addXP, doQuest, sfx, confetti, rerender, speak, speakSeq, stopSpeak, todayPick, onLeave, save, toast, compare, marksHtml, frNum, toks } = u;

  function hub() {
    const t = todayPick(TEF.listen);
    return `<h1 class="page">Listen</h1>
    <p class="muted small">Real exam audio plays once. Turn on exam mode in settings to practise that pressure.</p>
    <div class="list">${TEF.listen.map(l => `<a class="card art ${S.done.listen[l.id] ? 'done' : ''}" href="#/listen/${l.id}">
      <div class="row between"><span class="tag">${esc(l.type)}</span><span class="mono muted small">${l.lvl}${l.id === t.id ? ' · today' : ''}</span></div>
      <b>${esc(l.title)}</b>${S.done.listen[l.id] ? '<span class="mono ok small">completed</span>' : ''}</a>`).join('')}</div>
    <h2 class="sec">Skill builders</h2>
    <div class="list">
      <a class="card link" href="#/numbers"><span class="q-t"><b>Number ninja</b><small>Numbers, times and prices. The classic exam trap.</small></span></a>
      <a class="card link" href="#/dict"><span class="q-t"><b>Dictation</b><small>Hear a sentence and type it</small></span></a>
    </div>`;
  }

  let ld = null;
  function drill(id) {
    const l = TEF.listen.find(x => x.id === id);
    if (!l) return hub();
    if (!ld || ld.id !== id) {
      ld = { id, plays: 0, ans: [], paid: false, show: false, qs: l.qs.map(q => ({ q: q.q, o: shuffle(q.o.map((t, i) => ({ t, ok: i === q.a }))), ex: q.ex, exs: q.exs })) };
      onLeave(() => { ld = null; });
    }
    const fin = ld.qs.every((q, i) => ld.ans[i] !== undefined);
    const lim = S.settings.once;
    return `${back('#/listen', 'Listen')}<span class="tag">${esc(l.type)}</span> <span class="mono muted small">${l.lvl}</span><h1 class="page">${esc(l.title)}</h1>
    <div class="card center player">
      <div class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="row center-row">
        <button class="btn" data-act="lplay" data-r="1">${icon('play', 18)} Play</button>
        <button class="btn ghost" data-act="lplay" data-r="0.7">Slow</button>
        <button class="btn ghost" data-act="rstopl">${icon('stop', 18)}</button>
      </div>
      <p class="mono muted small">${lim ? 'Exam mode: ' + (ld.plays ? 'audio already played' : 'plays once') : 'Plays: ' + ld.plays + ' · unlimited'}</p>
    </div>
    ${ld.qs.map((q, qi) => {
      const a = ld.ans[qi];
      return `<div class="card quiz"><b class="fr">${esc(q.q)}</b><div class="opts">${q.o.map((o, oi) => `<button class="opt ${a === undefined ? '' : o.ok ? 'right' : oi === a ? 'wrong' : ''}" data-act="lans" data-q="${qi}" data-o="${oi}" ${a !== undefined ? 'disabled' : ''}>${esc(o.t)}</button>`).join('')}</div>${a !== undefined ? `<div class="tipbox">${trBox(q.ex, q.exs)}</div>` : ''}</div>`;
    }).join('')}
    ${fin || ld.show ? `<h2 class="sec">Transcript</h2><div class="card">${l.lines.map(x => `<p class="fr"><span class="mono muted">${esc(x.sp)}</span> ${esc(x.t)}</p>`).join('')}${trBox(l.en, l.es)}</div>` : `<button class="chip" data-act="lshow">Peek at transcript</button>`}
    ${fin ? `<a class="btn wide" href="#/listen">More drills</a>` : ''}`;
  }
  V.listen = { render(id) { return id ? drill(id) : hub(); } };
  ACT.lplay = el => {
    const l = TEF.listen.find(x => x.id === ld.id);
    if (S.settings.once && ld.plays >= 1) { toast('Exam mode: audio plays once', 'bad'); return; }
    ld.plays++;
    document.querySelector('.player').classList.add('playing');
    const items = l.lines.map(x => ({ t: x.t, voice: x.sp === 'B' ? 1 : 0, pitch: x.sp === 'B' ? 0.85 : 1 }));
    speakSeq(items, () => { const p = document.querySelector('.player'); if (p) p.classList.remove('playing'); }, parseFloat(el.dataset.r));
  };
  ACT.rstopl = () => { stopSpeak(); const p = document.querySelector('.player'); if (p) p.classList.remove('playing'); };
  ACT.lshow = () => { ld.show = true; rerender(); };
  ACT.lans = el => {
    const qi = +el.dataset.q, oi = +el.dataset.o;
    ld.ans[qi] = oi;
    const ok = ld.qs[qi].o[oi].ok;
    S.stats.quizAll++; if (ok) S.stats.quizOk++;
    sfx(ok ? 'ok' : 'bad');
    if (ld.qs.every((q, i) => ld.ans[i] !== undefined) && !ld.paid) {
      ld.paid = true;
      const good = ld.qs.filter((q, i) => q.o[ld.ans[i]].ok).length;
      S.done.listen[ld.id] = 1; save();
      addXP(8 + good * 6, 'Listening');
      doQuest('listen');
      if (good === ld.qs.length) confetti();
    }
    save(); rerender();
  };

  /* ---- dictation ---- */
  let dc = null;
  const startDict = () => { dc = { items: shuffle(TEF.dict.map((d, i) => ({ d, i }))).slice(0, 5), k: 0, res: null, ok: 0 }; };
  V.dict = {
    render() {
      if (!dc) startDict();
      onLeave(() => { dc = null; });
      if (dc.k >= dc.items.length) return `<div class="card center"><div class="emo-lg">⌨️</div><h2>${dc.ok} of ${dc.items.length} nailed</h2><button class="btn" data-act="drestart">Again</button> <a class="btn ghost" href="#/games">Arcade</a></div>`;
      const it = dc.items[dc.k];
      return `${back('#/listen', 'Listen')}${bar(dc.k / dc.items.length)}<h1 class="page">Dictation</h1>
      <p class="muted">Listen, then type exactly what you hear. Accents count.</p>
      <div class="row center-row"><button class="btn" data-act="dplay" data-r="1">${icon('play', 18)} Play</button><button class="btn ghost" data-act="dplay" data-r="0.65">Slow</button></div>
      <textarea id="dtxt" class="area" rows="3" placeholder="Type the sentence" autocapitalize="sentences" spellcheck="false" ${dc.res ? 'disabled' : ''}></textarea>
      ${dc.res ? `<div class="card"><div class="marks">${marksHtml(dc.res.marks)}</div><p class="mono">${Math.round(dc.res.pct * 100)}% ${dc.res.accent ? ' · watch your accents' : ''}</p><div class="row">${sayBtn(it.d[0])}<span class="fr">${esc(it.d[0])}</span></div>${trBox(it.d[1], it.d[2])}</div><button class="btn wide" data-act="dnext">Next</button>` : `<button class="btn wide" data-act="dcheck">Check</button>`}`;
    }
  };
  ACT.drestart = () => { startDict(); rerender(); };
  ACT.dplay = el => speak(dc.items[dc.k].d[0], { rate: parseFloat(el.dataset.r) });
  ACT.dcheck = () => {
    const it = dc.items[dc.k], txt = document.getElementById('dtxt').value;
    if (!txt.trim()) { toast('Type what you heard first', 'bad'); return; }
    const strict = compare(it.d[0], txt, true), lenient = compare(it.d[0], txt, false);
    strict.accent = lenient.pct > strict.pct;
    dc.res = strict;
    if (strict.pct >= 0.9) { dc.ok++; sfx('ok'); addXP(6, 'Dictation'); S.done.dict[it.i] = 1; if (strict.pct === 1) confetti(); } else sfx('bad');
    save(); rerender();
  };
  ACT.dnext = () => { dc.k++; dc.res = null; if (dc.k >= dc.items.length) { if (dc.ok >= 3) doQuest('listen'); } rerender(); };

  /* ---- number ninja ---- */
  let nn = null;
  function genNum() {
    const t = pick(['n', 'n', 't', 'p']);
    if (t === 'n') { const n = pick([Math.floor(Math.random() * 90) + 10, Math.floor(Math.random() * 40) + 60, Math.floor(Math.random() * 800) + 100]); return { say: frNum(n), ans: String(n), show: String(n), kind: 'number' }; }
    if (t === 't') {
      const h = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23]), m = pick([0, 5, 10, 15, 20, 30, 35, 40, 45, 50, 55]);
      return { say: frNum(h) + ' heures' + (m ? ' ' + frNum(m) : ''), ans: String(h) + ('0' + m).slice(-2), show: h + ':' + ('0' + m).slice(-2), kind: 'time' };
    }
    const d = Math.floor(Math.random() * 190) + 2, c = pick([0, 25, 50, 75, 95]);
    return { say: frNum(d) + ' dollars' + (c ? ' ' + frNum(c) : ''), ans: String(d) + ('0' + c).slice(-2), show: '$' + d + '.' + ('0' + c).slice(-2), kind: 'price' };
  }
  const startNn = () => { nn = { items: Array.from({ length: 6 }, genNum), i: 0, ok: 0, res: null }; };
  V.numbers = {
    render() {
      if (!nn) startNn();
      onLeave(() => { nn = null; });
      if (nn.i >= nn.items.length) return `<div class="card center"><div class="emo-lg">🥷</div><h2>${nn.ok} of ${nn.items.length}</h2><button class="btn" data-act="nrestart">Again</button> <a class="btn ghost" href="#/listen">Listen</a></div>`;
      const it = nn.items[nn.i];
      return `${back('#/listen', 'Listen')}${bar(nn.i / nn.items.length)}<h1 class="page">Number ninja</h1>
      <p class="muted">Type what you hear as digits. This one is a ${esc(it.kind)}.</p>
      <div class="row center-row"><button class="btn" data-act="nplay" data-r="1">${icon('play', 18)} Play</button><button class="btn ghost" data-act="nplay" data-r="0.7">Slow</button></div>
      <input id="ntxt" class="area one mono" inputmode="decimal" autocomplete="off" placeholder="${it.kind === 'time' ? '14:35' : it.kind === 'price' ? '12.50' : '95'}" ${nn.res !== null ? 'disabled' : ''}>
      ${nn.res !== null ? `<div class="card ${nn.res ? 'good' : 'bad'}"><b class="mono">${esc(it.show)}</b><div class="row">${sayBtn(it.say)}<span class="fr">${esc(it.say)}</span></div></div><button class="btn wide" data-act="nnext">Next</button>` : `<button class="btn wide" data-act="ncheck">Check</button>`}`;
    },
    mount() { const cur = nn; if (cur && cur.res === null && cur.i < cur.items.length) setTimeout(() => { if (nn === cur && cur.res === null) speak(cur.items[cur.i].say); }, 250); }
  };
  ACT.nrestart = () => { startNn(); rerender(); };
  ACT.nplay = el => speak(nn.items[nn.i].say, { rate: parseFloat(el.dataset.r) });
  ACT.ncheck = () => {
    const v = document.getElementById('ntxt').value.replace(/\D/g, '');
    if (!v) { toast('Type the digits you heard', 'bad'); return; }
    const it = nn.items[nn.i];
    nn.res = v === it.ans;
    if (nn.res) { nn.ok++; sfx('ok'); addXP(4); } else sfx('bad');
    rerender();
  };
  ACT.nnext = () => { nn.i++; nn.res = null; if (nn.i >= nn.items.length) { S.stats.nums++; S.stats.games++; if (nn.ok >= 5) confetti(); save(); } rerender(); };
})();
