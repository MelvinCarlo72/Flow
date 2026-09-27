const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return raw ? JSON.parse(raw) : [];
}

function writeTasks(tasks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

// POST a new task
app.post('/api/tasks', (req, res) => {
  const { title, dueDate } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    title: title.trim(),
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// PUT (update) a task — toggle completion, edit title/dueDate
app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'task not found' });

  const { title, dueDate, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (completed !== undefined) task.completed = completed;

  writeTasks(tasks);
  res.json(task);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readTasks();
  const exists = tasks.some(t => t.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'task not found' });
  tasks = tasks.filter(t => t.id !== req.params.id);
  writeTasks(tasks);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Task manager running at http://localhost:${PORT}`);
});
