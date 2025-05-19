export async function initPushNotification() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker tidak didukung browser ini.');
    return;
  }

  if (!('PushManager' in window)) {
    console.warn('Push Notification tidak didukung browser ini.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('User menolak permission notifikasi.');
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const vapidPublicKey = 'BHYKZX9jbTqsDN5Ckl1KWViKMJ76dSrCE5SBTiy8_4XIAImaEqG3vND8Q7xnn9U3cmh2e958EyP1olpJjgHS_jQ'; 
  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey,
    });

    console.log('Push Subscription berhasil:', JSON.stringify(subscription));
    // Kirim subscription ke server bila perlu
  } catch (error) {
    console.error('Gagal subscribe push notification:', error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}