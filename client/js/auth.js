document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout');

  // Redirect if already logged in (on login/signup pages)
  const userId = localStorage.getItem('userId');
  if (userId && (signupForm || loginForm)) {
    window.location = 'profil.html';
    return;
  }

  // Signup
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = signupForm['email'].value;
      const password = signupForm['password'].value;
      const name = signupForm['name']?.value || '';

      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('userName', name);
          window.location = 'profil.html';
        } else {
          alert(data.error);
        }
      } catch (err) {
        alert('Eroare de conexiune');
      }
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm['email'].value;
      const password = loginForm['password'].value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('userName', data.name);
          localStorage.setItem('isAdmin', data.isAdmin);
          window.location = 'profil.html';
        } else {
          alert(data.error);
        }
      } catch (err) {
        alert('Eroare de conexiune');
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('isAdmin');
      window.location = 'index.html';
    });
  }
});
