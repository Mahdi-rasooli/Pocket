const ExpenseEntry = require('../models/ExpenseEntry');
const { EXPENSE_CATEGORIES } = require('../models/ExpenseEntry');

async function list(req, res) {
  const { from, to } = req.query;
  const filter = { userId: req.userId };
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  const entries = await ExpenseEntry.find(filter).sort({ date: -1 });
  res.json(entries);
}

async function create(req, res) {
  const { amount, category, date, note } = req.body;
  if (amount == null || !category || !date) {
    return res.status(400).json({ error: 'amount, category, and date are required' });
  }
  if (!EXPENSE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${EXPENSE_CATEGORIES.join(', ')}` });
  }

  const entry = await ExpenseEntry.create({
    userId: req.userId,
    amount,
    category,
    date,
    note: note || '',
  });
  res.status(201).json(entry);
}

async function update(req, res) {
  const { id } = req.params;
  const { amount, category, date, note } = req.body;
  if (category && !EXPENSE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${EXPENSE_CATEGORIES.join(', ')}` });
  }

  const updates = {};
  if (amount != null) updates.amount = amount;
  if (category) updates.category = category;
  if (date) updates.date = date;
  if (note != null) updates.note = note;

  const entry = await ExpenseEntry.findOneAndUpdate(
    { _id: id, userId: req.userId },
    updates,
    { new: true }
  );
  if (!entry) {
    return res.status(404).json({ error: 'Expense entry not found' });
  }
  res.json(entry);
}

async function remove(req, res) {
  const { id } = req.params;
  const entry = await ExpenseEntry.findOneAndDelete({ _id: id, userId: req.userId });
  if (!entry) {
    return res.status(404).json({ error: 'Expense entry not found' });
  }
  res.status(204).send();
}

module.exports = { list, create, update, remove };
