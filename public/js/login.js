const existingToken = localStorage.getItem('admin_access_token');
if (existingToken) {
  window.location.href = '/admin/panel';
}

const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginMessage.textContent = '';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    loginMessage.textContent =
      data.message || 'Login failed. Please verify your credentials.';
    return;
  }

  localStorage.setItem('admin_access_token', data.accessToken);
  window.location.href = '/admin/panel';
});
