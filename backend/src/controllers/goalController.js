const mongoose = require('mongoose');
const Goal = require('../models/Goal');
const statsService = require('../services/statsService');
const { computeProjections } = require('../services/projections');
const { buildSuggestions } = require('../services/suggestions');

const TRAILING_MONTHS = 6;
const TRAILING_CATEGORY_MONTHS = 3;

async function list(req, res) {
  const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(goals);
}

async function create(req, res) {
  const { name, targetAmount, targetDate } = req.body;
  if (!name || targetAmount == null) {
    return res.status(400).json({ error: 'name and targetAmount are required' });
  }
  const goal = await Goal.create({ userId: req.userId, name, targetAmount, targetDate: targetDate || null });
  res.status(201).json(goal);
}

async function update(req, res) {
  const { id } = req.params;
  const { name, targetAmount, targetDate } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (targetAmount != null) updates.targetAmount = targetAmount;
  if (targetDate !== undefined) updates.targetDate = targetDate;

  const goal = await Goal.findOneAndUpdate({ _id: id, userId: req.userId }, updates, { new: true });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  res.json(goal);
}

async function remove(req, res) {
  const { id } = req.params;
  const goal = await Goal.findOneAndDelete({ _id: id, userId: req.userId });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  res.status(204).send();
}

// Average trailing-3-month spend per discretionary category, used by category-cut suggestions.
async function trailingCategoryAverages(userId) {
  const now = new Date();
  const months = [];
  for (let i = 0; i < TRAILING_CATEGORY_MONTHS; i += 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 });
  }

  const totals = {};
  for (const { year, month } of months) {
    const breakdown = await statsService.categoryBreakdown(userId, year, month);
    breakdown.forEach(({ category, total }) => {
      totals[category] = (totals[category] || 0) + total;
    });
  }

  return Object.entries(totals).map(([category, total]) => ({
    category,
    avgMonthlySpend: total / TRAILING_CATEGORY_MONTHS,
  }));
}

async function projections(req, res) {
  const { id } = req.params;
  const goal = await Goal.findOne({ _id: id, userId: req.userId });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });

  const userId = new mongoose.Types.ObjectId(req.userId);
  const [monthlyData, categoryAverages] = await Promise.all([
    statsService.trend(userId, TRAILING_MONTHS),
    trailingCategoryAverages(userId),
  ]);

  const currentSaved = monthlyData.reduce((sum, m) => sum + m.netSavings, 0);
  const projectionResults = computeProjections({
    monthlyData,
    categoryAverages,
    targetAmount: goal.targetAmount,
    currentSaved: Math.max(currentSaved, 0),
  });

  const suggestions = buildSuggestions(goal.name, projectionResults);

  res.json({
    goal,
    currentSaved: Math.max(currentSaved, 0),
    ...projectionResults,
    suggestions,
  });
}

module.exports = { list, create, update, remove, projections };
