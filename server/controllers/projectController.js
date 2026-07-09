import Project from '../models/Project.js';
import Team from '../models/Team.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { awardXP } from '../services/gamificationService.js';

export const getProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const projects = await Project.find({ isPublic: true })
    .populate('owner', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Project.countDocuments({ isPublic: true });
  res.json({ success: true, projects, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({ ...req.body, owner: req.user._id, members: [{ user: req.user._id, role: 'owner' }] });
  const team = await Team.create({ name: `${project.title} Team`, project: project._id, leader: req.user._id, members: [req.user._id] });
  project.team = team._id;
  await project.save();
  await awardXP(req.user._id, 50, 'project_created');
  res.status(201).json({ success: true, project });
});

export const joinProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  if (project.members.length >= project.maxMembers) throw new ApiError(400, 'Project is full');
  const alreadyMember = project.members.some((m) => m.user.toString() === req.user._id.toString());
  if (alreadyMember) {
    return res.json({ success: true, message: 'Already a member', project });
  }
  project.members.push({ user: req.user._id, role: 'member' });
  await project.save();
  if (project.team) {
    await Team.findByIdAndUpdate(project.team, { $addToSet: { members: req.user._id } });
  }
  await awardXP(req.user._id, 30, 'project_joined');
  res.json({ success: true, project });
});

export const updateTask = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.teamId);
  if (!team) throw new ApiError(404, 'Team not found');
  const task = team.tasks.id(req.params.taskId);
  if (!task) throw new ApiError(404, 'Task not found');
  Object.assign(task, req.body);
  await team.save();
  res.json({ success: true, task });
});

export const addTask = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.teamId);
  if (!team) throw new ApiError(404, 'Team not found');
  team.tasks.push(req.body);
  await team.save();
  res.status(201).json({ success: true, tasks: team.tasks });
});
