const mongoose = require('mongoose');

const incomeEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  source: { type: String, required: true, trim: true },
  type: { type: String, enum: ['recurring', 'one-time'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  note: { type: String, trim: true, default: '' },
}, { timestamps: true });

incomeEntrySchema.index({ userId: 1, startDate: 1 });

module.exports = mongoose.model('IncomeEntry', incomeEntrySchema);
