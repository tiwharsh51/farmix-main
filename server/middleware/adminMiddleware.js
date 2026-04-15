/**
 * adminMiddleware.js — standalone admin role check
 * Works as an enhance of the existing protect middleware.
 * Usage: router.use(protect, adminMiddleware)
 */
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Access denied. Admin role required.'));
  }
};

module.exports = adminMiddleware;
