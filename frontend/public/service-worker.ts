const CACHE_NAME = 'handball-ideas-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/android/android-launchericon-192-192.png',
    '/icons/android/android-launchericon-512-512.png'
];

self.addEventListener('push', function(event) {
    const data = event.data.json();
    console.log('Push received:', data);
    const options = {
        body: data.body,
        icon: 'icons/icon-192x192.png'
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});
