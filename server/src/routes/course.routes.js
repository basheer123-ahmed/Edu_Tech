const express = require('express');
const { 
  getAllCourses, 
  getCourseById, 
  getCourseBySlug,
  createCourse, 
  updateCourse,
  deleteCourse,
  getCourseProgress,
  updateLessonProgress,
  getCourseModules,
  addModule, 
  addLesson, 
  enrollInCourse 
} = require('../controllers/course.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Public Routes
router.get('/', getAllCourses);
router.get('/slug/:slug', getCourseBySlug);
router.get('/:id', getCourseById);

// Protected Routes (Student)
router.post('/:id/enroll', authenticate, enrollInCourse);
router.get('/:id/modules', authenticate, getCourseModules);
router.get('/:id/progress', authenticate, getCourseProgress);
router.post('/lessons/:lessonId/complete', authenticate, updateLessonProgress);

// Management Roles (Admin/Institution)
const managementRoles = process.env.NODE_ENV === 'development' 
  ? ['INSTITUTION', 'ADMIN', 'STUDENT'] 
  : ['INSTITUTION', 'ADMIN'];

router.post('/', authenticate, authorize(...managementRoles), createCourse);
router.put('/:id', authenticate, authorize(...managementRoles), updateCourse);
router.delete('/:id', authenticate, authorize(...managementRoles), deleteCourse);
router.post('/:id/modules', authenticate, authorize(...managementRoles), addModule);
router.post('/modules/:moduleId/lessons', authenticate, authorize(...managementRoles), addLesson);

module.exports = router;
