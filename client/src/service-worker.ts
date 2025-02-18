
/// <reference lib="webworker" />

const CACHE_NAME = 'civic-connect-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.tsx'
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
