const db = require('../database/db');

exports.getProjects = (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY id DESC').all();
  res.json(projects);
};

exports.createProject = (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Project title is required.' });
  }

  const result = db.prepare('INSERT INTO projects (title, description) VALUES (?, ?)').run(title, description || '');

  return res.status(201).json({ id: result.lastInsertRowid, title, description: description || '' });
};
