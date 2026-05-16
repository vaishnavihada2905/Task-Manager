const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'task_manager.db');
const db = new Database(dbPath);

// Create tables once at startup.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'member'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'In Progress', 'Completed')),
    dueDate TEXT NOT NULL,
    projectId INTEGER NOT NULL,
    assignedTo INTEGER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES projects(id),
    FOREIGN KEY (assignedTo) REFERENCES users(id)
  );
`);

module.exports = db;
