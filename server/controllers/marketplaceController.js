import FreelanceGig from '../models/FreelanceGig.js';
import Review from '../models/Review.js';
import Mentorship from '../models/Mentorship.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const getGigs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const gigs = await FreelanceGig.find({ status: 'open' })
    .populate('client', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await FreelanceGig.countDocuments({ status: 'open' });
  res.json({ success: true, gigs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const createGig = asyncHandler(async (req, res) => {
  const gig = await FreelanceGig.create({ ...req.body, client: req.user._id });
  res.status(201).json({ success: true, gig });
});

export const applyToGig = asyncHandler(async (req, res) => {
  const gig = await FreelanceGig.findById(req.params.id);
  if (!gig) throw new ApiError(404, 'Gig not found');
  gig.applicants.push({ user: req.user._id, proposal: req.body.proposal });
  await gig.save();
  res.json({ success: true, message: 'Application submitted' });
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({ ...req.body, reviewer: req.user._id });
  res.status(201).json({ success: true, review });
});

export const bookMentorship = asyncHandler(async (req, res) => {
  const mentorship = await Mentorship.create({
    mentor: req.body.mentorId,
    mentee: req.user._id,
    skill: req.body.skill,
  });
  res.status(201).json({ success: true, mentorship });
});

export const getMentorships = asyncHandler(async (req, res) => {
  const mentorships = await Mentorship.find({
    $or: [{ mentor: req.user._id }, { mentee: req.user._id }],
  }).populate('mentor mentee', 'name avatar role');
  res.json({ success: true, mentorships });
});
