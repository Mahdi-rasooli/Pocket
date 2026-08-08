const { z } = require('zod');
const { EXPENSE_CATEGORIES } = require('../models/ExpenseEntry');

const amount = z.number().nonnegative().max(1_000_000_000_000);
const dateString = z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date');
// Reuses the model's category list directly, so this can never drift out of sync
// with EXPENSE_CATEGORIES the way a hand-copied enum could.
const category = z.enum(EXPENSE_CATEGORIES);
const type = z.enum(['recurring', 'one-time']);

const create = z.object({
  amount,
  category,
  date: dateString,
  type: type.optional(),
  endDate: dateString.nullish(),
  note: z.string().max(1000).optional(),
});

const update = z.object({
  amount: amount.optional(),
  category: category.optional(),
  date: dateString.optional(),
  note: z.string().max(1000).optional(),
});

const deactivate = z.object({
  endDate: dateString.optional(),
});

const importCsv = z.object({
  csv: z.string().min(1).max(2_000_000, 'CSV too large'),
});

const listQuery = z.object({
  from: dateString.optional(),
  to: dateString.optional(),
});

module.exports = { create, update, deactivate, importCsv, listQuery };
