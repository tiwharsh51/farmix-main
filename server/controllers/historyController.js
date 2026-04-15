const CropData = require('../models/CropData');

// @desc    Get all prediction history for a user
// @route   GET /api/predictions/history
// @access  Private
const getPredictionHistory = async (req, res, next) => {
  try {
    const history = await CropData.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPredictionHistory };
