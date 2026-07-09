import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    icon: String,
    xpReward: { type: Number, default: 50 },
    category: { type: String, enum: ['learning', 'community', 'projects', 'freelance', 'streak', 'special'], default: 'special' },
    criteria: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Achievement', achievementSchema);
