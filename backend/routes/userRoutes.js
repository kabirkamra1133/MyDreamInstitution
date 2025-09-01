import express from 'express';
import { getAllUsers, getStudentInfo, getStudentDetails, finalizeStudent, forwardStudentToCollege, verifyToken } from '../controller/userController.js';
import {authenticate, authorize} from '../middleware/middleware.js';
const router = express.Router();

// Admin-only endpoint to list users
router.get('/', authenticate, authorize('admin'), getAllUsers);
// Get complete student information by ID
router.get('/student/:studentId/info', authenticate, authorize('admin'), getStudentInfo);
// Get detailed student information including course selections
router.get('/student/:studentId/details', authenticate, authorize('admin'), getStudentDetails);
// Update student finalization status
router.put('/:studentId/finalize', authenticate, authorize('admin'), finalizeStudent);
// Forward student to college
router.post('/forward', authenticate, authorize('admin'), forwardStudentToCollege);
// Verify any authenticated user
router.get('/verify',authenticate,verifyToken);

export default router;



