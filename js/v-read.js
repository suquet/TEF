/* Reading */
(function () {
  'use strict';
  const { V, ACT, S, u } = TEF;
  const { esc, icon, shuffle, trBox, sayBtn, back, addXP, doQuest, sfx, confetti, rerender, speakSeq, stopSpeak, todayPick, onLeave, save, toast } = u;
  let cat = 'all', rd = null, slow = false;
  const catName = c => (c === 'all' ? 'All' : TEF.cats[c]);

  function list() {
    const t = todayPick(TEF.articles);
    const cats = ['all', 'tech', 'game', 'ent', 'biz'];
    const items = TEF.articles.filter(a => cat === 'all' || a.cat === cat);
    const src = cat === 'all' ? [].concat(TEF.sources.easy) : TEF.sources[cat].concat(TEF.sources.easy.slice(0, 1));
    return `<h1 class="page">Read</h1>
    <p class="muted small">Original practice texts on tech, games, entertainment and business. Names and facts are fictional, so for real headlines use the sources below.</p>
    <div class="chips scroll">${cats.map(c => `<button class="chip ${cat === c ? 'on' : ''}" data-act="rcat" data-c="${c}">${esc(catName(c))}</button>`).join('')}</div>
    <div class="list">${items.map(a => `<a class="card art ${S.done.read[a.id] ? 'done' : ''}" href="#/read/${a.id}">
      <div class="row between"><span class="tag">${esc(TEF.cats[a.cat])}</span><span class="mono muted small">${a.lvl} · ${a.mins} min${a.id === t.id ? ' · today' : ''}</span></div>
      <b class="fr">${esc(a.title[0])}</b>${S.done.read[a.id] ? '<span class="mono ok small">completed</span>' : ''}
    </a>`).join('')}</div>
    <h2 class="sec">Read the real thing</h2>
    <div class="list">${src.map(s => `<a class="card link" href="${s[1]}" target="_blank" rel="noopener"><span class="q-t"><b>${esc(s[0])}</b><small>Opens in your browser</small></span>${icon('ext', 18)}</a>`).join('')}</div>`;
  }
  ACT.rcat = el => { cat = el.dataset.c; rerender(); };

  function article(id) {
    const a = TEF.articles.find(x => x.id === id);
    if (!a) return list();
    if (!rd || rd.id !== id) {
      rd = { id, ans: [], qs: a.qs.map(q => { const o = shuffle(q.o.map((t, i) => ({ t, ok: i === q.a }))); return { q: q.q, o, ex: q.ex, exs: q.exs }; }), paid: false };
      onLeave(() => { rd = null; });
    }
    const qhtml = rd.qs.map((q, qi) => {
      const ans = rd.ans[qi];
      return `<div class="card quiz"><b class="fr">${esc(q.q)}</b><div class="opts">${q.o.map((o, oi) => {
        const cls = ans === undefined ? '' : o.ok ? 'right' : oi === ans ? 'wrong' : '';
        return `<button class="opt ${cls}" data-act="rdans" data-q="${qi}" data-o="${oi}" ${ans !== undefined ? 'disabled' : ''}>${esc(o.t)}</button>`;
      }).join('')}</div>${ans !== undefined ? `<div class="tipbox">${trBox(q.ex, q.exs)}</div>` : ''}</div>`;
    }).join('');
    const finished = rd.ans.length === rd.qs.length && rd.ans.every(x => x !== undefined);
    const idx = TEF.articles.findIndex(x => x.id === id), next = TEF.articles[(idx + 1) % TEF.articles.length];
    return `${back('#/read', 'Stories')}
    <span class="tag">${esc(TEF.cats[a.cat])}</span><span class="mono muted small"> ${a.lvl}</span>
    <h1 class="page fr">${esc(a.title[0])}</h1>
    ${trBox(a.title[1], a.title[2])}
    <div class="toolbar">
      <button class="btn blue" data-act="rall">${icon('play', 18)} Listen</button>
      <button class="btn ghost" data-act="rstop">${icon('stop', 18)} Stop</button>
      <button class="chip ${slow ? 'on' : ''}" data-act="rslow">Slow</button>
    </div>
    <div class="chips scroll kw">${a.kw.map(k => `<button class="chip" data-act="kw" data-f="${esc(k[0])}" data-e="${esc(k[1])}" data-s="${esc(k[2])}">${esc(k[0])}</button>`).join('')}</div>
    <div class="kwout" id="kwout" hidden></div>
    <div class="text">${a.s.map((s, i) => `<div class="sent" data-i="${i}"><div class="row"><p class="fr">${esc(s[0])}</p>${sayBtn(s[0])}</div>${trBox(s[1], s[2])}</div>`).join('')}</div>
    <h2 class="sec">Comprehension</h2>
    ${qhtml}
    ${finished ? `<div class="card center"><b>Story complete</b><p class="muted">${rd.qs.filter((q, i) => q.o[rd.ans[i]].ok).length} of ${rd.qs.length} correct</p><a class="btn" href="#/read/${next.id}">Next story</a></div>` : ''}`;
  }
  V.read = { render(id) { return id ? article(id) : list(); } };

  ACT.rall = () => {
    const a = TEF.articles.find(x => x.id === rd.id);
    speakSeq(a.s.map((s, i) => ({ t: s[0], on: () => { document.querySelectorAll('.sent').forEach(e => e.classList.remove('now')); const e = document.querySelector('.sent[data-i="' + i + '"]'); if (e) { e.classList.add('now'); e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } } })),
      () => document.querySelectorAll('.sent').forEach(e => e.classList.remove('now')), slow ? 0.7 : 1);
  };
  ACT.rstop = () => { stopSpeak(); document.querySelectorAll('.sent').forEach(e => e.classList.remove('now')); };
  ACT.rslow = () => { slow = !slow; rerender(); };
  ACT.kw = el => {
    u.speak(el.dataset.f);
    const out = document.getElementById('kwout');
    out.hidden = false;
    out.innerHTML = `<b class="fr">${esc(el.dataset.f)}</b> · <span class="mono">EN</span> ${esc(el.dataset.e)} · <span class="mono">ES</span> ${esc(el.dataset.s)}`;
  };
  ACT.rdans = el => {
    const qi = +el.dataset.q, oi = +el.dataset.o;
    rd.ans[qi] = oi;
    const ok = rd.qs[qi].o[oi].ok;
    S.stats.quizAll++; if (ok) S.stats.quizOk++;
    sfx(ok ? 'ok' : 'bad');
    const finished = rd.qs.every((q, i) => rd.ans[i] !== undefined);
    if (finished && !rd.paid) {
      rd.paid = true;
      const good = rd.qs.filter((q, i) => q.o[rd.ans[i]].ok).length;
      S.done.read[rd.id] = 1; save();
      addXP(8 + good * 6, 'Story');
      doQuest('read');
      if (good === rd.qs.length) confetti();
    }
    save(); rerender();
  };
})();
