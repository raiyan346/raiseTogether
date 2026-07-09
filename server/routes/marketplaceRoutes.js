import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  getGigs, createGig, applyToGig, createReview, bookMentorship, getMentorships,
} from '../controllers/marketplaceController.js';

const router = Router();

router.get('/gigs', getGigs);
router.post('/gigs', protect, createGig);
router.post('/gigs/:id/apply', protect, applyToGig);
router.post('/reviews', protect, createReview);
router.post('/mentorships', protect, bookMentorship);
router.get('/mentorships', protect, getMentorships);

export default router;
