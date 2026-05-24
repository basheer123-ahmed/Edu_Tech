const asyncHandler = require('express-async-handler');
const authService = require('../services/auth.service');
const { prisma } = require('../config/db');
const bcrypt = require('bcryptjs');

const register = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (role && role !== 'STUDENT') {
    return res.status(403).json({
      status: 'error',
      message: 'Registration is restricted to students only. Admins and Institutions must be created by an administrator.'
    });
  }
  
  // Force role to STUDENT
  req.body.role = 'STUDENT';
  
  const user = await authService.createUser(req.body);
  const token = authService.generateToken(user.id, user.role);
  res.status(201).send({ user, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUserWithEmailAndPassword(email, password);
  res.send({ user, token });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      student: true,
      institution_institution_userIdTouser: true,
      company: true,
      admin: true
    }
  });
  res.json(user);
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).send({ message: 'Successfully logged out' });
});

/**
 * @desc    Force reset password (first login for institution accounts)
 * @route   POST /api/auth/force-reset-password
 * @access  Authenticated
 */
const forceResetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      status: 'error',
      message: 'New password must be at least 8 characters long',
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  if (!user.mustResetPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Password reset is not required for this account',
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      mustResetPassword: false,
    },
  });

  // Generate fresh token
  const token = authService.generateToken(user.id, user.role);

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful. Welcome to SkilStation!',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustResetPassword: false,
    },
  });
});

module.exports = {
  register,
  login,
  getMe,
  logout,
  forceResetPassword,
};
