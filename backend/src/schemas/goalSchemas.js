const { z } = require('zod');

const targetAmount = z.number().nonnegative().max(1_000_000_000_000);
const dateString = z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date');

const create = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  targetAmount,
  targetDate: dateString.nullish(),
});

const update = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  targetAmount: targetAmount.optional(),
  targetDate: dateString.nullable().optional(),
});

const inviteCollaborator = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});

module.exports = { create, update, inviteCollaborator };
