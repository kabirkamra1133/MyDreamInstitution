import express from 'express';
import { getAllColleges, getRegisteredColleges } from '../controller/collegeController.js';


const router = express.Router();

router.get('/', getAllColleges);
router.get('/all', getRegisteredColleges);

export default router;
