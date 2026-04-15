const User = require('../models/User');
const Post = require('../models/Post');
const CropData = require('../models/CropData');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all community posts (with author info)
// @route   GET /api/admin/posts
// @access  Private/Admin
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'name email role')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post by admin
// @route   DELETE /api/admin/post/:id
// @access  Private/Admin
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post removed by admin' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system stats (users, posts, predictions, splitby type)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const [userCount, postCount, predictionCount, cropCount, diseaseCount, yieldCount] =
      await Promise.all([
        User.countDocuments(),
        Post.countDocuments(),
        CropData.countDocuments(),
        CropData.countDocuments({ type: 'Crop-Recommendation' }),
        CropData.countDocuments({ type: 'Disease-Prediction' }),
        CropData.countDocuments({ type: 'Yield-Prediction' }),
      ]);

    // Recent 5 posts for activity feed
    const recentPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name')
      .select('title createdAt author likes comments')
      .lean();

    // Recent 5 users
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount,
        totalPosts: postCount,
        totalPredictions: predictionCount,
        predictionBreakdown: {
          cropRecommendations: cropCount,
          diseasePredictions: diseaseCount,
          yieldPredictions: yieldCount,
        },
        recentPosts,
        recentUsers,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (promote/demote)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      res.status(400);
      throw new Error('Invalid role. Must be "user" or "admin"');
    }
    // Prevent self-demotion
    if (req.params.id === req.user.id.toString() && role !== 'admin') {
      res.status(400);
      throw new Error('You cannot change your own role');
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getPosts, deletePost, getStats, updateUserRole };
