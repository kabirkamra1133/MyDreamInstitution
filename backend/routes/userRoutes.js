import express from 'express';
import { getAllUsers, verifyToken } from '../controller/userController.js';
import {authenticate, authorize} from '../middleware/middleware.js';
const router = express.Router();

// Admin-only endpoint to list users
router.get('/', authenticate, authorize('admin'), getAllUsers);
// Verify any authenticated user
router.get('/verify',authenticate,verifyToken);

export default router;



