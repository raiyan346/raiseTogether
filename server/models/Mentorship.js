import mongoose from 'mongoose';

const mentorshipSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: String,
    status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
    sessions: [{ date: Date, duration: Number, notes: String, completed: { type: Boolean, default: false } }],
    rating: { type: Number, min: 1, max: 5 },
    review: String,
  },
  { timestamps: true }
);

export default mongoose.model('Mentorship', mentorshipSchema);
