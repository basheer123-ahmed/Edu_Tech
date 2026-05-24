const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { prisma } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @desc    Get Admin Dashboard Overview Stats
 * @route   GET /api/admin/stats
 * @access  Admin Only
 */
const getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    activeCourses,
    pendingReviews,
    totalEnrollments,
    courses,
    recentUsers,
    recentCourses
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.course.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.enrollment.count(),
    prisma.course.findMany({ select: { price: true } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { name: true, role: true, createdAt: true } }),
    prisma.course.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { title: true, status: true, createdAt: true } })
  ]);

  // Mock revenue calculation (Enrollments * Avg Price)
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price || 0), 0) * (totalEnrollments / (courses.length || 1));

  const recentActivity = [
    ...recentUsers.map(u => ({ type: 'User', name: u.name || 'User', status: `New ${u.role}`, time: u.createdAt, color: 'bg-blue-500' })),
    ...recentCourses.map(c => ({ type: 'Course', name: c.title, status: c.status, time: c.createdAt, color: 'bg-orange-500' }))
  ].sort((a, b) => b.time - a.time).slice(0, 4).map(a => ({
    ...a,
    time: a.time.toLocaleDateString()
  }));

  const growthData = [45, 60, 40, 85, 70, 95, 100, 80, 65, 75, 90, 110];

  res.json({
    stats: {
      totalStudents,
      activeCourses,
      pendingReviews,
      totalRevenue: Math.round(totalRevenue),
      completionRate: 74,
      aiEngagement: 88,
      monthlyGrowth: 12.5
    },
    recentActivity,
    growthData
  });
});

/**
 * @desc    Get All Students with Details
 * @route   GET /api/admin/students
 * @access  Admin Only
 */
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      student: {
        include: {
          enrollments: { include: { course: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(students);
});

/**
 * @desc    Create a new admin account (Admin only)
 * @route   POST /api/admin/create-admin
 * @access  Admin Only
 */
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, email, and temporary password are required',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      status: 'error',
      message: 'Temporary password must be at least 6 characters',
    });
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: 'An account with this email already exists',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user + admin profile in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const userId = uuidv4();

    const user = await tx.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role: 'ADMIN',
        mustResetPassword: true,
      },
    });

    const adminProfile = await tx.admin.create({
      data: {
        id: uuidv4(),
        userId: user.id,
      },
    });

    return { user, adminProfile };
  });

  // Send credentials email
  let emailSent = false;
  try {
    const mailOptions = {
      from: `"SkilStation Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'SkilStation — Your Admin Account Credentials',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #9d174d 0%, #db2777 50%, #d946ef 100%); padding: 40px 32px; text-align: center;">
            <h1 style="color: white; font-size: 28px; font-weight: 800; margin: 0 0 8px 0;">🛡️ SkilStation Admin</h1>
            <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">Admin Account Created</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <p style="color: #1e293b; font-size: 16px; margin: 0 0 20px 0;">Hello <strong>${name}</strong>,</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 24px 0;">
              You have been granted <strong>Admin access</strong> to the SkilStation platform. 
              Use the credentials below to log in. You will be required to set a new password on first login.
            </p>

            <!-- Credentials Box -->
            <div style="background: #fdf2f8; border: 2px solid #fbcfe8; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 15px; font-weight: 600; text-align: right;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-top: 1px solid #fce7f3; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Temporary Password</td>
                  <td style="padding: 8px 0; border-top: 1px solid #fce7f3; color: #db2777; font-size: 18px; font-weight: 800; text-align: right; font-family: monospace; letter-spacing: 2px;">${password}</td>
                </tr>
              </table>
            </div>

            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; margin: 0 0 24px 0;">
              <p style="color: #92400e; font-size: 13px; margin: 0;">⚠️ <strong>Important:</strong> You must change this password on your first login. Do not share these credentials.</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0 16px 0;">
              <a href="http://localhost:5173/login" style="display: inline-block; background: linear-gradient(135deg, #db2777, #d946ef); color: white; text-decoration: none; padding: 14px 40px; border-radius: 12px; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;">Login to Admin Panel →</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #fdf2f8; padding: 20px 32px; text-align: center; border-top: 1px solid #fce7f3;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 SkilStation. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    emailSent = true;
    console.log(`✅ [Admin] Credentials email sent to ${email}`);
  } catch (error) {
    console.error('❌ [Admin] Failed to send credentials email:', error.message);
  }

  res.status(201).json({
    status: 'success',
    message: emailSent
      ? `Admin "${name}" created successfully. Credentials sent to ${email}.`
      : `Admin "${name}" created, but email delivery failed. Share credentials manually.`,
    emailSent,
    admin: {
      id: result.adminProfile.id,
      userId: result.user.id,
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone,
      createdAt: result.user.createdAt,
    },
    // Show temp password only if email failed
    ...(emailSent ? {} : { tempPassword: password }),
  });
});

/**
 * @desc    Get all admin accounts
 * @route   GET /api/admin/admins
 * @access  Admin Only
 */
const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      createdAt: true,
      lastLogin: true,
      mustResetPassword: true,
      admin: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatted = admins.map((a) => ({
    id: a.id,
    adminId: a.admin?.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    avatar: a.avatar,
    status: a.mustResetPassword ? 'PENDING_SETUP' : 'ACTIVE',
    mustResetPassword: a.mustResetPassword,
    lastLogin: a.lastLogin,
    createdAt: a.createdAt,
  }));

  res.json({ status: 'success', admins: formatted });
});

/**
 * @desc    Delete an admin account
 * @route   DELETE /api/admin/admins/:id
 * @access  Admin Only
 */
const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent self-deletion
  if (id === req.user.id) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot delete your own admin account',
    });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== 'ADMIN') {
    return res.status(404).json({ status: 'error', message: 'Admin not found' });
  }

  await prisma.user.delete({ where: { id } });

  res.json({ status: 'success', message: `Admin "${user.name}" deleted successfully` });
});

/**
 * @desc    Reset an admin's password (force them to reset on next login)
 * @route   POST /api/admin/admins/:id/reset-password
 * @access  Admin Only
 */
const resetAdminPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newTempPassword } = req.body;

  if (!newTempPassword || newTempPassword.length < 6) {
    return res.status(400).json({
      status: 'error',
      message: 'Temporary password must be at least 6 characters',
    });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== 'ADMIN') {
    return res.status(404).json({ status: 'error', message: 'Admin not found' });
  }

  const hashedPassword = await bcrypt.hash(newTempPassword, 10);

  await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
      mustResetPassword: true,
    },
  });

  res.json({
    status: 'success',
    message: `Password reset for "${user.name}". They must set a new password on next login.`,
  });
});

/**
 * @desc    Suspend/Unsuspend admin (toggle mustResetPassword as a soft lock)
 * @route   POST /api/admin/admins/:id/suspend
 * @access  Admin Only
 */
const suspendAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id === req.user.id) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot suspend your own account',
    });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== 'ADMIN') {
    return res.status(404).json({ status: 'error', message: 'Admin not found' });
  }

  // Toggle: set mustResetPassword to true to effectively lock them out
  await prisma.user.update({
    where: { id },
    data: { mustResetPassword: true },
  });

  res.json({
    status: 'success',
    message: `Admin "${user.name}" has been suspended. They must reset their password to regain access.`,
  });
});

module.exports = {
  getAdminStats,
  getAllStudents,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  resetAdminPassword,
  suspendAdmin,
};

