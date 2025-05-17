const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const subscriptions = []; 

const vapidKeys = {
  publicKey: 'BIDIsn5pkD5WXwKtrN_38kUzJs8JOwJlgSsDTtdNnnevAPY-_LzvhgtV_DrbUy55oKJoAPdg42zkfNrbeyVR7I0',
  privateKey: 'zj-8mPt0JntjClDuBtnEGoMTis8WG7TW2Q4QPw-Z4S0',
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  subscriptions.push(subscription);

  res.status(201).json({ message: 'Subscription diterima' });
});

app.post('/sendNotification', async (req, res) => {
  const { title, message } = req.body;

  const payload = JSON.stringify({
    title: title || 'Notifikasi Baru',
    message: message || 'Ini adalah notifikasi push dari server',
  });

  const sendPromises = subscriptions.map(sub =>
    webpush.sendNotification(sub, payload).catch(err => {
      console.error('Error mengirim notifikasi:', err);
    })
  );

  try {
    await Promise.all(sendPromises);
    res.status(200).json({ message: 'Notifikasi berhasil dikirim' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengirim notifikasi' });
  }
});
app.get('/', (req, res) => {
  res.send('Selamat datang di server Express!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
