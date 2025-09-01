import express from 'express';
import { getMyShortlists, listShortlisted, addShortlist, removeShortlist, toggleShortlist, listStudentsForCollege, listShortlistStats } from '../controller/shortlistController.js';
import { authenticate, authorize } from '../middleware/middleware.js';

const router = express.Router();

// Get current user's shortlists
router.get('/my-shortlists', authenticate, getMyShortlists);
// For now authenticate middleware is placed; adjust authorize if roles needed
router.get('/', authenticate, listShortlisted); // query param or auth user
router.post('/', authenticate, addShortlist); // body: { collegeId, notes? }
router.post('/toggle', authenticate, toggleShortlist); // body: { collegeId }
router.delete('/:collegeId', authenticate, removeShortlist);

// Admin aggregated stats (requires admin)
router.get('/stats/aggregate', authenticate, listShortlistStats);
// List students who shortlisted a specific college (admin or that college-admin)
// Split optional param into two concrete routes to avoid path-to-regexp optional syntax issues
router.get('/college', authenticate, listStudentsForCollege); // uses auth user if college-admin
router.get('/college/:collegeAdminId', authenticate, listStudentsForCollege);

export default router;
