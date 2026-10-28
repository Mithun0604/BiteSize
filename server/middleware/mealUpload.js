const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.resolve(__dirname, '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadsDir),
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `meal-${suffix}${ext}`);
  }
});

module.exports = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) return callback(null, true);
    const error = new Error('Please upload a JPG, PNG, or WebP meal photo.');
    error.statusCode = 415;
    error.code = 'UNSUPPORTED_IMAGE_TYPE';
    callback(error);
  }
});
