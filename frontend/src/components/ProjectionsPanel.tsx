'use client';

import { motion } from 'framer-motion';
import { TrendingUp, LineChart as LineChartIcon, GitBranch, Scissors } from 'lucide-react';
import type { GoalProjections } from '@/lib/types';
import { formatCategory } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useCurrency } from '@/lib/currency-context';

const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function ProjectionRow({ label, monthsRemaining, etaDate, monthlySavingsRate, notAvailable, monthUnit }: {
  label: string; monthsRemaining: number | null; etaDate: string | null; monthlySavingsRate: number;
  notAvailable: string; monthUnit: string;
}) {
  const { format } = useCurrency();
  return (
    <div className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{format(monthlySavingsRate)}/mo</p>
      </div>
      <p className="text-sm font-medium text-right">
        {monthsRemaining != null ? `${monthsRemaining} ${monthUnit}` : notAvailable}
        {etaDate && <span className="block text-xs text-muted-foreground">{etaDate}</span>}
      </p>
    </div>
  );
}

export default function ProjectionsPanel({ projections }: { projections: GoalProjections }) {
  const { t } = useI18n();
  const { format } = useCurrency();
  const { averageRate, weightedTrend, bestWorstCase, categoryCuts } = projections;
  const notAvailable = t('projections.notAvailable');
  const monthUnit = t('projections.month');

  return (
    <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-brand/15 text-brand p-1.5 rounded-lg"><TrendingUp size={16} /></div>
            <p className="text-sm text-muted-foreground">{t('projections.averageRate')}</p>
          </div>
          <ProjectionRow
            label={t('projections.averageRate')}
            monthsRemaining={averageRate.monthsRemaining}
            etaDate={averageRate.etaDate}
            monthlySavingsRate={averageRate.monthlySavingsRate}
            notAvailable={notAvailable}
            monthUnit={monthUnit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-sky-500/15 text-sky-400 p-1.5 rounded-lg"><LineChartIcon size={16} /></div>
            <p className="text-sm text-muted-foreground">{t('projections.weightedTrend')}</p>
          </div>
          <ProjectionRow
            label={t('projections.weightedTrend')}
            monthsRemaining={weightedTrend.monthsRemaining}
            etaDate={weightedTrend.etaDate}
            monthlySavingsRate={weightedTrend.monthlySavingsRate}
            notAvailable={notAvailable}
            monthUnit={monthUnit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-purple-500/15 text-purple-400 p-1.5 rounded-lg"><GitBranch size={16} /></div>
            <p className="text-sm text-muted-foreground">{bestWorstCase.label}</p>
          </div>
          <ProjectionRow
            label={t('projections.optimistic')}
            monthsRemaining={bestWorstCase.optimistic.monthsRemaining}
            etaDate={bestWorstCase.optimistic.etaDate}
            monthlySavingsRate={bestWorstCase.optimistic.monthlySavingsRate}
            notAvailable={notAvailable}
            monthUnit={monthUnit}
          />
          <ProjectionRow
            label={t('projections.pessimistic')}
            monthsRemaining={bestWorstCase.pessimistic.monthsRemaining}
            etaDate={bestWorstCase.pessimistic.etaDate}
            monthlySavingsRate={bestWorstCase.pessimistic.monthlySavingsRate}
            notAvailable={notAvailable}
            monthUnit={monthUnit}
          />
          <p className="text-xs text-muted-foreground mt-2">± {format(bestWorstCase.monthlySavingsStdDev)}/mo {t('projections.variance')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-500/15 text-amber-400 p-1.5 rounded-lg"><Scissors size={16} /></div>
            <p className="text-sm text-muted-foreground">{t('projections.categoryCuts')}</p>
          </div>
          {categoryCuts.length > 0 ? categoryCuts.map((c) => (
            <div key={c.category} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
              <div>
                <p className="text-sm">{formatCategory(c.category, t)}</p>
                <p className="text-xs text-muted-foreground">{t('projections.cut')} {c.cutPercent}% · {t('projections.avg')} {format(c.avgMonthlySpend)}/mo</p>
              </div>
              <p className="text-sm font-medium text-right">
                {c.newMonthsRemaining} {monthUnit}
                {c.monthsSaved != null && <span className="block text-xs text-brand">-{c.monthsSaved} {monthUnit}</span>}
              </p>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">{t('projections.noDiscretionary')}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
