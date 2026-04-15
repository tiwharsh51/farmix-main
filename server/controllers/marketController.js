// @desc    Get current market prices (mocked)
// @route   GET /api/market/prices
// @access  Public
const getMarketPrices = async (req, res, next) => {
  try {
    // In production, this would fetch from an external API or DB
    const mockPrices = [
      { crop: 'Wheat', price: { min: 2100, max: 2400 }, unit: 'Quintal', trend: 'up' },
      { crop: 'Rice', price: { min: 2500, max: 2800 }, unit: 'Quintal', trend: 'down' },
      { crop: 'Sugarcane', price: { min: 300, max: 350 }, unit: 'Quintal', trend: 'stable' },
      { crop: 'Cotton', price: { min: 6500, max: 7200 }, unit: 'Quintal', trend: 'up' },
      { crop: 'Maize', price: { min: 1800, max: 2100 }, unit: 'Quintal', trend: 'down' },
    ];
    
    res.status(200).json({ success: true, data: mockPrices });
  } catch (error) {
    next(error);
  }
};

// @desc    Predict market prices based on history (mocked)
// @route   GET /api/market/predict
// @access  Public
const predictMarketPrice = async (req, res, next) => {
  try {
    const { crop } = req.query;
    if (!crop) {
      res.status(400);
      throw new Error('Please provide crop name to predict');
    }

    // Mock time-series prediction
    const monthlyForecast = [];
    const basePrice = crop.toLowerCase() === 'wheat' ? 2200 : 2000;
    
    for (let i = 1; i <= 6; i++) {
        // Create mock fluctuations
        const fluctuation = Math.floor(Math.random() * 300) - 100;
        monthlyForecast.push({
            month: `Month +${i}`,
            predictedPrice: basePrice + (i * 50) + fluctuation
        });
    }

    res.status(200).json({ 
        success: true, 
        data: {
            crop,
            forecast: monthlyForecast
        }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMarketPrices,
  predictMarketPrice
};
