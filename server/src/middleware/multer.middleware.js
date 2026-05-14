const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '../../uploads');
    
    const folderMap = {
      'thumbnail': 'thumbnails',
      'banner': 'banners',
      'introVideo': 'intro-videos',
      'previewVideo': 'preview-videos',
      'lessonVideo': 'lesson-videos'
    };

    const folder = folderMap[file.fieldname] || 'misc';
    uploadPath = path.join(uploadPath, folder);
    
    createDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const imageTypes = ['thumbnail', 'banner'];
  const videoTypes = ['introVideo', 'previewVideo', 'lessonVideo'];

  if (imageTypes.includes(file.fieldname)) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed for this field!'), false);
    }
  } else if (videoTypes.includes(file.fieldname)) {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only videos are allowed for this field!'), false);
    }
  } else {
    cb(null, true);
  }
};

const uploadThumbnail = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('thumbnail');

const uploadBanner = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
}).single('banner');

const uploadVideo = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

module.exports = {
  uploadThumbnail,
  uploadBanner,
  uploadVideo,
  storage
};
