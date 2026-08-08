const { z } = require('zod');
const { EXPENSE_CATEGORIES } = require('../models/ExpenseEntry');

const upsert = z.object({
  category: z.enum(EXPENSE_CATEGORIES),
  monthlyLimit: z.number().nonnegative().max(1_000_000_000_000),
});

module.exports = { upsert };
