importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('✅ Workbox loaded');

  // ✅ Precache App Shell
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: 'v1' },
    { url: '/index.html', revision: 'v1' },
    { url: '/main.js', revision: 'v1' },
    { url: '/styles/style.css', revision: 'v1' },
    { url: '/icons/icon-192x192.png', revision: 'v1' },
    { url: '/icons/icon-512x512.png', revision: 'v1' },
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
          maxAgeSeconds: 5 * 60,
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
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // ✅ Navigasi halaman SPA
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'html-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
        }),
      ],
    })
  );

  // ✅ Fallback untuk permintaan dokumen saat offline
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match('/index.html');
    }
    return Response.error();
  });

} else {
  console.log('❌ Workbox gagal dimuat');
}

// ✅ Push Notification Handler
self.addEventListener('push', (event) => {
  try {
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
  } catch (error) {
    console.error('❌ Error parsing push event:', error);
  }
});

// ✅ Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
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
