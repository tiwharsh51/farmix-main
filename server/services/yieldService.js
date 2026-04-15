const predictYield = async (data) => {
  // Simulate ML model prediction for yield (e.g. tons per hectare)
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const baseYield = Math.random() * (10 - 2) + 2; // Random tons between 2 and 10
  
  return {
    estimatedYield: baseYield.toFixed(2) + " tons/hectare",
    confidence: (Math.random() * (0.95 - 0.80) + 0.80).toFixed(2)
  };
};

module.exports = { predictYield };
