const { recommendCrop } = require('../services/cropService');
const CropData = require('../models/CropData');

// @desc    Get crop recommendation
// @route   POST /api/crop/recommend
// @access  Private
const getCropRecommendation = async (req, res, next) => {
  try {
    const { soilType, rainfall, temperature, humidity } = req.body;

    if (!soilType || !rainfall || !temperature || !humidity) {
      res.status(400);
      throw new Error('Please provide all required inputs for crop recommendation');
    }

    const predictionResult = await recommendCrop(req.body);

    // Save prediction history
    await CropData.create({
      user: req.user.id,
      type: 'Crop-Recommendation',
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

module.exports = { getCropRecommendation };
