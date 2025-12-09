// backend/controllers/analyticsController.js

const Habit = require("../models/Habit");

// 📌 Combined GitHub-style heatmap (all habits merged)
exports.getCombinedHeatmap = async (req, res) => {
  try {
    const userId = req.user._id;

    const habits = await Habit.find({ user: userId });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = 365; // 1-year heatmap
    const start = new Date(today);
    start.setDate(today.getDate() - days);

    // Collect all completions into a date → count map
    const heatmap = {};

    habits.forEach((habit) => {
      habit.completions.forEach((c) => {
        const date = new Date(c.at);
        const key = date.toISOString().slice(0, 10);

        if (!heatmap[key]) heatmap[key] = 0;
        heatmap[key] += 1;
      });
    });

    const grid = Array.from({ length: 53 }, () =>
      Array.from({ length: 7 }, () => ({ count: 0 }))
    );

    // Fill grid
    for (let col = 0; col < 53; col++) {
      for (let row = 0; row < 7; row++) {
        const d = new Date(start);
        d.setDate(start.getDate() + col * 7 + row); // move day-by-day

        const key = d.toISOString().slice(0, 10);
        grid[col][row] = { count: heatmap[key] || 0 };
      }
    }

    // ------------------------------------------
    // 📌 OPTION 2 — Show ALL 12 month names
    // ------------------------------------------
    const monthLabels = Array(53).fill("");

    // Determine which column roughly starts each month
    const visibleMonths = [];

    const monthStart = new Date(start);
    monthStart.setDate(1);

    while (monthStart <= today) {
      visibleMonths.push({
        month: monthStart.getMonth(),
        label: monthStart.toLocaleString("default", { month: "short" }),
        date: new Date(monthStart),
      });

      monthStart.setMonth(monthStart.getMonth() + 1);
    }

    // Map each month to closest column
    visibleMonths.forEach((m) => {
      const diffDays = Math.floor((m.date - start) / (1000 * 60 * 60 * 24));
      const col = Math.floor(diffDays / 7);

      if (col >= 0 && col < 53) {
        monthLabels[col] = m.label;
      }
    });

    res.json({ success: true, grid, monthLabels });
  } catch (err) {
    console.error("Heatmap error:", err);
    res.status(500).json({ error: "Heatmap failed" });
  }
};

// 📌 ADVANCED ANALYTICS (monthly stats, XP, categories, streaks)
exports.getAdvancedAnalytics = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });

    // MONTHLY COMPLETIONS (last 12 months)
    const monthlyLabels = [];
    const monthlyValues = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const month = date.getMonth();
      const year = date.getFullYear();

      let count = 0;

      habits.forEach((h) =>
        h.completions.forEach((c) => {
          const d = new Date(c.at);
          if (d.getMonth() === month && d.getFullYear() === year) count++;
        })
      );

      monthlyLabels.unshift(
        date.toLocaleString("default", { month: "short" }) + " " + year
      );
      monthlyValues.unshift(count);
    }

    // XP trend (simple formula)
    const xpLabels = [...monthlyLabels];
    const xpValues = monthlyValues.map((v) => v * 10);

    // CATEGORY STRENGTH
    const categoryStrength = {};
    habits.forEach((h) => {
      categoryStrength[h.category] =
        (categoryStrength[h.category] || 0) + h.totalCompletions;
    });

    // TOP HABITS
    const topHabits = habits
      .map((h) => ({
        title: h.title,
        totalCompletions: h.totalCompletions,
      }))
      .sort((a, b) => b.totalCompletions - a.totalCompletions)
      .slice(0, 5);

    // STREAK INTENSITY
    const streakIntensity = habits
      .map((h) => ({
        title: h.title,
        streak: h.currentStreak,
      }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);

    res.json({
      success: true,
      monthly: { labels: monthlyLabels, values: monthlyValues },
      xp: { labels: xpLabels, values: xpValues },
      categoryStrength,
      topHabits,
      streakIntensity,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to load analytics" });
  }
};
