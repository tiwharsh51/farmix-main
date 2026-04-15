const { predictDisease } = require('../services/diseaseService');
const CropData = require('../models/CropData');

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

// @desc    Upload image and get disease prediction
// @route   POST /api/disease/predict
// @access  Private
const getDiseasePrediction = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image file of the plant leaf');
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      res.status(422);
      throw new Error(`Invalid file type. Allowed types: JPEG, PNG, WebP, GIF, BMP`);
    }

    // Validate file size (Multer may have already limited it, but double check)
    const sizeMB = req.file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      res.status(422);
      throw new Error(`Image too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB`);
    }

    const predictionResult = await predictDisease(req.file.path);

    // Save prediction history
    await CropData.create({
      user: req.user.id,
      type: 'Disease-Prediction',
      inputData: {
        imagePath: req.file.path,
        fileName: req.file.originalname,
        fileSize: `${sizeMB.toFixed(2)}MB`
      },
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

module.exports = { getDiseasePrediction };
