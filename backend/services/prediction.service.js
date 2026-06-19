const Sensor = require("../models/Sensor.model");


const calculateLinearRegression = (dataPoints) => {

  const n = dataPoints.length;
  if (n < 2) return null;

  const sumX = dataPoints.reduce((acc, p) => acc + p.x, 0);
  const sumY = dataPoints.reduce((acc, p) => acc + p.y, 0);
  const sumXY = dataPoints.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = dataPoints.reduce((acc, p) => acc + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  // Intercept (c) — value at x = 0
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};
const calculateRollingStats = (values) => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  return { mean, stdDev };
};

const predictTrend = async (type, stepsAhead = 6) => {
  const readings = await Sensor.find({ type })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  if (readings.length < 5) {
    return { hasEnoughData: false };
  }

  const ordered = readings.reverse();

  const dataPoints = ordered.map((r, index) => ({
    x: index,
    y: r.value,
  }));

  const regression = calculateLinearRegression(dataPoints);
  if (!regression) return { hasEnoughData: false };

  const values = ordered.map((r) => r.value);
  const { mean, stdDev } = calculateRollingStats(values);

  const futureX = dataPoints.length - 1 + stepsAhead;
  const predictedValue = regression.slope * futureX + regression.intercept;

  const trendDirection =
    regression.slope > 0.5 ? "rising" :
    regression.slope < -0.5 ? "falling" :
    "stable";

  return {
    hasEnoughData: true,
    currentValue: values[values.length - 1],
    predictedValue: Math.round(predictedValue * 10) / 10,
    trendDirection,
    slope: Math.round(regression.slope * 100) / 100,
    mean: Math.round(mean * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
  };
};

module.exports = { predictTrend, calculateLinearRegression, calculateRollingStats };