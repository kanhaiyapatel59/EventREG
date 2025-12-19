import express from 'express';
import {
    enrollInEvent,
    getMyEnrollments,
    getAllEnrollments,
    cancelTicket
} from '../controllers/enrollmentController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- USER ROUTES ---

// Enroll using the ID from the URL (e.g., /api/enrollments/64f1...)
router.post('/:eventId', protect, enrollInEvent);

// Get the logged-in user's tickets
router.get('/my-tickets', protect, getMyEnrollments);

// Cancel a specific ticket
router.delete('/cancel/:id', protect, cancelTicket);


// --- ADMIN ROUTES ---

// See every enrollment in the system
router.get('/admin/all', protect, adminOnly, getAllEnrollments);

export default router;