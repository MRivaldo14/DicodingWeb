const express = require('express');
const cors = require('cors');
const webpush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Array untuk menyimpan semua subscription dari client
const subscriptions = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ganti dengan VAPID key kamu sendiri jika berbeda
const vapidKeys = {
  publicKey: 'BBx6xDtETY3DtUaOO4dVblOeJ-4w-qiSjjl_Lz1wgWkEugZN5jYbaD-KGZuLawRNLoce106oeD5DiZlOe68A-TQ',
  privateKey: '4uAMd4iZrfuyhIQM4Qa4EiCIE6iSHPIRr4Rzk40aIus',
};

// Konfigurasi VAPID untuk web-push
webpush.setVapidDetails(
  'mailto:admin@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Endpoint untuk menerima subscription baru
app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  // Cek apakah subscription sudah ada
  const alreadySubscribed = subscriptions.find(
    (sub) => JSON.stringify(sub) === JSON.stringify(subscription)
  );

  if (!alreadySubscribed) {
    subscriptions.push(subscription);
    console.log('✅ Subscription ditambahkan:', subscription);
  } else {
    console.log('ℹ️ Subscription sudah ada.');
  }

  res.status(201).json({ message: 'Berhasil subscribe' });
});

// Endpoint untuk mengirim push notification ke semua subscriber
app.post('/api/push-test', async (req, res) => {
  const payload = JSON.stringify({
    title: 'Notifikasi Uji Coba',
    body: 'Push notification berhasil dikirim!',
  });

  try {
    const sendPromises = subscriptions.map((subscription) =>
      webpush.sendNotification(subscription, payload)
    );

    await Promise.all(sendPromises);
    console.log(`📨 Push berhasil dikirim ke ${subscriptions.length} subscriber`);
    res.status(200).json({ success: true, sent: subscriptions.length });
  } catch (error) {
    console.error('❌ Gagal kirim push:', error);
    res.status(500).json({ error: error.message });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
