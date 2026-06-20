const express = require("express");
const router = express.Router();
const { askAssistant } = require("../controllers/aiAssistantController");
const { protect } = require("../middleware/authMiddleware");

router.post("/ask", protect, askAssistant);

module.exports = router;