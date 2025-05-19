import StoryDetailModel from '../models/storyDetailModel.js';
import IDBHelper from '../utils/idb.js'; 

const StoryDetailPresenter = (view) => {
  const loadDetail = async (id) => {
    try {
      const story = await StoryDetailModel.getStoryDetail(id);

      await IDBHelper.saveStory(story);

      view.renderDetail(story);
    } catch (err) {
      console.warn('Gagal ambil dari API, mencoba ambil dari IndexedDB...', err);

      const cachedStory = await IDBHelper.getStoryById(id);

      if (cachedStory) {
        view.renderDetail(cachedStory);
      } else {
        view.showErrorMessage(err.message || 'Gagal memuat detail cerita.');
      }
    }
  };

  return { loadDetail };
};

export default StoryDetailPresenter;
