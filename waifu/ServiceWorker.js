const cacheName = "Mirailabs-Waifu Tap-1.0.0";
const contentToCache = [
    "Build/Build.loader.js",
    "Build/e3990134963a217655419d7a99280482.js.unityweb",
    "Build/ce1528cd657f3266ed6fc651f752f6e0.data.unityweb",
    "Build/412adc410c9bf7d3bbdac32a516f69c6.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
