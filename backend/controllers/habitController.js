const Habit = require("../models/Habit");
const mongoose = require("mongoose");
// ✔ Create Habit
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


function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function isSameUTCDate(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

// ✔ Mark Habit as Completed Today
exports.completeHabit = async (req, res) => {
  try {
    const userId = req.user._id;
    const habitId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(habitId)) {
      return res.status(400).json({ error: "Invalid habit ID" });
    }

    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.user.toString() !== userId.toString())
      return res.status(403).json({ error: "Not authorized" });

    const now = new Date();

    // Prevent double completion
    if (habit.lastCompletedAt && isSameUTCDate(habit.lastCompletedAt, now)) {
      return res.status(400).json({
        error: "Already completed today",
        alreadyCompleted: true,
      });
    }

    // Add completion
    habit.completions.push({ at: now });
    habit.totalCompletions += 1;

    // Streak logic
    if (habit.lastCompletedAt) {
      const last = startOfDay(habit.lastCompletedAt);
      const yesterday = startOfDay(new Date(now.getTime() - 86400000));

      if (last.getTime() === yesterday.getTime()) {
        habit.currentStreak += 1;
      } else {
        habit.currentStreak = 1;
      }
    } else {
      habit.currentStreak = 1;
    }

    habit.longestStreak = Math.max(
      habit.longestStreak,
      habit.currentStreak
    );

    habit.lastCompletedAt = now;

    await habit.save();

    return res.json({ success: true, habit });
  } catch (err) {
    console.error("completeHabit error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ✔ Heatmap Data
exports.heatmap = async (req, res) => {
  try {
    const userId = req.user._id;
    const habitId = req.params.id;
    const days = parseInt(req.query.days || "120");

    const habit = await Habit.findById(habitId).lean();
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.user.toString() !== userId.toString())
      return res.status(403).json({ error: "Not authorized" });

    const map = {};
    const today = startOfDay();
    
    (habit.completions || []).forEach((c) => {
      const day = startOfDay(c.at);
      const diff = (today - day) / 86400000;

      if (diff >= 0 && diff < days) {
        const key = day.toISOString().slice(0, 10);
        map[key] = (map[key] || 0) + 1;
      }
    });

    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today - i * 86400000);
      const key = date.toISOString().slice(0, 10);
      result.push({ date: key, count: map[key] || 0 });
    }

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("heatmap error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ✔ Get All MY Habits
exports.getMyHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, habits });
  } catch (err) {
    console.error("getMyHabits error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


// ✔ Delete Habit
exports.deleteHabit = async (req, res) => {
  try {
    const userId = req.user._id;
    const habitId = req.params.id;

    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await habit.deleteOne();

    return res.json({ success: true, message: "Habit deleted" });
  } catch (err) {
    console.error("deleteHabit error:", err);
    return res.status(500).json({ error: "Server error deleting habit" });
  }
};

