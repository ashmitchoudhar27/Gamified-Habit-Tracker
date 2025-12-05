const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash });
    const token = generateToken(user._id);

    res.status(201).json({ user: user.toJSON(), token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({ user: user.toJSON(), token });
  } catch (err) {
    next(err);
  }
};

// ⭐ Updated getMe – now returns xp + level too
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to load user profile" });
  }
};

module.exports = { register, login, getMe };
