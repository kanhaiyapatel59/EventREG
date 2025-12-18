import Event from '../models/Event.js';
import Enrollment from '../models/Enrollment.js';

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, capacity } = req.body;

        if (!title || !description || !date || !location || !capacity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (capacity <= 0) {
            return res.status(400).json({ message: "Capacity must be greater than 0" });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            capacity,
            createdBy: req.user.id
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({
            message: "Error creating event",
            error: error.message
        });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events" });
    }
};

// ✅ ADDED DELETE EVENT CONTROLLER
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find the event
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // 2. Delete the event
        await Event.findByIdAndDelete(id);

        // 3. Delete all enrollments linked to this event
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
