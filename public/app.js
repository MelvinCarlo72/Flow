const form = document.getElementById('taskForm');
const titleInput = document.getElementById('titleInput');
const dueInput = document.getElementById('dueInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter');

let tasks = [];
let currentFilter = 'all';

async function loadTasks() {
  const res = await fetch('/api/tasks');
  tasks = await res.json();
  render();
}

async function addTask(title, dueDate) {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, dueDate })
  });
  const task = await res.json();
  tasks.push(task);
  render();
}

async function toggleTask(id, completed) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  const updated = await res.json();
  tasks = tasks.map(t => t.id === id ? updated : t);
  render();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  tasks = tasks.filter(t => t.id !== id);
  render();
}

function render() {
  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  taskList.innerHTML = '';
  emptyState.classList.toggle('hidden', filtered.length > 0);

  filtered
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} />
        <span class="title">${escapeHtml(task.title)}</span>
        ${task.dueDate ? `<span class="due">${task.dueDate}</span>` : ''}
        <button class="delete">Delete</button>
      `;
      li.querySelector('input').addEventListener('change', e => toggleTask(task.id, e.target.checked));
      li.querySelector('.delete').addEventListener('click', () => deleteTask(task.id));
      taskList.appendChild(li);
    });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  addTask(title, dueInput.value || null);
  titleInput.value = '';
  dueInput.value = '';
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

loadTasks();
