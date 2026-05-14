const express = require('express');
const router = express.Router();
const { getAdminStats, getAllStudents } = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/stats', authenticate, authorize('ADMIN'), getAdminStats);
router.get('/students', authenticate, authorize('ADMIN'), getAllStudents);

module.exports = router;
