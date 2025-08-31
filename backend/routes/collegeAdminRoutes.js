import express from 'express';
import {
  listCollegeAdmins,
  createCollegeAdmin,
  getCollegeAdmin,
  updateCollegeAdmin,
  deleteCollegeAdmin,
  getMyCollegeAdmin,
} from '../controller/collegeAdminController.js';
import { authenticate, authorize } from '../middleware/middleware.js';
import upload, { uploadCollegeMedia } from '../middleware/upload.js';

const router = express.Router();

// Admin-only: list all college admins
router.get('/', authenticate, listCollegeAdmins);

// Create a college admin (only if not already created) — must be authenticated as college
router.post('/profile', authenticate, uploadCollegeMedia, createCollegeAdmin);

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    return res.status(201).json({ url: `/uploads/college-admins/${file.filename}`, filename: file.filename, size: file.size });
  } catch (err) {
    console.error('Upload route error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// Get, update, delete single college admin
router.get('/profile', authenticate, getMyCollegeAdmin);
router.get('/:id', getCollegeAdmin);
router.put('/:id', authenticate, updateCollegeAdmin);
router.delete('/:id', authenticate, authorize('admin'), deleteCollegeAdmin);

export default router;
