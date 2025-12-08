const Habit = require("../models/Habit");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const habits = await Habit.find({ user: userId });

    // -----------------------------
    // WEEKLY COMPLETION ANALYTICS
    // -----------------------------
    const today = new Date();
    const last7days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayString = d.toISOString().slice(0, 10);

      last7days.push({
        date: dayString,
        count: 0,
      });
    }

    habits.forEach((habit) => {
      habit.completions.forEach((c) => {
        const d = c.at.toISOString().slice(0, 10);
        const idx = last7days.findIndex((x) => x.date === d);
        if (idx !== -1) last7days[idx].count += 1;
      });
    });

    // -----------------------------
    // CATEGORY ANALYTICS
    // -----------------------------
    const categoryCount = {};
    habits.forEach((h) => {
      categoryCount[h.category] = (categoryCount[h.category] || 0) + 1;
    });

    // -----------------------------
    // STREAK LEADERBOARD
    // -----------------------------
    const streakLeaders = habits
      .map((h) => ({
        title: h.title,
        streak: h.currentStreak || 0,
      }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 3);

    res.json({
      success: true,
      weekly: last7days,
      categories: categoryCount,
      streakLeaders,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
