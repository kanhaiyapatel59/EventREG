import Event from '../models/Event.js';
import Enrollment from '../models/Enrollment.js';

/**
 * CREATE EVENT
 */
export const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            location,
            capacity,
            category,
            image
        } = req.body;

        // Validation
        if (!title || !description || !date || !location || !capacity || !category) {
            return res.status(400).json({
                message: "All fields including category are required"
            });
        }

        if (capacity <= 0) {
            return res.status(400).json({
                message: "Capacity must be greater than 0"
            });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            capacity,
            category,
            image: image || undefined,
            createdBy: req.user.id
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);

    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({
            message: "Error creating event",
            error: error.message
        });
    }
};

/**
 * GET ALL EVENTS
 */
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 }).lean();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching events",
            error: error.message
        });
    }
};

/**
 * DELETE EVENT + RELATED ENROLLMENTS
 */
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await Event.findByIdAndDelete(id);
        await Enrollment.deleteMany({ event: id });

        res.status(200).json({
            message: "Event and associated enrollments deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting event",
            error: error.message
        });
    }
};

/**
 * ADMIN DASHBOARD STATS
 */
export const getAdminStats = async (req, res) => {
    try {
        const events = await Event.find().lean();

        const totalEvents = events.length;

        const totalCapacity = events.reduce(
            (sum, e) => sum + (e.capacity || 0),
            0
        );

        const totalEnrolled = events.reduce(
            (sum, e) => sum + (e.enrolledCount || 0),
            0
        );

        const totalWaitlisted = events.reduce(
            (sum, e) => sum + (e.waitlist?.length || 0),
            0
        );

        // Category breakdown
        const categories = {};
        events.forEach(e => {
            if (e.category) {
                categories[e.category] = (categories[e.category] || 0) + 1;
            }
        });

        const occupancyRate =
            totalCapacity > 0
                ? ((totalEnrolled / totalCapacity) * 100).toFixed(1)
                : "0.0";

        res.status(200).json({
            totalEvents,
            totalCapacity,
            totalEnrolled,
            totalWaitlisted,
            categories,
            occupancyRate
        });

    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({
            message: "Error fetching admin stats",
            error: error.message
        });
    }
};
