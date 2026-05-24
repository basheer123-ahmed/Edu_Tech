const express = require('express');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// In-memory OTP storage for demonstration
const otpStore = new Map();

/**
 * @route   POST /api/otp/send-otp
 * @desc    Generate and send 6-digit OTP to email using Gmail
 */
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Generate strictly 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration (5 minutes)
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });

    // Send email using Nodemailer
    const mailOptions = {
      from: `"SkilStation Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SkilStation OTP Verification Code',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #7c3aed; text-align: center;">SkilStation Verification</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) for logging into SkilStation is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #111827;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #6b7280; text-align: center;">This code will expire in 5 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: 'OTP sent successfully to ' + email });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please check server logs.',
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/otp/verify-otp
 * @desc    Verify OTP and generate JWT
 */
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ success: false, message: 'OTP not found. Please resend.' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP expired. Please resend.' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    // OTP Verified - Success
    otpStore.delete(email);

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(200).json({ 
        success: true, 
        message: 'OTP verified. No user account found.',
        isNewUser: true 
      });
    }

    // Generate JWT for existing user
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
