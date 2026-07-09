import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getProjects, createProject, joinProject, updateTask, addTask } from '../controllers/projectController.js';

const router = Router();

router.get('/', getProjects);
router.post('/', protect, createProject);
router.post('/:id/join', protect, joinProject);
router.post('/teams/:teamId/tasks', protect, addTask);
router.put('/teams/:teamId/tasks/:taskId', protect, updateTask);

export default router;
