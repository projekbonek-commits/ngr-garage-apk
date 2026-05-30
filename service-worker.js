const CACHE = 'ngr-neo-html-v12-polish';
const ASSETS = ['./index.html','./style.css','./app.js','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => {
      const clone = res.clone(); caches.open(CACHE).then(c => c.put(req, clone)); return res;
    }).catch(() => caches.match(req)));
  } else {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
  }
});
