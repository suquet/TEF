/* Words (spaced repetition), browse, match, rush, unscramble */
(function () {
  'use strict';
  const { V, ACT, IN, S, u } = TEF;
  const { esc, icon, dkey, addDays, day, shuffle, pick, short, trBox, sayBtn, back, bar, addXP, doQuest, toast, sfx, confetti, rerender, onLeave, save } = u;
  const W = () => TEF.words;
  const due = () => W().filter(w => S.srs[w.f] && S.srs[w.f].due <= dkey());
  const unseen = () => W().filter(w => !S.srs[w.f]);
  const INT = [0, 1, 3, 7, 16, 35];
  const lang = () => (S.settings.help === 'es' ? 'es' : 'en');
  const meaning = w => (lang() === 'es' ? short(w.s) : short(w.e));
  let ws = null;

  const catTag = w => `<span class="tag">${esc(TEF.cats[w.c])}</span>`;

  /* ---- hub ---- */
  function hub() {
    const nu = unseen().length, dd = due().length, d = day();
    return `<h1 class="page">Words</h1>
    <div class="list">
      <div class="card big-action">
        <div><b>Learn 5 new words</b><small>${nu ? nu + ' words waiting · ' + Math.min(d.nw, 5) + '/5 today' : 'You have met every word. Nice.'}</small></div>
        <button class="btn" data-act="startnew" ${nu ? '' : 'disabled'}>Start</button>
      </div>
      <div class="card big-action">
        <div><b>Review</b><small>${dd ? dd + ' card' + (dd > 1 ? 's' : '') + ' due now' : 'Nothing due. Come back tomorrow.'}</small></div>
        <button class="btn blue" data-act="startrev" ${dd ? '' : 'disabled'}>Review</button>
      </div>
      <a class="card link" href="#/words/all"><span class="q-t"><b>Browse all ${W().length} words</b><small>Filter by topic, tap to listen</small></span></a>
      <a class="card link" href="#/match"><span class="q-t"><b>Match game</b><small>Pair words with meanings</small></span></a>
      <a class="card link" href="#/rush"><span class="q-t"><b>Word rush</b><small>30 seconds, as many as you can</small></span></a>
      <a class="card link" href="#/unscramble"><span class="q-t"><b>Unscramble</b><small>Rebuild French sentences</small></span></a>
    </div>
    <p class="muted small">Spaced repetition: cards you know come back after 1, 3, 7, 16 and 35 days. Cards you miss come back today.</p>`;
  }
  ACT.startnew = () => { ws = { mode: 'new', q: unseen().slice(0, 5), i: 0 }; u.go('#/words/new'); };
  ACT.startrev = () => { ws = { mode: 'review', q: shuffle(due()).slice(0, 15), i: 0, flip: false, n: 0 }; u.go('#/words/review'); };

  /* ---- learn new ---- */
  function renderNew() {
    if (!ws || ws.mode !== 'new') { ws = { mode: 'new', q: unseen().slice(0, 5), i: 0 }; onLeave(() => { ws = null; }); }
    if (!ws.q.length) return `${back('#/words', 'Words')}<div class="card center"><h2>All words learned</h2><p class="muted">Use review to keep them fresh.</p><a class="btn" href="#/words">Back</a></div>`;
    if (ws.i >= ws.q.length) {
      return `<div class="card center"><div class="emo-lg">✅</div><h2>${ws.q.length} words added</h2><p class="muted">They will come back for review tomorrow.</p><a class="btn" href="#/match">Play match</a> <a class="btn ghost" href="#/words">Done</a></div>`;
    }
    const w = ws.q[ws.i];
    return `${back('#/words', 'Words')}${bar(ws.i / ws.q.length)}<p class="mono muted small">${ws.i + 1} of ${ws.q.length}</p>
    <div class="card flash">
      <div class="row between">${catTag(w)}<span class="mono muted small">${esc(w.t)}</span></div>
      <div class="big-fr">${esc(w.f)}</div>
      <div class="row">${sayBtn(w.f)}${sayBtn(w.f, 0.6, 'slow')}</div>
      <div class="meanings"><div><span class="mono">EN</span> ${esc(w.e)}</div><div><span class="mono">ES</span> ${esc(w.s)}</div></div>
      <div class="ex"><div class="row">${sayBtn(w.x)}<span>${esc(w.x)}</span></div>${trBox(w.xe, w.xs)}</div>
    </div>
    <button class="btn wide" data-act="gotit">Got it</button>`;
  }
  ACT.gotit = () => {
    const w = ws.q[ws.i];
    S.srs[w.f] = { box: 1, due: addDays(1), n: 1 };
    S.stats.words = Object.keys(S.srs).length;
    day().nw++; ws.i++;
    addXP(4);
    if (ws.i >= ws.q.length && (day().nw >= 5 || !unseen().length)) doQuest('words');
    save(); rerender();
  };

  /* ---- review ---- */
  function renderReview() {
    if (!ws || ws.mode !== 'review') { ws = { mode: 'review', q: shuffle(due()).slice(0, 15), i: 0, flip: false, n: 0 }; onLeave(() => { ws = null; }); }
    if (!ws.q.length) return `${back('#/words', 'Words')}<div class="card center"><h2>Nothing due</h2><p class="muted">Come back tomorrow, or learn new words.</p><a class="btn" href="#/words">Back</a></div>`;
    if (ws.i >= ws.q.length) return `<div class="card center"><div class="emo-lg">🧠</div><h2>Review complete</h2><p class="muted">${ws.n} cards reviewed.</p><a class="btn" href="#/words">Done</a></div>`;
    const w = ws.q[ws.i];
    return `${back('#/words', 'Words')}${bar(ws.i / ws.q.length)}<p class="mono muted small">${ws.i + 1} of ${ws.q.length}</p>
    <div class="card flash">
      <div class="big-fr">${esc(w.f)}</div>
      <div class="row">${sayBtn(w.f)}</div>
      ${ws.flip ? `<div class="meanings"><div><span class="mono">EN</span> ${esc(w.e)}</div><div><span class="mono">ES</span> ${esc(w.s)}</div></div><div class="ex"><div class="row">${sayBtn(w.x)}<span>${esc(w.x)}</span></div>${trBox(w.xe, w.xs)}</div>` : `<p class="muted">Say the meaning in your head, then flip.</p>`}
    </div>
    ${ws.flip
      ? `<div class="rate"><button class="btn danger" data-act="rate" data-r="again">Again</button><button class="btn blue" data-act="rate" data-r="good">Good</button><button class="btn" data-act="rate" data-r="easy">Easy</button></div>`
      : `<button class="btn wide" data-act="flip">Flip</button>`}`;
  }
  ACT.flip = () => { ws.flip = true; rerender(); };
  ACT.rate = el => {
    const r = el.dataset.r, w = ws.q[ws.i], s = S.srs[w.f] || { box: 0 };
    if (r === 'again') { s.box = 0; s.due = dkey(); ws.q.push(w); }
    else { s.box = Math.min(5, s.box + (r === 'easy' ? 2 : 1)); s.due = addDays(INT[s.box]); }
    s.n = (s.n || 0) + 1; S.srs[w.f] = s;
    ws.i++; ws.n++; ws.flip = false;
    addXP(r === 'again' ? 1 : 3);
    if (ws.i >= ws.q.length && !unseen().length) doQuest('words');
    save(); rerender();
  };

  /* ---- browse ---- */
  let allCat = 'all';
  function renderAll() {
    const cats = ['all'].concat(Object.keys(TEF.cats));
    return `${back('#/words', 'Words')}<h1 class="page">All words</h1>
    <input class="search" data-in="wsearch" type="search" placeholder="Search French or English" autocomplete="off">
    <div class="chips scroll">${cats.map(c => `<button class="chip ${allCat === c ? 'on' : ''}" data-act="wcat" data-c="${c}">${c === 'all' ? 'All' : esc(TEF.cats[c])}</button>`).join('')}</div>
    <div class="list" id="wlist">${W().map(w => `<div class="card word" data-c="${w.c}" data-s="${esc((w.f + ' ' + w.e + ' ' + w.s).toLowerCase())}" ${allCat !== 'all' && allCat !== w.c ? 'hidden' : ''}>
      <div class="row between"><b class="fr">${esc(w.f)}</b>${sayBtn(w.f)}</div>${trBox(w.e + ' · ' + w.s, w.s)}
    </div>`).join('')}</div>`;
  }
  ACT.wcat = el => { allCat = el.dataset.c; rerender(); };
  IN.wsearch = el => {
    const q = el.value.trim().toLowerCase();
    document.querySelectorAll('#wlist .word').forEach(c => { c.hidden = (allCat !== 'all' && allCat !== c.dataset.c) || (q && c.dataset.s.indexOf(q) < 0); });
  };

  V.words = { render(mode) { if (mode === 'new') return renderNew(); if (mode === 'review') return renderReview(); if (mode === 'all') return renderAll(); ws = null; return hub(); } };

  /* ---- match ---- */
  let mg = null, mgLock = false, mgTimer = null;
  function startMatch() {
    const learned = W().filter(w => S.srs[w.f]);
    const base = learned.length >= 6 ? learned : W();
    const six = shuffle(base).slice(0, 6);
    mg = { moves: 0, sel: [], done: 0, cards: shuffle(six.map(w => ({ id: w.f, t: w.f, k: 'f' })).concat(six.map(w => ({ id: w.f, t: meaning(w), k: 'm' })))).map((c, i) => Object.assign(c, { uid: i, st: '' })) };
    mgLock = false;
  }
  V.match = {
    render() {
      if (!mg) startMatch();
      onLeave(() => { mg = null; clearTimeout(mgTimer); });
      if (mg.done === 6) {
        return `<div class="card center"><div class="emo-lg">🧩</div><h2>Cleared in ${mg.moves} moves</h2><p class="muted">${mg.moves <= 8 ? 'Excellent memory.' : 'Try for fewer moves.'}</p><button class="btn" data-act="mrestart">Play again</button> <a class="btn ghost" href="#/games">Arcade</a></div>`;
      }
      return `${back('#/games', 'Arcade')}<h1 class="page">Match</h1><p class="muted">Pair each French word with its meaning (${lang() === 'es' ? 'Español' : 'English'}). Moves: <b class="mono">${mg.moves}</b></p>
      <div class="mgrid">${mg.cards.map(c => `<button class="mcard ${c.k} ${c.st}" data-act="mcard" data-i="${c.uid}" ${c.st === 'done' ? 'disabled' : ''}>${esc(c.t)}</button>`).join('')}</div>`;
    }
  };
  ACT.mrestart = () => { startMatch(); rerender(); };
  ACT.mcard = el => {
    if (mgLock) return;
    const c = mg.cards[+el.dataset.i];
    if (c.st || mg.sel.includes(c)) return;
    c.st = 'sel'; mg.sel.push(c); sfx('tap');
    if (mg.sel.length === 2) {
      mg.moves++;
      const [a, b] = mg.sel;
      if (a.id === b.id && a.k !== b.k) {
        a.st = b.st = 'done'; mg.sel = []; mg.done++; sfx('ok');
        if (mg.done === 6) { S.stats.games++; addXP(Math.max(8, 26 - 2 * (mg.moves - 6)), 'Match'); if (mg.moves <= 8) confetti(); }
      } else {
        a.st = b.st = 'bad'; mgLock = true; sfx('bad');
        mgTimer = setTimeout(() => { a.st = b.st = ''; mg.sel = []; mgLock = false; rerender(); }, 650);
      }
    }
    rerender();
  };

  /* ---- rush ---- */
  let rs = null;
  function rushQ() {
    const w = pick(W()), opts = shuffle([w].concat(shuffle(W().filter(x => x !== w)).slice(0, 3)));
    rs.q = { w, opts, a: opts.indexOf(w) };
  }
  V.rush = {
    render() {
      if (!rs) { rs = { score: 0, combo: 0, best: 0, t: 30, over: false }; rushQ(); }
      onLeave(() => { if (rs && rs.iv) clearInterval(rs.iv); rs = null; });
      if (rs.over) {
        return `<div class="card center"><div class="emo-lg">⏱️</div><h2>${rs.score} correct</h2><p class="muted">Best combo ×${rs.best}</p><button class="btn" data-act="rrestart">Go again</button> <a class="btn ghost" href="#/games">Arcade</a></div>`;
      }
      const q = rs.q;
      return `${back('#/games', 'Arcade')}<div class="rush-top mono"><span id="rt">${rs.t}s</span><span>score ${rs.score}</span><span>combo ×${rs.combo}</span></div>${bar(rs.t / 30)}
      <div class="card flash center"><p class="muted small">What does this mean?</p><div class="big-fr">${esc(q.w.f)}</div></div>
      <div class="opts">${q.opts.map((o, i) => `<button class="opt" data-act="rans" data-i="${i}">${esc(meaning(o))}</button>`).join('')}</div>`;
    },
    mount() {
      if (rs && !rs.over && !rs.iv) {
        rs.iv = setInterval(() => {
          rs.t--;
          const e = document.getElementById('rt');
          if (e) e.textContent = rs.t + 's';
          if (rs.t <= 0) { clearInterval(rs.iv); rs.iv = null; rs.over = true; S.stats.games++; addXP(Math.min(30, rs.score * 2), 'Word rush'); rerender(); }
        }, 1000);
      }
    }
  };
  ACT.rrestart = () => { rs = null; rerender(); };
  ACT.rans = el => {
    if (!rs || rs.over) return;
    if (+el.dataset.i === rs.q.a) { rs.score++; rs.combo++; rs.best = Math.max(rs.best, rs.combo); sfx('ok'); }
    else { rs.combo = 0; sfx('bad'); }
    rushQ();
    const t = rs.t;
    rerender();
    rs.t = t;
  };

  /* ---- unscramble ---- */
  let us = null;
  function sentencePool() {
    const out = [];
    W().forEach(w => out.push([w.x, w.xe, w.xs]));
    TEF.articles.forEach(a => a.s.forEach(s => out.push(s)));
    TEF.roles.forEach(r => r.steps.forEach(s => { out.push(s.p); out.push(s.m); }));
    return out.filter(s => { const n = s[0].split(/\s+/).length; return n >= 5 && n <= 11; });
  }
  function newItem(s) {
    const words = s[0].split(/\s+/).map((w, i) => ({ k: i, w }));
    return { fr: s[0], en: s[1], es: s[2], pool: shuffle(words), ans: [], res: null };
  }
  function startUs() { us = { items: shuffle(sentencePool()).slice(0, 5).map(newItem), i: 0, ok: 0 }; }
  V.unscramble = {
    render() {
      if (!us) startUs();
      onLeave(() => { us = null; });
      if (us.i >= us.items.length) {
        return `<div class="card center"><div class="emo-lg">🔀</div><h2>${us.ok} of ${us.items.length} rebuilt</h2><button class="btn" data-act="urestart">Play again</button> <a class="btn ghost" href="#/games">Arcade</a></div>`;
      }
      const it = us.items[us.i];
      return `${back('#/games', 'Arcade')}${bar(us.i / us.items.length)}<h1 class="page">Unscramble</h1>
      <p class="muted">Tap the words in the right order.</p>
      <div class="ans ${it.res === true ? 'good' : it.res === false ? 'bad' : ''}">${it.ans.map(t => `<button class="tok" data-act="utok" data-k="${t.k}" data-from="a" ${it.res !== null ? 'disabled' : ''}>${esc(t.w)}</button>`).join('') || '<span class="muted small">Your sentence appears here</span>'}</div>
      <div class="pool">${it.pool.map(t => `<button class="tok" data-act="utok" data-k="${t.k}" data-from="p">${esc(t.w)}</button>`).join('')}</div>
      ${trBox(it.en, it.es)}
      ${it.res === null
        ? `<div class="rate"><button class="btn" data-act="ucheck" ${it.pool.length ? 'disabled' : ''}>Check</button><button class="btn ghost" data-act="uskip">Skip</button></div>`
        : `<div class="card"><b>${it.res ? 'Correct' : 'Answer'}</b><div class="row">${sayBtn(it.fr)}<span>${esc(it.fr)}</span></div></div><button class="btn wide" data-act="unext">Next</button>`}`;
    }
  };
  ACT.urestart = () => { startUs(); rerender(); };
  ACT.utok = el => {
    const it = us.items[us.i], k = +el.dataset.k;
    if (it.res !== null) return;
    if (el.dataset.from === 'p') { const t = it.pool.find(x => x.k === k); it.pool = it.pool.filter(x => x.k !== k); it.ans.push(t); }
    else { const t = it.ans.find(x => x.k === k); it.ans = it.ans.filter(x => x.k !== k); it.pool.push(t); }
    sfx('tap'); rerender();
  };
  ACT.ucheck = () => {
    const it = us.items[us.i];
    it.res = it.ans.map(t => t.w).join(' ') === it.fr;
    if (it.res) { us.ok++; sfx('ok'); addXP(5); } else sfx('bad');
    rerender();
  };
  ACT.uskip = () => { us.i++; rerender(); };
  ACT.unext = () => {
    us.i++;
    if (us.i >= us.items.length) { S.stats.games++; if (us.ok >= 4) confetti(); save(); }
    rerender();
  };
})();
