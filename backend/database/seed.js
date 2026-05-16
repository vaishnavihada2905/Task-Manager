const bcrypt = require('bcryptjs');
const db = require('./db');

function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

  if (userCount === 0) {
    const hashedAdmin = bcrypt.hashSync('admin123', 10);
    const hashedMember = bcrypt.hashSync('member123', 10);

    const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    insertUser.run('Admin User', 'admin@example.com', hashedAdmin, 'admin');
    insertUser.run('Member User', 'member@example.com', hashedMember, 'member');

    const insertProject = db.prepare('INSERT INTO projects (title, description) VALUES (?, ?)');
    const project = insertProject.run('Demo Project', 'This is a demo project for beginners.');

    const member = db.prepare("SELECT id FROM users WHERE role = 'member' LIMIT 1").get();
    const insertTask = db.prepare(
      'INSERT INTO tasks (title, description, status, dueDate, projectId, assignedTo) VALUES (?, ?, ?, ?, ?, ?)'
    );

    insertTask.run('Design Landing Page', 'Create first simple landing page.', 'Pending', '2026-12-30', project.lastInsertRowid, member.id);
    insertTask.run('Setup API Integration', 'Connect frontend with backend APIs.', 'In Progress', '2026-12-20', project.lastInsertRowid, member.id);
  }
}

module.exports = seedData;
