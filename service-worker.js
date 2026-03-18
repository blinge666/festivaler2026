const CACHE = 'festivalplan-v3';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).then(networkRes => {
      const clone = networkRes.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, clone));
      return networkRes;
    }).catch(() => caches.match('./index.html')))
  );
});
