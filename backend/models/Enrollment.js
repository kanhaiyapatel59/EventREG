import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true 
    },
    enrollmentDate: { type: Date, default: Date.now }
}, { timestamps: true });

// This prevents the same user from enrolling in the same event twice!
enrollmentSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);