import home from './routes/home.js'; 
import login from './routes/login.js';
import register from './routes/register.js';
import addStory from './routes/addStory.js';
import storyDetail from './routes/storyDetail.js';
import notFound from './routes/notFound.js';
import { initPushNotification } from './src/push-notification.js';
let currentCleanup = null;

const DB_NAME = 'my-pwa-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function addData(data) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllData() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteData(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

async function router() {
  const app = document.getElementById('app');
  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  app.classList.remove('fade-in');
  app.classList.add('fade-out');
  await new Promise(resolve => setTimeout(resolve, 200));

  const hash = location.hash || '#/home';
  const path = hash.split('/');

  switch (path[1]) {
    case '':
    case 'home':
      await home({ getAllData, deleteData });
      break;
    case 'login':
      await login();
      break;
    case 'register':
      await register();
      break;
    case 'add':
      await addStory(setCleanup, addData);
      break;
    case 'story':
      await storyDetail(path[2]);
      break;
    default:
      notFound();
      break;
  }

  updateAuthLinks();
  app.classList.remove('fade-out');
  app.classList.add('fade-in');
}

function setCleanup(cleanupFn) {
  currentCleanup = cleanupFn;
}

function updateAuthLinks() {
  const links = document.getElementById('auth-links');
  const token = localStorage.getItem('token');
  if (!links) return;

  if (token) {
    links.innerHTML = `<button id="logoutBtn" aria-label="Logout">Logout</button>`;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('token');
      alert('Anda telah logout.');
      location.hash = '#/login';
    });
  } else {
    links.innerHTML = `
      <a href="#/login" aria-label="Masuk">Masuk</a> |
      <a href="#/register" aria-label="Daftar">Daftar</a>
    `;
  }
}

function setupSkipLinkAccessibility() {
  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-link');
  if (mainContent && skipLink) {
    skipLink.addEventListener('click', event => {
      event.preventDefault();
      skipLink.blur();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function navigate() {
  if ('startViewTransition' in document) {
    document.startViewTransition(() => router());
  } else {
    router();
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

async function sendSubscriptionToServer(subscription) {
  try {
    const response = await fetch('http://localhost:4000/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengirim subscription: ${response.status}`);
    }

    console.log('✅ Subscription berhasil dikirim ke server');
  } catch (error) {
    console.warn('❌ Error kirim subscription:', error.message);
  }
}

async function registerServiceWorkerAndPush() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service worker terdaftar');

      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.warn('❌ Notifikasi ditolak oleh pengguna');
        return;
      }

      const applicationServerKey = urlBase64ToUint8Array(
        'BHYKZX9jbTqsDN5Ckl1KWViKMJ76dSrCE5SBTiy8_4XIAImaEqG3vND8Q7xnn9U3cmh2e958EyP1olpJjgHS_jQ'
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      console.log('✅ Berhasil subscribe:', subscription);
      await sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error('❌ Error saat register SW atau Push:', error);
    }
  } else {
    console.warn('❌ Browser tidak mendukung Service Worker atau Push Notification');
  }
}

function startApp() {
  window.addEventListener('hashchange', navigate);
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('app').animate(
      [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      {
        duration: 400,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );

    navigate();
    setupSkipLinkAccessibility();
    registerServiceWorkerAndPush();
  });
}

startApp();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
      await initPushNotification(); 
    } catch (err) {
      console.error('SW registration or push init failed:', err);
    }
  });
}