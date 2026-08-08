const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { apiLimiter } = require('./middleware/rateLimiters');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const statsRoutes = require('./routes/statsRoutes');
const goalRoutes = require('./routes/goalRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();

// CORS_ORIGIN unset keeps the previous wide-open behavior (fine for local dev);
// set it (comma-separated for multiple) to lock this down before deploying.
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : true;
app.use(cors({ origin: corsOrigin }));
app.use(helmet());
// 2mb accommodates a reasonably large CSV import, well beyond any JSON payload
// (bcrypt-hashed auth, single transaction/goal/budget bodies) the app otherwise sends.
app.use(express.json({ limit: '2mb' }));
app.use('/api', apiLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/budgets', budgetRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
