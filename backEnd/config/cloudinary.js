const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Connect to Cloudinary
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim().toLowerCase(),
  api_key:    (process.env.CLOUDINARY_API_KEY || '').trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim()
});

// Storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'logistic-planner/events', // folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 600, crop: 'fill' }]
  }
});

// Multer upload middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = { cloudinary, upload };
