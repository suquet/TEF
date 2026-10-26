/* Boot */
(function () {
  'use strict';
  const { S, u } = TEF;
  TEF.applyTheme();

  const tabs = [['home', '#/', 'home', 'Home'], ['words', '#/words', 'cards', 'Words'], ['read', '#/read', 'book', 'Read'], ['listen', '#/listen', 'ear', 'Listen'], ['speak', '#/speak', 'mic', 'Speak'], ['write', '#/write', 'pen', 'Write'], ['more', '#/more', 'grid', 'More']];
  document.getElementById('nav').innerHTML = tabs.map(t => `<a href="${t[1]}" data-tab="${t[0]}">${u.icon(t[2], 22)}<span>${t[3]}</span></a>`).join('');
  document.getElementById('hFlame').innerHTML = u.icon('flame', 16);
  document.getElementById('hZap').innerHTML = u.icon('zap', 16);

  if (!location.hash || location.hash === '#') { try { history.replaceState(null, '', '#/'); } catch (e) { /* file:// or sandboxed frame */ } }
  // an empty route name renders Home
  u.route();
  u.checkBadges();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { }); });
  }
})();
