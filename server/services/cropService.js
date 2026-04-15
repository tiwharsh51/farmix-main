// server/services/cropService.js
const recommendCrop = async (data) => {
  // In a real application, this would call the Python ML model via spawn or an HTTP request
  // For now, we simulate the ML response based on heuristics or random choice
  const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Jute'];
  
  // Simulated ML delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    recommendedCrop: crops[Math.floor(Math.random() * crops.length)],
    confidence: (Math.random() * (0.99 - 0.75) + 0.75).toFixed(2)
  };
};

module.exports = { recommendCrop };
