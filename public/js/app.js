async function loadLinks() {
  const res = await fetch('/api/links');
  const links = await res.json();

  const container = document.getElementById('links-container');
  container.innerHTML = '';

  links.forEach(link => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <img src="${link.icon || '/icons/default.png'}" />
      <h3>${link.title}</h3>
      <a href="${link.url}" target="_blank">Open</a>
    `;

    container.appendChild(div);
  });
}

window.onload = loadLinks;