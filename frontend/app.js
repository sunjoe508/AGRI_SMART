let token = '';

async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User', email, password })
  });
  const data = await res.json();
  if (data.token) { token = data.token; showDash(); }
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) { token = data.token; showDash(); }
}

function showDash() {
  document.getElementById('auth-form').classList.add('d-none');
  document.getElementById('dashboard').classList.remove('d-none');
  loadCrops(); loadTasks();
}

async function loadCrops() {
  const res = await fetch('http://localhost:5000/api/crops', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const crops = await res.json();
  const list = document.getElementById('crop-list');
  list.innerHTML = crops.map(c => `<li class="list-group-item">${c.name} (planted: ${new Date(c.plantedAt).toLocaleDateString()})</li>`).join('');
}

async function addCrop() {
  const name = prompt('Crop name?');
  const date = prompt('Plant date (YYYY-MM-DD)?');
  await fetch('http://localhost:5000/api/crops', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, plantedAt: date, expectedHarvest: date })
  });
  loadCrops();
}

async function loadTasks() {
  const res = await fetch('http://localhost:5000/api/tasks', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const tasks = await res.json();
  const list = document.getElementById('task-list');
  list.innerHTML = tasks.map(t => `
    <li class="list-group-item">
      <input type="checkbox" ${t.done ? 'checked' : ''} onclick="toggleTask('${t._id}', this.checked)">
      ${t.task}
    </li>`).join('');
}

async function addTask() {
  const task = prompt('New task?');
  await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ task })
  });
  loadTasks();
}

async function toggleTask(id, done) {
  await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ done })
  });
  loadTasks();
}
