const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllStudents,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  resetAdminPassword,
  suspendAdmin,
} = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All admin routes require authentication + ADMIN role
router.use(authenticate, authorize('ADMIN'));

// Dashboard
router.get('/stats', getAdminStats);
router.get('/students', getAllStudents);

// Admin management
router.post('/create-admin', createAdmin);
router.get('/admins', getAllAdmins);
router.delete('/admins/:id', deleteAdmin);
router.post('/admins/:id/reset-password', resetAdminPassword);
router.post('/admins/:id/suspend', suspendAdmin);

module.exports = router;
