const db = require('../database/db');

exports.getTasks = (req, res) => {
  const user = req.user;
  let tasks;

  if (user.role === 'admin') {
    tasks = db.prepare(`
      SELECT tasks.*, projects.title as projectTitle, users.name as assigneeName
      FROM tasks
      JOIN projects ON projects.id = tasks.projectId
      JOIN users ON users.id = tasks.assignedTo
      ORDER BY tasks.id DESC
    `).all();
  } else {
    tasks = db.prepare(`
      SELECT tasks.*, projects.title as projectTitle, users.name as assigneeName
      FROM tasks
      JOIN projects ON projects.id = tasks.projectId
      JOIN users ON users.id = tasks.assignedTo
      WHERE tasks.assignedTo = ?
      ORDER BY tasks.id DESC
    `).all(user.id);
  }

  res.json(tasks);
};

exports.createTask = (req, res) => {
  const { title, description, status, dueDate, projectId, assignedTo } = req.body;

  if (!title || !dueDate || !projectId || !assignedTo) {
    return res.status(400).json({ message: 'title, dueDate, projectId, and assignedTo are required.' });
  }

  if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid task status.' });
  }

  const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found.' });

  const member = db.prepare("SELECT id, role FROM users WHERE id = ?").get(assignedTo);
  if (!member || member.role !== 'member') {
    return res.status(400).json({ message: 'Task can be assigned only to a valid member.' });
  }

  const result = db
    .prepare('INSERT INTO tasks (title, description, status, dueDate, projectId, assignedTo) VALUES (?, ?, ?, ?, ?, ?)')
    .run(title, description || '', status || 'Pending', dueDate, projectId, assignedTo);

  return res.status(201).json({ id: result.lastInsertRowid, message: 'Task created.' });
};

exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Valid status is required.' });
  }

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });

  // Members can update only their own tasks.
  if (req.user.role === 'member' && task.assignedTo !== req.user.id) {
    return res.status(403).json({ message: 'You can update only your own tasks.' });
  }

  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, taskId);

  return res.json({ message: 'Task status updated.' });
};

exports.getDashboard = (req, res) => {
  const user = req.user;
  const today = new Date().toISOString().split('T')[0];

  const whereClause = user.role === 'admin' ? '' : 'WHERE assignedTo = ?';
  const param = user.role === 'admin' ? [] : [user.id];

  const allTasks = db.prepare(`SELECT * FROM tasks ${whereClause}`).all(...param);

  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === 'Completed').length;
  const pending = allTasks.filter((t) => t.status !== 'Completed').length;
  const overdue = allTasks.filter((t) => t.status !== 'Completed' && t.dueDate < today).length;

  res.json({ total, completed, pending, overdue });
};

exports.getMembers = (req, res) => {
  const members = db.prepare("SELECT id, name, email FROM users WHERE role = 'member' ORDER BY name").all();
  res.json(members);
};
