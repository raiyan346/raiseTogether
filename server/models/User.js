import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLES = ['job_seeker', 'mentor', 'freelancer', 'recruiter', 'startup_founder', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: ROLES, default: 'job_seeker' },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    googleId: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    refreshToken: { type: String, select: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: String,
    verificationExpire: Date,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActiveDate: Date,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reputation: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.calculateLevel = function () {
  return Math.floor(Math.sqrt(this.xp / 100)) + 1;
};

export { ROLES };
export default mongoose.model('User', userSchema);
