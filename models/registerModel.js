const API_BASE = 'https://story-api.dicoding.dev/v1';

const RegisterModel = {
  async register(name, email, password) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message);
    }

    return await response.json();
  },
};

export default RegisterModel;
