const { pool } = require('../database/db');

exports.getTasks = async (req, res) => {
  const user = req.user;

  try {
    let result;
    if (user.role === 'admin') {
      result = await pool.query(`
        SELECT tasks.*, projects.title as "projectTitle", users.name as "assigneeName"
        FROM tasks
        JOIN projects ON projects.id = tasks."projectId"
        JOIN users ON users.id = tasks."assignedTo"
        ORDER BY tasks.id DESC
      `);
    } else {
      result = await pool.query(`
        SELECT tasks.*, projects.title as "projectTitle", users.name as "assigneeName"
        FROM tasks
        JOIN projects ON projects.id = tasks."projectId"
        JOIN users ON users.id = tasks."assignedTo"
        WHERE tasks."assignedTo" = $1
        ORDER BY tasks.id DESC
      `, [user.id]);
    }

    res.json(result.rows);
  } catch (err) {
    console.error('getTasks error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, status, dueDate, projectId, assignedTo } = req.body;

  if (!title || !dueDate || !projectId || !assignedTo) {
    return res.status(400).json({ message: 'title, dueDate, projectId, and assignedTo are required.' });
  }

  if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid task status.' });
  }

  try {
    const project = await pool.query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (project.rows.length === 0) return res.status(404).json({ message: 'Project not found.' });

    const member = await pool.query('SELECT id, role FROM users WHERE id = $1', [assignedTo]);
    if (member.rows.length === 0 || member.rows[0].role !== 'member') {
      return res.status(400).json({ message: 'Task can be assigned only to a valid member.' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, "dueDate", "projectId", "assignedTo")
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, description || '', status || 'Pending', dueDate, projectId, assignedTo]
    );

    return res.status(201).json({ id: result.rows[0].id, message: 'Task created.' });
  } catch (err) {
    console.error('createTask error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Valid status is required.' });
  }

  try {
    const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (taskResult.rows.length === 0) return res.status(404).json({ message: 'Task not found.' });

    const task = taskResult.rows[0];

    // Members can update only their own tasks.
    if (req.user.role === 'member' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'You can update only your own tasks.' });
    }

    await pool.query('UPDATE tasks SET status = $1 WHERE id = $2', [status, taskId]);

    return res.json({ message: 'Task status updated.' });
  } catch (err) {
    console.error('updateTask error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getDashboard = async (req, res) => {
  const user = req.user;
  const today = new Date().toISOString().split('T')[0];

  try {
    let result;
    if (user.role === 'admin') {
      result = await pool.query('SELECT * FROM tasks');
    } else {
      result = await pool.query('SELECT * FROM tasks WHERE "assignedTo" = $1', [user.id]);
    }

    const allTasks = result.rows;
    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === 'Completed').length;
    const pending = allTasks.filter((t) => t.status !== 'Completed').length;
    const overdue = allTasks.filter((t) => t.status !== 'Completed' && t.dueDate < today).length;

    res.json({ total, completed, pending, overdue });
  } catch (err) {
    console.error('getDashboard error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users WHERE role = 'member' ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error('getMembers error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
