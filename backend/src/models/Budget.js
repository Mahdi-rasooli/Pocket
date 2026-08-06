const mongoose = require('mongoose');
const { EXPENSE_CATEGORIES } = require('./ExpenseEntry');

// One monthly limit per category per user (not tied to a specific month — the
// limit is compared against whichever month's spend is currently in view).
const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, enum: EXPENSE_CATEGORIES, required: true },
  monthlyLimit: { type: Number, required: true, min: 0 },
}, { timestamps: true });

budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
