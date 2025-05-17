import StoryDetailView from '../views/storyDetailView.js';
import StoryDetailPresenter from '../presenters/storyDetailPresenter.js';

export default async function storyDetail(id) {
  StoryDetailView.render(); 
  const presenter = StoryDetailPresenter(StoryDetailView);
  await presenter.loadDetail(id); 
  StoryDetailView.init(); 
}
