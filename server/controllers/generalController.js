import Profile from '../models/Profile.js';
import Application from '../models/Application.js';
import Project from '../models/Project.js';
import Job from '../models/Job.js';
import Course from '../models/Course.js';
import FreelanceGig from '../models/FreelanceGig.js';
import StartupIdea from '../models/StartupIdea.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { updateStreak, awardXP } from '../services/gamificationService.js';

export const getCourses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const courses = await Course.find({ isPublished: true })
    .populate('instructor', 'name avatar')
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Course.countDocuments({ isPublished: true });
  res.json({ success: true, courses, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.enrolledUsers.includes(req.user._id)) {
    course.enrolledUsers.push(req.user._id);
    await course.save();
    await awardXP(req.user._id, 25, 'course_enrolled');
  }
  res.json({ success: true, course });
});

export const getStartupIdeas = asyncHandler(async (req, res) => {
  const ideas = await StartupIdea.find({ isPublic: true })
    .populate('founder', 'name avatar')
    .sort({ voteCount: -1 });
  res.json({ success: true, ideas });
});

export const submitStartupIdea = asyncHandler(async (req, res) => {
  const idea = await StartupIdea.create({ ...req.body, founder: req.user._id });
  res.status(201).json({ success: true, idea });
});

export const voteStartupIdea = asyncHandler(async (req, res) => {
  const idea = await StartupIdea.findById(req.params.id);
  if (!idea) throw new ApiError(404, 'Idea not found');
  const voted = idea.votes.includes(req.user._id);
  if (voted) {
    idea.votes.pull(req.user._id);
    idea.voteCount -= 1;
  } else {
    idea.votes.push(req.user._id);
    idea.voteCount += 1;
  }
  await idea.save();
  res.json({ success: true, voteCount: idea.voteCount, voted: !voted });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ success: true, notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, recipient: req.params.userId },
      { sender: req.params.userId, recipient: req.user._id },
    ],
  })
    .populate('sender recipient', 'name avatar')
    .sort({ createdAt: 1 });
  res.json({ success: true, messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const recipientId = /^[0-9a-fA-F]{24}$/.test(req.body.recipientId) ? req.body.recipientId : null;
  const teamId = /^[0-9a-fA-F]{24}$/.test(req.body.teamId) ? req.body.teamId : null;

  const message = await Message.create({
    sender: req.user._id,
    recipient: recipientId,
    team: teamId,
    content: req.body.content,
  });
  const populated = await Message.findById(message._id).populate('sender', 'name avatar');
  res.status(201).json({ success: true, message: populated });
});

export const getMotivation = asyncHandler(async (req, res) => {
  const user = await updateStreak(req.user._id);
  const profile = await Profile.findOne({ user: req.user._id });
  const achievements = await Achievement.find().limit(10);
  res.json({
    success: true,
    streak: user?.streak || 0,
    xp: user?.xp || 0,
    level: user?.level || 1,
    dailyGoals: profile?.dailyGoals || [],
    achievements,
  });
});

export const updateDailyGoals = asyncHandler(async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { dailyGoals: req.body.goals },
    { new: true }
  );
  res.json({ success: true, dailyGoals: profile.dailyGoals });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const applications = await Application.countDocuments({ applicant: req.user._id });
  const projects = await Project.countDocuments({ 'members.user': req.user._id });
  res.json({
    success: true,
    analytics: {
      applications,
      projects,
      xp: req.user.xp,
      level: req.user.level,
      streak: req.user.streak,
      skillsGrowth: [20, 35, 45, 60, 72, 85],
      activityStats: { posts: 12, comments: 34, logins: req.user.streak },
    },
  });
});

export const adminGetUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const users = await User.find()
    .select('name email role isActive isVerified createdAt xp')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await User.countDocuments();
  res.json({ success: true, users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const adminToggleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, isActive: user.isActive });
});

export const adminApproveJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.json({ success: true, job });
});

export const adminGetCourses = asyncHandler(async (_req, res) => {
  const courses = await Course.find()
    .populate('instructor', 'name email')
    .sort({ updatedAt: -1 })
    .limit(200);
  res.json({ success: true, courses });
});

export const adminCreateCourse = asyncHandler(async (req, res) => {
  const { title, description, category, level, isPublished } = req.body;
  if (!title || !description) throw new ApiError(400, 'Title and description are required');

  const course = await Course.create({
    title,
    description,
    category,
    level: level || 'beginner',
    isPublished: Boolean(isPublished),
    instructor: req.user._id,
  });
  res.status(201).json({ success: true, course });
});

export const adminUpdateCourse = asyncHandler(async (req, res) => {
  const update = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    level: req.body.level,
    isPublished: req.body.isPublished,
  };

  Object.keys(update).forEach((key) => {
    if (typeof update[key] === 'undefined') delete update[key];
  });

  const course = await Course.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!course) throw new ApiError(404, 'Course not found');
  res.json({ success: true, course });
});

export const adminGetContentJobs = asyncHandler(async (_req, res) => {
  const jobs = await Job.find()
    .populate('postedBy', 'name email')
    .sort({ updatedAt: -1 })
    .limit(300);
  res.json({ success: true, jobs });
});

export const adminCreateContentJob = asyncHandler(async (req, res) => {
  const { title, company, description, type, location, salary, skills, deadline, isActive } = req.body;
  if (!title || !company || !description || !type) {
    throw new ApiError(400, 'Title, company, description, and type are required');
  }

  const job = await Job.create({
    title,
    company,
    description,
    type,
    location,
    salary,
    skills,
    deadline,
    isActive: typeof isActive === 'boolean' ? isActive : true,
    isApproved: true,
    postedBy: req.user._id,
  });
  res.status(201).json({ success: true, job });
});

export const adminUpdateContentJob = asyncHandler(async (req, res) => {
  const update = {
    title: req.body.title,
    company: req.body.company,
    description: req.body.description,
    type: req.body.type,
    location: req.body.location,
    salary: req.body.salary,
    skills: req.body.skills,
    deadline: req.body.deadline,
    isActive: req.body.isActive,
    isApproved: req.body.isApproved,
  };

  Object.keys(update).forEach((key) => {
    if (typeof update[key] === 'undefined') delete update[key];
  });

  const job = await Job.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!job) throw new ApiError(404, 'Job not found');
  res.json({ success: true, job });
});

export const adminGetGigs = asyncHandler(async (_req, res) => {
  const gigs = await FreelanceGig.find()
    .populate('client', 'name email')
    .sort({ updatedAt: -1 })
    .limit(300);
  res.json({ success: true, gigs });
});

export const adminCreateGig = asyncHandler(async (req, res) => {
  const { title, description, budget, status, deadline, skills } = req.body;
  if (!title || !description) throw new ApiError(400, 'Title and description are required');

  const gig = await FreelanceGig.create({
    title,
    description,
    budget,
    status: status || 'open',
    deadline,
    skills,
    client: req.user._id,
  });
  res.status(201).json({ success: true, gig });
});

export const adminUpdateGig = asyncHandler(async (req, res) => {
  const update = {
    title: req.body.title,
    description: req.body.description,
    budget: req.body.budget,
    status: req.body.status,
    deadline: req.body.deadline,
    skills: req.body.skills,
  };

  Object.keys(update).forEach((key) => {
    if (typeof update[key] === 'undefined') delete update[key];
  });

  const gig = await FreelanceGig.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!gig) throw new ApiError(404, 'Gig not found');
  res.json({ success: true, gig });
});

