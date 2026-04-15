const { predictYield } = require('../services/yieldService');
const CropData = require('../models/CropData');

// @desc    Calculate crop yield prediction
// @route   POST /api/yield/predict
// @access  Private
const getYieldPrediction = async (req, res, next) => {
  try {
    const { cropType, area, season, state } = req.body;

    if (!cropType || !area || !season || !state) {
      res.status(400);
      throw new Error('Please provide crop type, area, season, and state inputs');
    }

    const predictionResult = await predictYield(req.body);

    // Save prediction history
    await CropData.create({
      user: req.user.id,
      type: 'Yield-Prediction',
      inputData: req.body,
      predictionResult
    });

    res.status(200).json({
      success: true,
      data: predictionResult
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getYieldPrediction };
