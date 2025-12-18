import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

// Load variables from .env file
dotenv.config();
const app = express();

// Middleware (Helper functions that process data)
app.use(express.json()); 
app.use(cors()); 
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/enrollments', enrollmentRoutes);


// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/DigitalEvent';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// A simple test route to see if the server is running
app.get('/', (req, res) => {
  res.send('Server is running! 🚀');
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is sprinting on port ${PORT}`);
});