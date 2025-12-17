const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getWeeklyReport } = require("../controllers/reportController");
const { getWeeklyReportPDF } = require("../controllers/reportController");

router.get("/weekly", protect, getWeeklyReport);
router.get("/weekly/pdf", protect, getWeeklyReportPDF);

module.exports = router;
