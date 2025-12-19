import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    enrolledCount: { type: Number, default: 0 },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop'
    },
    category: { type: String, required: true, enum: ['Tech', 'Music', 'Business', 'Sports', 'Art', 'Other'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    validatedTickets: [{ type: String }]
}, { timestamps: true });

eventSchema.virtual('status').get(function () {
    const d = new Date(this.date), n = new Date();
    return d.toDateString() === n.toDateString() ? 'Ongoing' : d > n ? 'Upcoming' : 'Completed';
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

export default mongoose.model('Event', eventSchema);
