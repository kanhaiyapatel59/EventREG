import Enrollment from '../models/Enrollment.js';
import Event from '../models/Event.js';

// 1. Enroll in Event or Join Waitlist
export const enrollInEvent = async (req, res) => {
    try {
        const { eventId } = req.params; 
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        // Check if event is full
        if (event.enrolledCount >= event.capacity) {
            if (event.waitlist.includes(req.user.id)) {
                return res.status(400).json({ message: "Already on waitlist" });
            }
            event.waitlist.push(req.user.id);
            await event.save();
            return res.status(200).json({ message: "Event Full: Added to Waitlist" });
        }

        // Create enrollment
        const newEnrollment = new Enrollment({ user: req.user.id, event: eventId });
        await newEnrollment.save();

        // Increment count
        event.enrolledCount += 1;
        await event.save();

        res.status(201).json({ message: "Successfully Enrolled!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get tickets for the logged-in user
export const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user.id }).populate('event');
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Cancel Ticket & Auto-promote Waitlist
export const cancelTicket = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment) return res.status(404).json({ message: "Ticket not found" });

        const event = await Event.findById(enrollment.event);
        await Enrollment.findByIdAndDelete(req.params.id);

        // If people are waiting, enroll the first one automatically
        if (event.waitlist && event.waitlist.length > 0) {
            const nextUserId = event.waitlist.shift(); // Remove first ID
            const autoEnroll = new Enrollment({ user: nextUserId, event: event._id });
            await autoEnroll.save();
            // Count stays same: 1 left, 1 joined
        } else {
            event.enrolledCount = Math.max(0, event.enrolledCount - 1);
        }
        
        await event.save();
        res.status(200).json({ message: "Cancelled. Waitlist updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Admin: Get all enrollments in system
export const getAllEnrollments = async (req, res) => {
    try {
        const all = await Enrollment.find().populate('user').populate('event');
        res.status(200).json(all);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};