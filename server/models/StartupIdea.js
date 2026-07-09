import mongoose from 'mongoose';

const startupIdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: String,
    stage: { type: String, enum: ['idea', 'mvp', 'growth'], default: 'idea' },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    voteCount: { type: Number, default: 0 },
    coFoundersNeeded: [String],
    validationReport: { score: Number, feedback: String, generatedAt: Date },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('StartupIdea', startupIdeaSchema);
