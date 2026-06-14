const Alert = require("../models/Alert.model");

const getAlerts = async (req, res) => {
  try {
    const { status, type, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.status(200).json({ count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    if (alert.status === "resolved")
      return res.status(400).json({ message: "Alert already resolved" });
    alert.status = "resolved";
    alert.resolvedAt = new Date();
    alert.resolvedBy = req.user.id;
    await alert.save();
    res.status(200).json({ message: "Alert resolved", alert });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getAlertStats = async (req, res) => {
  try {
    const stats = await Alert.aggregate([
      { $group: { _id: { type: "$type", severity: "$severity" }, count: { $sum: 1 } } }
    ]);
    const total = await Alert.countDocuments();
    const active = await Alert.countDocuments({ status: "active" });
    res.status(200).json({ total, active, stats });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAlerts, resolveAlert, getAlertStats };