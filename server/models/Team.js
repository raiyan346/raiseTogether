import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [
      {
        title: String,
        description: String,
        assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
        dueDate: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Team', teamSchema);
