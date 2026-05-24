const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const hasCloudinaryKeys = process.env.CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_API_KEY && 
                          process.env.CLOUDINARY_API_SECRET;

let storage;

if (hasCloudinaryKeys) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let folder = 'skilstation/others';
      let resource_type = 'auto';

      if (file.mimetype.startsWith('image')) folder = 'skilstation/images';
      if (file.mimetype.startsWith('video')) {
        folder = 'skilstation/videos';
        resource_type = 'video';
      }
      if (file.mimetype === 'application/pdf') folder = 'skilstation/pdfs';

      return {
        folder: folder,
        resource_type: resource_type,
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      };
    },
  });
} else {
  // Local Storage Fallback
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
}

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload, hasCloudinaryKeys };
