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
// ⭐ GET ALL HABITS OF LOGGED-IN USER
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
// ⭐ COMPLETE A HABIT → XP + LEVEL + STREAK SYSTEM
// ----------------------------------------------------------
exports.completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const today = new Date();
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null;

    // -----------------------------------------------------
    // ⭐ STREAK LOGIC
    // -----------------------------------------------------
    if (!lastCompleted) {
      // first time completing
      habit.streak = 1;
    } else {
      const diffDays = (today - lastCompleted) / (1000 * 60 * 60 * 24);

      if (lastCompleted.toDateString() === today.toDateString()) {
        // already completed today → streak unchanged
      }
      else if (diffDays <= 2) {
        // completed yesterday → increase streak
        habit.streak += 1;
      }
      else {
        // streak broken
        habit.streak = 1;
      }
    }

    // update completion time
    habit.lastCompleted = today;

    // track total completions
    habit.totalCompletions += 1;

    await habit.save();

    // -----------------------------------------------------
    // ⭐ XP / LEVEL SYSTEM
    // -----------------------------------------------------
    const XP_PER_COMPLETION = 10;
    user.xp += XP_PER_COMPLETION;

    let leveledUp = false;

    if (user.xp >= user.level * 100) {
      user.level += 1;
      user.xp = 0;
      leveledUp = true;
    }

    await user.save();

    // -----------------------------------------------------
    // ⭐ RESPONSE
    // -----------------------------------------------------
    res.json({
      message: "Habit completed successfully!",
      streak: habit.streak,
      totalCompletions: habit.totalCompletions,
      xp: user.xp,
      level: user.level,
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
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    await habit.deleteOne();

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete habit" });
  }
};

