const Sensor = require("../models/Sensor.model");
const Alert = require("../models/Alert.model");

const getHealthScore = async (req, res) => {
  try {
    const activeAlerts = await Alert.find({ status: "active" });

    let score = 100;

    activeAlerts.forEach((alert) => {
      if (alert.severity === "critical") score -= 8;
      else if (alert.severity === "warning") score -= 4;
      else score -= 1;
    });

    const types = ["traffic", "air_quality", "energy", "water", "waste"];
    const latestReadings = await Promise.all(
      types.map((type) => Sensor.findOne({ type }).sort({ createdAt: -1 }))
    );

    latestReadings.forEach((reading) => {
      if (!reading) return;
      if (reading.status === "critical") score -= 3;
      else if (reading.status === "warning") score -= 1;
    });

    score = Math.max(0, Math.min(100, Math.round(score)));

    const label =
      score >= 80 ? "Excellent" :
      score >= 60 ? "Good" :
      score >= 40 ? "Fair" :
      "Needs Attention";

    res.status(200).json({
      score,
      label,
      activeAlertCount: activeAlerts.length,
      criticalCount: activeAlerts.filter((a) => a.severity === "critical").length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getHealthScore };