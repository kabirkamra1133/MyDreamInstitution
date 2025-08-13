import express from 'express';
import {  getAllUsers, loginUser, registerUser, verifyToken } from '../controller/userController.js';
import {authenticate} from '../middleware/middleware.js';
const router = express.Router();
router.post('/register', registerUser);
router.get('/login',loginUser);
router.get('/verify',authenticate,verifyToken);

export default router;



