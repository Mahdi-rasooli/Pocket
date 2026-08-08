const IncomeEntry = require('../models/IncomeEntry');
const { toCSV, parseCSV } = require('../utils/csv');

const CSV_COLUMNS = ['amount', 'source', 'type', 'startDate', 'endDate', 'note'];

async function list(req, res) {
  const entries = await IncomeEntry.find({ userId: req.userId }).sort({ startDate: -1 });
  res.json(entries);
}

// Body shape/types already validated by validateBody(incomeSchemas.create).
async function create(req, res) {
  const { amount, source, type, startDate, endDate, note } = req.body;

  const entry = await IncomeEntry.create({
    userId: req.userId,
    amount,
    source,
    type,
    startDate,
    endDate: endDate || null,
    note: note || '',
  });
  res.status(201).json(entry);
}

// Represents a raise/change to a recurring entry: deactivates the old entry
// as of the effective date and creates a new entry, preserving history.
async function replace(req, res) {
  const { id } = req.params;
  const { amount, source, effectiveDate, note } = req.body;

  const previous = await IncomeEntry.findOne({ _id: id, userId: req.userId });
  if (!previous) {
    return res.status(404).json({ error: 'Income entry not found' });
  }

  previous.endDate = effectiveDate;
  previous.isActive = false;
  await previous.save();

  const next = await IncomeEntry.create({
    userId: req.userId,
    amount,
    source: source || previous.source,
    type: previous.type,
    startDate: effectiveDate,
    endDate: null,
    isActive: true,
    note: note || '',
  });

  res.status(201).json({ previous, next });
}

async function deactivate(req, res) {
  const { id } = req.params;
  const entry = await IncomeEntry.findOneAndUpdate(
    { _id: id, userId: req.userId },
    { isActive: false, endDate: req.body.endDate || new Date() },
    { new: true }
  );
  if (!entry) {
    return res.status(404).json({ error: 'Income entry not found' });
  }
  res.json(entry);
}

async function remove(req, res) {
  const { id } = req.params;
  const entry = await IncomeEntry.findOneAndDelete({ _id: id, userId: req.userId });
  if (!entry) {
    return res.status(404).json({ error: 'Income entry not found' });
  }
  res.status(204).send();
}

async function exportCSV(req, res) {
  const entries = await IncomeEntry.find({ userId: req.userId }).sort({ startDate: -1 }).lean();
  const rows = entries.map((e) => ({
    ...e,
    startDate: e.startDate.toISOString().slice(0, 10),
    endDate: e.endDate ? e.endDate.toISOString().slice(0, 10) : '',
  }));
  res.header('Content-Type', 'text/csv');
  res.header('Content-Disposition', 'attachment; filename="pocket-income.csv"');
  res.send(toCSV(rows, CSV_COLUMNS));
}

// Bulk-creates income entries from CSV text (same columns as exportCSV). Rows
// missing a required field are skipped and reported back, not aborting the batch.
async function importCSV(req, res) {
  const { csv } = req.body;

  const rows = parseCSV(csv);
  const toInsert = [];
  const errors = [];

  rows.forEach((row, i) => {
    const { amount, source, type, startDate, endDate, note } = row;
    if (!amount || !source || !type || !startDate) {
      errors.push({ row: i + 2, error: 'missing amount, source, type, or startDate' });
      return;
    }
    if (!['recurring', 'one-time'].includes(type)) {
      errors.push({ row: i + 2, error: 'type must be "recurring" or "one-time"' });
      return;
    }
    toInsert.push({
      userId: req.userId,
      amount: Number(amount),
      source,
      type,
      startDate,
      endDate: endDate || null,
      note: note || '',
    });
  });

  const created = toInsert.length ? await IncomeEntry.insertMany(toInsert) : [];
  res.status(201).json({ imported: created.length, errors });
}

module.exports = { list, create, replace, deactivate, remove, exportCSV, importCSV };
