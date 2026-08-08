const { z } = require('zod');

const email = z.string().trim().toLowerCase().email('Invalid email address');
// This is the first place a password policy actually exists — previously any
// non-empty string was accepted. bcrypt itself has a 72-byte input limit, so a
// generous max keeps hashing well-behaved for pathological input.
const password = z.string().min(8, 'Password must be at least 8 characters').max(72);

const register = z.object({
  email,
  password,
  name: z.string().trim().min(1, 'Name is required').max(200),
});

const login = z.object({
  email,
  // Login intentionally doesn't enforce the 8-char minimum — an existing account
  // with a shorter legacy password must still be able to log in.
  password: z.string().min(1, 'Password is required').max(200),
});

module.exports = { register, login };
