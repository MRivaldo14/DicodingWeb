let cameraStream;

const AddStoryView = () => {
  const render = () => `
    <section class="add-story">
      <h2><i class="feather icon-plus-circle"></i> Tambah Story Baru</h2>
      <form id="storyForm">
        <label for="description">Deskripsi:</label>
        <textarea id="description" name="description" placeholder="Masukkan deskripsi..." required></textarea>

        <label>Foto (kamera):</label>
        <div class="camera-wrapper">
          <video id="video" autoplay playsinline></video>
          <canvas id="canvas" style="display:none;"></canvas>
          <button type="button" id="captureBtn" class="btn capture-btn">
            <i class="feather icon-camera"></i> Ambil Gambar
          </button>
          <img id="preview" src="" alt="Preview Foto" class="preview" style="display:none;" />
        </div>

        <input type="hidden" id="lat" name="lat">
        <input type="hidden" id="lon" name="lon">

        <div id="map" class="map-container"></div>

        <button type="submit" class="btn submit-btn">Kirim</button>
      </form>
      <a href="#/home" class="back-link">⬅ Kembali</a>
    </section>
  `;

  const setupCamera = (videoEl) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        cameraStream = stream;
        videoEl.srcObject = stream;
      })
      .catch(() => alert('Gagal mengakses kamera.'));
  };

  const setupMap = (mapEl) => {
    const map = L.map(mapEl).setView([-6.9, 107.6], 13);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });
    osmLayer.addTo(map);

    let marker;
    map.on('click', e => {
      const { lat, lng } = e.latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;
      if (marker) marker.remove();
      marker = L.marker([lat, lng]).addTo(map);
    });
  };

  const showSuccessMessage = msg => {
    const c = document.querySelector('.add-story');
    const b = document.createElement('div');
    b.className = 'success-banner';
    b.textContent = msg;
    c.prepend(b);
    setTimeout(() => b.remove(), 2000);
  };

  const showErrorMessage = msg => {
    const c = document.querySelector('.add-story');
    const b = document.createElement('div');
    b.className = 'error-banner';
    b.textContent = msg;
    c.prepend(b);
    setTimeout(() => b.remove(), 2000);
  };

  const cleanup = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
  };

  return {
    render,
    setupCamera,
    setupMap,
    showSuccessMessage,
    showErrorMessage,
    cleanup
  };
};

export default AddStoryView;
