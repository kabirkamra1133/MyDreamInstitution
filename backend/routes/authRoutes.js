import express from 'express';
import { registerStudent, loginStudent, registerCollege, loginCollege, registerAdmin, loginAdmin } from '../controller/authController.js';
import { authenticate, authorize } from '../middleware/middleware.js';
const router = express.Router();

// Student
router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);

// College
router.post('/college/register',registerCollege);
router.post('/college/login', loginCollege);

// Admin
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

export default router;
