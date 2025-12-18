import Enrollment from '../models/Enrollment.js';
import Event from '../models/Event.js';

export const enrollInEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id; // From our 'protect' middleware

        // 1. Find the event
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // 2. Check if event is full
        if (event.enrolledCount >= event.capacity) {
            return res.status(400).json({ message: "Event is already full" });
        }

        // 3. Check if user is already enrolled
        const existingEnrollment = await Enrollment.findOne({ user: userId, event: eventId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "You are already enrolled in this event" });
        }

        // 4. Create Enrollment
        const newEnrollment = new Enrollment({ user: userId, event: eventId });
        await newEnrollment.save();

        // 5. Increment the enrolledCount in the Event document
        event.enrolledCount += 1;
        await event.save();

        res.status(201).json({ message: "Enrolled successfully!", enrollment: newEnrollment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserEnrollments = async (req, res) => {
    try {
        // Find all enrollments for this user and "populate" the event details
        const enrollments = await Enrollment.find({ user: req.user.id }).populate('event');
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching enrollments" });
    }
};