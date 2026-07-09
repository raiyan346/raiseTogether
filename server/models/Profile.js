import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    headline: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 2000 },
    location: { type: String, default: '' },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    portfolio: {
      theme: { type: String, default: 'minimal' },
      projects: [{ title: String, url: String, description: String, image: String }],
      socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        website: String,
      },
    },
    resumeUrl: String,
    availability: { type: String, enum: ['open', 'not_looking', 'freelance'], default: 'open' },
    dailyGoals: [{ text: String, completed: { type: Boolean, default: false } }],
    careerRoadmap: [{ step: String, completed: { type: Boolean, default: false }, order: Number }],
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
