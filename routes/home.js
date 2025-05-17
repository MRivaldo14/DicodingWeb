import HomeView from '../views/homeView.js';
import HomePresenter from '../presenters/homePresenter.js';

export default async function home() {
  HomeView.init();

  const presenter = HomePresenter(HomeView);
  await presenter.loadStories(); 
}
