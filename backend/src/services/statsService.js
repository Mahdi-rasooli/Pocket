const IncomeEntry = require('../models/IncomeEntry');
const ExpenseEntry = require('../models/ExpenseEntry');

function monthRange(year, month) {
  // month is 1-12
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return { start, end };
}

function dayRange(date) {
  const d = new Date(date);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

// Recurring income counts toward a month if it was active (startDate <= monthEnd
// and endDate is null or endDate >= monthStart) at any point during that month.
async function monthlyIncomeTotal(userId, year, month) {
  const { start, end } = monthRange(year, month);

  const oneTime = await IncomeEntry.aggregate([
    { $match: { userId, type: 'one-time', startDate: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const recurring = await IncomeEntry.find({
    userId,
    type: 'recurring',
    startDate: { $lt: end },
    $or: [{ endDate: null }, { endDate: { $gte: start } }],
  });

  const recurringTotal = recurring.reduce((sum, e) => sum + e.amount, 0);
  const oneTimeTotal = oneTime[0]?.total || 0;

  return oneTimeTotal + recurringTotal;
}

async function monthlyExpenseTotal(userId, year, month) {
  const { start, end } = monthRange(year, month);
  const result = await ExpenseEntry.aggregate([
    { $match: { userId, date: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result[0]?.total || 0;
}

async function dailySummary(userId, date) {
  const { start, end } = dayRange(date);

  const [expenses, incomeEntries] = await Promise.all([
    ExpenseEntry.find({ userId, date: { $gte: start, $lt: end } }).sort({ date: -1 }),
    IncomeEntry.find({ userId, startDate: { $gte: start, $lt: end } }).sort({ startDate: -1 }),
  ]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomeEntries.reduce((sum, e) => sum + e.amount, 0);

  return { date: start.toISOString().slice(0, 10), totalIncome, totalExpenses, expenses, incomeEntries };
}

async function monthlySummary(userId, year, month) {
  const [totalIncome, totalExpenses] = await Promise.all([
    monthlyIncomeTotal(userId, year, month),
    monthlyExpenseTotal(userId, year, month),
  ]);
  return { year, month, totalIncome, totalExpenses, netSavings: totalIncome - totalExpenses };
}

async function categoryBreakdown(userId, year, month) {
  const { start, end } = monthRange(year, month);
  const result = await ExpenseEntry.aggregate([
    { $match: { userId, date: { $gte: start, $lt: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
  ]);
  return result.map((r) => ({ category: r._id, total: r.total }));
}

// Trailing `months` months of {year, month, totalIncome, totalExpenses, netSavings}, oldest first.
async function trend(userId, months = 6, referenceDate = new Date()) {
  const results = [];
  const ref = new Date(referenceDate);
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - i, 1));
    const summary = await monthlySummary(userId, d.getUTCFullYear(), d.getUTCMonth() + 1);
    results.push(summary);
  }
  return results;
}

module.exports = {
  monthRange,
  dayRange,
  monthlyIncomeTotal,
  monthlyExpenseTotal,
  dailySummary,
  monthlySummary,
  categoryBreakdown,
  trend,
};
