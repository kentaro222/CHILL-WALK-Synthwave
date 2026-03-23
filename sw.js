const CACHE_NAME = 'chill-walk-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './player_1bit00_sheet.png'
  './icon-192.png',
  './icon-512.png'
];

// インストール時にキャッシュを保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// オフライン時はキャッシュから返す (Cache First strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあればそれを返し、なければネットワークへリクエスト
        return response || fetch(event.request);
      })
  );
});
