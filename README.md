# Task Manager App

A full-stack task manager: add tasks, set due dates, mark them complete, filter
by status. Node/Express backend with a JSON-file data store, vanilla JS frontend.

## Tech stack
- Node.js + Express (REST API)
- JSON file storage (no database setup needed to run it)
- Vanilla JavaScript, HTML, CSS on the frontend

## Run it

```bash
npm install
npm start
# visit http://localhost:3000
```

For auto-restart on file changes during development:

```bash
npm run dev
```

## API

| Method | Route             | Description          |
|--------|--------------------|-----------------------|
| GET    | `/api/tasks`       | List all tasks        |
| POST   | `/api/tasks`       | Create a task          |
| PUT    | `/api/tasks/:id`   | Update a task (title, dueDate, completed) |
| DELETE | `/api/tasks/:id`   | Delete a task          |

## Possible next steps
- Swap the JSON file for a real database (SQLite / Postgres)
- Add user accounts and auth
- Deploy (Render, Railway, or Fly.io all have free tiers)

---
Built by Melvin Carlo Villanueva.
