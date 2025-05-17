import AddStoryPresenter from '../presenters/addStoryPresenter.js';

const addStory = async (setCleanup) => {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="add-story">
      <h2><i class="feather icon-plus-circle"></i> Tambah Story Baru</h2>
      <form id="storyForm">
        <label for="description">Deskripsi:</label>
        <textarea id="description" name="description" placeholder="Masukkan deskripsi..." required></textarea>

        <fieldset>
          <legend>Ambil Foto dengan Kamera</legend>
          <div class="camera-wrapper">
            <video id="video" autoplay playsinline></video>
            <canvas id="canvas" style="display:none;"></canvas>
            <button type="button" id="captureBtn" class="btn capture-btn" title="Ambil gambar dari kamera">
              <i class="feather icon-camera"></i> Ambil Gambar
            </button>
            <img id="preview" src="" alt="Pratinjau hasil foto dari kamera" title="Pratinjau foto" class="preview" style="display:none;" />
          </div>
        </fieldset>

        <label for="fileUpload">Atau unggah foto dari galeri:</label>
        <input type="file" id="fileUpload" name="photo" accept="image/*" title="Unggah foto dari galeri" class="input-field" />

        <input type="hidden" id="lat" name="lat">
        <input type="hidden" id="lon" name="lon">

        <div id="map" class="map-container"></div>

        <button type="submit" class="btn submit-btn">Kirim</button>
      </form>
      <a href="#/home" class="back-link">⬅ Kembali</a>
    </section>
  `;

  let cameraStream = null;
  let marker = null;
  let map = null;

  const view = {
    showSuccessMessage: (msg) => {
      const container = document.querySelector('.add-story');
      const banner = document.createElement('div');
      banner.className = 'success-banner';
      banner.textContent = msg;
      container.prepend(banner);
      setTimeout(() => banner.remove(), 2000);
    },
    showErrorMessage: (msg) => {
      const container = document.querySelector('.add-story');
      const banner = document.createElement('div');
      banner.className = 'error-banner';
      banner.textContent = msg;
      container.prepend(banner);
      setTimeout(() => banner.remove(), 2000);
    },
    cleanup: () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
      }
      if (map) {
        map.off();
        map.remove();
        map = null;
      }
      captureBtn.removeEventListener('click', onCaptureClick);
      storyForm.removeEventListener('submit', onSubmit);
      fileUpload.removeEventListener('change', onFileUpload);
    }
  };

  const presenter = AddStoryPresenter(view);

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const preview = document.getElementById('preview');
  const captureBtn = document.getElementById('captureBtn');
  const storyForm = document.getElementById('storyForm');
  const fileUpload = document.getElementById('fileUpload');

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      cameraStream = stream;
      video.srcObject = stream;
    })
    .catch(() => {
      alert('Gagal mengakses kamera. Pastikan izinnya diberikan.');
    });

  function onCaptureClick() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      preview.src = URL.createObjectURL(blob);
      preview.style.display = 'block';
      preview.blob = blob;
    }, 'image/jpeg');
  }
  captureBtn.addEventListener('click', onCaptureClick);

  function onFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';
      preview.blob = file;
    }
  }
  fileUpload.addEventListener('change', onFileUpload);

  if (!document.querySelector('link[href*="leaflet.css"]')) {
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
    document.head.appendChild(leafletCSS);
  }

  function initMap() {
    map = L.map('map').setView([-6.9, 107.6], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', e => {
      const { lat, lng } = e.latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;

      if (marker) marker.remove();
      marker = L.marker([lat, lng]).addTo(map);
    });
  }

  if (window.L) {
    initMap();
  } else {
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
    leafletScript.onload = initMap;
    document.body.appendChild(leafletScript);
  }

  function onSubmit(e) {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const lat = document.getElementById('lat').value;
    const lon = document.getElementById('lon').value;
    const photoBlob = preview.blob;

    if (!description) {
      alert('Deskripsi harus diisi.');
      return;
    }
    if (!photoBlob) {
      alert('Ambil atau unggah gambar terlebih dahulu!');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photoBlob);
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    presenter.submitStory(formData);
  }

  storyForm.addEventListener('submit', onSubmit);

  if (typeof setCleanup === 'function') {
    setCleanup(view.cleanup);
  }
};

export default addStory;
