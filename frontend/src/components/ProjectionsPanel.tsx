'use client';

import { motion } from 'framer-motion';
import { TrendingUp, LineChart as LineChartIcon, GitBranch, Scissors } from 'lucide-react';
import type { GoalProjections } from '@/lib/types';
import { formatCurrency, formatCategory } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';

const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function ProjectionRow({ label, monthsRemaining, etaDate, monthlySavingsRate }: {
  label: string; monthsRemaining: number | null; etaDate: string | null; monthlySavingsRate: number;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{formatCurrency(monthlySavingsRate)}/mo</p>
      </div>
      <p className="text-sm font-medium text-right">
        {monthsRemaining != null ? `${monthsRemaining} mo` : 'N/A'}
        {etaDate && <span className="block text-xs text-muted-foreground">{etaDate}</span>}
      </p>
    </div>
  );
}

export default function ProjectionsPanel({ projections }: { projections: GoalProjections }) {
  const { averageRate, weightedTrend, bestWorstCase, categoryCuts } = projections;

  return (
    <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-brand/15 text-brand p-1.5 rounded-lg"><TrendingUp size={16} /></div>
            <p className="text-sm text-muted-foreground">Average savings rate</p>
          </div>
          <ProjectionRow {...averageRate} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-sky-500/15 text-sky-400 p-1.5 rounded-lg"><LineChartIcon size={16} /></div>
            <p className="text-sm text-muted-foreground">Weighted recent-trend</p>
          </div>
          <ProjectionRow {...weightedTrend} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-purple-500/15 text-purple-400 p-1.5 rounded-lg"><GitBranch size={16} /></div>
            <p className="text-sm text-muted-foreground">{bestWorstCase.label}</p>
          </div>
          <ProjectionRow label="Optimistic" {...bestWorstCase.optimistic} />
          <ProjectionRow label="Pessimistic" {...bestWorstCase.pessimistic} />
          <p className="text-xs text-muted-foreground mt-2">± {formatCurrency(bestWorstCase.monthlySavingsStdDev)}/mo variance</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-500/15 text-amber-400 p-1.5 rounded-lg"><Scissors size={16} /></div>
            <p className="text-sm text-muted-foreground">Category-cut suggestions</p>
          </div>
          {categoryCuts.length > 0 ? categoryCuts.map((c) => (
            <div key={c.category} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
              <div>
                <p className="text-sm">{formatCategory(c.category)}</p>
                <p className="text-xs text-muted-foreground">cut {c.cutPercent}% · avg {formatCurrency(c.avgMonthlySpend)}/mo</p>
              </div>
              <p className="text-sm font-medium text-right">
                {c.newMonthsRemaining} mo
                {c.monthsSaved != null && <span className="block text-xs text-brand">-{c.monthsSaved} mo</span>}
              </p>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">No discretionary spending detected yet.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
