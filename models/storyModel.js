const API_BASE = 'https://story-api.dicoding.dev/v1';

const StoryModel = {
  async getStories() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

      const res = await fetch(`${API_BASE}/stories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal memuat stories dari API.');
      }

      const data = await res.json();

      if (!Array.isArray(data.listStory)) {
        throw new Error('Format data stories tidak valid.');
      }

      return data.listStory.map((story) => ({
        id: story.id,
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        createdAt: story.createdAt,
        lat: story.lat,
        lon: story.lon,
      }));
    } catch (error) {
      console.error('StoryModel.getStories error:', error);
      throw error;
    }
  },

  async addStory(formData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

      const res = await fetch(`${API_BASE}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Gagal mengirim story.',
        };
      }

      return {
        success: true,
        message: data.message || 'Story berhasil ditambahkan!',
        data: data.story,
      };
    } catch (error) {
      console.error('StoryModel.addStory error:', error);
      return {
        success: false,
        message: error.message || 'Terjadi kesalahan saat upload story.',
      };
    }
  },
};

export default StoryModel;
