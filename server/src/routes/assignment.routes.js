const express = require('express');
const { getCourseAssignments, submitAssignment, getExam } = require('../controllers/assignment.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/course/:courseId', getCourseAssignments);
router.post('/:assignmentId/submit', submitAssignment);
router.get('/exam/:examId', getExam);

module.exports = router;
