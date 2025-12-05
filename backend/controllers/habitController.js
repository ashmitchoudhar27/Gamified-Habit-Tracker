const Habit = require("../models/Habit");
const User = require("../models/User");

// ----------------------------------------------------------
// ⭐ CREATE HABIT
// ----------------------------------------------------------
exports.createHabit = async (req, res) => {
  try {
    const { title, category, frequency } = req.body;

    const habit = await Habit.create({
      title,
      category,
      frequency,
      user: req.user.id,
    });

    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: "Failed to create habit" });
  }
};

// ----------------------------------------------------------
// ⭐ GET ALL HABITS
// ----------------------------------------------------------
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

// ----------------------------------------------------------
// ⭐ COMPLETE HABIT → STREAK + XP + BADGES
// ----------------------------------------------------------
exports.completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!habit) return res.status(404).json({ error: "Habit not found" });

    const today = new Date();
    const lastCompleted = habit.lastCompleted
      ? new Date(habit.lastCompleted)
      : null;

    // ⭐⭐⭐ FIXED STREAK LOGIC (MATCHES MODEL)
    if (!lastCompleted) {
      habit.streak = 1;
    } else {
      const diffDays = (today - lastCompleted) / (1000 * 60 * 60 * 24);

      if (lastCompleted.toDateString() === today.toDateString()) {
        // Already completed today → streak unchanged
      } else if (diffDays <= 2) {
        habit.streak += 1;
      } else {
        habit.streak = 1;
      }
    }

    habit.lastCompleted = today;
    habit.totalCompletions += 1;
    await habit.save();

    // ⭐⭐⭐ XP & LEVEL LOGIC
    const XP_PER_COMPLETION = 10;
    user.xp += XP_PER_COMPLETION;

    let leveledUp = false;
    if (user.xp >= user.level * 100) {
      user.level += 1;
      user.xp = 0;
      leveledUp = true;
    }

    // ⭐⭐⭐ BADGE LOGIC (NOW WORKS)
    let earnedBadge = null;
    let badges = user.badges || [];

    if (habit.streak === 1 && !badges.includes("streak_1")) {
      badges.push("streak_1");
      earnedBadge = "streak_1";
    }

    if (habit.streak === 3 && !badges.includes("streak_3")) {
      badges.push("streak_3");
      earnedBadge = "streak_3";
    }

    if (habit.streak === 7 && !badges.includes("streak_7")) {
      badges.push("streak_7");
      earnedBadge = "streak_7";
    }

    if (habit.totalCompletions === 10 && !badges.includes("completions_10")) {
      badges.push("completions_10");
      earnedBadge = "completions_10";
    }

    user.badges = badges;
    await user.save();

    res.json({
      message: "Habit completed successfully!",
      streak: habit.streak,
      totalCompletions: habit.totalCompletions,
      xp: user.xp,
      level: user.level,
      badges,
      earnedBadge,
      leveledUp,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to complete habit" });
  }
};

// ----------------------------------------------------------
// ⭐ DELETE HABIT
// ----------------------------------------------------------
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    await habit.deleteOne();
    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete habit" });
  }
};
