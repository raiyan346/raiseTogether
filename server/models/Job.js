import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['internship', 'remote', 'full_time', 'part_time', 'hackathon', 'workshop', 'competition'], required: true },
    location: String,
    salary: { min: Number, max: Number, currency: { type: String, default: 'USD' } },
    skills: [String],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deadline: Date,
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    applicants: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
