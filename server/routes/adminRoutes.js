const express = require('express');
const router = express.Router();
const { getUsers, getPosts, deletePost, getStats, updateUserRole } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes protected by auth + admin role check
router.use(protect);
router.use(admin);

router.route('/users').get(getUsers);
router.route('/users/:id/role').put(updateUserRole);
router.route('/posts').get(getPosts);
router.route('/post/:id').delete(deletePost);
// Keep backward-compat alias
router.route('/remove-post/:id').delete(deletePost);
router.route('/stats').get(getStats);

module.exports = router;
