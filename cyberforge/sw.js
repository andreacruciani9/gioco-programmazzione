const CACHE = 'cyberforge-v11-wifi-authz-ir-resilience';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './attack-defense.css',
  './real-world.css',
  './app.js',
  './attack-scenarios.js',
  './defense-scenarios.js',
  './privacy-scenarios.js',
  './update-2026-08-07.js',
  './update-2026-08-11.js',
  './update-2026-08-14.js',
  './update-2026-08-18.js',
  './update-2026-08-21.js',
  './update-2026-08-25.js',
  './update-2026-08-28.js',
  './attack-defense.js',
  './real-world-examples.js',
  './update-2026-08-07-examples.js',
  './update-2026-08-11-examples.js',
  './update-2026-08-14-examples.js',
  './update-2026-08-18-examples.js',
  './update-2026-08-21-examples.js',
  './update-2026-08-25-examples.js',
  './update-2026-08-28-examples.js',
  './real-world-ui.js',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});