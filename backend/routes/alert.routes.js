const express = require("express");
const router = express.Router();
const { getAlerts, resolveAlert, getAlertStats } = require("../controllers/alertController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAlerts);
router.get("/stats", protect, getAlertStats);
router.patch("/:id/resolve", protect, resolveAlert);

module.exports = router;