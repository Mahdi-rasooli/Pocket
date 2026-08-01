'use client';

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import type { Goal } from '@/lib/types';
import { formatCurrency } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/i18n-context';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

interface Props {
  goal: Goal;
  currentSaved: number;
  onClick?: () => void;
  active?: boolean;
}

export default function GoalProgressCard({ goal, currentSaved, onClick, active }: Props) {
  const { t } = useI18n();
  const pct = goal.targetAmount > 0 ? Math.min((currentSaved / goal.targetAmount) * 100, 100) : 0;

  return (
    <motion.div variants={cardVariants}>
      <Card
        onClick={onClick}
        className={cn(onClick && 'cursor-pointer transition-colors', active && 'border-brand')}
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-brand/15 text-brand p-1.5 rounded-lg">
                <Target size={16} />
              </div>
              <p className="font-medium">{goal.name}</p>
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(pct)}%</p>
          </div>
          <div className="h-2 rounded-full bg-surface-border overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-brand rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(currentSaved)} {t('goals.of')} {formatCurrency(goal.targetAmount)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
