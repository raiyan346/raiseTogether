import Job from '../models/Job.js';
import Application from '../models/Application.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const getJobs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filter = { isActive: true, isApproved: true };
  if (req.query.type) filter.type = req.query.type;
  const jobs = await Job.find(filter)
    .populate('postedBy', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Job.countDocuments(filter);
  res.json({ success: true, jobs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user._id, isApproved: req.user.role === 'admin' });
  res.status(201).json({ success: true, job });
});

export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  const application = await Application.create({
    job: job._id,
    applicant: req.user._id,
    resumeUrl: req.body.resumeUrl,
    coverLetter: req.body.coverLetter,
  });
  job.applicants += 1;
  await job.save();
  res.status(201).json({ success: true, application });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate('job')
    .sort({ createdAt: -1 });
  res.json({ success: true, applications });
});
