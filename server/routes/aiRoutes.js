import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  resumeAnalyzer, skillGap, careerRoadmap, interviewQuestions,
  learningRecommendations, dailyQuote, validateStartup, mentorChat,
} from '../controllers/aiController.js';

const router = Router();

router.get('/quote', dailyQuote);
router.post('/resume-analyzer', protect, resumeAnalyzer);
router.post('/skill-gap', protect, skillGap);
router.post('/career-roadmap', protect, careerRoadmap);
router.post('/interview-questions', protect, interviewQuestions);
router.post('/learning-recommendations', protect, learningRecommendations);
router.post('/validate-startup', protect, validateStartup);
router.post('/mentor-chat', protect, mentorChat);

export default router;
