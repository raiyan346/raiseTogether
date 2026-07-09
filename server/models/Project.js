import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    skills: [String],
    status: { type: String, enum: ['planning', 'active', 'completed', 'archived'], default: 'planning' },
    members: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: String }],
    maxMembers: { type: Number, default: 5 },
    tags: [String],
    image: String,
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
