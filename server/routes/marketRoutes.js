const express = require('express');
const router = express.Router();
const { getMarketPrices, predictMarketPrice } = require('../controllers/marketController');

router.get('/prices', getMarketPrices);
router.get('/predict', predictMarketPrice);

module.exports = router;
