const mongoose = require("mongoose");

const completionSchema = new mongoose.Schema({
  at: { type: Date, default: Date.now },
});

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "general" },
  frequency: { type: String, default: "daily" },
  active: { type: Boolean, default: true },

  // NEW
  completions: [completionSchema],

  totalCompletions: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCompletedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
  startDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Habit", habitSchema);
