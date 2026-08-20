const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get absolute path to uploads directory
const uploadDir = path.resolve(__dirname, '../../public/uploads');
console.log('📁 Upload directory path:', uploadDir);

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Uploads directory created at:', uploadDir);
} else {
  console.log('✅ Uploads directory exists at:', uploadDir);
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('📁 Saving file to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    console.log('📄 Generated filename:', filename);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  console.log('🔍 Filtering file:', file.originalname, 'Type:', file.mimetype);
  
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    console.log('✅ File type accepted');
    return cb(null, true);
  } else {
    console.log('❌ File type rejected');
    cb(new Error('Only images and videos are allowed'));
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
});

// Export the upload middleware
module.exports = upload;