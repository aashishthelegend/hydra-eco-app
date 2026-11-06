const CACHE_NAME = 'hydra-eco-v1';
const ASSETS_TO_CACHE = [
  './', './index.html', './manifest.json',
  './favicon-48.png', './icon-72.png', './icon-96.png',
  './icon-192.png', './icon-512.png', './maskable-192.png',
  './maskable-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME ? caches.delete(k) : null))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('/api/')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});