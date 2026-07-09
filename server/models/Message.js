import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    attachments: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
