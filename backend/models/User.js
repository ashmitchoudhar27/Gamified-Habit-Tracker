const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  // ⭐ XP + Level System
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },

  badges: [{ type: String }], // earned badges

  createdAt: { type: Date, default: Date.now }
});

// remove password from response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
