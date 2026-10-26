/* Home, More, Progress, Settings, Guide */
(function () {
  'use strict';
  const { V, ACT, IN, S, u } = TEF;
  const { esc, icon, levelInfo, day, QUESTS, ring, bar, trBox, sayBtn, dkey, todayPick, todayIdx, curStreak, BADGES, toast, copyText, back } = u;

  const picks = () => ({
    words: '#/words', read: '#/read/' + todayPick(TEF.articles).id, listen: '#/listen/' + todayPick(TEF.listen).id,
    speak: '#/speak/' + todayPick(TEF.roles).id, write: '#/write/' + todayPick(TEF.write).id, boss: '#/boss'
  });

  function examCard() {
    if (!S.settings.exam) return `<a class="card exam" href="#/settings"><div><b>Set your exam date</b><small>A deadline turns study into a plan.</small></div><span class="pill">Set</span></a>`;
    const left = Math.ceil((new Date(S.settings.exam + 'T00:00:00') - new Date()) / 86400000);
    if (left < 0) return `<a class="card exam" href="#/settings"><div><b>Exam date passed</b><small>Update it in settings.</small></div><span class="pill">Edit</span></a>`;
    return `<a class="card exam" href="#/guide"><div><b class="mono">T-${left} day${left === 1 ? '' : 's'}</b><small>until your TEF exam · see the weekly plan</small></div><span class="pill">${left <= 14 ? 'Final sprint' : 'On track'}</span></a>`;
  }

  V.home = {
    render() {
      const L = levelInfo(), d = day(), goal = S.settings.goal, p = picks(), w = todayPick(TEF.words);
      const done = QUESTS.filter(q => d.q[q.id]).length;
      const tip = TEF.tips[todayIdx() % TEF.tips.length];
      return `
      <section class="hero">
        <div class="hero-row">
          <div>
            <div class="mono lbl">level ${L.L}</div>
            <h1 class="lvl">${esc(L.name)}</h1>
            <p class="sub">${S.settings.name ? 'Bonjour, ' + esc(S.settings.name) + ' !' : 'Bonjour !'} ${done === QUESTS.length ? 'All quests cleared. Beau travail.' : 'Pick a quest and start.'}</p>
          </div>
          ${ring(d.xp / goal, d.xp + '/' + goal, 'XP today')}
        </div>
        ${bar(L.pct)}
        <div class="bar-l mono"><span>${S.xp} XP</span><span>${L.hi - S.xp} to level ${L.L + 1}</span></div>
      </section>
      ${examCard()}
      <h2 class="sec">Daily quests <span class="mono count">${done}/${QUESTS.length}</span></h2>
      <div class="quests">${QUESTS.map(q => {
        const dn = !!d.q[q.id];
        return `<a class="quest ${dn ? 'done' : ''}" href="${p[q.id]}"><span class="q-ico">${icon(dn ? 'check' : q.ico, 22)}</span><span class="q-t"><b>${q.t}</b><small>${q.s}</small></span><span class="q-xp mono">${dn ? 'done' : '+' + q.xp}</span></a>`;
      }).join('')}</div>
      <h2 class="sec">Word of the day</h2>
      <div class="card wotd">
        <div class="row"><div class="big-fr">${esc(w.f)}</div>${sayBtn(w.f)}</div>
        <div class="muted">${esc(w.x)}</div>
        ${trBox(w.e + ' · ' + w.s + ' | ' + w.xe, w.s + ' | ' + w.xs)}
      </div>
      <h2 class="sec">Arcade</h2>
      <div class="chips scroll">
        <a class="chip" href="#/match">Match</a><a class="chip" href="#/rush">Word rush</a><a class="chip" href="#/unscramble">Unscramble</a>
        <a class="chip" href="#/numbers">Number ninja</a><a class="chip" href="#/dict">Dictation</a><a class="chip" href="#/quiz">Quiz</a>
        <a class="chip" href="#/shadow">Shadowing</a><a class="chip" href="#/twisters">Tongue twisters</a>
      </div>
      <h2 class="sec">Tip of the day</h2>
      <a class="card tip" href="#/reddit"><b>${esc(tip.t)}</b><span class="muted">${esc(tip.d)}</span></a>`;
    }
  };

  V.more = {
    render() {
      const item = (h, ic, t, s) => `<a class="card link" href="${h}"><span class="q-ico">${icon(ic)}</span><span class="q-t"><b>${t}</b><small>${s}</small></span></a>`;
      return `<h1 class="page">More</h1>
      <div class="list">
        ${item('#/games', 'zap', 'Arcade', 'Match, word rush, unscramble, number ninja')}
        ${item('#/quiz', 'check', 'Grammar quiz', 'Instant tips in English and Spanish')}
        ${item('#/boss', 'swords', 'Daily boss', 'Ten questions, three lives')}
        ${item('#/videos', 'play', 'Videos & podcasts', 'Curated for TEF and daily life')}
        ${item('#/reddit', 'book', 'Community tips', 'Study habits that work, plus Reddit links')}
        ${item('#/quebec', 'home', 'Québec corner', 'Canadian French you will hear on the exam day and after')}
        ${item('#/guide', 'grid', 'TEF guide', 'Exam anatomy and a weekly plan')}
        ${item('#/progress', 'flame', 'Progress & badges', 'Streaks, skills, achievements')}
        ${item('#/settings', 'cog', 'Settings', 'Translations, voice, exam date, backup')}
      </div>`;
    }
  };

  V.games = {
    render() {
      const g = (h, t, s, e) => `<a class="card game" href="${h}"><span class="emo">${e}</span><b>${t}</b><small>${s}</small></a>`;
      return `${back('#/more', 'More')}<h1 class="page">Arcade</h1>
      <div class="grid2">
        ${g('#/match', 'Match', 'Pair words with meanings', '🧩')}
        ${g('#/rush', 'Word rush', '30 seconds, combos', '⏱️')}
        ${g('#/unscramble', 'Unscramble', 'Rebuild French sentences', '🔀')}
        ${g('#/numbers', 'Number ninja', 'Numbers, times, prices', '🥷')}
        ${g('#/dict', 'Dictation', 'Hear it, type it', '⌨️')}
        ${g('#/quiz', 'Grammar quiz', '10 quick questions', '🎯')}
        ${g('#/shadow', 'Shadowing', 'Repeat after the model', '🗣️')}
        ${g('#/twisters', 'Tongue twisters', 'Virelangues', '🌀')}
        ${g('#/boss', 'Daily boss', 'Win for 60 XP', '👾')}
      </div>`;
    }
  };

  V.progress = {
    render() {
      const L = levelInfo(), n = k => Object.keys(S.done[k]).length;
      const days = [];
      for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = dkey(d); days.push({ k, l: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()], xp: (S.days[k] || {}).xp || 0 }); }
      const mx = Math.max(50, ...days.map(x => x.xp));
      const skills = [
        ['Vocabulary', S.stats.words / TEF.words.length, S.stats.words + '/' + TEF.words.length],
        ['Reading', n('read') / TEF.articles.length, n('read') + '/' + TEF.articles.length],
        ['Listening', (n('listen') + n('dict')) / (TEF.listen.length + TEF.dict.length), (n('listen') + n('dict')) + '/' + (TEF.listen.length + TEF.dict.length)],
        ['Speaking', n('speak') / TEF.roles.length, n('speak') + '/' + TEF.roles.length],
        ['Writing', n('write') / TEF.write.length, n('write') + '/' + TEF.write.length],
        ['Quiz accuracy', S.stats.quizAll ? S.stats.quizOk / S.stats.quizAll : 0, S.stats.quizAll ? Math.round(100 * S.stats.quizOk / S.stats.quizAll) + '%' : '–']
      ];
      return `${back('#/more', 'More')}<h1 class="page">Progress</h1>
      <div class="stats">
        <div class="stat"><b class="mono">${S.xp}</b><small>total XP</small></div>
        <div class="stat"><b class="mono">${L.L}</b><small>${esc(L.name)}</small></div>
        <div class="stat"><b class="mono">${curStreak()}</b><small>day streak</small></div>
        <div class="stat"><b class="mono">${S.best}</b><small>best streak</small></div>
      </div>
      <h2 class="sec">Last 7 days</h2>
      <div class="card chart" role="img" aria-label="XP per day for the last 7 days">${days.map(x => `<div class="col"><i style="height:${Math.max(4, 100 * x.xp / mx)}%"></i><small class="mono">${x.l}</small><em class="mono">${x.xp || ''}</em></div>`).join('')}</div>
      <h2 class="sec">Skills coverage</h2>
      <div class="card skills">${skills.map(s => `<div class="skill"><span>${s[0]}</span>${bar(s[1])}<small class="mono">${s[2]}</small></div>`).join('')}</div>
      <h2 class="sec">Badges <span class="mono count">${Object.keys(S.badges).length}/${BADGES.length}</span></h2>
      <div class="badges">${BADGES.map(b => `<div class="badge ${S.badges[b.id] ? 'on' : ''}"><span>${S.badges[b.id] ? b.i : '🔒'}</span><b>${esc(b.n)}</b><small>${esc(b.d)}</small></div>`).join('')}</div>`;
    }
  };

  V.guide = {
    render() {
      const g = TEF.guide;
      return `${back('#/more', 'More')}<h1 class="page">TEF Canada guide</h1>
      <p class="muted">The four mandatory sections used for most Canadian immigration programs. Details change, so confirm timings, scoring and validity with your exam centre and IRCC.</p>
      <div class="list">${g.sections.map(s => `<div class="card"><div class="row between"><b>${esc(s.n)}</b><span class="pill mono">${esc(s.min)}</span></div><span class="muted">${esc(s.d)}</span><small class="mono train">train: ${esc(s.train)}</small></div>`).join('')}</div>
      <h2 class="sec">A weekly rhythm</h2>
      <div class="card week">${g.week.map(w => `<div class="wk"><b class="mono">${w[0]}</b><span>${esc(w[1])}</span></div>`).join('')}</div>
      <h2 class="sec">Official sources</h2>
      <div class="list">${g.links.map(l => `<a class="card link" href="${l[1]}" target="_blank" rel="noopener"><span class="q-t"><b>${esc(l[0])}</b></span>${icon('ext', 18)}</a>`).join('')}</div>
      <p class="muted small">TEF Quest is an independent practice tool. It is not affiliated with the organizers of the TEF or with IRCC.</p>`;
    }
  };

  /* settings */
  let resetArm = false;
  V.settings = {
    render() {
      const s = S.settings, vs = u.voiceList();
      const opt = (v, t, cur) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(t)}</option>`;
      return `${back('#/more', 'More')}<h1 class="page">Settings</h1>
      <div class="card form">
        <label>Your name (optional)<input data-in="name" type="text" value="${esc(s.name)}" maxlength="24" autocomplete="off"></label>
        <label>Show translations automatically
          <select data-in="help">${opt('off', 'Off: French first, tap EN or ES', s.help)}${opt('en', 'English', s.help)}${opt('es', 'Español', s.help)}</select></label>
        <label>Exam date<input data-in="exam" type="date" value="${esc(s.exam)}"></label>
        <label>Daily XP goal
          <select data-in="goal">${[50, 100, 150, 250].map(g => opt(g, g + ' XP', s.goal)).join('')}</select></label>
        <label>Speech speed <span class="mono">${s.rate.toFixed(2)}×</span><input data-in="rate" type="range" min="0.6" max="1.2" step="0.05" value="${s.rate}"></label>
        <label>Voice
          <select data-in="voice">${opt('', vs.length ? 'Automatic (prefers Canadian French)' : 'Automatic (no French voices found)', s.voice)}${vs.map(v => opt(v.name, v.name + ' · ' + v.lang, s.voice)).join('')}</select></label>
        <button class="btn ghost" data-act="testvoice">${icon('vol', 18)} Test voice</button>
        <label>Theme
          <select data-in="theme">${opt('dark', 'Dark', s.theme)}${opt('light', 'Light', s.theme)}${opt('auto', 'Match my device', s.theme)}</select></label>
        <label class="check"><input data-in="sfx" type="checkbox" ${s.sfx ? 'checked' : ''}> Sound effects</label>
        <label class="check"><input data-in="once" type="checkbox" ${s.once ? 'checked' : ''}> Exam mode in listening: audio plays once</label>
      </div>
      <h2 class="sec">Backup</h2>
      <div class="card form">
        <p class="muted small">Progress is stored only in this browser. Copy a backup to move it to another device.</p>
        <button class="btn blue" data-act="export">Copy backup</button>
        <textarea id="imp" rows="3" placeholder="Paste a backup here to restore it" spellcheck="false"></textarea>
        <button class="btn ghost" data-act="import">Restore backup</button>
        <button class="btn danger" data-act="reset">${resetArm ? 'Tap again to erase everything' : 'Reset all progress'}</button>
      </div>
      <p class="muted small mono">TEF Quest · open source · MIT</p>`;
    }
  };
  const applyTheme = () => {
    const t = S.settings.theme, h = document.documentElement;
    if (t === 'auto') h.removeAttribute('data-theme'); else h.setAttribute('data-theme', t);
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'light' ? '#F3F6FD' : '#060A14');
  };
  TEF.applyTheme = applyTheme;
  IN.name = el => { S.settings.name = el.value.trim(); u.save(); };
  IN.help = el => { S.settings.help = el.value; u.save(); };
  IN.exam = el => { S.settings.exam = el.value; u.save(); };
  IN.goal = el => { S.settings.goal = parseInt(el.value, 10) || 100; u.save(); };
  IN.rate = el => { S.settings.rate = parseFloat(el.value) || 1; u.save(); const l = el.closest('label').querySelector('.mono'); if (l) l.textContent = S.settings.rate.toFixed(2) + '×'; };
  IN.voice = el => { S.settings.voice = el.value; u.save(); };
  IN.theme = el => { S.settings.theme = el.value; u.save(); applyTheme(); };
  IN.sfx = el => { S.settings.sfx = el.checked; u.save(); };
  IN.once = el => { S.settings.once = el.checked; u.save(); };
  ACT.testvoice = () => u.speak('Bonjour! Prêt pour le TEF?');
  ACT.export = () => copyText(JSON.stringify(S), 'Backup copied');
  ACT.import = () => {
    const ta = document.getElementById('imp');
    try { const o = JSON.parse(ta.value); if (typeof o !== 'object' || o === null || !('xp' in o)) throw new Error('bad'); u.importAll(o); toast('Progress restored', 'xp'); applyTheme(); u.rerender(); }
    catch (e) { toast('That backup could not be read', 'bad'); }
  };
  ACT.reset = () => {
    if (!resetArm) { resetArm = true; u.rerender(); setTimeout(() => { resetArm = false; }, 4000); return; }
    resetArm = false; u.resetAll(); applyTheme(); toast('Progress erased'); u.rerender();
  };
})();
