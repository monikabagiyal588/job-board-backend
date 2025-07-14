const router = require('express').Router();
const adminController = require('../Controllers/admin.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// User management
router.get('/users', verifyToken, requireRole('admin'), adminController.getAllUsers);
router.delete('/users/:id', verifyToken, requireRole('admin'), adminController.deleteUser);

// Job management
router.get('/jobs', verifyToken, requireRole('admin'), adminController.getAllJobs);
router.delete('/jobs/:id', verifyToken, requireRole('admin'), adminController.deleteJob);

module.exports = router;
