const router = require('express').Router();
const jobController = require('../Controllers/job.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// Public
router.get('/', jobController.getAllJobs);

// Protected
router.post('/', verifyToken, requireRole('recruiter'), jobController.createJob);
router.post('/:id/apply', verifyToken, requireRole('user'), jobController.applyToJob);
router.get('/applications/mine', verifyToken, requireRole('user'), jobController.getMyApplications);
router.get('/my-posts', verifyToken, requireRole('recruiter'), jobController.getMyJobs);

module.exports = router;
