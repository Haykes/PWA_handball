var CACHE_NAME = 'handball-ideas-cache-v1';
var urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/android/android-launchericon-192-192.png',
    '/icons/android/android-launchericon-512-512.png'
];
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
    }));
});
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request)
        .then(function (response) {
        if (response) {
            return response;
        }
        return fetch(event.request);
    }));
});
