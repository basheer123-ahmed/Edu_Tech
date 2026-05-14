const { prisma } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  const token = generateToken(user.id, user.role);

  return { user, token };
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const { email, password, name, role, gender, phone } = userBody;

  if (await prisma.user.findUnique({ where: { email } })) {
    throw new ApiError(400, 'Email already taken');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { v4: uuidv4 } = require('uuid');
  
  const user = await prisma.$transaction(async (tx) => {
    const userId = uuidv4();
    const newUser = await tx.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        name,
        gender: gender || null,
        phone: phone || null,
        role: role || 'STUDENT',
      },
    });

    // Create role-specific profile
    if (newUser.role === 'STUDENT') {
      await tx.student.create({ data: { id: uuidv4(), userId: newUser.id } });
    } else if (newUser.role === 'INSTITUTION') {
      await tx.institution.create({ data: { id: uuidv4(), userId: newUser.id } });
    } else if (newUser.role === 'COMPANY') {
      await tx.company.create({ data: { id: uuidv4(), userId: newUser.id } });
    } else if (newUser.role === 'ADMIN') {
      await tx.admin.create({ data: { id: uuidv4(), userId: newUser.id } });
    }

    return newUser;
  });

  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
  createUser,
  generateToken,
};
