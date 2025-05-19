import HomeView from '../views/homeView.js';
import HomePresenter from '../presenters/homePresenter.js';
import IDBHelper from '../utils/idb.js';

export default async function home() {
  try {
    HomeView.init();

    const presenter = HomePresenter({
      view: HomeView,
      dataSource: IDBHelper,
    });

    await presenter.loadStories();
  } catch (error) {
    console.error('❌ Error saat memuat halaman beranda:', error);
    HomeView.showError('Gagal memuat cerita. Silakan coba lagi.');
  }
}
