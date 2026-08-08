const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// email/password/name are already validated (and email lowercased/trimmed) by
// validateBody(authSchemas) in authRoutes.js before this runs.
async function register(req, res) {
  const { email, password, name } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });

  const token = signToken(user._id.toString());
  res.status(201).json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken(user._id.toString());
  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
}

module.exports = { register, login };
