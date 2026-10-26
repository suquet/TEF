/* Grammar quiz + daily boss (shared engine) */
(function () {
  'use strict';
  const { V, ACT, S, u } = TEF;
  const { esc, icon, shuffle, pick, short, trBox, bar, back, addXP, doQuest, sfx, confetti, rerender, onLeave, save, todayPick, day } = u;
  let qz = null;
  const lang = () => (S.settings.help === 'es' ? 'es' : 'en');

  function vocabQ() {
    const w = pick(TEF.words), others = shuffle(TEF.words.filter(x => x !== w)).slice(0, 3);
    const m = x => (lang() === 'es' ? short(x.s) : short(x.e));
    const o = shuffle([w].concat(others));
    return { q: '« ' + w.f + ' » means:', o: o.map(m), a: o.indexOf(w), e: w.e + ' · ' + w.s + '. Example: ' + w.xe, s: w.s + '. Ejemplo: ' + w.xs, say: w.f };
  }
  function grammarQ() {
    const g = pick(TEF.quiz), o = shuffle(g.o.map((t, i) => ({ t, ok: i === g.a })));
    return { q: g.q, o: o.map(x => x.t), a: o.findIndex(x => x.ok), e: g.e, s: g.s };
  }
  function start(mode) {
    const n = 10;
    const qs = [];
    const pool = shuffle(TEF.quiz);
    const g = mode === 'boss' ? 6 : 8;
    for (let i = 0; i < g; i++) { const x = pool[i % pool.length], o = shuffle(x.o.map((t, k) => ({ t, ok: k === x.a }))); qs.push({ q: x.q, o: o.map(y => y.t), a: o.findIndex(y => y.ok), e: x.e, s: x.s }); }
    while (qs.length < n) qs.push(vocabQ());
    qz = { mode, qs: shuffle(qs), i: 0, ok: 0, lives: 3, hp: 100, sel: null, over: null, boss: todayPick(TEF.bosses) };
  }

  function render(mode) {
    if (!qz || qz.mode !== mode) { start(mode); onLeave(() => { qz = null; }); }
    const boss = mode === 'boss';
    if (qz.over) {
      const win = qz.over === 'win';
      return boss
        ? `<div class="card center"><div class="emo-lg">${win ? '🏆' : '💥'}</div><h2>${win ? qz.boss.n + ' defeated' : 'Defeated by ' + qz.boss.n}</h2><p class="muted">${qz.ok} correct · ${win ? 'Quest cleared' : 'Study the tips and try again'}</p><button class="btn" data-act="qrestart">${win ? 'Fight again' : 'Retry'}</button> <a class="btn ghost" href="#/">Home</a></div>`
        : `<div class="card center"><div class="emo-lg">🎯</div><h2>${qz.ok} of ${qz.qs.length}</h2><p class="muted">${qz.ok === qz.qs.length ? 'Perfect run.' : qz.ok >= 7 ? 'Strong. Keep going.' : 'Review the tips and retry.'}</p><button class="btn" data-act="qrestart">Play again</button> <a class="btn ghost" href="#/more">More</a></div>`;
    }
    const q = qz.qs[qz.i], sel = qz.sel;
    return `${back(boss ? '#/' : '#/more', boss ? 'Home' : 'More')}
    ${boss ? `<div class="boss"><div class="boss-e">${qz.boss.e}</div><div class="boss-b"><b>${esc(qz.boss.n)}</b><div class="bar hp"><i style="width:${Math.max(0, qz.hp)}%"></i></div></div><div class="lives" aria-label="${qz.lives} lives left">${'❤️'.repeat(qz.lives)}${'🖤'.repeat(3 - qz.lives)}</div></div>` : bar(qz.i / qz.qs.length)}
    <p class="mono muted small">Question ${qz.i + 1} of ${qz.qs.length}</p>
    <div class="card quiz"><h2 class="fr qtext">${esc(q.q).replace('___', '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>')}</h2>
      <div class="opts">${q.o.map((o, i) => `<button class="opt ${sel === null ? '' : i === q.a ? 'right' : i === sel ? 'wrong' : ''}" data-act="qans" data-i="${i}" ${sel !== null ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
      ${sel !== null ? `<div class="tipbox"><b>${sel === q.a ? 'Correct' : 'Not quite'}</b>${trBox(q.e, q.s)}</div>` : ''}
    </div>
    ${sel !== null ? `<button class="btn wide" data-act="qnext">${qz.i === qz.qs.length - 1 || qz.hp <= 0 || qz.lives <= 0 ? 'See result' : 'Next'}</button>` : ''}`;
  }
  V.quiz = { render() { return render('quiz'); } };
  V.boss = { render() { return render('boss'); } };

  ACT.qrestart = () => { const m = qz.mode; start(m); rerender(); };
  ACT.qans = el => {
    const q = qz.qs[qz.i], i = +el.dataset.i;
    qz.sel = i;
    const ok = i === q.a;
    S.stats.quizAll++;
    if (ok) { qz.ok++; S.stats.quizOk++; sfx('ok'); if (qz.mode === 'boss') qz.hp -= 14; } else { sfx('bad'); if (qz.mode === 'boss') qz.lives--; }
    if (q.say) u.speak(q.say);
    save(); rerender();
  };
  ACT.qnext = () => {
    const boss = qz.mode === 'boss';
    const last = qz.i === qz.qs.length - 1;
    if (boss && qz.hp <= 0) qz.over = 'win';
    else if (boss && qz.lives <= 0) qz.over = 'lose';
    else if (last) qz.over = boss ? 'lose' : 'done';
    if (qz.over) {
      if (boss) {
        if (qz.over === 'win') { S.stats.boss++; addXP(20, 'Boss defeated'); doQuest('boss'); confetti(); } else addXP(5, 'Good fight');
      } else { S.stats.games++; addXP(qz.ok * 3 + (qz.ok === qz.qs.length ? 10 : 0), 'Quiz'); if (qz.ok === qz.qs.length) confetti(); }
      save();
    } else { qz.i++; qz.sel = null; }
    rerender();
  };
})();
