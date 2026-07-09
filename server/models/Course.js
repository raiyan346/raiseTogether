import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: String,
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    thumbnail: String,
    lessons: [{ title: String, content: String, videoUrl: String, duration: Number, order: Number }],
    quizzes: [{ question: String, options: [String], correctAnswer: Number }],
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    learningPath: String,
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
