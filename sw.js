// sw.js file ka code
const CACHE_NAME = "nain-csc-v1";
const urlsToCache = [
  "/",
  "/index.html",
  // Agar koi image ya css file hai toh yahan add karein
];

// Install: Files ko cache mein save karna
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch: Net nahi hai toh cache se dikhana
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
