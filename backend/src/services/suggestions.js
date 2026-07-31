function formatMonths(months) {
  if (months == null) return "at your current rate you won't reach this goal";
  if (months <= 0) return "you've already reached this goal";
  if (months < 1) return 'less than a month';
  const rounded = Math.round(months);
  return `${rounded} month${rounded === 1 ? '' : 's'}`;
}

function buildSuggestions(goalName, projections) {
  const lines = [];
  const { averageRate, weightedTrend, bestWorstCase, categoryCuts } = projections;

  if (averageRate.monthsRemaining != null) {
    lines.push(`At your current savings rate, you'll reach "${goalName}" in ${formatMonths(averageRate.monthsRemaining)}.`);
  } else {
    lines.push(`Based on your recent spending, you aren't currently saving enough to reach "${goalName}" — consider cutting expenses or increasing income.`);
  }

  if (weightedTrend.monthsRemaining != null && averageRate.monthsRemaining != null) {
    const diff = Math.round((averageRate.monthsRemaining - weightedTrend.monthsRemaining) * 10) / 10;
    if (diff > 0.5) {
      lines.push(`Your recent months have been stronger than your overall average — factoring that trend in, you could get there ${formatMonths(diff)} sooner, in ${formatMonths(weightedTrend.monthsRemaining)}.`);
    } else if (diff < -0.5) {
      lines.push(`Your recent months have slowed down compared to your overall average — at that pace it would take ${formatMonths(weightedTrend.monthsRemaining)}.`);
    }
  }

  if (bestWorstCase.optimistic.monthsRemaining != null && bestWorstCase.pessimistic.monthsRemaining != null) {
    lines.push(`Depending on how your income and spending vary month to month, expect a range of ${formatMonths(bestWorstCase.optimistic.monthsRemaining)} in a good stretch to ${formatMonths(bestWorstCase.pessimistic.monthsRemaining)} in a slower one.`);
  }

  if (categoryCuts.length > 0) {
    const top = categoryCuts[0];
    if (top.monthsSaved != null && top.monthsSaved > 0) {
      lines.push(`Cutting ${top.category} spending by ${top.cutPercent}% (about $${top.monthlySavingsIncrease}/month) gets you there ${formatMonths(top.monthsSaved)} faster, in ${formatMonths(top.newMonthsRemaining)}.`);
    }
    if (categoryCuts.length > 1) {
      const rest = categoryCuts.slice(1).map((c) => c.category).join(' and ');
      lines.push(`You could also trim ${rest} for additional savings.`);
    }
  }

  return lines;
}

module.exports = { buildSuggestions, formatMonths };
