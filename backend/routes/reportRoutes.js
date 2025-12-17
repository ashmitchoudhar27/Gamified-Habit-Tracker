const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getWeeklyReport } = require("../controllers/reportController");

router.get("/weekly", protect, getWeeklyReport);

module.exports = router;
