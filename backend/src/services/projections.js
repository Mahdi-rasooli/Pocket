const DISCRETIONARY_CATEGORIES = ['dining', 'entertainment', 'shopping'];
const MIN_MONTHLY_RATE = 1; // floor to avoid divide-by-zero / negative ETAs

function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function stddev(nums) {
  if (nums.length < 2) return 0;
  const avg = average(nums);
  return Math.sqrt(average(nums.map((n) => (n - avg) ** 2)));
}

function monthsToDate(monthsFromNow, referenceDate = new Date()) {
  if (monthsFromNow == null || !Number.isFinite(monthsFromNow)) return null;
  const d = new Date(Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() + Math.ceil(monthsFromNow), 1));
  return d.toISOString().slice(0, 10);
}

// monthlyData: array of {year, month, totalIncome, totalExpenses, netSavings}, oldest first.

function averageRateProjection(monthlyData, targetAmount, currentSaved) {
  const rates = monthlyData.map((m) => m.netSavings);
  const avgRate = average(rates);
  const remaining = Math.max(targetAmount - currentSaved, 0);
  const effectiveRate = avgRate > 0 ? avgRate : null;
  const monthsRemaining = effectiveRate ? remaining / effectiveRate : null;

  return {
    label: 'Average savings rate',
    monthlySavingsRate: Math.round(avgRate * 100) / 100,
    monthsRemaining: monthsRemaining != null ? Math.round(monthsRemaining * 10) / 10 : null,
    etaDate: monthsToDate(monthsRemaining),
  };
}

function weightedTrendRate(monthlyData) {
  const n = monthlyData.length;
  if (n === 0) return 0;
  const weights = monthlyData.map((_, i) => {
    const distanceFromEnd = n - 1 - i; // 0 = most recent month
    if (distanceFromEnd === 0) return 3;
    if (distanceFromEnd === 1) return 2;
    if (distanceFromEnd === 2) return 1.5;
    return 1;
  });
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const weightedSum = monthlyData.reduce((sum, m, i) => sum + m.netSavings * weights[i], 0);
  return weightedSum / weightSum;
}

function weightedTrendProjection(monthlyData, targetAmount, currentSaved) {
  const rate = weightedTrendRate(monthlyData);
  const remaining = Math.max(targetAmount - currentSaved, 0);
  const monthsRemaining = rate > 0 ? remaining / rate : null;

  return {
    label: 'Weighted recent-trend projection',
    monthlySavingsRate: Math.round(rate * 100) / 100,
    monthsRemaining: monthsRemaining != null ? Math.round(monthsRemaining * 10) / 10 : null,
    etaDate: monthsToDate(monthsRemaining),
  };
}

function bestWorstCaseRange(monthlyData, targetAmount, currentSaved) {
  const rates = monthlyData.map((m) => m.netSavings);
  const avgRate = average(rates);
  const sd = stddev(rates);
  const remaining = Math.max(targetAmount - currentSaved, 0);

  const optimisticRate = avgRate + sd;
  const pessimisticRate = Math.max(avgRate - sd, MIN_MONTHLY_RATE);

  const optimisticMonths = optimisticRate > 0 ? remaining / optimisticRate : null;
  const pessimisticMonths = pessimisticRate > 0 ? remaining / pessimisticRate : null;

  return {
    label: 'Best/worst-case range',
    monthlySavingsStdDev: Math.round(sd * 100) / 100,
    optimistic: {
      monthlySavingsRate: Math.round(optimisticRate * 100) / 100,
      monthsRemaining: optimisticMonths != null ? Math.round(optimisticMonths * 10) / 10 : null,
      etaDate: monthsToDate(optimisticMonths),
    },
    pessimistic: {
      monthlySavingsRate: Math.round(pessimisticRate * 100) / 100,
      monthsRemaining: pessimisticMonths != null ? Math.round(pessimisticMonths * 10) / 10 : null,
      etaDate: monthsToDate(pessimisticMonths),
    },
  };
}

// categoryAverages: array of {category, avgMonthlySpend} over trailing 3 months.
function categoryCutSuggestions(monthlyData, categoryAverages, targetAmount, currentSaved) {
  const baseRate = average(monthlyData.map((m) => m.netSavings));
  const remaining = Math.max(targetAmount - currentSaved, 0);
  const cutPercent = 0.15;

  const candidates = categoryAverages
    .filter((c) => DISCRETIONARY_CATEGORIES.includes(c.category) && c.avgMonthlySpend > 0)
    .sort((a, b) => b.avgMonthlySpend - a.avgMonthlySpend)
    .slice(0, 3);

  return candidates.map((c) => {
    const monthlySavingsIncrease = c.avgMonthlySpend * cutPercent;
    const newRate = Math.max(baseRate + monthlySavingsIncrease, MIN_MONTHLY_RATE);
    const newMonthsRemaining = remaining / newRate;
    const baselineMonths = baseRate > 0 ? remaining / baseRate : null;

    return {
      category: c.category,
      avgMonthlySpend: Math.round(c.avgMonthlySpend * 100) / 100,
      cutPercent: Math.round(cutPercent * 100),
      monthlySavingsIncrease: Math.round(monthlySavingsIncrease * 100) / 100,
      newMonthsRemaining: Math.round(newMonthsRemaining * 10) / 10,
      monthsSaved: baselineMonths != null ? Math.round((baselineMonths - newMonthsRemaining) * 10) / 10 : null,
    };
  });
}

function computeProjections({ monthlyData, categoryAverages, targetAmount, currentSaved }) {
  return {
    averageRate: averageRateProjection(monthlyData, targetAmount, currentSaved),
    weightedTrend: weightedTrendProjection(monthlyData, targetAmount, currentSaved),
    bestWorstCase: bestWorstCaseRange(monthlyData, targetAmount, currentSaved),
    categoryCuts: categoryCutSuggestions(monthlyData, categoryAverages, targetAmount, currentSaved),
  };
}

module.exports = {
  DISCRETIONARY_CATEGORIES,
  average,
  stddev,
  averageRateProjection,
  weightedTrendProjection,
  bestWorstCaseRange,
  categoryCutSuggestions,
  computeProjections,
};
