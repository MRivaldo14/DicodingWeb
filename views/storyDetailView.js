import StoryDetailPresenter from '../presenters/storyDetailPresenter.js';
export default {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `<p>Memuat detail cerita...</p>`;
  },

  // Jika tidak perlu event handler, bisa dihapus atau dikosongkan
  init() {
    // Misal nanti untuk tombol atau interaksi lain
  },

  renderDetail(story) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section>
        <h2>${story.name}</h2>
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" width="300"/>
        <p>${story.description}</p>
        <p><strong>Tanggal:</strong> ${new Date(story.createdAt).toLocaleString()}</p>
        <div id="map" style="height:300px; margin-top:1rem;"></div>
        <a href="#/home">⬅ Kembali</a>
      </section>
    `;

    if (story.lat && story.lon) {
      const map = L.map('map').setView([story.lat, story.lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      L.marker([story.lat, story.lon]).addTo(map)
        .bindPopup(`<b>${story.name}</b><br>${story.description}`).openPopup();
    }
  },

  showErrorMessage(message) {
    const app = document.getElementById('app');
    app.innerHTML = `<p style="color:red;">${message}</p>`;
  }
};
