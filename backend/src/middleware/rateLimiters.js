const { rateLimit } = require('express-rate-limit');

// Login/register are the brute-force target — tight per-IP limit.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later' },
});

// Generous baseline for everything else behind auth, mainly to blunt scripted abuse
// (e.g. a runaway client retry loop) rather than normal usage.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down' },
});

module.exports = { authLimiter, apiLimiter };
