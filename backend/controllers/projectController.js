const { pool } = require('../database/db');

exports.getProjects = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('getProjects error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.createProject = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Project title is required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO projects (title, description) VALUES ($1, $2) RETURNING id',
      [title, description || '']
    );

    return res.status(201).json({ id: result.rows[0].id, title, description: description || '' });
  } catch (err) {
    console.error('createProject error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
