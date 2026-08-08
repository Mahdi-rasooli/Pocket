const { z } = require('zod');

// Query params arrive as strings; z.coerce converts and validates in one step.
const year = z.coerce.number().int().min(2000).max(2100).optional();
const month = z.coerce.number().int().min(1).max(12).optional();

const monthlyQuery = z.object({ year, month });
const categoriesQuery = z.object({ year, month });

const dailyQuery = z.object({
  date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date').optional(),
});

// `trend` used to accept an unbounded `months` value and loop that many times
// doing sequential DB round trips per iteration — `?months=999999` was a real,
// trivially-triggered DoS. Clamped to a sane window (2 years).
const trendQuery = z.object({
  months: z.coerce.number().int().min(1).max(24).optional(),
});

module.exports = { monthlyQuery, categoriesQuery, dailyQuery, trendQuery };
