const VERSION = 'v1-minimal';
const CACHE_NAME = VERSION;

// Install: pre-cache the shell (optional: keep tiny to avoid bloat)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        '/',             // root
        '/assets/application.css', // adjust if needed
        '/assets/application.js'   // adjust if needed
      ].filter(Boolean))
    )
  );
});

// Activate: delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => (n !== CACHE_NAME ? caches.delete(n) : null)))
    )
  );
  self.clients.claim();
});

// Cache-first strategy
async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  try {
    const res = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, res.clone());
    return res;
  } catch (err) {
    return new Response('Offline', { status: 408, headers: { 'Content-Type': 'text/plain' } });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // pass-through non-GET
  event.respondWith(cacheFirst(request));
});
