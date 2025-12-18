import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/DigitalEvent';
        await mongoose.connect(MONGO_URI);

        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new User({
                name: 'System Admin',
                email: 'admin@event.com',
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log('✅ Default Admin Created: admin@event.com / admin123');
        } else {
            console.log('ℹ️ Admin already exists.');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    }
};

seedAdmin();