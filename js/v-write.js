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

  function editor(id) {
    const w = TEF.write.find(x => x.id === id);
    if (!w) return hub();
    if (!wr || wr.id !== id) { wr = { id, checks: {}, model: false }; onLeave(() => { wr = null; if (stopT) { stopT(); stopT = null; } }); }
    const text = S.drafts[id] || '';
    const n = words(text);
    return `${back('#/write', 'Write')}
    <span class="tag">Section ${w.sec}</span> <span class="mono muted small">${w.min}+ words · about ${w.mins} min</span>
    <h1 class="page">${esc(w.title)}</h1>
    <div class="card prompt"><p class="fr">${esc(w.task)}</p>${w.start ? `<blockquote class="fr">${esc(w.start)}</blockquote>` : ''}${trBox(w.taskEn, w.taskEs)}</div>
    <div class="toolbar"><span class="mono timer" id="wtimer">${String(w.mins).padStart(2, '0')}:00</span><button class="btn ghost" data-act="wtimer">Start timer</button></div>
    <textarea id="wtext" class="area write" data-in="wtext" rows="12" placeholder="Écrivez ici…" spellcheck="true" lang="fr" autocapitalize="sentences">${esc(text)}</textarea>
    <div class="wc mono"><span id="wcount">${n}</span> / ${w.min} words</div><div class="bar" id="wbarwrap"><i id="wbar" style="width:${Math.min(100, 100 * n / w.min)}%"></i></div>
    <details class="card"><summary>Phrase bank <span class="muted small">(tap to insert)</span></summary>${TEF.phrases.map(g => `<div class="pg"><small class="mono">${esc(g.g)}</small><div class="chips wrap">${g.p.map(p => `<button class="chip" data-act="ins" data-t="${esc(p)}">${esc(p.length > 40 ? p.slice(0, 38) + '…' : p)}</button>`).join('')}</div></div>`).join('')}</details>
    <details class="card"><summary>Self-check</summary><div class="checks">${TEF.checklist.map((c, i) => `<label class="check"><input type="checkbox" data-in="chk" data-i="${i}" ${wr.checks[i] ? 'checked' : ''}> ${esc(c)}</label>`).join('')}</div></details>
    <div class="rate"><button class="btn blue" data-act="wcopy">Copy for AI feedback</button><button class="btn" id="wfin" data-act="wfin" ${n >= w.min ? '' : 'disabled'}>Finish</button></div>
    ${w.model ? `<button class="chip" data-act="wmodel">${wr.model ? 'Hide' : 'Show'} model answer</button>${wr.model ? `<div class="card model"><p class="fr pre">${esc(w.model)}</p></div>` : ''}` : ''}`;
  }
  V.write = { render(id) { return id ? editor(id) : hub(); } };

  IN.wtext = el => {
    const w = TEF.write.find(x => x.id === wr.id);
    S.drafts[wr.id] = el.value; save();
    const n = words(el.value);
    document.getElementById('wcount').textContent = n;
    document.getElementById('wbar').style.width = Math.min(100, 100 * n / w.min) + '%';
    document.getElementById('wfin').disabled = n < w.min;
  };
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
