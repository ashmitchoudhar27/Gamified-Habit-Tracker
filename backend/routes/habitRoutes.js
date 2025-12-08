const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
  completeHabit,
  heatmap,
  getMyHabits,
  createHabit,
  deleteHabit       // <- NEW
} = require("../controllers/habitController");

// Create a habit
router.post("/", protect, createHabit);  // <- NEW

router.delete("/:id", protect, deleteHabit);

// Get all my habits
router.get("/my", protect, getMyHabits);

// Mark habit as completed today
router.post("/:id/complete", protect, completeHabit);

// Heatmap data
router.get("/:id/heatmap", protect, heatmap);

module.exports = router;
