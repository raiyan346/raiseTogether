import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { getPosts, createPost, likePost, getComments, createComment } from '../controllers/communityController.js';

const router = Router();

router.get('/', optionalAuth, getPosts);
router.post('/', protect, createPost);
router.post('/:id/like', protect, likePost);
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, createComment);

export default router;
