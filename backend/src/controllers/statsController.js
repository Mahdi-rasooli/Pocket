const mongoose = require('mongoose');
const statsService = require('../services/statsService');

function toUserId(req) {
  return new mongoose.Types.ObjectId(req.userId);
}

function parseYearMonth(query, fallback = new Date()) {
  const year = Number(query.year) || fallback.getUTCFullYear();
  const month = Number(query.month) || fallback.getUTCMonth() + 1;
  return { year, month };
}

async function daily(req, res) {
  const date = req.query.date ? new Date(req.query.date) : new Date();
  const summary = await statsService.dailySummary(toUserId(req), date);
  res.json(summary);
}

async function monthly(req, res) {
  const { year, month } = parseYearMonth(req.query);
  const summary = await statsService.monthlySummary(toUserId(req), year, month);
  res.json(summary);
}

async function categories(req, res) {
  const { year, month } = parseYearMonth(req.query);
  const breakdown = await statsService.categoryBreakdown(toUserId(req), year, month);
  res.json(breakdown);
}

async function trend(req, res) {
  const months = Number(req.query.months) || 6;
  const data = await statsService.trend(toUserId(req), months);
  res.json(data);
}

module.exports = { daily, monthly, categories, trend };
