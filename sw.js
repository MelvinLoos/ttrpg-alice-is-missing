const CACHE_NAME = 'alice-missing-v1';
// Precache only same-origin assets to avoid CORS issues when caching external CDNs.
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install Event: Cache core assets (add individually and ignore failures)
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Avoid trying to cache the directory entry './' which can 404 on some hosts
    const toCache = ASSETS.filter(a => a !== './');
    for (const asset of toCache) {
      try {
        await cache.add(asset);
      } catch (err) {
        // Log but don't fail the install if a single asset can't be cached
        console.warn('SW install: failed to cache', asset, err);
      }
    }
  })());
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