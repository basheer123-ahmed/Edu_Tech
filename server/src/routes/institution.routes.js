const express = require('express');
const router = express.Router();
const {
  createInstitution,
  getAllInstitutions,
  getInstitutionById,
} = require('../controllers/institution.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All routes require admin authentication
router.use(authenticate, authorize('ADMIN'));

router.post('/', createInstitution);
router.get('/', getAllInstitutions);
router.get('/:id', getInstitutionById);

module.exports = router;
