const express = require('express');
const { getProjects, createProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, roleMiddleware('admin'), createProject);

module.exports = router;
