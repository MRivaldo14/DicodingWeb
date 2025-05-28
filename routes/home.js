import HomeView from '../views/homeView.js';
import HomePresenter from '../presenters/homePresenter.js';

export default async function home() {
  try {
    HomeView.init();
  } catch (error) {
    console.error('❌ Error saat memuat halaman beranda:', error);
    HomeView.showUploadError('Gagal memuat cerita. Silakan coba lagi.');
  }
}
