/* Videos, community tips, Québec corner */
(function () {
  'use strict';
  const { V, ACT, S, u } = TEF;
  const { esc, icon, back, sayBtn, rerender, save, checkBadges, trBox } = u;
  let vk = 'all';

  V.videos = {
    render() {
      const kinds = Object.keys(TEF.videoKinds);
      const items = TEF.videos.filter(v => vk === 'all' || v.k === vk);
      return `${back('#/more', 'More')}<h1 class="page">Videos &amp; podcasts</h1>
      <p class="muted small">Links open YouTube searches or official sites in your browser, so they stay fresh. Turn on French captions when you can.</p>
      <div class="chips scroll">${kinds.map(k => `<button class="chip ${vk === k ? 'on' : ''}" data-act="vk" data-k="${k}">${esc(TEF.videoKinds[k])}</button>`).join('')}</div>
      <div class="list">${items.map(v => `<a class="card link vid" href="${v.u}" target="_blank" rel="noopener"><span class="q-t"><b>${esc(v.t)}</b><small>${esc(v.d)}</small><span class="mono muted small">${esc(v.lvl)}</span></span>${icon('ext', 18)}</a>`).join('')}</div>`;
    }
  };
  ACT.vk = el => { vk = el.dataset.k; rerender(); };

  V.reddit = {
    render() {
      return `${back('#/more', 'More')}<h1 class="page">Community tips</h1>
      <p class="muted small">Habits that language learners and TEF candidates repeat again and again in forums like Reddit. These are summaries, not quotes from specific users.</p>
      <div class="list">${TEF.tips.map(t => `<div class="card tip"><span class="tag">${esc(t.k)}</span><b>${esc(t.t)}</b><span class="muted">${esc(t.d)}</span></div>`).join('')}</div>
      <h2 class="sec">Communities</h2>
      <div class="list">${TEF.communities.map(c => `<a class="card link" href="${c.u}" target="_blank" rel="noopener"><span class="q-t"><b>${esc(c.n)}</b><small>${esc(c.d)}</small></span>${icon('ext', 18)}</a>`).join('')}</div>
      <p class="muted small">Always cross-check exam rules and CLB/NCLC requirements on the official IRCC site. Forum advice can be outdated.</p>`;
    }
  };

  V.quebec = {
    render() {
      if (!S.stats.qc) { S.stats.qc = 1; save(); checkBadges(); }
      return `${back('#/more', 'More')}<h1 class="page">Québec corner</h1>
      <p class="muted small">The exam uses standard French, but daily life in Canada does not. Know both forms.</p>
      <div class="list">${TEF.qc.map(q => `<div class="card qc"><div class="row between"><b class="fr">${esc(q.qc)}</b>${sayBtn(q.qc)}</div>
        <div class="muted small">France / standard: <span class="fr">${esc(q.fr)}</span></div>${trBox(q.en, q.es)}<small class="mono">${esc(q.note)}</small></div>`).join('')}</div>`;
    }
  };
})();
