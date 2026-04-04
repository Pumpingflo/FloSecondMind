// AthleteOS Service Worker v9
// Strategy: Network-only for HTML, cache for static assets only
// This ensures the app always loads the latest version

const CACHE = 'athleteos-v9';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // NEVER cache the main HTML - always fresh from network
  if (url.hostname === 'pumpingflo.github.io') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => new Response('<h1>Offline</h1><p>Bitte Internetverbindung prüfen.</p>',
          { headers: { 'Content-Type': 'text/html' } }))
    );
    return;
  }

  // Let all other requests (Supabase, CDNs) go through normally
  // No caching of API calls - this prevents stale auth tokens
});
