const asyncHandler = require('express-async-handler');
const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get student profile with all relations
 * @route   GET /api/profile/me
 * @access  Private (Student)
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { userId: req.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatar: true,
          banner: true,
          bio: true,
          location: true,
          socialLinks: true,
        }
      },
      education: { orderBy: { endYear: 'desc' } },
      projects: { orderBy: { createdAt: 'desc' } },
      certifications: { orderBy: { issueDate: 'desc' } },
      skills: true,
      documents: true,
      _count: {
        select: {
          enrollments: true,
          submissions: true,
          certificates: true
        }
      }
    }
  });

  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }

  res.json(student);
});

/**
 * @desc    Update personal info
 * @route   PUT /api/profile/personal
 * @access  Private (Student)
 */
const updatePersonalInfo = asyncHandler(async (req, res) => {
  const { name, bio, location, gender, dob, mobile, whatsapp, parentContact, address, city, state, pincode, socialLinks } = req.body;

  // Update User Model
  await prisma.user.update({
    where: { id: req.user.id },
    data: { name, bio, location, socialLinks }
  });

  // Update Student Model
  const student = await prisma.student.update({
    where: { userId: req.user.id },
    data: {
      gender,
      dob: dob ? new Date(dob) : undefined,
      mobile,
      whatsapp,
      parentContact,
      address,
      city,
      state,
      pincode
    }
  });

  res.json({ message: 'Personal information updated successfully', student });
});

/**
 * @desc    Add education
 * @route   POST /api/profile/education
 * @access  Private (Student)
 */
const addEducation = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  
  const education = await prisma.education.create({
    data: {
      ...req.body,
      studentId: student.id,
      cgpa: parseFloat(req.body.cgpa) || null,
      startYear: parseInt(req.body.startYear) || null,
      endYear: parseInt(req.body.endYear) || null
    }
  });

  res.status(201).json(education);
});

/**
 * @desc    Update education
 * @route   PUT /api/profile/education/:id
 * @access  Private (Student)
 */
const updateEducation = asyncHandler(async (req, res) => {
  const education = await prisma.education.update({
    where: { id: req.params.id },
    data: {
      ...req.body,
      cgpa: parseFloat(req.body.cgpa) || undefined,
      startYear: parseInt(req.body.startYear) || undefined,
      endYear: parseInt(req.body.endYear) || undefined
    }
  });
  res.json(education);
});

/**
 * @desc    Delete education
 * @route   DELETE /api/profile/education/:id
 * @access  Private (Student)
 */
const deleteEducation = asyncHandler(async (req, res) => {
  await prisma.education.delete({ where: { id: req.params.id } });
  res.json({ message: 'Education deleted' });
});

/**
 * @desc    Add project
 * @route   POST /api/profile/projects
 * @access  Private (Student)
 */
const addProject = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  
  const project = await prisma.project.create({
    data: {
      ...req.body,
      studentId: student.id,
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack : []
    }
  });

  res.status(201).json(project);
});

/**
 * @desc    Update project
 * @route   PUT /api/profile/projects/:id
 * @access  Private (Student)
 */
const updateProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: {
      ...req.body,
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack : undefined
    }
  });
  res.json(project);
});

/**
 * @desc    Delete project
 * @route   DELETE /api/profile/projects/:id
 * @access  Private (Student)
 */
const deleteProject = asyncHandler(async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ message: 'Project deleted' });
});

/**
 * @desc    Update skills
 * @route   PUT /api/profile/skills
 * @access  Private (Student)
 */
const updateSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body; // Array of {name, level}
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });

  // Delete existing skills
  await prisma.skill.deleteMany({ where: { studentId: student.id } });

  // Create new skills
  if (skills && skills.length > 0) {
    await prisma.skill.createMany({
      data: skills.map(s => ({
        name: s.name,
        level: s.level || 'BEGINNER',
        studentId: student.id
      }))
    });
  }

  const updatedSkills = await prisma.skill.findMany({ where: { studentId: student.id } });
  res.json(updatedSkills);
});

/**
 * @desc    Add certification
 * @route   POST /api/profile/certifications
 * @access  Private (Student)
 */
const addCertification = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  
  const certification = await prisma.certification.create({
    data: {
      ...req.body,
      studentId: student.id,
      issueDate: req.body.issueDate ? new Date(req.body.issueDate) : null,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null
    }
  });

  res.status(201).json(certification);
});

/**
 * @desc    Delete certification
 * @route   DELETE /api/profile/certifications/:id
 * @access  Private (Student)
 */
const deleteCertification = asyncHandler(async (req, res) => {
  await prisma.certification.delete({ where: { id: req.params.id } });
  res.json({ message: 'Certification deleted' });
});

module.exports = {
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
  deleteCertification
};
