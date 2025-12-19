import express from 'express';
import {
    createEvent,
    getAllEvents,
    deleteEvent,
    getAdminStats
} from '../controllers/eventController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * PUBLIC
 */
router.get('/', getAllEvents);              

/**
 * ADMIN
 */
router.get('/admin/stats', protect, adminOnly, getAdminStats); 
router.post('/', protect, adminOnly, createEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

export default router;
