import HomePresenter from '../presenters/homePresenter.js';

export default {
  presenter: null,

  render(stories) {
    const container = document.getElementById('app');
    container.innerHTML = `
      <section class="container">
        <h2>Tambah Story</h2>
        <form id="uploadForm" class="upload-form">
          <input type="text" name="description" placeholder="Deskripsi..." required class="input-field"/>
          <input type="file" name="photo" accept="image/*" required class="input-field"/>
          <button type="submit" class="submit-btn">Upload</button>
        </form>

        <button id="testPushBtn" class="test-push-btn">Uji Push Notification</button>

        <h2>Daftar Story</h2>
        <div id="story-list" class="story-list"></div>
        <div id="map" class="map-container"></div>
      </section>
    `;

    const listContainer = document.getElementById('story-list');
    listContainer.innerHTML = '';

    stories.forEach(story => {
      const item = document.createElement('article');
      item.className = 'story-item';

      const photoSrc = story.photoUrl || (story.photoBlob ? URL.createObjectURL(story.photoBlob) : '');

      item.innerHTML = `
        <div class="story-card">
          <img src="${photoSrc}" alt="Foto dari ${story.name || 'User'}" class="story-img"/>
          <div class="story-content">
            <h3 class="story-title">${story.name || 'User'}</h3>
            <p class="story-description">${story.description}</p>
            <small class="story-date">${new Date(story.createdAt).toLocaleString()}</small>
          </div>
        </div>
      `;
      listContainer.appendChild(item);
    });

    // Inisialisasi peta jika tersedia
    if (typeof L !== 'undefined') {
      const map = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors',
      }).addTo(map);

      stories.forEach(story => {
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`<strong>${story.name || 'User'}</strong><br>${story.description}`);
        }
      });
    }

    // Tombol Uji Push Notification
    const testPushBtn = document.getElementById('testPushBtn');
    if (testPushBtn) {
      testPushBtn.addEventListener('click', async () => {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          alert('Belum subscribe push notification.');
          return;
        }

        try {
          const response = await fetch('/api/push-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
          });

          const result = await response.json();
          alert(result.message || 'Notifikasi diuji.');
        } catch (error) {
          console.error('Push test error:', error);
          alert('Gagal mengirim push notification uji coba.');
        }
      });
    }
  },

  init() {
    this.presenter = HomePresenter(this);
    this.presenter.loadStories();

    document.addEventListener('submit', (e) => {
      if (e.target && e.target.id === 'uploadForm') {
        e.preventDefault();
        const formData = new FormData(e.target);
        this.presenter.uploadStory(formData);
      }
    });
  },

  showUploadSuccess() {
    alert('Story berhasil ditambahkan!');
    this.presenter.loadStories();
  },

  showUploadError(message) {
    alert('Gagal upload story: ' + message);
  }
};
