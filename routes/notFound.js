export default function notFound() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="not-found">
      <h2>404 Not Found</h2>
      <p>Halaman yang Anda cari tidak ditemukan.</p>
      <a href="#/home" class="btn btn-primary">Kembali ke Beranda</a>
    </section>
  `;
}
