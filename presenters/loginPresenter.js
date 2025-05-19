import LoginModel from '../models/loginModel.js';

const LoginPresenter = (view) => {
  const loginUser = async (email, password) => {
    try {
      const data = await LoginModel.login(email, password);
      localStorage.setItem('token', data.loginResult.token);
      view.showSuccessMessage('Login berhasil!');
    } catch (err) {
      view.showErrorMessage(err.message || 'Gagal login.');
    }
  };

  return { loginUser };
};

export default LoginPresenter;
