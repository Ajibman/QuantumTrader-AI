 /* Service Worker — simple cache-first strategy for images and core assets */
const CACHE_NAME = 'qtai-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.mjs',
  '/assets/images/qtai_globe.png',
  '/assets/images/qtai_ori_olokun.png',
  '/assets/images/MacArthur.png',
  '/assets/images/tradingfloor_main.png',
  '/assets/image/globe.png',
  '/assets/image/globe.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  const req = evt.request;
  // HTML network-first, assets cache-first
  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    evt.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for other requests (images, css, js)
  evt.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
      return res;
    })).catch(()=>{})
  );
});
