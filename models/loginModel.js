const API_BASE = 'https://story-api.dicoding.dev/v1';

const LoginModel = {
  async login(email, password) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.message);
    return data;
  },
};

export default LoginModel;
