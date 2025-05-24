import AddStoryModel from '../models/addStoryModel.js';

const AddStoryPresenter = (view) => {
  const submitStory = async (formData) => {
    try {
      const result = await AddStoryModel.addStory(formData);
      console.log('AddStoryPresenter:', result);

      await AddStoryModel.saveStoryOffline(formData);

      view.showSuccessMessage(result.message || 'Story berhasil ditambahkan!');
      view.cleanup();

      setTimeout(() => {
        location.hash = '#/home';
      }, 300);
    } catch (err) {
      console.error(err);
      view.showErrorMessage(err.message || 'Terjadi kesalahan saat mengirim story.');
    }
  };

  return { submitStory };
};

export default AddStoryPresenter;
