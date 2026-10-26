/* Offline cache. Bump VERSION when you change files. */
const VERSION = 'tef-quest-v1';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/styles.css',
  'js/data/words.js', 'js/data/reading.js', 'js/data/speaking.js', 'js/data/practice.js', 'js/data/resources.js',
  'js/core.js', 'js/v-home.js', 'js/v-words.js', 'js/v-read.js', 'js/v-listen.js', 'js/v-speak.js', 'js/v-write.js', 'js/v-quiz.js', 'js/v-extras.js', 'js/main.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('index.html')))
  );
});
