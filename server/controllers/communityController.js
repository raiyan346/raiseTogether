import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { awardXP, createNotification } from '../services/gamificationService.js';

export const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = req.query.trending === 'true' ? { isTrending: true } : {};
  const posts = await Post.find(query)
    .populate('author', 'name avatar role level')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Post.countDocuments(query);
  res.json({ success: true, posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user._id });
  await awardXP(req.user._id, 10, 'post_created');
  const populated = await Post.findById(post._id).populate('author', 'name avatar role');
  res.status(201).json({ success: true, post: populated });
});

export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');
  const liked = post.likes.includes(req.user._id);
  if (liked) {
    post.likes.pull(req.user._id);
  } else {
    post.likes.push(req.user._id);
    if (post.author.toString() !== req.user._id.toString()) {
      await createNotification({
        user: post.author,
        type: 'like',
        title: 'New like on your post',
        message: `${req.user.name} liked your post`,
        link: `/community/${post._id}`,
      });
    }
  }
  await post.save();
  res.json({ success: true, likes: post.likes.length, liked: !liked });
});

export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create({
    post: req.params.id,
    author: req.user._id,
    content: req.body.content,
    parentComment: req.body.parentComment,
  });
  await awardXP(req.user._id, 5, 'comment_created');
  const populated = await Comment.findById(comment._id).populate('author', 'name avatar');
  res.status(201).json({ success: true, comment: populated });
});
