const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
  getMyProfile,
  updatePersonalInfo,
  addEducation,
  updateEducation,
  deleteEducation,
  addProject,
  updateProject,
  deleteProject,
  updateSkills,
  addCertification,
  deleteCertification,
  updateResumeData
} = require('../controllers/studentProfile.controller');

// All routes are protected
router.use(authenticate);

router.get('/me', getMyProfile);
router.put('/personal', updatePersonalInfo);
router.put('/resume-data', updateResumeData);

router.post('/education', addEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

router.post('/projects', addProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

router.put('/skills', updateSkills);

router.post('/certifications', addCertification);
router.delete('/certifications/:id', deleteCertification);

module.exports = router;
