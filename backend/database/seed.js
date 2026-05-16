const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function seedData() {
  const { rows } = await pool.query('SELECT COUNT(*) as count FROM users');
  const userCount = parseInt(rows[0].count, 10);

  if (userCount === 0) {
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedMember = await bcrypt.hash('member123', 10);

    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      ['Admin User', 'admin@example.com', hashedAdmin, 'admin']
    );
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      ['Member User', 'member@example.com', hashedMember, 'member']
    );

    const projectResult = await pool.query(
      'INSERT INTO projects (title, description) VALUES ($1, $2) RETURNING id',
      ['Demo Project', 'This is a demo project for beginners.']
    );
    const projectId = projectResult.rows[0].id;

    const memberResult = await pool.query("SELECT id FROM users WHERE role = 'member' LIMIT 1");
    const memberId = memberResult.rows[0].id;

    await pool.query(
      `INSERT INTO tasks (title, description, status, "dueDate", "projectId", "assignedTo") VALUES ($1, $2, $3, $4, $5, $6)`,
      ['Design Landing Page', 'Create first simple landing page.', 'Pending', '2026-12-30', projectId, memberId]
    );
    await pool.query(
      `INSERT INTO tasks (title, description, status, "dueDate", "projectId", "assignedTo") VALUES ($1, $2, $3, $4, $5, $6)`,
      ['Setup API Integration', 'Connect frontend with backend APIs.', 'In Progress', '2026-12-20', projectId, memberId]
    );
  }
}

module.exports = seedData;
