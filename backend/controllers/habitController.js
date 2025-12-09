const Habit = require("../models/Habit");
const mongoose = require("mongoose");

// Normalize date to start of day
function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ----------------------------
// CREATE HABIT
// ----------------------------
exports.createHabit = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const habit = await Habit.create({
      title,
      category,
      user: req.user._id,
      completions: [],
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
    });

    return res.status(201).json({ success: true, habit });
  } catch (err) {
    console.error("createHabit error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ----------------------------
// COMPLETE HABIT
// ----------------------------
exports.completeHabit = async (req, res) => {
  try {
    const habitId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(habitId)) {
      return res.status(400).json({ error: "Invalid habit ID" });
    }

    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const now = startOfDay();

    // Prevent double completion
    if (habit.lastCompletedAt && startOfDay(habit.lastCompletedAt).getTime() === now.getTime()) {
      return res.status(400).json({ error: "Already completed today" });
    }

    // Add completion
    habit.completions.push({ at: now });
    habit.totalCompletions += 1;

    // Streak logic
    if (habit.lastCompletedAt) {
      const last = startOfDay(habit.lastCompletedAt);
      const yesterday = startOfDay(new Date(now.getTime() - 86400000));

      habit.currentStreak = last.getTime() === yesterday.getTime() ? habit.currentStreak + 1 : 1;
    } else {
      habit.currentStreak = 1;
    }

    habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
    habit.lastCompletedAt = now;

    await habit.save();

    res.json({ success: true, habit });
  } catch (err) {
    console.error("completeHabit error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------------------
// GET HEATMAP (GitHub Style)
// ----------------------------
exports.getHabitHeatmap = async (req, res) => {
  try {
    const habitId = req.params.id;
    const days = Number(req.query.days) || 365;

    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const today = startOfDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);

    // ----------------------------
    // Create 53 × 7 grid
    // ----------------------------
    const grid = Array.from({ length: 53 }, () =>
      Array.from({ length: 7 }, () => 0)
    );

    // Fill grid with completion counts
    habit.completions.forEach((c) => {
      const date = startOfDay(new Date(c.at));
      if (date < startDate) return;

      const diff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
      const week = Math.floor(diff / 7);
      const day = date.getDay(); // Sun = 0

      if (grid[week] && grid[week][day] !== undefined) {
        grid[week][day] += 1;
      }
    });

    // ----------------------------
    // Month labels
    // ----------------------------
    const monthLabels = Array(53).fill("");

    for (let i = 0; i < 53; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * 7);
      if (date.getDate() <= 7) {
        monthLabels[i] = date.toLocaleString("default", { month: "short" });
      }
    }

    res.json({ success: true, grid, monthLabels });
  } catch (err) {
    console.error("Heatmap error:", err);
    res.status(500).json({ error: "Heatmap failed" });
  }
};

// ----------------------------
// GET MY HABITS
// ----------------------------
exports.getMyHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, habits });
  } catch (err) {
    console.error("getMyHabits error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------------------
// DELETE HABIT
// ----------------------------
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await habit.deleteOne();
    res.json({ success: true, message: "Habit deleted" });
  } catch (err) {
    console.error("deleteHabit error:", err);
    res.status(500).json({ error: "Server error deleting habit" });
  }
};
