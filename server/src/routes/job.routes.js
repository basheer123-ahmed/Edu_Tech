const express = require('express');
const { getAllJobs, createJob } = require('../controllers/job.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllJobs);
router.post('/', authenticate, authorize('COMPANY', 'ADMIN'), createJob);

module.exports = router;
