importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('✅ Workbox loaded');

  // ✅ Precache App Shell
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/main.js', revision: '1' },
    { url: '/styles/style.css', revision: '1' },
    { url: '/icons/icon-192x192.png', revision: '1' },
    { url: '/icons/icon-512x512.png', revision: '1' },
  ], {
    ignoreURLParametersMatching: [/.*/],
  });

  // ✅ Cache API request dengan NetworkFirst
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://story-api.dicoding.dev',
    new workbox.strategies.NetworkFirst({
      cacheName: 'story-api-cache',
      networkTimeoutSeconds: 10,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // ✅ Cache image dengan CacheFirst
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // ✅ Offline fallback untuk navigasi SPA
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'html-cache',
      plugins: [
        new workbox.precaching.PrecacheFallbackPlugin({
          fallbackURL: '/index.html',
        }),
      ],
    })
  );

} else {
  console.log('❌ Workbox gagal dimuat');
}

// ✅ Push Notification Handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'Story App';
  const options = {
    body: data.body || 'Anda memiliki notifikasi baru.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    image: data.image || undefined,
    data: {
      url: data.url || '/',
    },
  };

  console.log('📬 Push received:', data);

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ✅ Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
