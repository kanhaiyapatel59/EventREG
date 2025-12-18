import express from 'express';
import { createEvent, getAllEvents } from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: Anyone can see events
router.get('/', getAllEvents);

// Protected route: Only Admins can create events
router.post('/', protect, adminOnly, createEvent);

export default router;