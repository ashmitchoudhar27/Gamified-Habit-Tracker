const Habit = require("../models/Habit");

// 📊 WEEKLY REPORT
exports.getWeeklyReport = async (req, res) => {
  try {
    const userId = req.user._id;

    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);

    const habits = await Habit.find({ user: userId });

    let totalCompletions = 0;
    const habitStats = [];

    habits.forEach(habit => {
      const count = habit.completions.filter(
        c => new Date(c.at) >= start
      ).length;

      totalCompletions += count;

      habitStats.push({
        title: habit.title,
        count
      });
    });

    res.json({
      success: true,
      totalCompletions,
      habits: habitStats
    });

  } catch (err) {
    console.error("Weekly report error:", err);
    res.status(500).json({ error: "Failed to generate weekly report" });
  }
};
