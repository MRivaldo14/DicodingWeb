const API_BASE = 'https://story-api.dicoding.dev/v1';

const AddStoryModel = {
  async addStory(formData) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Autentikasi gagal. Silakan login kembali.');
    }

    try {
      const response = await fetch(`${API_BASE}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambahkan story.');
      }

      return await response.json();
    } catch (err) {
      throw new Error(err.message || 'Terjadi kesalahan jaringan. Silakan coba lagi.');
    }
  },
};

export default AddStoryModel;
