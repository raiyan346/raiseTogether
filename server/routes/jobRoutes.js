import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getJobs, createJob, applyToJob, getMyApplications } from '../controllers/jobController.js';

const router = Router();

router.get('/', getJobs);
router.post('/', protect, authorize('recruiter', 'admin', 'startup_founder'), createJob);
router.post('/:id/apply', protect, applyToJob);
router.get('/applications/me', protect, getMyApplications);

export default router;
