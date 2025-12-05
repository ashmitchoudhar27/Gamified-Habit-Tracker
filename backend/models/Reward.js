const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  cost: { type: Number, default: 0 }, // coins or XP cost
  redeemedAt: Date
});

module.exports = mongoose.model('Reward', rewardSchema);
