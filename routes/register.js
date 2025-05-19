import RegisterPresenter from '../presenters/registerPresenter.js';

const register = async () => {
  const app = document.getElementById('app');

  const view = {
    showSuccessMessage: (msg) => alert(msg),
    showErrorMessage: (msg) => alert(msg),
  };

  const presenter = RegisterPresenter(view);

  app.innerHTML = `
    <h2>Daftar Akun</h2>
    <form id="registerForm">
      <label for="name">Nama:</label>
      <input type="text" id="name" required />
      <label for="email">Email:</label>
      <input type="email" id="email" required />
      <label for="password">Password:</label>
      <input type="password" id="password" required />
      <button type="submit">Daftar</button>
    </form>
  `;

  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    presenter.registerUser(name, email, password);
  });
};

export default register;
