const token = localStorage.getItem('admin_access_token');
const adminMessage = document.getElementById('admin-message');

if (!token) {
  window.location.href = '/admin';
}

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function handleUnauthorized(res) {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('admin_access_token');
    window.location.href = '/admin';
    return true;
  }

  return false;
}

async function loadAdminLinks() {
  const res = await fetch('/api/admin/links', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (handleUnauthorized(res)) {
    return;
  }

  const links = await res.json();

  const container = document.getElementById('admin-links');
  container.innerHTML = '';

  links.forEach((link) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <img src="${link.icon || '/icons/default.png'}" />
      <h3>${link.title}</h3>
      <a href="${link.url}" target="_blank">Open</a>
      <button onclick="deleteLink('${link._id}')">Delete</button>
    `;

    container.appendChild(div);
  });
}

async function deleteLink(id) {
  const res = await fetch('/api/admin/links/' + id, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (handleUnauthorized(res)) {
    return;
  }

  loadAdminLinks();
}

window.deleteLink = deleteLink;

document.getElementById('logout-button').addEventListener('click', function () {
  localStorage.removeItem('admin_access_token');
  window.location.href = '/admin';
});

document.getElementById('link-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const url = document.getElementById('url').value;
  const icon = document.getElementById('icon').value;

  const res = await fetch('/api/admin/links', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, url, icon }),
  });

  if (handleUnauthorized(res)) {
    return;
  }

  if (!res.ok) {
    adminMessage.textContent = 'Failed to create link. Please check your data.';
    return;
  }

  adminMessage.textContent = '';

  e.target.reset();
  loadAdminLinks();
});

window.onload = loadAdminLinks;
