import StoryModel from '../models/storyModel.js';
import IDBHelper from '../utils/idb.js';

const HomePresenter = (view) => {
  const loadStories = async () => {
    try {
      const stories = await StoryModel.getStories();

      await IDBHelper.saveStories(stories);

      view.render(stories);
    } catch (error) {
      console.warn('Gagal ambil stories dari API, coba ambil dari IndexedDB...', error);

      const cachedStories = await IDBHelper.getAllStories();

      if (cachedStories.length > 0) {
        view.render(cachedStories);
      } else {

        view.render([]);
      }
    }
  };

  const uploadStory = async (formData) => {
    try {
      const result = await StoryModel.addStory(formData);
      if (result.success) {
        view.showUploadSuccess();

        const stories = await StoryModel.getStories();
        await IDBHelper.saveStories(stories);
        view.render(stories);
      } else {
        view.showUploadError(result.message || 'Gagal upload story.');
      }
    } catch (error) {
      console.error(error);
      view.showUploadError(error.message || 'Terjadi kesalahan saat upload story.');
    }
  };

  return { loadStories, uploadStory };
};

export default HomePresenter;
