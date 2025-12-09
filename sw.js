const CACHE_NAME = 'nain-csc-cache-v2';

// 1. Install Event: Purana service worker turant hatao aur naya active karo
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Turant naya version lagao
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients.claim() // Sabhi khule hue pages par control lelo
  );
});

// 2. Fetch Event: "Network First" Strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Agar Net chal raha hai, to naya page dikhao aur cache update karo
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Agar Net BAND hai (Offline), to purana saved page dikhao
        return caches.match(event.request);
      })
  );
});
