import jwt from 'jsonwebtoken';
import User, { ROLES } from '../models/User.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken, generateEmailToken } from '../utils/generateToken.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import { awardXP, updateStreak } from '../services/gamificationService.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isProfileComplete: user.isProfileComplete,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'Email already registered');

  const userRole = ROLES.includes(role) && role !== 'admin' ? role : 'job_seeker';
  const verificationToken = generateEmailToken({ email }, '24h');

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    verificationToken,
    verificationExpire: Date.now() + 24 * 60 * 60 * 1000,
  });

  await Profile.create({ user: user._id });
  try {
    await sendVerificationEmail(email, verificationToken);
  } catch (emailErr) {
    console.error('Verification email failed:', emailErr.message);
  }
  sendTokenResponse(user, 201, res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, twoFactorCode } = req.body;
  const user = await User.findOne({ email }).select('+password +twoFactorSecret');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.twoFactorEnabled) {
    if (!twoFactorCode) {
      return res.status(200).json({ success: true, requires2FA: true });
    }
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorCode,
      window: 1,
    });
    if (!verified) throw new ApiError(401, 'Invalid 2FA code');
  }

  await updateStreak(user._id);
  sendTokenResponse(user, 200, res);
});

export const getMe = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate('skills');
  res.json({ success: true, user: req.user, profile });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const user = await User.findOne({ verificationToken: token });
  if (!user || user.verificationExpire < Date.now()) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpire = undefined;
  await user.save();
  await awardXP(user._id, 50, 'email_verified');
  res.json({ success: true, message: 'Email verified successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: true, message: 'If email exists, reset link sent' });
  }
  const resetToken = generateEmailToken({ id: user._id }, '1h');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save({ validateBeforeSave: false });
  await sendPasswordResetEmail(user.email, resetToken);
  res.json({ success: true, message: 'If email exists, reset link sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password');
  if (!user) throw new ApiError(400, 'Invalid or expired reset token');
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

export const setup2FA = asyncHandler(async (req, res) => {
  const secret = speakeasy.generateSecret({ name: `RiseTogether (${req.user.email})` });
  req.user.twoFactorSecret = secret.base32;
  await req.user.save({ validateBeforeSave: false });
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);
  res.json({ success: true, secret: secret.base32, qrCode });
});

export const enable2FA = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+twoFactorSecret');
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: req.body.code,
    window: 1,
  });
  if (!verified) throw new ApiError(400, 'Invalid verification code');
  user.twoFactorEnabled = true;
  await user.save();
  res.json({ success: true, message: '2FA enabled successfully' });
});

export const disable2FA = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+twoFactorSecret +password');
  if (!(await user.matchPassword(req.body.password))) {
    throw new ApiError(401, 'Invalid password');
  }
  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save();
  res.json({ success: true, message: '2FA disabled' });
});

export const completeProfile = asyncHandler(async (req, res) => {
  const { headline, bio, location, skills, availability } = req.body;

  let skillIds = [];
  if (Array.isArray(skills)) {
    skillIds = await Promise.all(
      skills.map(async (sName) => {
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
    { headline, bio, location, skills: skillIds, availability },
    { new: true, upsert: true }
  );
  await User.findByIdAndUpdate(req.user._id, { isProfileComplete: true });
  await awardXP(req.user._id, 100, 'profile_complete');
  res.json({ success: true, profile });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new ApiError(401, 'Refresh token required');
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) throw new ApiError(401, 'Invalid refresh token');
  sendTokenResponse(user, 200, res);
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined });
  res.json({ success: true, message: 'Logged out' });
});
