const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

const { authenticateUser, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/chat', authenticateUser, aiController.chat);
router.post('/resume/generate', authenticateUser, authorizeRoles('STUDENT'), aiController.generateResume);

module.exports = router;
