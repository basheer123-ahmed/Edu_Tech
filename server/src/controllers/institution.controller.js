const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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
 * Generate a secure random password
 */
const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/**
 * @desc    Create a new institution (Admin only)
 * @route   POST /api/institutions
 * @access  Admin
 */
const createInstitution = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      status: 'error',
      message: 'Name and email are required',
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

  // Generate temp password
  const tempPassword = generateTempPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Create user + institution in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const userId = uuidv4();
    const institutionId = uuidv4();

    const user = await tx.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role: 'INSTITUTION',
        mustResetPassword: true,
      },
    });

    const institution = await tx.institution.create({
      data: {
        id: institutionId,
        userId: user.id,
      },
    });

    return { user, institution };
  });

  // Send credentials email
  let emailSent = false;
  try {
    const mailOptions = {
      from: `"SkilStation Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to SkilStation — Your Institution Account Credentials',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%); padding: 40px 32px; text-align: center;">
            <h1 style="color: white; font-size: 28px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.5px;">🎓 SkilStation</h1>
            <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">Institution Account Created</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <p style="color: #1e293b; font-size: 16px; margin: 0 0 20px 0;">Hello <strong>${name}</strong>,</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 24px 0;">
              Your institution account has been created on <strong>SkilStation</strong>. 
              Use the credentials below to log in for the first time. You will be prompted to set a new password.
            </p>

            <!-- Credentials Box -->
            <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 15px; font-weight: 600; text-align: right;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Temporary Password</td>
                  <td style="padding: 8px 0; border-top: 1px solid #e2e8f0; color: #7c3aed; font-size: 18px; font-weight: 800; text-align: right; font-family: monospace; letter-spacing: 2px;">${tempPassword}</td>
                </tr>
              </table>
            </div>

            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; margin: 0 0 24px 0;">
              <p style="color: #92400e; font-size: 13px; margin: 0;">⚠️ <strong>Important:</strong> You must change this password on your first login. Do not share these credentials.</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0 16px 0;">
              <a href="http://localhost:5173/login" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; text-decoration: none; padding: 14px 40px; border-radius: 12px; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;">Login to SkilStation →</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 SkilStation. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    emailSent = true;
    console.log(`✅ [Institution] Credentials email sent to ${email}`);
  } catch (error) {
    console.error('❌ [Institution] Failed to send credentials email:', error.message);
  }

  res.status(201).json({
    status: 'success',
    message: emailSent
      ? `Institution "${name}" created successfully. Credentials sent to ${email}.`
      : `Institution "${name}" created, but email delivery failed. Please share credentials manually.`,
    emailSent,
    institution: {
      id: result.institution.id,
      userId: result.user.id,
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone,
      createdAt: result.user.createdAt,
    },
    // Only show temp password if email failed (so admin can share manually)
    ...(emailSent ? {} : { tempPassword }),
  });
});

/**
 * @desc    Get all institutions (Admin only)
 * @route   GET /api/institutions
 * @access  Admin
 */
const getAllInstitutions = asyncHandler(async (req, res) => {
  const institutions = await prisma.user.findMany({
    where: { role: 'INSTITUTION' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      createdAt: true,
      lastLogin: true,
      mustResetPassword: true,
      institution_institution_userIdTouser: {
        select: {
          id: true,
          verified: true,
          course: {
            select: { id: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Transform the response for cleaner output
  const formatted = institutions.map((inst) => ({
    id: inst.id,
    institutionId: inst.institution_institution_userIdTouser?.id,
    name: inst.name,
    email: inst.email,
    phone: inst.phone,
    avatar: inst.avatar,
    verified: inst.institution_institution_userIdTouser?.verified || false,
    courseCount: inst.institution_institution_userIdTouser?.course?.length || 0,
    mustResetPassword: inst.mustResetPassword,
    lastLogin: inst.lastLogin,
    createdAt: inst.createdAt,
  }));

  res.json({ status: 'success', institutions: formatted });
});

/**
 * @desc    Get institution by ID (Admin only)
 * @route   GET /api/institutions/:id
 * @access  Admin
 */
const getInstitutionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const institution = await prisma.institution.findUnique({
    where: { id },
    include: {
      user_institution_userIdTouser: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          createdAt: true,
          lastLogin: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!institution) {
    return res.status(404).json({ status: 'error', message: 'Institution not found' });
  }

  res.json({ status: 'success', institution });
});

module.exports = {
  createInstitution,
  getAllInstitutions,
  getInstitutionById,
};
