import HomePresenter from '../presenters/homePresenter.js';

export default {
  presenter: null,

  init() {
    this.presenter = HomePresenter(this);
    this.presenter.loadStories();

    document.addEventListener('submit', async (e) => {
      if (e.target && e.target.id === 'uploadForm') {
        e.preventDefault();
        const formData = new FormData(e.target);
        await this.presenter.uploadStory(formData);
        e.target.reset(); // Reset form setelah submit
      }
    });
  },

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

        <h2>Daftar Story</h2>
        <div id="story-list" class="story-list"></div>
        <div id="map" class="map-container"></div>
      </section>
    `;

    const listContainer = document.getElementById('story-list');
    listContainer.innerHTML = '';

    stories.forEach((story) => {
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

    this.renderMap(stories);
  },

  renderMap(stories) {
    if (typeof L === 'undefined') return;

    const mapElement = document.getElementById('map');
    mapElement.innerHTML = ''; // Bersihkan map sebelumnya
    const map = L.map(mapElement).setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name || 'User'}</strong><br>${story.description}`);
      }
    });
  },

  showUploadSuccess() {
    alert('Story berhasil ditambahkan!');
  },

  showUploadError(message) {
    alert('Gagal upload story: ' + message);
  },
};
