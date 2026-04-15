const IoTSensor = require('../models/IoTSensor');

// @desc    Receive IoT Sensor Data Ping
// @route   POST /api/iot/data
// @access  Private
const receiveSensorData = async (req, res, next) => {
  try {
    const { type, value } = req.body;
    
    if (!type || value === undefined) {
      res.status(400);
      throw new Error('Please provide sensor type and value');
    }

    const sensorData = await IoTSensor.create({
      userId: req.user._id,
      type,
      value
    });

    res.status(201).json({ success: true, data: sensorData });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Latest IoT Sensor Data
// @route   GET /api/iot/data
// @access  Private
const getSensorData = async (req, res, next) => {
  try {
    // Group by type and get most recent
    const moisture = await IoTSensor.findOne({ userId: req.user._id, type: 'moisture' }).sort('-timestamp');
    const temperature = await IoTSensor.findOne({ userId: req.user._id, type: 'temperature' }).sort('-timestamp');
    const humidity = await IoTSensor.findOne({ userId: req.user._id, type: 'humidity' }).sort('-timestamp');
    
    // Also send historical mock data for chart rendering
    const history = [
        { time: '10:00', moisture: 45, temperature: 28 },
        { time: '11:00', moisture: 42, temperature: 29 },
        { time: '12:00', moisture: 40, temperature: 31 },
        { time: '13:00', moisture: 38, temperature: 32 },
        { time: '14:00', moisture: 36, temperature: 33 },
        { time: '15:00', moisture: 55, temperature: 30 }, // Irrigation event mock
    ];

    res.status(200).json({ 
        success: true, 
        data: {
            current: {
                moisture: moisture ? moisture.value : 40,
                temperature: temperature ? temperature.value : 30,
                humidity: humidity ? humidity.value : 60
            },
            history
        }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  receiveSensorData,
  getSensorData
};
