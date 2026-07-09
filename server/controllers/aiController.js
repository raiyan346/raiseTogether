import {
  analyzeResume,
  detectSkillGaps,
  generateCareerRoadmap,
  generateInterviewQuestions,
  getLearningRecommendations,
  getDailyQuote,
  generateValidationReport,
  generateMentorReply,
} from '../services/aiService.js';
import Profile from '../models/Profile.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const resumeAnalyzer = asyncHandler(async (req, res) => {
  const analysis = await analyzeResume(req.body.resumeText || '');
  res.json({ success: true, analysis });
});

export const skillGap = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  const gaps = await detectSkillGaps(req.body.skills || [], req.body.targetRole);
  res.json({ success: true, gaps });
});

export const careerRoadmap = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  const roadmap = await generateCareerRoadmap(profile);
  if (profile) {
    profile.careerRoadmap = roadmap.roadmap.flatMap((p, i) =>
      p.steps.map((step, j) => ({ step, completed: false, order: i * 10 + j }))
    );
    await profile.save();
  }
  res.json({ success: true, roadmap });
});

export const interviewQuestions = asyncHandler(async (req, res) => {
  const questions = await generateInterviewQuestions(req.body.role, req.body.level);
  res.json({ success: true, questions });
});

export const learningRecommendations = asyncHandler(async (req, res) => {
  const recs = await getLearningRecommendations(req.user._id, req.body.skills);
  res.json({ success: true, recommendations: recs.recommendations });
});

export const dailyQuote = asyncHandler(async (_req, res) => {
  res.json({ success: true, quote: getDailyQuote() });
});

export const validateStartup = asyncHandler(async (req, res) => {
  const report = await generateValidationReport(req.body);
  res.json({ success: true, report });
});

export const mentorChat = asyncHandler(async (req, res) => {
  const message = String(req.body?.message || '').trim();
  if (!message) throw new ApiError(400, 'Message is required');

  const profile = await Profile.findOne({ user: req.user._id }).populate('skills', 'name');
  const reply = await generateMentorReply(message, profile);

  res.json({ success: true, reply });
});
