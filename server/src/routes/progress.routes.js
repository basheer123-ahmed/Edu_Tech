const express = require('express');
const { updateLessonProgress, getCourseProgress } = require('../controllers/progress.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/course/:courseId', getCourseProgress);
router.post('/lesson/:lessonId', updateLessonProgress);

module.exports = router;
