const asyncHandler = require('express-async-handler');
const authService = require('../services/auth.service');
const { prisma } = require('../config/db');

const register = asyncHandler(async (req, res) => {
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

module.exports = {
  register,
  login,
  getMe,
  logout
};
