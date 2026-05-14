const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { uploadThumbnail, uploadBanner, uploadVideo } = require('../middleware/multer.middleware');
const path = require('path');

const router = express.Router();

// Helper to get file URL
const getFileUrl = (req) => {
  const protocol = req.protocol;
  const host = req.get('host');
  // Normalize path separators to forward slashes for URLs
  const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
  return `${protocol}://${host}/uploads${relativePath}`;
};

// Management Roles (Admin/Institution)
const managementRoles = ['INSTITUTION', 'ADMIN'];

// POST /api/upload/thumbnail
router.post('/thumbnail', authenticate, authorize(...managementRoles), (req, res) => {
  uploadThumbnail(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload an image' });
    res.status(200).json({ success: true, fileUrl: getFileUrl(req), fileName: req.file.filename });
  });
});

// POST /api/upload/banner
router.post('/banner', authenticate, authorize(...managementRoles), (req, res) => {
  uploadBanner(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a banner' });
    res.status(200).json({ success: true, fileUrl: getFileUrl(req), fileName: req.file.filename });
  });
});

// POST /api/upload/intro-video
router.post('/intro-video', authenticate, authorize(...managementRoles), (req, res) => {
  uploadVideo.single('introVideo')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a video' });
    res.status(200).json({ success: true, fileUrl: getFileUrl(req), fileName: req.file.filename });
  });
});

// POST /api/upload/preview-video
router.post('/preview-video', authenticate, authorize(...managementRoles), (req, res) => {
  uploadVideo.single('previewVideo')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a preview video' });
    res.status(200).json({ success: true, fileUrl: getFileUrl(req), fileName: req.file.filename });
  });
});

// POST /api/upload/lesson-video
router.post('/lesson-video', authenticate, authorize(...managementRoles), (req, res) => {
  uploadVideo.single('lessonVideo')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a lesson video' });
    res.status(200).json({ success: true, fileUrl: getFileUrl(req), fileName: req.file.filename });
  });
});

// POST /api/upload/video (Legacy/General)
router.post('/video', authenticate, authorize(...managementRoles), (req, res) => {
  uploadVideo.single('video')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a video' });
    res.status(200).json({ success: true, fileUrl: getFileUrl(req), fileName: req.file.filename });
  });
});

module.exports = router;

