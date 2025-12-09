const express = require("express");
const router = express.Router();
const {
  createHabit,
  completeHabit,
  getMyHabits,
  deleteHabit,
  getHabitHeatmap
} = require("../controllers/habitController");

const { protect } = require("../middleware/authMiddleware");

// ROUTES
router.post("/", protect, createHabit);
router.get("/my", protect, getMyHabits);

// IMPORTANT: Heatmap route must come BEFORE dynamic routes like :id
router.get("/:id/heatmap", protect, getHabitHeatmap);

router.post("/:id/complete", protect, completeHabit);
router.delete("/:id", protect, deleteHabit);

module.exports = router;
