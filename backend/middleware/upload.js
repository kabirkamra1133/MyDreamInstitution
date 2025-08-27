import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_BASE = path.join(process.cwd(), 'uploads', 'college-admins');

// ensure upload dir exists
fs.mkdirSync(UPLOAD_BASE, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_BASE);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

export const uploadCollegeMedia = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]);

export default upload;
