import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import Notification from '../models/Notification.js';

export const awardXP = async (userId, amount, reason) => {
  const user = await User.findById(userId);
  if (!user) return;
  user.xp += amount;
  user.level = user.calculateLevel();
  await user.save();
  return user;
};

export const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;
  const today = new Date().toDateString();
  const lastActive = user.lastActiveDate?.toDateString();
  if (lastActive === today) return user;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastActive === yesterday.toDateString()) {
    user.streak += 1;
  } else {
    user.streak = 1;
  }
  user.lastActiveDate = new Date();
  await user.save();
  return user;
};

export const createNotification = async ({ user, type, title, message, link, data }) =>
  Notification.create({ user, type, title, message, link, data });

export const seedAchievements = async () => {
  const count = await Achievement.countDocuments();
  if (count > 0) return;
  await Achievement.insertMany([
    { name: 'First Steps', description: 'Complete your profile', icon: 'user', xpReward: 100, category: 'special' },
    { name: 'Week Warrior', description: '7-day activity streak', icon: 'flame', xpReward: 200, category: 'streak' },
    { name: 'Team Player', description: 'Join your first project', icon: 'users', xpReward: 150, category: 'projects' },
    { name: 'Knowledge Seeker', description: 'Complete your first course', icon: 'book', xpReward: 250, category: 'learning' },
    { name: 'Community Star', description: 'Get 10 likes on a post', icon: 'star', xpReward: 100, category: 'community' },
  ]);
};
