import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getProfile, updateProfile, uploadAvatar, followUser, getLeaderboard, exportPortfolio,
} from '../controllers/userController.js';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/me/portfolio', protect, exportPortfolio);
router.get('/:id/portfolio', exportPortfolio);
router.get('/:id', getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/:id/follow', protect, followUser);

export default router;
