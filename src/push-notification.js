// push-notification.js

export async function initPushNotification() {
  if (!('serviceWorker' in navigator)) {
    console.warn('❌ Service Worker tidak didukung di browser ini.');
    return;
  }

  if (!('PushManager' in window)) {
    console.warn('❌ Push Notification tidak didukung di browser ini.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('❌ Izin notifikasi ditolak oleh user.');
      return;
    }

    const applicationServerKey = urlBase64ToUint8Array(
      'BBx6xDtETY3DtUaOO4dVblOeJ-4w-qiSjjl_Lz1wgWkEugZN5jYbaD-KGZuLawRNLoce106oeD5DiZlOe68A-TQ'
    );

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      await existingSubscription.unsubscribe();
      console.log('🔁 Subscription lama dibatalkan.');
    }

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log('✅ Subscription baru berhasil dibuat:', newSubscription);
    await sendSubscriptionToServer(newSubscription);
  } catch (error) {
    console.error('❌ Gagal melakukan inisialisasi push notification:', error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

async function sendSubscriptionToServer(subscription) {
  try {
    const response = await fetch('http://localhost:4000/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengirim subscription: ${response.status}`);
    }

    console.log('📬 Subscription berhasil dikirim ke server.');
  } catch (error) {
    console.warn('❌ Gagal mengirim subscription ke server:', error.message);
  }
}
