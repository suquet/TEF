/* Free conversation with an AI partner. Streams the reply and speaks it sentence by sentence. */
(function () {
  'use strict';
  const { V, ACT, IN, S, u } = TEF;
  const { esc, icon, trBox, sayBtn, back, addXP, doQuest, sfx, confetti, rerender, speak, stopSpeak, onLeave, save, toast, canListen, listen, stopListen, checkBadges, copyText } = u;

  const SCN = [
    { id: 'smalltalk', t: 'Small talk', d: 'A neighbour in Toronto', p: 'a friendly neighbour in Toronto chatting about daily life, the weather, work and weekend plans' },
    { id: 'interview', t: 'Job interview', d: 'You are the candidate', p: 'a recruiter at a Canadian company interviewing the learner for a job in sales or tech; ask one question at a time and follow up on their answers' },
    { id: 'clinic', t: 'At the clinic', d: 'Book and explain a visit', p: 'a receptionist at a medical clinic in Montréal helping the learner book an appointment and explain what they need' },
    { id: 'apartment', t: 'Rent an apartment', d: 'Talk to a landlord', p: 'a landlord showing an apartment to the learner; answer their questions and ask about their situation' },
    { id: 'tech', t: 'Tech talk', d: 'AI, apps and gadgets', p: 'a curious colleague chatting about new technology, AI tools, apps and gadgets' },
    { id: 'games', t: 'Gaming talk', d: 'Games and streaming', p: 'a friend who loves video games, chatting about games they play, new releases and esports' },
    { id: 'movies', t: 'Movies and series', d: 'What are you watching?', p: 'a friend chatting about movies, series and what to watch this weekend' },
    { id: 'biz', t: 'Business meeting', d: 'Plan a project', p: 'a manager in a business meeting discussing a project plan, deadlines, customers and next steps' },
    { id: 'tefb', t: 'TEF debate', d: 'Convince a friend', p: 'a friend who politely disagrees with the learner; the learner must convince them (TEF oral Section B). Push back with questions and objections' }
  ];
  let tk = null, aborter = null;
  const reset = () => { if (aborter) { try { aborter.abort(); } catch (e) { /* ignore */ } } aborter = null; };

  function newTalk() {
    tk = { tok: Math.random(), scn: null, custom: '', level: 'B1', msgs: [], log: [], busy: false, listening: false, hf: !!S.settings.hf && canListen(), turns: 0, fixes: [], vocab: [], draft: '', ctl: null, sq: [], sqBusy: false, streamDone: true, spoken: 0, err: '' };
    onLeave(() => { reset(); stopListen(); stopSpeak(); if (tk) tk.tok = null; tk = null; });
  }
  const alive = tok => tk && tk.tok === tok;

  /* ---------- views ---------- */
  function setup() {
    return `${back('#/speak', 'Speak')}<h1 class="page">Free conversation</h1>
    <div class="card prompt"><b>Talk to an AI partner out loud.</b>
      <p class="muted">Your partner answers in French, reacts to what you actually said, asks follow-up questions, and after each turn shows what to fix. This uses your own Anthropic API key. It stays in this browser only, and your messages go straight from your browser to Anthropic. Create a key with a low spending limit, and remove it any time in Settings.</p>
      <a class="btn" href="#/settings">Add your API key in Settings</a></div>
    <p class="muted small">Without a key, the Speak missions still react to what you say, using built-in targets.</p>`;
  }
  function chooser() {
    return `${back('#/speak', 'Speak')}<h1 class="page">Free conversation</h1>
    <p class="muted">Pick a situation. You speak, your partner answers.</p>
    <div class="list">${SCN.map(s => `<button class="card scn ${tk.scn === s.id ? 'sel' : ''}" data-act="tscn" data-id="${s.id}"><b>${esc(s.t)}</b><span class="muted small">${esc(s.d)}</span></button>`).join('')}</div>
    <div class="card form"><label>Or describe your own situation<input id="tcustom" data-in="tcustom" type="text" maxlength="140" placeholder="Ordering at a restaurant in Québec City" value="${esc(tk.custom)}" autocomplete="off"></label>
      <label>Level<select data-in="tlevel">${['A2', 'B1', 'B2', 'C1'].map(l => `<option ${tk.level === l ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label class="check"><input type="checkbox" data-in="thf" ${tk.hf ? 'checked' : ''} ${canListen() ? '' : 'disabled'}> Hands-free: the mic opens after each reply</label></div>
    <button class="btn wide" data-act="tstart" ${tk.scn || tk.custom ? '' : 'disabled'}>Start talking</button>
    ${tk.err ? `<p class="errline">${esc(tk.err)}</p>` : ''}`;
  }
  function chat() {
    const sc = SCN.find(s => s.id === tk.scn);
    const title = tk.scn ? sc.t : (tk.custom || 'Conversation');
    return `<div class="row between"><a class="back" href="#/speak">${icon('back', 18)}<span>Leave</span></a><button class="chip" data-act="tend">End and review</button></div>
    <h1 class="page sm">${esc(title)} <span class="tag">${tk.level}</span></h1>
    <div class="chatlog" id="tlog">${tk.log.map(logHtml).join('')}</div>
    ${tk.err ? `<p class="errline">${esc(tk.err)} <button class="chip" data-act="tretry">Try again</button></p>` : ''}
    <div class="dock">
      ${tk.busy ? '<div class="mono small muted pulse">Partner is replying…</div>' : ''}
      <div class="microw"><button class="mic sm ${tk.listening ? 'on' : ''}" data-act="tmic" aria-label="${tk.listening ? 'Stop listening' : 'Speak'}" aria-pressed="${tk.listening}">${icon('mic', 24)}</button>
        <div class="said ${tk.listening ? 'live' : ''}" id="tsaid">${tk.listening ? '<span class="muted">Listening…</span>' : '<span class="muted">Tap the mic and speak</span>'}</div></div>
      <div class="typed"><input id="tdraft" class="area one" data-in="tdraft" type="text" placeholder="…or type in French" autocomplete="off" spellcheck="false" value="${esc(tk.draft)}"><button class="btn ghost" data-act="tsend">Send</button></div>
      <div class="toolrow"><button class="chip ${tk.hf ? 'on' : ''}" data-act="thf" ${canListen() ? '' : 'disabled'}>Hands-free ${tk.hf ? 'on' : 'off'}</button><button class="chip" data-act="thelp">Help me answer</button></div>
    </div>`;
  }
  function logHtml(b, i) {
    if (b.who === 'them') {
      return `<div class="bubble them" id="b${i}"><div class="row">${b.fr && !b.streaming ? sayBtn(b.fr, 0, '', 'A') : ''}<span class="fr" id="bt${i}">${esc(b.fr)}${b.streaming ? '<span class="caret"></span>' : ''}</span></div>${b.en ? trBox(b.en, b.es || '') : ''}</div>`;
    }
    if (b.who === 'hint') return `<div class="bubble model"><span class="mono small">ideas</span><div class="fr">${esc(b.text)}</div></div>`;
    const c = b.coach;
    return `<div class="bubble you"><span class="fr">${esc(b.text)}</span>${c ? coachHtml(c) : ''}</div>`;
  }
  function coachHtml(c) {
    const fixes = (c.fixes || []).slice(0, 3);
    return `<div class="coach">${fixes.map(f => `<div class="fix"><span class="w-bad">${esc(f.said)}</span> <span class="arr">→</span> <span class="w-ok">${esc(f.better)}</span>${f.why ? `<div class="muted small">${esc(f.why)}</div>` : ''}</div>`).join('')}${!fixes.length ? '<div class="fix ok small mono">No mistakes spotted. Well said.</div>' : ''}${c.praise ? `<div class="muted small">${esc(c.praise)}</div>` : ''}</div>`;
  }
  function review() {
    const fx = tk.fixes, vc = tk.vocab;
    return `<h1 class="page">Session review</h1>
    <div class="stats"><div class="stat"><b class="mono">${tk.turns}</b><small>your turns</small></div><div class="stat"><b class="mono">${fx.length}</b><small>fixes</small></div><div class="stat"><b class="mono">${vc.length}</b><small>new phrases</small></div></div>
    <h2 class="sec">Things to fix</h2>
    ${fx.length ? `<div class="list">${fx.map(f => `<div class="card"><span class="w-bad">${esc(f.said)}</span> <span class="arr">→</span> <span class="w-ok">${esc(f.better)}</span><span class="muted small">${esc(f.why || '')}</span></div>`).join('')}</div>` : '<p class="muted">Nothing to fix. Try a harder level next.</p>'}
    <h2 class="sec">Useful phrases</h2>
    ${vc.length ? `<div class="list">${vc.map(v => `<div class="card"><div class="row">${sayBtn(v.fr, 0, '', 'A')}<b class="fr">${esc(v.fr)}</b></div><span class="muted">${esc(v.en)}</span></div>`).join('')}</div>` : '<p class="muted">None this time.</p>'}
    <div class="rate"><button class="btn" data-act="tnew">New conversation</button><button class="btn ghost" data-act="tcopy">Copy review</button></div>`;
  }
  V.talk = {
    render() {
      if (!TEF.ai.has()) return setup();
      if (!tk) newTalk();
      if (tk.ended) return review();
      return tk.msgs.length || tk.log.length ? chat() : chooser();
    }
  };

  /* ---------- prompts ---------- */
  function systemPrompt() {
    const sc = SCN.find(s => s.id === tk.scn);
    const who = sc ? sc.p : tk.custom;
    return `You are a warm, natural native French speaker from Canada helping an adult learner prepare for the TEF Canada exam by talking. Role: ${who}.
Learner level: ${tk.level} (CEFR). Keep your vocabulary and sentence length at that level, slightly above when they are doing well.

Conversation rules:
- Speak only French inside <say>. Use 1 to 3 short spoken sentences (about 35 words at most). Sound like a real person: react to the specific thing they said, then ask ONE follow-up question or move the scene forward.
- Stay in character. If they are stuck, rephrase more simply instead of switching to English.
- The learner's text comes from speech recognition or typing, so ignore punctuation, capitalization and likely recognition glitches. Correct only real grammar, vocabulary, agreement or register problems.

Reply in exactly this format and nothing else:
<say>your French reply</say>
<meta>{"en":"English translation of your reply","es":"Spanish translation of your reply","fixes":[{"said":"exact words from the learner's LAST message","better":"corrected French","why":"short English explanation"}],"praise":"one short English sentence about what they did well, or empty","vocab":[{"fr":"a useful phrase from this exchange","en":"meaning"}]}</meta>
"fixes" has at most 3 items, most important first, and is [] when the last message was fine. At the very start of the conversation use "fixes":[] and "praise":"". "vocab" has at most 2 items.`;
  }
  function trimmed() {
    let m = tk.msgs.slice(-14);
    while (m.length && m[0].role !== 'user') m.shift();
    return m;
  }

  /* ---------- streaming and speaking ---------- */
  function parseSay(full) {
    const a = full.indexOf('<say>');
    if (a < 0) return { say: '', closed: false };
    const s = a + 5, e = full.indexOf('</say>', s);
    let say = e < 0 ? full.slice(s) : full.slice(s, e);
    if (e < 0) say = say.replace(/<[^>]*$/, '');
    return { say, closed: e >= 0 };
  }
  function enqueue(text) { tk.sq.push(text); pump(); }
  function pump() {
    if (!tk || tk.sqBusy) return;
    const t = tk.sq.shift();
    if (!t) { if (tk.streamDone) afterSpeech(); return; }
    tk.sqBusy = true;
    const tok = tk.tok;
    speak(t, { role: 'A', onend: () => { if (!alive(tok)) return; tk.sqBusy = false; pump(); } });
  }
  function afterSpeech() {
    if (!tk || tk.busy || tk.listening || tk.ended) return;
    if (tk.hf) { const tok = tk.tok; setTimeout(() => { if (alive(tok) && !tk.busy && !tk.listening && !tk.sqBusy && !tk.ended) startMic(); }, 250); }
  }
  async function partnerTurn() {
    const tok = tk.tok;
    reset(); aborter = new AbortController();
    tk.busy = true; tk.err = ''; tk.streamDone = false; tk.spoken = 0; tk.sq = [];
    const bubble = { who: 'them', fr: '', en: '', es: '', streaming: true };
    tk.log.push(bubble);
    const idx = tk.log.length - 1;
    rerender();
    let lastSay = '';
    const feed = (say, closed) => {
      lastSay = say;
      const el = document.getElementById('bt' + idx);
      if (el) el.innerHTML = esc(say) + (closed ? '' : '<span class="caret"></span>');
      bubble.fr = say;
      const rest = say.slice(tk.spoken);
      const re = /[^.!?…]*[.!?…]+(?=\s|$)/g;
      let m, used = 0;
      while ((m = re.exec(rest))) { const sent = m[0].trim(); used = m.index + m[0].length; if (sent) enqueue(sent); }
      tk.spoken += used;
      if (closed) { const tail = say.slice(tk.spoken).trim(); if (tail) enqueue(tail); tk.spoken = say.length; }
    };
    try {
      const full = await TEF.ai.stream({
        system: systemPrompt(), messages: trimmed(), max: 700, signal: aborter.signal,
        onText: t => { if (!alive(tok)) return; const p = parseSay(t); feed(p.say, p.closed); }
      });
      if (!alive(tok)) return;
      const p = parseSay(full); feed(p.say, true);
      const mm = full.match(/<meta>([\s\S]*?)<\/meta>/);
      const meta = mm ? TEF.ai.json(mm[1]) : null;
      tk.msgs.push({ role: 'assistant', content: full });
      bubble.streaming = false;
      if (meta) {
        bubble.en = meta.en || ''; bubble.es = meta.es || '';
        const prev = lastUserBubble();
        if (prev) { prev.coach = { fixes: Array.isArray(meta.fixes) ? meta.fixes : [], praise: meta.praise || '' }; (prev.coach.fixes || []).forEach(f => { if (f && f.said && f.better) tk.fixes.push(f); }); }
        (Array.isArray(meta.vocab) ? meta.vocab : []).forEach(v => { if (v && v.fr && !tk.vocab.some(x => x.fr === v.fr)) tk.vocab.push(v); });
      }
      tk.busy = false; tk.streamDone = true;
      rerender();
      pump();
    } catch (e) {
      if (!alive(tok)) return;
      if (e && e.name === 'AbortError') return;
      tk.busy = false; tk.streamDone = true;
      tk.log = tk.log.filter(b => b !== bubble || b.fr);
      bubble.streaming = false;
      tk.err = e && e.message ? e.message : 'Something went wrong.';
      rerender();
    }
  }
  const lastUserBubble = () => { for (let i = tk.log.length - 1; i >= 0; i--) if (tk.log[i].who === 'you') return tk.log[i]; return null; };

  /* ---------- user turns ---------- */
  function sendUser(text) {
    text = (text || '').trim();
    if (!text || tk.busy) return;
    stopListen(); stopSpeak(); tk.listening = false; tk.sq = []; tk.sqBusy = false;
    tk.log.push({ who: 'you', text });
    tk.msgs.push({ role: 'user', content: text });
    tk.draft = ''; tk.turns++;
    S.stats.talk++;
    if (text.split(/\s+/).length >= 3) addXP(6, 'Conversation');
    if (tk.turns === 3) { doQuest('speak'); sfx('quest'); }
    save(); checkBadges();
    partnerTurn();
  }
  function startMic() {
    if (!canListen() || !tk || tk.busy) return;
    const tok = tk.tok;
    stopSpeak(); tk.sq = []; tk.sqBusy = false;
    tk.listening = true; rerender();
    const el = () => document.getElementById('tsaid');
    tk.ctl = listen(ev => {
      if (!alive(tok)) return;
      if (ev.type === 'interim') { const e = el(); if (e) { e.textContent = ev.text; e.classList.add('live'); } }
      else if (ev.type === 'end') { tk.listening = false; tk.ctl = null; if (ev.text) sendUser(ev.text); else { rerender(); } }
      else if (ev.type === 'error') {
        tk.listening = false; tk.ctl = null;
        if (/not-allowed|service-not-allowed|start-failed/.test(ev.error)) { tk.hf = false; toast('The browser blocked the microphone. Tap the mic to try again.', 'bad'); }
        else toast('Mic problem (' + ev.error + '). You can type instead.', 'bad');
        rerender();
      }
    }, { patience: 1900 });
    if (!tk.ctl && tk.listening) { tk.listening = false; rerender(); }
  }

  ACT.tscn = el => { tk.scn = el.dataset.id; tk.custom = ''; rerender(); };
  IN.tcustom = el => { tk.custom = el.value; if (el.value) tk.scn = null; const b = document.querySelector('[data-act="tstart"]'); if (b) b.disabled = !(tk.scn || tk.custom.trim()); document.querySelectorAll('.scn.sel').forEach(x => x.classList.remove('sel')); };
  IN.tlevel = el => { tk.level = el.value; };
  IN.thf = el => { tk.hf = el.checked; S.settings.hf = el.checked; save(); };
  IN.tdraft = el => { tk.draft = el.value; };
  ACT.tstart = () => {
    if (!tk.scn && !tk.custom.trim()) return;
    tk.msgs = [{ role: 'user', content: '[The learner is ready. Start the conversation now with a natural greeting that fits the scene, and ask your first question.]' }];
    partnerTurn();
  };
  ACT.tretry = () => { tk.err = ''; if (tk.msgs.length && tk.msgs[tk.msgs.length - 1].role === 'user') partnerTurn(); else rerender(); };
  ACT.tmic = () => { if (!tk) return; if (tk.listening) { if (tk.ctl) tk.ctl.stop(); } else startMic(); };
  ACT.tsend = () => { const el = document.getElementById('tdraft'); sendUser(el ? el.value : tk.draft); };
  ACT.thf = () => { tk.hf = !tk.hf; S.settings.hf = tk.hf; save(); if (tk.hf && !tk.busy && !tk.listening && !tk.sqBusy) startMic(); else rerender(); };
  ACT.thelp = () => {
    const last = tk.log.slice().reverse().find(b => b.who === 'them');
    if (!last || !last.fr) return;
    tk.log.push({ who: 'hint', text: 'Try starting with: « Je pense que… », « Pour moi… », « Ça dépend de… », or « Pourriez-vous répéter? » Answer the question, then add one detail.' });
    rerender();
  };
  ACT.tend = () => {
    reset(); stopListen(); stopSpeak(); tk.listening = false; tk.ended = true;
    if (tk.turns >= 5) confetti();
    rerender();
  };
  ACT.tnew = () => { const hf = tk.hf; tk.tok = null; tk = null; newTalk(); tk.hf = hf; rerender(); };
  ACT.tcopy = () => {
    const lines = ['TEF Quest session review', ''];
    tk.fixes.forEach(f => lines.push('✗ ' + f.said + ' → ' + f.better + (f.why ? ' (' + f.why + ')' : '')));
    lines.push('');
    tk.vocab.forEach(v => lines.push('• ' + v.fr + ' = ' + v.en));
    copyText(lines.join('\n'), 'Review copied');
  };
})();
