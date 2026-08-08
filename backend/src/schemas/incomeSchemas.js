const { z } = require('zod');

// Sanity cap, not a real-world limit — guards against absurd values (typos with
// extra zeros, or deliberate abuse) breaking downstream math/display.
const amount = z.number().nonnegative().max(1_000_000_000_000);
const dateString = z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date');
const type = z.enum(['recurring', 'one-time']);

const create = z.object({
  amount,
  source: z.string().trim().min(1, 'Source is required').max(200),
  type,
  startDate: dateString,
  endDate: dateString.nullish(),
  note: z.string().max(1000).optional(),
});

const replace = z.object({
  amount,
  effectiveDate: dateString,
  source: z.string().trim().min(1).max(200).optional(),
  note: z.string().max(1000).optional(),
});

const deactivate = z.object({
  endDate: dateString.optional(),
});

const importCsv = z.object({
  csv: z.string().min(1).max(2_000_000, 'CSV too large'),
});

module.exports = { create, replace, deactivate, importCsv };
