import Event from '../models/Event.js';

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
