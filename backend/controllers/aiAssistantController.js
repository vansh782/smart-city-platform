const Sensor = require("../models/Sensor.model");
const Alert = require("../models/Alert.model");


const askAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    const q = (question || "").toLowerCase();

    let answer = "";

    if (q.includes("traffic")) {
      const traffic = await Sensor.findOne({ type: "traffic" }).sort({ createdAt: -1 });
      if (traffic) {
        answer = `🚦 Current traffic at ${traffic.location.zone} is ${traffic.value} ${traffic.unit} (status: ${traffic.status}).`;
      } else {
        answer = "No traffic data available yet.";
      }
    } else if (q.includes("aqi") || q.includes("air")) {
      const aqi = await Sensor.findOne({ type: "air_quality" }).sort({ createdAt: -1 });
      if (aqi) {
        answer = `🌫 Current AQI at ${aqi.location.zone} is ${aqi.value} (status: ${aqi.status}).`;
      } else {
        answer = "No air quality data available yet.";
      }
    } else if (q.includes("energy") || q.includes("power")) {
      const energy = await Sensor.findOne({ type: "energy" }).sort({ createdAt: -1 });
      if (energy) {
        answer = `⚡ Current energy usage at ${energy.location.zone} is ${energy.value} kWh (status: ${energy.status}).`;
      } else {
        answer = "No energy data available yet.";
      }
    } else if (q.includes("waste") || q.includes("trash") || q.includes("garbage")) {
      const waste = await Sensor.findOne({ type: "waste" }).sort({ createdAt: -1 });
      if (waste) {
        answer = `🗑 Waste bin at ${waste.location.zone} is at ${waste.value}% capacity (status: ${waste.status}).`;
      } else {
        answer = "No waste data available yet.";
      }
    } else if (q.includes("water")) {
      const water = await Sensor.findOne({ type: "water" }).sort({ createdAt: -1 });
      if (water) {
        answer = `💧 Water usage at ${water.location.zone} is ${water.value} L/hr (status: ${water.status}).`;
      } else {
        answer = "No water data available yet.";
      }
    } else if (q.includes("alert") || q.includes("emergency") || q.includes("issue")) {
      const activeAlerts = await Alert.find({ status: "active" });
      if (activeAlerts.length === 0) {
        answer = "✅ No active alerts right now. All systems are normal.";
      } else {
        const critical = activeAlerts.filter((a) => a.severity === "critical").length;
        answer = `⚠️ There are ${activeAlerts.length} active alert(s)${critical > 0 ? `, ${critical} of which are critical` : ""}. Check the Alerts page for details.`;
      }
    } else if (q.includes("health") || q.includes("status") || q.includes("overall")) {
      const activeAlerts = await Alert.countDocuments({ status: "active" });
      answer = `🏙 The city currently has ${activeAlerts} active alert(s). Visit the dashboard for the full health score.`;
    } else {
      answer = "🤖 I can answer questions about traffic, AQI, energy, water, waste, or active alerts. Try asking about one of those!";
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { askAssistant };