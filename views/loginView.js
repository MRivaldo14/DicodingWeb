import LoginPresenter from '../presenters/loginPresenter.js';

export default {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section>
        <h2>Login</h2>
        <form id="loginForm">
          <label for="email">Email:</label>
          <input id="email" type="email" required />
          
          <label for="password">Password:</label>
          <input id="password" type="password" required minlength="8" />
          
          <button type="submit">Login</button>
        </form>
        <p>Belum punya akun? <a href="#/register">Daftar</a></p>
      </section>
    `;
  },

  init() {
    const presenter = LoginPresenter(this);
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      presenter.loginUser(email, password);
    });
  },

  showSuccessMessage(message) {
    alert(message);
    location.hash = '#/home';
  },

  showErrorMessage(message) {
    alert(message);
  }
};
