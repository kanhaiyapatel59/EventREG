import express from 'express';
import { createEvent, getAllEvents, deleteEvent } from '../controllers/eventController.js'; 
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: Anyone can see events
router.get('/', getAllEvents);

// Protected route: Only Admins can create events
router.post('/', protect, adminOnly, createEvent);

// Only Admins can delete events
router.delete('/:id', protect, adminOnly, deleteEvent);

export default router;