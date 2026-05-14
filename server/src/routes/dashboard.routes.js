const express = require('express');
const { 
  getStudentDashboard, 
  getStudentCourses,
  getAdminDashboard, 
  getInstitutionDashboard, 
  getCompanyDashboard 
} = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/student', authenticate, authorize('STUDENT'), getStudentDashboard);
router.get('/student/courses', authenticate, authorize('STUDENT'), getStudentCourses);
router.get('/admin', authenticate, authorize('ADMIN'), getAdminDashboard);
router.get('/institution', authenticate, authorize('INSTITUTION'), getInstitutionDashboard);
router.get('/company', authenticate, authorize('COMPANY'), getCompanyDashboard);

module.exports = router;
