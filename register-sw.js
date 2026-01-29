/* ======================================================
   QuantumTrader AI / QonexAI
   Service Worker – Production Ready (Mobile Safe)
   ====================================================== */

const CACHE_NAME = "qtai-pwa-v1";

// Files essential for offline app shell
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",

  // CSS
  "./css/qtai.css",

  // Core JS
  "./js/core/bootstrap.js",
  "./js/core/simulation/traderLab.js",
  "./js/core/utils/helpers.js",

  // Assets
  "./assets/qtai_globe.png",
  "./assets/qtai_ori_olokun.png"
];

/* =====================
   INSTALL
   ===================== */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

/* =====================
   ACTIVATE
   ===================== */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* =====================
   FETCH (Cache First)
   ===================== */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          // Optional: cache new GET requests
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Fallback to index.html for SPA navigation
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
