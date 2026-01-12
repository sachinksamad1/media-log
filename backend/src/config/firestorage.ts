import multer from 'multer';

// Configure storage to use memory
export const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Basic validation for image types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});
