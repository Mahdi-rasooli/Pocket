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
// Summed via aggregation rather than `.find()` + JS reduce — the DB only ever
// hands back a single number per bucket instead of full documents.
async function monthlyIncomeTotal(userId, year, month) {
  const { start, end } = monthRange(year, month);

  const [oneTime, recurring] = await Promise.all([
    IncomeEntry.aggregate([
      { $match: { userId, type: 'one-time', startDate: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    IncomeEntry.aggregate([
      {
        $match: {
          userId,
          type: 'recurring',
          startDate: { $lt: end },
          $or: [{ endDate: null }, { endDate: { $gte: start } }],
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  return (oneTime[0]?.total || 0) + (recurring[0]?.total || 0);
}

// Expense entries predating the recurring-expense feature have no `type` field —
// treat those as one-time so historical totals don't silently drop.
const ONE_TIME_OR_LEGACY = { $or: [{ type: 'one-time' }, { type: { $exists: false } }] };
const RECURRING_ACTIVE = (end, start) => ({
  type: 'recurring',
  date: { $lt: end },
  $or: [{ endDate: null }, { endDate: { $gte: start } }],
});

async function monthlyExpenseTotal(userId, year, month) {
  const { start, end } = monthRange(year, month);

  const [oneTime, recurring] = await Promise.all([
    ExpenseEntry.aggregate([
      { $match: { userId, ...ONE_TIME_OR_LEGACY, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    ExpenseEntry.aggregate([
      { $match: { userId, ...RECURRING_ACTIVE(end, start) } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  return (oneTime[0]?.total || 0) + (recurring[0]?.total || 0);
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

  const [oneTime, recurring] = await Promise.all([
    ExpenseEntry.aggregate([
      { $match: { userId, ...ONE_TIME_OR_LEGACY, date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]),
    ExpenseEntry.aggregate([
      { $match: { userId, ...RECURRING_ACTIVE(end, start) } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]),
  ]);

  const totals = new Map(oneTime.map((r) => [r._id, r.total]));
  for (const { _id: category, total } of recurring) {
    totals.set(category, (totals.get(category) || 0) + total);
  }

  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

// Trailing `months` months of {year, month, totalIncome, totalExpenses, netSavings}, oldest first.
// The months are independent of each other, so they're fetched concurrently
// instead of one at a time — a 6-month trend used to mean 6 sequential
// round-trip pairs; now they all fire together.
async function trend(userId, months = 6, referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  const targets = Array.from({ length: months }, (_, idx) => {
    const i = months - 1 - idx;
    const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - i, 1));
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
  });
  return Promise.all(targets.map(({ year, month }) => monthlySummary(userId, year, month)));
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
