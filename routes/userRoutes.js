const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authorize = require('../middleware/authMiddelware').authorize;
const checkRole = require('../middleware/authMiddelware').checkRole;

router.get('/profile', authorize, userController.getProfile); // All authenticated users
router.get('/users', authorize, checkRole('Admin'), userController.getAllUsers); 
router.put('/update-role', authorize, checkRole('Admin'), userController.updateUserRole);
router.put('/preferences', authorize, userController.updateNotificationPreferences);

module.exports = router;