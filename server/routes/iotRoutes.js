const express = require('express');
const router = express.Router();
const { receiveSensorData, getSensorData } = require('../controllers/iotController');
const { protect } = require('../middleware/authMiddleware');

router.post('/data', protect, receiveSensorData);
router.get('/data', protect, getSensorData);

module.exports = router;
