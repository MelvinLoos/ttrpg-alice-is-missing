const CACHE_NAME = 'alice-missing-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap',
  'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm',
  'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js'
];

// Install Event: Cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
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