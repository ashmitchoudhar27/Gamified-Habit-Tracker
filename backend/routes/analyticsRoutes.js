// backend/routes/analyticsRoutes.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getCombinedHeatmap,
  getAdvancedAnalytics
} = require("../controllers/analyticsController");

// GitHub-style combined heatmap
router.get("/combined-heatmap", protect, getCombinedHeatmap);

// Main analytics endpoint
router.get("/advanced", protect, getAdvancedAnalytics);

module.exports = router;
