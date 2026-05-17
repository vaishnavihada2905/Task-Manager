require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./database/db');
const seedData = require('./database/seed');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

seedData();

app.get('/', (req, res) => {
  res.json({ message: 'Team Task Manager API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
