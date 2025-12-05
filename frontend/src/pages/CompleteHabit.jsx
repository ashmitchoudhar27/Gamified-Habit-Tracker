// Complete a habit → XP + streak + badge system
exports.completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!habit) return res.status(404).json({ error: "Habit not found" });

    // Update habit stats
    habit.totalCompletions += 1;
    habit.currentStreak += 1;
    habit.lastCompletedAt = new Date();

    // Update longest streak
    if (habit.currentStreak > habit.longestStreak) {
      habit.longestStreak = habit.currentStreak;
    }

    await habit.save();

    // XP logic
    const XP_PER_COMPLETION = 10;
    user.xp += XP_PER_COMPLETION;

    let leveledUp = false;

    if (user.xp >= user.level * 100) {
      user.level += 1;
      user.xp = 0;
      leveledUp = true;
    }

    // ---------- BADGE SYSTEM ----------
    const newBadges = [];

    // 🎖️ Streak Badges
    const streak = habit.currentStreak;
    if (streak >= 3 && !user.badges.includes("streak_3"))
      newBadges.push("streak_3");
    if (streak >= 7 && !user.badges.includes("streak_7"))
      newBadges.push("streak_7");
    if (streak >= 14 && !user.badges.includes("streak_14"))
      newBadges.push("streak_14");
    if (streak >= 30 && !user.badges.includes("streak_30"))
      newBadges.push("streak_30");

    // ⭐ Level Badges
    const level = user.level;
    if (level >= 2 && !user.badges.includes("level_2"))
      newBadges.push("level_2");
    if (level >= 5 && !user.badges.includes("level_5"))
      newBadges.push("level_5");
    if (level >= 10 && !user.badges.includes("level_10"))
      newBadges.push("level_10");
    if (level >= 20 && !user.badges.includes("level_20"))
      newBadges.push("level_20");

    // 🎯 Completion Badges
    const total = habit.totalCompletions;
    if (total >= 10 && !user.badges.includes("complete_10"))
      newBadges.push("complete_10");
    if (total >= 50 && !user.badges.includes("complete_50"))
      newBadges.push("complete_50");
    if (total >= 100 && !user.badges.includes("complete_100"))
      newBadges.push("complete_100");

    // Add new badges to user
    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
    }

    await user.save();

    res.json({
      message: "Habit completed successfully!",
      streak: habit.currentStreak,
      totalCompletions: habit.totalCompletions,
      xp: user.xp,
      level: user.level,
      leveledUp,
      newBadges,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to complete habit" });
  }
};
