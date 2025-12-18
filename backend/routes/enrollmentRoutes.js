import express from 'express';
import {
    enrollInEvent,
    getUserEnrollments,
    getAllEnrollments
} from '../controllers/enrollmentController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/:eventId', protect, enrollInEvent);
router.get('/my-enrollments', protect, getUserEnrollments);

// Admin route
router.get('/admin/all', protect, adminOnly, getAllEnrollments);

export default router;
