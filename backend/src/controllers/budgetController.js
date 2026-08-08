const Budget = require('../models/Budget');

async function list(req, res) {
  const budgets = await Budget.find({ userId: req.userId }).sort({ category: 1 });
  res.json(budgets);
}

// Set or update the limit for a category (one budget per category per user).
// Body shape/types already validated by validateBody(budgetSchemas.upsert).
async function upsert(req, res) {
  const { category, monthlyLimit } = req.body;

  const budget = await Budget.findOneAndUpdate(
    { userId: req.userId, category },
    { monthlyLimit },
    { new: true, upsert: true }
  );
  res.status(200).json(budget);
}

async function remove(req, res) {
  const { category } = req.params;
  const budget = await Budget.findOneAndDelete({ userId: req.userId, category });
  if (!budget) {
    return res.status(404).json({ error: 'Budget not found' });
  }
  res.status(204).send();
}

module.exports = { list, upsert, remove };
