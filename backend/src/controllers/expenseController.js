const ExpenseEntry = require('../models/ExpenseEntry');
const { EXPENSE_CATEGORIES } = require('../models/ExpenseEntry');
const { toCSV, parseCSV } = require('../utils/csv');

const CSV_COLUMNS = ['amount', 'category', 'date', 'type', 'endDate', 'note'];

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
  const { amount, category, date, type, endDate, note } = req.body;
  if (amount == null || !category || !date) {
    return res.status(400).json({ error: 'amount, category, and date are required' });
  }
  if (!EXPENSE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${EXPENSE_CATEGORIES.join(', ')}` });
  }
  if (type && !['recurring', 'one-time'].includes(type)) {
    return res.status(400).json({ error: 'type must be "recurring" or "one-time"' });
  }

  const entry = await ExpenseEntry.create({
    userId: req.userId,
    amount,
    category,
    date,
    type: type || 'one-time',
    endDate: endDate || null,
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

// Stops a recurring expense (e.g. a canceled subscription) as of endDate, without
// deleting its history — mirrors IncomeEntry's deactivate.
async function deactivate(req, res) {
  const { id } = req.params;
  const entry = await ExpenseEntry.findOneAndUpdate(
    { _id: id, userId: req.userId },
    { isActive: false, endDate: req.body.endDate || new Date() },
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

async function exportCSV(req, res) {
  const entries = await ExpenseEntry.find({ userId: req.userId }).sort({ date: -1 }).lean();
  const rows = entries.map((e) => ({
    ...e,
    date: e.date.toISOString().slice(0, 10),
    endDate: e.endDate ? e.endDate.toISOString().slice(0, 10) : '',
  }));
  res.header('Content-Type', 'text/csv');
  res.header('Content-Disposition', 'attachment; filename="pocket-expenses.csv"');
  res.send(toCSV(rows, CSV_COLUMNS));
}

// Bulk-creates expense entries from CSV text (same columns as exportCSV). Rows
// missing a required field are skipped and reported back, not aborting the batch.
async function importCSV(req, res) {
  const { csv } = req.body;
  if (!csv) {
    return res.status(400).json({ error: 'csv is required' });
  }

  const rows = parseCSV(csv);
  const toInsert = [];
  const errors = [];

  rows.forEach((row, i) => {
    const { amount, category, date, type, endDate, note } = row;
    if (!amount || !category || !date) {
      errors.push({ row: i + 2, error: 'missing amount, category, or date' });
      return;
    }
    if (!EXPENSE_CATEGORIES.includes(category)) {
      errors.push({ row: i + 2, error: `category must be one of: ${EXPENSE_CATEGORIES.join(', ')}` });
      return;
    }
    if (type && !['recurring', 'one-time'].includes(type)) {
      errors.push({ row: i + 2, error: 'type must be "recurring" or "one-time"' });
      return;
    }
    toInsert.push({
      userId: req.userId,
      amount: Number(amount),
      category,
      date,
      type: type || 'one-time',
      endDate: endDate || null,
      note: note || '',
    });
  });

  const created = toInsert.length ? await ExpenseEntry.insertMany(toInsert) : [];
  res.status(201).json({ imported: created.length, errors });
}

module.exports = { list, create, update, deactivate, remove, exportCSV, importCSV };
