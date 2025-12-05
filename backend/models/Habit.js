const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'general' },
  frequency: { type: String, default: 'daily' },

  active: { type: Boolean, default: true },

  // ⭐ Streak system
  totalCompletions: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastCompleted: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Habit', habitSchema);
