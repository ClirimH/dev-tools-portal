const token = localStorage.getItem('admin_access_token');
const adminMessage = document.getElementById('admin-message');
const linkForm = document.getElementById('link-form');
const linkIdInput = document.getElementById('link-id');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const iconInput = document.getElementById('icon');
const submitLinkButton = document.getElementById('submit-link-button');
const cancelEditButton = document.getElementById('cancel-edit-button');

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

function resetFormState() {
  linkIdInput.value = '';
  linkForm.reset();
  submitLinkButton.textContent = 'Add Link';
  cancelEditButton.hidden = true;
  adminMessage.textContent = '';
}

function startEdit(link) {
  linkIdInput.value = link._id;
  titleInput.value = link.title || '';
  urlInput.value = link.url || '';
  iconInput.value = link.icon || '';
  submitLinkButton.textContent = 'Update Link';
  cancelEditButton.hidden = false;
  adminMessage.textContent =
    'Editing link. Update the fields and save changes.';
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
      <button type="button" class="edit-link-button">Edit</button>
      <button onclick="deleteLink('${link._id}')">Delete</button>
    `;

    const editButton = div.querySelector('.edit-link-button');
    editButton.addEventListener('click', () => startEdit(link));

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

cancelEditButton.addEventListener('click', function () {
  resetFormState();
});

linkForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = titleInput.value;
  const url = urlInput.value;
  const icon = iconInput.value;
  const linkId = linkIdInput.value;
  const isEditing = Boolean(linkId);

  const res = await fetch(
    isEditing ? `/api/admin/links/${linkId}` : '/api/admin/links',
    {
      method: isEditing ? 'PATCH' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, url, icon }),
    },
  );

  if (handleUnauthorized(res)) {
    return;
  }

  if (!res.ok) {
    adminMessage.textContent = isEditing
      ? 'Failed to update link. Please check your data.'
      : 'Failed to create link. Please check your data.';
    return;
  }

  resetFormState();
  loadAdminLinks();
});

window.onload = loadAdminLinks;
