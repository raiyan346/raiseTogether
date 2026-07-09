import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
  register, login, getMe, verifyEmail, forgotPassword, resetPassword,
  setup2FA, enable2FA, disable2FA, completeProfile, refreshToken, logout,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], validate, register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], validate, login);

router.post('/verify-email', [body('token').notEmpty()], validate, verifyEmail);
router.post('/forgot-password', [body('email').isEmail()], validate, forgotPassword);
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
], validate, resetPassword);
router.post('/refresh-token', refreshToken);

router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/complete-profile', protect, completeProfile);
router.post('/2fa/setup', protect, setup2FA);
router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/disable', protect, disable2FA);

export default router;
