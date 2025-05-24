import RegisterPresenter from '../presenters/register.js';

const RegisterView = {
    render() {
      return `
        <section id="register-section">
          <h2>Daftar Akun</h2>
          <form id="register-form">
            <label for="name">Nama:</label>
            <input type="text" id="name" required />
            <label for="email">Email:</label>
            <input type="email" id="email" required />
            <label for="password">Password:</label>
            <input type="password" id="password" minlength="8" required />
            <button type="submit">Daftar</button>
          </form>
          <div id="message" role="alert"></div>
        </section>
      `;
    },
  
    init() {
      this.form = document.getElementById('register-form');
      this.nameInput = document.getElementById('name');
      this.emailInput = document.getElementById('email');
      this.passwordInput = document.getElementById('password');
      this.messageBox = document.getElementById('message');
  
      this.presenter = RegisterPresenter(this);
  
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = this.nameInput.value;
        const email = this.emailInput.value;
        const password = this.passwordInput.value;
  
        this.presenter.registerUser(name, email, password);
      });
    },
  
    showSuccessMessage(message) {
      this.messageBox.innerText = message;
      this.messageBox.style.color = 'green';
    },
  
    showErrorMessage(message) {
      this.messageBox.innerText = message;
      this.messageBox.style.color = 'red';
    }
  };
  
  export default RegisterView;
  
