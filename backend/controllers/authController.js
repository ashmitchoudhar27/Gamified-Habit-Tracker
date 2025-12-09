// backend/controllers/authController.js

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const user = await User.create({ username, email, password });

    return res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
      },
    });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await user.matchPassword(password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.password = undefined;

    return res.json({
      success: true,
      token: generateToken(user._id),
      user,
    });

  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    return res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
