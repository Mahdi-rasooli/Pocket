const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  targetAmount: { type: Number, required: true, min: 0 },
  targetDate: { type: Date, default: null },
  // Other users invited (by email) to view this goal and their own progress toward
  // it. Each collaborator's projections are computed from their own income/expense
  // data — this shares visibility into the goal, not a pooled/joint balance.
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

goalSchema.index({ collaborators: 1 });

module.exports = mongoose.model('Goal', goalSchema);
