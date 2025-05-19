importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const CACHE_NAME = 'app-shell-v1';

if (workbox) {
  console.log('✅ Workbox loaded');

  // Precache App Shell
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/styles/style.css', revision: '1' },
    { url: '/icons/icon-192x192.png', revision: '1' },
    { url: '/icons/icon-512x512.png', revision: '1' },
  ], {
    ignoreURLParametersMatching: [/.*/],
  });

  // Cache API Story Dicoding
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://story-api.dicoding.dev',
    new workbox.strategies.NetworkFirst({
      cacheName: 'story-api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60,
        }),
      ],
    })
  );

 
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // Fallback offline untuk navigasi (routing)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    async () => {
      try {
        return await fetch('/');
      } catch (error) {
        return caches.match('/index.html');
      }
    }
  );
  
} else {
  console.log('❌ Workbox gagal dimuat');
}

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'Story App';
  const options = {
    body: data.body || 'Anda memiliki notifikasi baru.',
    icon: '/icons/icon-192x192.png',
    image: data.image || undefined,
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
 
