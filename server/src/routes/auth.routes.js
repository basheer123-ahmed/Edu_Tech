const express = require('express');
const validate = require('../middleware/validate.middleware');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
