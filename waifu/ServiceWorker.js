const cacheName = "Mirailabs-Waifu Tap-1.0.0";
const contentToCache = [
    "Build/Build.loader.js",
    "Build/e3990134963a217655419d7a99280482.js.unityweb",
    "Build/a25a04949ba4c7b787bd33d937c6f690.data.unityweb",
    "Build/a5a8457472cc1458586d4a10a46ad14b.wasm.unityweb",
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
