
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authorize = require('../middleware/authMiddelware').authorize;
const checkRole = require('../middleware/authMiddelware').checkRole;


router.get('/', authorize, taskController.getAllTasks);

router.get('/:id', authorize, taskController.getTaskById);
router.post('/', authorize, checkRole('Admin'), taskController.createTask);


router.put('/:id', authorize, taskController.updateTask);

router.delete('/:id', authorize, taskController.deleteTask);

module.exports = router;
