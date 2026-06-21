// Basic MVP Service Worker for PWA compliance
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Pass through fetch for MVP (no offline caching yet)
  e.respondWith(fetch(e.request).catch(() => new Response("Offline")));
});
