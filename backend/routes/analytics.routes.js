const express = require("express");
const router = express.Router();
const { getHourlyData, getSummary } = require("../controllers/analyticsController");
const { getPrediction, getAllPredictions } = require("../controllers/predictionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/hourly", protect, getHourlyData);
router.get("/summary", protect, getSummary);
router.get("/predict", protect, getPrediction);
router.get("/predict/all", protect, getAllPredictions);

module.exports = router;