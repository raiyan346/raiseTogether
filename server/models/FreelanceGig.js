import mongoose from 'mongoose';

const freelanceGigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    budget: { amount: Number, currency: { type: String, default: 'USD' }, type: { type: String, enum: ['fixed', 'hourly'], default: 'fixed' } },
    skills: [String],
    status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
    applicants: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, proposal: String, status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' } }],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deadline: Date,
  },
  { timestamps: true }
);

export default mongoose.model('FreelanceGig', freelanceGigSchema);
