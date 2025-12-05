const express = require("express");
const router = express.Router();

const {
  createHabit,
  getHabits,
  completeHabit,
  deleteHabit,
} = require("../controllers/habitController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.post("/:id/complete", protect, completeHabit);
router.delete("/:id", protect, deleteHabit);

module.exports = router;
