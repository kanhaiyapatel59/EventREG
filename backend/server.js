import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); 
// origin: '*' allows all domains to access your API (Good for development/deployment testing)
app.use(cors({ origin: '*' })); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/DigitalEvent';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Server is running! 🚀');
});

// Use the PORT provided by the hosting service OR 5001 locally
const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});