import express from 'express';
import { enrollInEvent, getUserEnrollments } from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All enrollment routes should be protected (user must be logged in)
router.post('/:eventId', protect, enrollInEvent);
router.get('/my-enrollments', protect, getUserEnrollments);

export default router;