const CACHE_NAME = 'alice-missing-v1';
// Precache only same-origin assets to avoid CORS issues when caching external CDNs.
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install Event: Cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch((err) => {
        // Prevent the install from failing due to external/CORS errors.
        console.error('SW install: cache.addAll failed', err);
      })
  );
});

// Listen for messages from the page (e.g. SKIP_WAITING)
self.addEventListener('message', (e) => {
  if (!e.data) return;
  if (e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Event: Serve from cache if available, else network
self.addEventListener('fetch', (e) => {
  // Ignore Supabase API calls (let them go to network always)
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});