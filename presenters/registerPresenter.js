import RegisterModel from '../models/registerModel.js';

const RegisterPresenter = (view) => {
  const registerUser = async (name, email, password) => {
    try {
      const result = await RegisterModel.register(name, email, password);

      if (!result.error) {
        view.showSuccessMessage(result.message);
        location.hash = '#/login';
      } else {
        view.showErrorMessage(result.message);
      }
    } catch (error) {
      view.showErrorMessage('Terjadi kesalahan saat mendaftar.');
    }
  };

  return { registerUser };
};

export default RegisterPresenter;
