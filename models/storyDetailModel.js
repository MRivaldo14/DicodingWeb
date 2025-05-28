const API_BASE = 'https://story-api.dicoding.dev/v1';

const StoryDetailModel = {
  async getStoryDetail(id) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Gagal memuat detail story (HTTP Error).');
    }

    const { story, error, message } = await response.json();
    if (error) throw new Error(message || 'Gagal memuat detail story.');

    return story;
  },
};

export default StoryDetailModel;
