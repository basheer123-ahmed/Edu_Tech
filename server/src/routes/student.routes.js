const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getStudentProgress,
  getLeaderboard,
  getStreakData,
  getSkills,
  getAnalytics,
  getAttendance,
  getRecommendations
} = require('../controllers/studentDashboard.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const studentOnly = [authenticate, authorize('STUDENT')];

router.get('/dashboard', studentOnly, getStudentDashboard);
router.get('/progress', studentOnly, getStudentProgress);
router.get('/leaderboard', studentOnly, getLeaderboard);
router.get('/streak', studentOnly, getStreakData);
router.get('/skills', studentOnly, getSkills);
router.get('/analytics', studentOnly, getAnalytics);
router.get('/attendance', studentOnly, getAttendance);
router.get('/recommendations', studentOnly, getRecommendations);

module.exports = router;
