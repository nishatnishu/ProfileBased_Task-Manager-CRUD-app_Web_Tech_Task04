const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, getAllTasksAdmin } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

// User routes
router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

// Admin-only route
router.get('/admin/all', auth, authorizeRoles('admin'), getAllTasksAdmin);

module.exports = router;
