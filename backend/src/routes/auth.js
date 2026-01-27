const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.post('/login', authController.login);
router.post('/register-staff', authController.registerStaff);
router.get('/stats', authController.getDashboardStats);

module.exports = router;