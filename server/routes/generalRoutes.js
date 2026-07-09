import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getCourses, enrollCourse, getStartupIdeas, submitStartupIdea, voteStartupIdea,
  getNotifications, markNotificationRead, getMessages, sendMessage,
  getMotivation, updateDailyGoals, getAnalytics,
  adminGetUsers, adminToggleUser, adminApproveJob,
  adminGetCourses, adminCreateCourse, adminUpdateCourse,
  adminGetContentJobs, adminCreateContentJob, adminUpdateContentJob,
  adminGetGigs, adminCreateGig, adminUpdateGig,
} from '../controllers/generalController.js';

const router = Router();

router.get('/courses', getCourses);
router.post('/courses/:id/enroll', protect, enrollCourse);
router.get('/startups', getStartupIdeas);
router.post('/startups', protect, submitStartupIdea);
router.post('/startups/:id/vote', protect, voteStartupIdea);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.get('/messages/:userId', protect, getMessages);
router.post('/messages', protect, sendMessage);
router.get('/motivation', protect, getMotivation);
router.put('/motivation/goals', protect, updateDailyGoals);
router.get('/analytics', protect, getAnalytics);

router.get('/admin/users', protect, authorize('admin'), adminGetUsers);
router.put('/admin/users/:id/toggle', protect, authorize('admin'), adminToggleUser);
router.put('/admin/jobs/:id/approve', protect, authorize('admin'), adminApproveJob);
router.get('/admin/courses', protect, authorize('admin'), adminGetCourses);
router.post('/admin/courses', protect, authorize('admin'), adminCreateCourse);
router.put('/admin/courses/:id', protect, authorize('admin'), adminUpdateCourse);
router.get('/admin/content/jobs', protect, authorize('admin'), adminGetContentJobs);
router.post('/admin/content/jobs', protect, authorize('admin'), adminCreateContentJob);
router.put('/admin/content/jobs/:id', protect, authorize('admin'), adminUpdateContentJob);
router.get('/admin/content/gigs', protect, authorize('admin'), adminGetGigs);
router.post('/admin/content/gigs', protect, authorize('admin'), adminCreateGig);
router.put('/admin/content/gigs/:id', protect, authorize('admin'), adminUpdateGig);

export default router;
