import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  const profile = await Profile.findOne({ user: user._id }).populate('skills');
  res.json({ success: true, user, profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };
  if (req.body.skills && Array.isArray(req.body.skills)) {
    updateData.skills = await Promise.all(
      req.body.skills.map(async (sName) => {
        if (typeof sName !== 'string') return sName;
        const cleanName = sName.trim();
        if (!cleanName) return null;
        if (/^[0-9a-fA-F]{24}$/.test(cleanName)) return cleanName;
        let skill = await Skill.findOne({ name: { $regex: new RegExp(`^${cleanName}$`, 'i') } });
        if (!skill) {
          skill = await Skill.create({ name: cleanName });
        }
        return skill._id;
      })
    ).then((results) => results.filter(Boolean));
  }

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    updateData,
    { new: true, runValidators: true }
  );
  if (req.body.name) {
    await User.findByIdAndUpdate(req.user._id, { name: req.body.name });
  }
  res.json({ success: true, profile });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const result = await uploadToCloudinary(req.file.buffer, 'avatars');
  await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url });
  res.json({ success: true, url: result.secure_url });
});

export const followUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (targetId === req.user._id.toString()) throw new ApiError(400, 'Cannot follow yourself');
  const target = await User.findById(targetId);
  if (!target) throw new ApiError(404, 'User not found');
  const isFollowing = req.user.following.includes(targetId);
  if (isFollowing) {
    await User.findByIdAndUpdate(req.user._id, { $pull: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { followers: req.user._id } });
  } else {
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: req.user._id } });
  }
  res.json({ success: true, following: !isFollowing });
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const users = await User.find({ isActive: true })
    .select('name avatar xp level streak role')
    .sort({ xp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await User.countDocuments({ isActive: true });
  res.json({ success: true, users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const exportPortfolio = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id || req.user._id).select('name email avatar role');
  const profile = await Profile.findOne({ user: user._id });
  res.json({
    success: true,
    portfolio: {
      user: { name: user.name, avatar: user.avatar, role: user.role },
      headline: profile?.headline,
      bio: profile?.bio,
      experience: profile?.experience,
      education: profile?.education,
      projects: profile?.portfolio?.projects,
      socialLinks: profile?.portfolio?.socialLinks,
      exportedAt: new Date().toISOString(),
    },
  });
});
