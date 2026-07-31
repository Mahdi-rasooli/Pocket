const mongoose = require('mongoose');

const EXPENSE_CATEGORIES = [
  'housing', 'food', 'dining', 'transport', 'entertainment',
  'shopping', 'health', 'utilities', 'other',
];

const expenseEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, enum: EXPENSE_CATEGORIES, required: true },
  date: { type: Date, required: true },
  note: { type: String, trim: true, default: '' },
}, { timestamps: true });

expenseEntrySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('ExpenseEntry', expenseEntrySchema);
module.exports.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
