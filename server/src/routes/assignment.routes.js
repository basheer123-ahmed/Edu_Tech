const express = require('express');
const {
  getCourseAssignments,
  submitAssignment,
  getAssignmentStats,
  getAssignmentCourses,
  getAssignmentLevelDetails,
  getAdminCourseAssignments,
  createAdminLevel,
  deleteAdminLevel,
  createAdminQuestion,
  generateAdminAIQuestions,
  bulkUploadAdminQuestions,
  bulkSaveAdminQuestions,
  publishAdminAssignment,
  logProctoringViolation,
  getProctoringLogs,
  startProctoringSession,
  endProctoringSession
} = require('../controllers/assignment.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Student APIs
router.get('/stats', getAssignmentStats);
router.get('/courses', getAssignmentCourses);
router.get('/course/:courseId', getCourseAssignments);
router.get('/level/:levelId', getAssignmentLevelDetails);
router.post('/:assignmentId/submit', submitAssignment);
router.post('/proctor/violation', logProctoringViolation);
router.post('/proctor/session/start', startProctoringSession);
router.post('/proctor/session/end', endProctoringSession);

// Admin APIs
router.get('/admin/courses/:courseId/assignments', authorize('ADMIN'), getAdminCourseAssignments);
router.post('/admin/levels/create', authorize('ADMIN'), createAdminLevel);
router.delete('/admin/levels/:levelId', authorize('ADMIN'), deleteAdminLevel);
router.post('/admin/questions/create', authorize('ADMIN'), createAdminQuestion);
router.post('/admin/questions/ai-generate', authorize('ADMIN'), generateAdminAIQuestions);
router.post('/admin/questions/bulk-upload', authorize('ADMIN'), bulkUploadAdminQuestions);
router.post('/admin/questions/bulk-save', authorize('ADMIN'), bulkSaveAdminQuestions);
router.post('/admin/assignments/publish', authorize('ADMIN'), publishAdminAssignment);
router.get('/admin/proctor/logs', authorize('ADMIN'), getProctoringLogs);

module.exports = router;
