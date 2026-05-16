const express = require('express');
const { getTasks, createTask, updateTask, getDashboard, getMembers } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, roleMiddleware('admin'), createTask);
router.put('/:id', authMiddleware, updateTask);
router.get('/dashboard/stats', authMiddleware, getDashboard);
router.get('/members/list', authMiddleware, roleMiddleware('admin'), getMembers);

module.exports = router;
