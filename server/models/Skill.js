import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, default: 'general' },
    description: String,
    users: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, level: { type: Number, default: 1, min: 1, max: 10 } }],
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
