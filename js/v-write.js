/* Writing */
(function () {
  'use strict';
  const { V, ACT, IN, S, u } = TEF;
  const { esc, icon, trBox, back, addXP, doQuest, sfx, confetti, rerender, todayPick, onLeave, save, toast, copyText, startTimer } = u;
  let wr = null, stopT = null;
  const words = t => (t.trim() ? t.trim().split(/\s+/).length : 0);

  function hub() {
    const t = todayPick(TEF.write);
    return `<h1 class="page">Write</h1>
    <p class="muted small">Section A: continue a news item (80+ words). Section B: argue your point of view (200+ words). Drafts save automatically on this device.</p>
    <div class="list">${TEF.write.map(w => `<a class="card art ${S.done.write[w.id] ? 'done' : ''}" href="#/write/${w.id}">
      <div class="row between"><span class="tag">Section ${w.sec}</span><span class="mono muted small">${w.min}+ words${w.id === t.id ? ' · today' : ''}</span></div>
      <b>${esc(w.title)}</b>${S.drafts[w.id] ? '<span class="mono muted small">draft: ' + words(S.drafts[w.id]) + ' words</span>' : ''}${S.done.write[w.id] ? '<span class="mono ok small">completed</span>' : ''}</a>`).join('')}</div>`;
  }

  const WC = () => TEF.wc;
  const ensure = id => {
    if (!wr || wr.id !== id) {
      if (wr && wr.ctl) wr.ctl.abort();
      wr = { id, checks: {}, model: false, local: [], lt: [], all: [], ltState: 'idle', ltText: '', ignored: {}, gained: 0, deep: null, deepBusy: false, focus: -1 };
      onLeave(() => { if (wr && wr.ctl) wr.ctl.abort(); clearTimeout(tL); clearTimeout(tT); wr = null; if (stopT) { stopT(); stopT = null; } });
    }
    return wr;
  };
  let tL = 0, tT = 0;
  const curW = () => TEF.write.find(x => x.id === wr.id);
  const ctxOf = w => ({ sec: w.sec, reg: w.reg, min: w.min });

  function editor(id) {
    const w = TEF.write.find(x => x.id === id);
    if (!w) return hub();
    ensure(id);
    const text = S.drafts[id] || '';
    const n = words(text);
    setTimeout(() => { if (wr && wr.id === id) { analyze(true); } }, 0);
    return `${back('#/write', 'Write')}
    <span class="tag">Section ${w.sec}</span> <span class="mono muted small">${w.min}+ words · about ${w.mins} min${w.reg ? ' · ' + (w.reg === 'formal' ? 'formal letter (vous)' : 'friendly letter (tu)') : ''}</span>
    <h1 class="page">${esc(w.title)}</h1>
    <div class="card prompt"><p class="fr">${esc(w.task)}</p>${w.start ? `<blockquote class="fr">${esc(w.start)}</blockquote>` : ''}${trBox(w.taskEn, w.taskEs)}</div>
    <div class="toolbar"><span class="mono timer" id="wtimer">${String(w.mins).padStart(2, '0')}:00</span><button class="btn ghost" data-act="wtimer">Start timer</button></div>
    ${ltCard()}
    <div class="editor"><div class="hl" id="whl" aria-hidden="true"></div><textarea id="wtext" class="area write" data-in="wtext" rows="10" placeholder="Écrivez ici… I'll check as you type." spellcheck="false" lang="fr" autocapitalize="sentences" autocorrect="off">${esc(text)}</textarea></div>
    <div class="live mono" id="wlive"><span class="dot"></span><span id="wstate">Live check on</span></div>
    <div id="wfocus" class="focusbar" hidden></div>
    <div class="wc mono"><span id="wcount">${n}</span> / ${w.min} words</div><div class="bar" id="wbarwrap"><i id="wbar" style="width:${Math.min(100, 100 * n / w.min)}%"></i></div>
    <div class="card meters" id="wmeters"></div>
    <div id="wissues"></div>
    <details class="card"><summary>Phrase bank <span class="muted small">(tap to insert)</span></summary>${TEF.phrases.map(g => `<div class="pg"><small class="mono">${esc(g.g)}</small><div class="chips wrap">${g.p.map(p => `<button class="chip" data-act="ins" data-t="${esc(p)}">${esc(p.length > 40 ? p.slice(0, 38) + '…' : p)}</button>`).join('')}</div></div>`).join('')}</details>
    <details class="card"><summary>Self-check</summary><div class="checks">${TEF.checklist.map((c, i) => `<label class="check"><input type="checkbox" data-in="chk" data-i="${i}" ${wr.checks[i] ? 'checked' : ''}> ${esc(c)}</label>`).join('')}</div></details>
    <div id="wdeep"></div>
    <div class="rate">${TEF.ai && TEF.ai.has() ? '<button class="btn blue" id="wdeepbtn" data-act="wdeep">Deep check with AI</button>' : ''}<button class="btn ${TEF.ai && TEF.ai.has() ? 'ghost' : 'blue'}" data-act="wcopy">Copy for AI feedback</button><button class="btn" id="wfin" data-act="wfin" ${n >= w.min ? '' : 'disabled'}>Finish</button></div>
    ${TEF.ai && TEF.ai.has() ? '' : '<p class="muted small">Tip: add your own Anthropic key in Settings for a full examiner-style review.</p>'}
    ${w.model ? `<button class="chip" data-act="wmodel">${wr.model ? 'Hide' : 'Show'} model answer</button>${wr.model ? `<div class="card model"><p class="fr pre">${esc(w.model)}</p></div>` : ''}` : ''}`;
  }
  V.write = { render(id) { return id ? editor(id) : hub(); } };

  function ltCard() {
    const v = S.settings.lt;
    if (v === 'on' || v === 'off') return '';
    return `<div class="card consent" id="wlt"><b>Turn on the grammar engine?</b>
      <p class="small muted">The instant checks run on your device. For deeper grammar and spelling, your text can also be sent while you type to the free LanguageTool service (languagetool.org). Nothing is stored in your account here. You can change this in Settings.</p>
      <div class="rate"><button class="btn blue" data-act="ltyes">Yes, use it</button><button class="btn ghost" data-act="ltno">Keep it offline</button></div></div>`;
  }

  /* ---------- analysis and rendering ---------- */
  function analyze(first) {
    if (!wr || !document.getElementById('wtext')) return;
    const w = curW(), ta = document.getElementById('wtext'), text = ta.value;
    const r = WC().check(text, ctxOf(w));
    wr.local = r.issues; wr.stats = r.stats;
    if (wr.lt.length && wr.ltText !== text) wr.lt = WC().shift(wr.lt, wr.ltText, text), wr.ltText = text;
    paint();
    if (S.settings.lt === 'on' && words(text) >= 3) {
      clearTimeout(tL);
      if (wr.ltText !== text || first) {
        wr.ltState = wr.ltState === 'err' ? 'err' : 'wait';
        tL = setTimeout(runLT, first ? 300 : 900);
      }
    }
    status();
  }

  async function runLT() {
    if (!wr) return;
    const ta = document.getElementById('wtext'); if (!ta) return;
    const text = ta.value, id = wr.id;
    if (!text.trim()) { wr.lt = []; wr.ltText = text; paint(); status(); return; }
    if (wr.ctl) wr.ctl.abort();
    wr.ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    wr.ltState = 'busy'; status();
    try {
      const list = await WC().ltCheck(text.slice(0, 9000), wr.ctl && wr.ctl.signal);
      if (!wr || wr.id !== id) return;
      wr.lt = list; wr.ltText = text; wr.ltState = 'ok';
      const now = document.getElementById('wtext');
      if (now && now.value !== text) { wr.lt = WC().shift(wr.lt, text, now.value); wr.ltText = now.value; wr.ltState = 'wait'; clearTimeout(tL); tL = setTimeout(runLT, 600); }
    } catch (e) {
      if (!wr || wr.id !== id || (e && e.name === 'AbortError')) return;
      if (e && e.code === 429) { wr.ltState = 'slow'; clearTimeout(tL); tL = setTimeout(runLT, 8000); }
      else wr.ltState = 'err';
    }
    paint(); status();
  }

  function status() {
    const el = document.getElementById('wstate'), box = document.getElementById('wlive');
    if (!el || !wr) return;
    const m = { idle: 'Live check on', wait: 'Checking…', busy: 'Checking grammar online…', ok: 'Live check + grammar engine', slow: 'Grammar engine is busy, retrying…', err: 'Grammar engine unreachable. Instant checks still work.' };
    const off = S.settings.lt !== 'on';
    el.textContent = off ? 'Live check on (offline rules)' : (m[wr.ltState] || m.idle);
    box.className = 'live mono ' + (wr.ltState === 'err' ? 'bad' : wr.ltState === 'busy' || wr.ltState === 'wait' ? 'busy' : '');
  }

  const key = i => i.rule + '|' + i.sw;
  function paint() {
    if (!wr) return;
    const ta = document.getElementById('wtext'); if (!ta) return;
    const text = ta.value;
    let all = WC().merge(wr.local, wr.lt).filter(i => i.s < 0 || (i.e <= text.length && i.s >= 0));
    all.forEach(i => { i.sw = i.s >= 0 ? text.slice(i.s, i.e) : ''; });
    all = all.filter(i => !wr.ignored[key(i)]);
    all.forEach((i, n) => { i.id = n; });
    wr.all = all;
    // highlights
    let html = '', pos = 0;
    all.filter(i => i.s >= 0).forEach(i => {
      if (i.s < pos) return;
      html += esc(text.slice(pos, i.s)) + `<mark class="m-${i.type}" data-i="${i.id}">${esc(text.slice(i.s, i.e)) || '&nbsp;'}</mark>`;
      pos = i.e;
    });
    html += esc(text.slice(pos)) + '\n​';
    const hl = document.getElementById('whl'); if (hl) hl.innerHTML = html;
    grow();
    renderIssues(); renderMeters(); focusBar();
  }
  function grow() {
    const ta = document.getElementById('wtext'); if (!ta) return;
    ta.style.height = 'auto'; ta.style.height = Math.max(220, ta.scrollHeight + 2) + 'px';
  }
  const label = { error: 'Fix', style: 'Style', tip: 'Tip' };
  function explain(i) {
    const es = S.settings.help === 'es';
    if (i.src === 'lt') return `<span class="fr">${esc(i.fr || '')}</span> <span class="muted small">${esc(es ? i.es : i.en)}</span>`;
    return esc(es ? i.es : i.en);
  }
  function card(i, compact) {
    const wrong = i.s >= 0 ? `<span class="wrong">${esc(i.sw)}</span>` : '';
    const fix = i.fix != null && i.s >= 0 ? `${wrong ? '<span class="arr">→</span>' : ''}<span class="right">${esc(i.fix) || '(delete)'}</span>` : '';
    return `<div class="issue ${i.type}" data-i="${i.id}"><div class="ihead"><span class="ilab">${label[i.type] || 'Tip'}</span>${wrong}${fix}</div>
      <p class="small">${explain(i)}</p>
      <div class="irow">${i.fix != null && i.s >= 0 ? `<button class="chip ok" data-act="wfix" data-i="${i.id}">Apply</button>` : ''}${(i.alts || []).map((a, k) => `<button class="chip" data-act="wfix" data-i="${i.id}" data-k="${k}">${esc(a)}</button>`).join('')}<button class="chip" data-act="wign" data-i="${i.id}">Ignore</button></div></div>`;
  }
  function renderIssues() {
    const box = document.getElementById('wissues'); if (!box) return;
    const text = (document.getElementById('wtext') || {}).value || '';
    if (!text.trim()) { box.innerHTML = ''; return; }
    const errs = wr.all.filter(i => i.type === 'error'), rest = wr.all.filter(i => i.type !== 'error');
    if (!wr.all.length) { box.innerHTML = `<div class="card okcard"><b>Looks clean so far.</b><p class="small muted">No issues found by the checks. Keep going, then proofread once more.</p></div>`; return; }
    const shown = errs.concat(rest).slice(0, 12);
    box.innerHTML = `<h2 class="sec">Suggestions <span class="mono muted small">${errs.length} to fix · ${rest.length} tips</span></h2>${shown.map(i => card(i)).join('')}${wr.all.length > 12 ? `<p class="muted small">+ ${wr.all.length - 12} more. Fix these first.</p>` : ''}`;
  }
  function focusBar() {
    const fb = document.getElementById('wfocus'), ta = document.getElementById('wtext'); if (!fb || !ta) return;
    const c = ta.selectionStart, i = wr.all.find(x => x.s >= 0 && c >= x.s && c <= x.e && document.activeElement === ta);
    if (!i) { fb.hidden = true; return; }
    fb.hidden = false; fb.innerHTML = card(i, true);
  }
  function renderMeters() {
    const box = document.getElementById('wmeters'); if (!box || !wr.stats) return;
    const st = wr.stats, w = curW(), avg = st.avgLen;
    const lvl = (v, lo, hi) => v >= lo && v <= hi ? 'good' : 'warn';
    const m = (name, val, cls, hint) => `<div class="meter ${cls}"><b class="mono">${val}</b><small>${name}</small>${hint ? `<em>${hint}</em>` : ''}</div>`;
    box.innerHTML = `<div class="mrow">${m('words', st.words + '/' + w.min, st.words >= w.min ? 'good' : 'warn')}
      ${m('avg sentence', st.sentences ? avg.toFixed(0) + ' w' : '–', st.sentences ? lvl(avg, 8, 24) : '', avg > 24 ? 'shorten' : avg && avg < 8 ? 'combine' : '')}
      ${m('connectors', st.connectors.length, st.connectors.length >= (w.sec === 'B' ? 4 : 2) ? 'good' : 'warn')}
      ${m('variety', st.words > 20 ? Math.round(st.ttr * 100) + '%' : '–', st.words > 20 ? (st.ttr > 0.6 ? 'good' : 'warn') : '')}</div>
      ${st.words >= 8 && st.suggest.length ? `<div class="chips wrap"><small class="mono muted">Try a connector:</small>${st.suggest.map(c => `<button class="chip" data-act="ins" data-t="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}`;
  }

  IN.wtext = el => {
    const w = curW();
    S.drafts[wr.id] = el.value; save();
    const n = words(el.value);
    document.getElementById('wcount').textContent = n;
    document.getElementById('wbar').style.width = Math.min(100, 100 * n / w.min) + '%';
    document.getElementById('wfin').disabled = n < w.min;
    // keep highlights glued to the text right away, then re-check shortly
    const hl = document.getElementById('whl'); if (hl && wr.ltText !== el.value) { /* old highlights shift in analyze */ }
    clearTimeout(tT);
    tT = setTimeout(() => analyze(false), 160);
  };
  document.addEventListener('selectionchange', () => { if (wr && document.activeElement && document.activeElement.id === 'wtext') focusBar(); });
  document.addEventListener('scroll', () => {}, { passive: true });

  function applyFix(i, alt) {
    const ta = document.getElementById('wtext'); if (!ta || i.s < 0) return;
    const rep = alt != null ? i.alts[alt] : i.fix;
    if (rep == null) return;
    const before = ta.value;
    if (before.slice(i.s, i.e) !== i.sw) { toast('That text changed. Check again.', 'bad'); analyze(false); return; }
    ta.value = before.slice(0, i.s) + rep + before.slice(i.e);
    ta.selectionStart = ta.selectionEnd = i.s + rep.length;
    wr.lt = WC().shift(wr.lt, before, ta.value); wr.ltText = ta.value;
    S.stats.fixes = (S.stats.fixes || 0) + 1;
    if (wr.gained < 10) { wr.gained += 1; addXP(1, 'Fix'); }
    sfx('ok');
    IN.wtext(ta);
    analyze(false);
    S.stats.fixes >= 10 && u.checkBadges && u.checkBadges();
  }
  ACT.wfix = el => { const i = wr.all[+el.dataset.i]; if (i) applyFix(i, el.dataset.k != null ? +el.dataset.k : null); };
  ACT.wign = el => { const i = wr.all[+el.dataset.i]; if (i) { wr.ignored[key(i)] = 1; paint(); } };
  ACT.ltyes = () => { S.settings.lt = 'on'; save(); const c = document.getElementById('wlt'); if (c) c.remove(); analyze(true); };
  ACT.ltno = () => { S.settings.lt = 'off'; save(); const c = document.getElementById('wlt'); if (c) c.remove(); status(); };

  ACT.wdeep = async el => {
    const w = curW(), t = (S.drafts[wr.id] || '').trim();
    if (words(t) < 15) { toast('Write a little more first', 'bad'); return; }
    if (wr.deepBusy) return;
    wr.deepBusy = true; el.disabled = true; el.textContent = 'Reading your text…';
    const box = document.getElementById('wdeep');
    try {
      const out = await TEF.ai.complete({
        max: 1400,
        system: 'You are a strict but kind TEF Canada writing examiner. The learner is a Spanish speaker writing French. Reply with ONLY a JSON object: {"nclc":"estimated level like B1 / NCLC 6","task":"one sentence on task fulfilment (English)","strengths":["max 3 short items in English"],"fixes":[{"orig":"exact wrong snippet from the text","fix":"corrected French","why":"short English reason"}],"rewrite":"the learner text corrected minimally, in French","next":"one concrete priority in English"}. At most 8 fixes, most important first.',
        messages: [{ role: 'user', content: 'Task (' + (w.reg || 'free') + ', Section ' + w.sec + ', min ' + w.min + ' words): ' + w.task + (w.start ? '\nGiven start: ' + w.start : '') + '\n\nLearner text:\n' + t }]
      });
      const j = TEF.ai.json(out);
      if (!j) throw new Error('The AI answer could not be read. Try again.');
      wr.deep = j;
      box.innerHTML = `<div class="card deep"><div class="row between"><b>AI review</b><span class="tag">${esc(j.nclc || '')}</span></div>
        <p class="small">${esc(j.task || '')}</p>
        ${(j.strengths || []).length ? `<ul class="small">${j.strengths.map(x => `<li>✓ ${esc(x)}</li>`).join('')}</ul>` : ''}
        ${(j.fixes || []).map(f => `<div class="issue error"><div class="ihead"><span class="wrong">${esc(f.orig)}</span><span class="arr">→</span><span class="right">${esc(f.fix)}</span></div><p class="small">${esc(f.why || '')}</p></div>`).join('')}
        ${j.rewrite ? `<details><summary>Corrected version</summary><p class="fr pre">${esc(j.rewrite)}</p><button class="chip" data-act="wcopyfix">Copy corrected version</button></details>` : ''}
        ${j.next ? `<p class="small"><b>Next priority:</b> ${esc(j.next)}</p>` : ''}</div>`;
      addXP(wr.gained < 10 ? 3 : 0, 'AI review');
    } catch (e) { box.innerHTML = `<div class="card bad"><p class="small">${esc(e.message || 'AI review failed.')}</p></div>`; }
    wr.deepBusy = false; el.disabled = false; el.textContent = 'Deep check with AI';
  };
  ACT.wcopyfix = () => { if (wr && wr.deep && wr.deep.rewrite) copyText(wr.deep.rewrite, 'Copied.'); };

  IN.chk = el => { wr.checks[el.dataset.i] = el.checked; };
  ACT.ins = el => {
    const ta = document.getElementById('wtext'), t = el.dataset.t + ' ';
    const s = ta.selectionStart == null ? ta.value.length : ta.selectionStart, e = ta.selectionEnd == null ? s : ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + t + ta.value.slice(e);
    ta.selectionStart = ta.selectionEnd = s + t.length;
    ta.focus();
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  };
  ACT.wtimer = el => {
    const w = TEF.write.find(x => x.id === wr.id);
    if (stopT) { stopT(); stopT = null; el.textContent = 'Start timer'; document.getElementById('wtimer').textContent = String(w.mins).padStart(2, '0') + ':00'; return; }
    el.textContent = 'Stop';
    stopT = startTimer(document.getElementById('wtimer'), w.mins * 60, () => { toast("Time's up. Proofread now.", 'lvl'); sfx('quest'); stopT = null; });
  };
  ACT.wmodel = () => { wr.model = !wr.model; rerender(); };
  ACT.wcopy = () => {
    const w = TEF.write.find(x => x.id === wr.id), t = S.drafts[wr.id] || '';
    if (!t.trim()) { toast('Write something first', 'bad'); return; }
    copyText('Act as a TEF Canada examiner. Task (Section ' + w.sec + ', at least ' + w.min + ' words): ' + w.task + (w.start ? '\nStart of the text: ' + w.start : '') + '\n\nHere is my text (' + words(t) + ' words):\n' + t + '\n\nPlease evaluate: task fulfilment, coherence and connectors, vocabulary range, grammar and spelling. Give a corrected version, an estimated NCLC level, and my 3 top priorities to improve. Explain corrections in English.', 'Copied. Paste it into your favorite assistant.');
  };
  ACT.wfin = () => {
    const w = TEF.write.find(x => x.id === wr.id), t = S.drafts[wr.id] || '', n = words(t);
    if (n < w.min) return;
    const first = !S.done.write[w.id];
    S.done.write[w.id] = 1;
    S.stats.writeWords += n; save();
    if (stopT) { stopT(); stopT = null; }
    addXP(first ? 20 + (n >= w.min * 1.25 ? 10 : 0) : 6, 'Writing');
    doQuest('write'); confetti(); sfx('quest');
    toast('Saved. Copy it for feedback or try the next prompt.', 'xp');
    u.go('#/write');
  };
})();
