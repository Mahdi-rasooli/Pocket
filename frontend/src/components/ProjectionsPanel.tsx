'use client';

import { motion } from 'framer-motion';
import { TrendingUp, LineChart as LineChartIcon, GitBranch, Scissors } from 'lucide-react';
import type { GoalProjections } from '@/lib/types';
import { formatCurrency, formatCategory } from '@/lib/format';

const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function ProjectionRow({ label, monthsRemaining, etaDate, monthlySavingsRate }: {
  label: string; monthsRemaining: number | null; etaDate: string | null; monthlySavingsRate: number;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-gray-500">{formatCurrency(monthlySavingsRate)}/mo</p>
      </div>
      <p className="text-sm font-medium text-right">
        {monthsRemaining != null ? `${monthsRemaining} mo` : 'N/A'}
        {etaDate && <span className="block text-xs text-gray-500">{etaDate}</span>}
      </p>
    </div>
  );
}

export default function ProjectionsPanel({ projections }: { projections: GoalProjections }) {
  const { averageRate, weightedTrend, bestWorstCase, categoryCuts } = projections;

  return (
    <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-accent/15 text-accent p-1.5 rounded-lg"><TrendingUp size={16} /></div>
          <p className="text-sm text-gray-400">Average savings rate</p>
        </div>
        <ProjectionRow {...averageRate} />
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-sky-500/15 text-sky-400 p-1.5 rounded-lg"><LineChartIcon size={16} /></div>
          <p className="text-sm text-gray-400">Weighted recent-trend</p>
        </div>
        <ProjectionRow {...weightedTrend} />
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-purple-500/15 text-purple-400 p-1.5 rounded-lg"><GitBranch size={16} /></div>
          <p className="text-sm text-gray-400">{bestWorstCase.label}</p>
        </div>
        <ProjectionRow label="Optimistic" {...bestWorstCase.optimistic} />
        <ProjectionRow label="Pessimistic" {...bestWorstCase.pessimistic} />
        <p className="text-xs text-gray-500 mt-2">± {formatCurrency(bestWorstCase.monthlySavingsStdDev)}/mo variance</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-amber-500/15 text-amber-400 p-1.5 rounded-lg"><Scissors size={16} /></div>
          <p className="text-sm text-gray-400">Category-cut suggestions</p>
        </div>
        {categoryCuts.length > 0 ? categoryCuts.map((c) => (
          <div key={c.category} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
            <div>
              <p className="text-sm">{formatCategory(c.category)}</p>
              <p className="text-xs text-gray-500">cut {c.cutPercent}% · avg {formatCurrency(c.avgMonthlySpend)}/mo</p>
            </div>
            <p className="text-sm font-medium text-right">
              {c.newMonthsRemaining} mo
              {c.monthsSaved != null && <span className="block text-xs text-accent">-{c.monthsSaved} mo</span>}
            </p>
          </div>
        )) : (
          <p className="text-sm text-gray-500">No discretionary spending detected yet.</p>
        )}
      </div>
    </motion.div>
  );
}
