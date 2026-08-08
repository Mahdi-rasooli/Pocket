const mongoose = require('mongoose');
const Goal = require('../models/Goal');
const User = require('../models/User');
const statsService = require('../services/statsService');
const { computeProjections } = require('../services/projections');
const { buildSuggestions } = require('../services/suggestions');

const TRAILING_MONTHS = 6;
const TRAILING_CATEGORY_MONTHS = 3;
const COLLABORATOR_FIELDS = 'name email';

// Goals the user owns, plus goals shared with them as a collaborator.
async function list(req, res) {
  const goals = await Goal.find({ $or: [{ userId: req.userId }, { collaborators: req.userId }] })
    .sort({ createdAt: -1 })
    .populate('userId', COLLABORATOR_FIELDS)
    .populate('collaborators', COLLABORATOR_FIELDS);
  res.json(goals);
}

// Body shape/types already validated by validateBody(goalSchemas.create).
async function create(req, res) {
  const { name, targetAmount, targetDate } = req.body;
  const goal = await Goal.create({ userId: req.userId, name, targetAmount, targetDate: targetDate || null });
  await goal.populate('userId', COLLABORATOR_FIELDS);
  res.status(201).json(goal);
}

async function update(req, res) {
  const { id } = req.params;
  const { name, targetAmount, targetDate } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (targetAmount != null) updates.targetAmount = targetAmount;
  if (targetDate !== undefined) updates.targetDate = targetDate;

  const goal = await Goal.findOneAndUpdate({ _id: id, userId: req.userId }, updates, { new: true })
    .populate('userId', COLLABORATOR_FIELDS)
    .populate('collaborators', COLLABORATOR_FIELDS);
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  res.json(goal);
}

async function remove(req, res) {
  const { id } = req.params;
  const goal = await Goal.findOneAndDelete({ _id: id, userId: req.userId });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  res.status(204).send();
}

// Average trailing-3-month spend per discretionary category, used by category-cut
// suggestions. The 3 months are independent, so fetched concurrently.
async function trailingCategoryAverages(userId) {
  const now = new Date();
  const months = Array.from({ length: TRAILING_CATEGORY_MONTHS }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
  });

  const breakdowns = await Promise.all(
    months.map(({ year, month }) => statsService.categoryBreakdown(userId, year, month))
  );

  const totals = {};
  breakdowns.flat().forEach(({ category, total }) => {
    totals[category] = (totals[category] || 0) + total;
  });

  return Object.entries(totals).map(([category, total]) => ({
    category,
    avgMonthlySpend: total / TRAILING_CATEGORY_MONTHS,
  }));
}

async function projections(req, res) {
  const { id } = req.params;
  const goal = await Goal.findOne({ _id: id, $or: [{ userId: req.userId }, { collaborators: req.userId }] })
    .populate('userId', COLLABORATOR_FIELDS)
    .populate('collaborators', COLLABORATOR_FIELDS);
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

// Only the goal's owner can invite/remove collaborators. Invitees must already have
// a Pocket account (no email invite flow) — looked up by email.
// email already validated by validateBody(goalSchemas.inviteCollaborator).
async function addCollaborator(req, res) {
  const { id } = req.params;
  const { email } = req.body;

  const goal = await Goal.findOne({ _id: id, userId: req.userId });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });

  const invitee = await User.findOne({ email: email.toLowerCase() });
  if (!invitee) return res.status(404).json({ error: 'No Pocket account with that email' });
  if (invitee._id.toString() === req.userId.toString()) {
    return res.status(400).json({ error: "You can't invite yourself" });
  }
  if (goal.collaborators.some((c) => c.toString() === invitee._id.toString())) {
    return res.status(409).json({ error: 'Already a collaborator' });
  }

  goal.collaborators.push(invitee._id);
  await goal.save();
  await goal.populate('userId', COLLABORATOR_FIELDS);
  await goal.populate('collaborators', COLLABORATOR_FIELDS);
  res.status(201).json(goal);
}

async function removeCollaborator(req, res) {
  const { id, userId: collaboratorId } = req.params;
  const goal = await Goal.findOneAndUpdate(
    { _id: id, userId: req.userId },
    { $pull: { collaborators: collaboratorId } },
    { new: true }
  ).populate('userId', COLLABORATOR_FIELDS).populate('collaborators', COLLABORATOR_FIELDS);
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  res.json(goal);
}

module.exports = { list, create, update, remove, projections, addCollaborator, removeCollaborator };
