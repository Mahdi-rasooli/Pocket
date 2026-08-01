'use client';

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import type { Goal } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

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
  const pct = goal.targetAmount > 0 ? Math.min((currentSaved / goal.targetAmount) * 100, 100) : 0;

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      className={`card ${onClick ? 'cursor-pointer transition-colors' : ''} ${active ? 'border-accent' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-accent/15 text-accent p-1.5 rounded-lg">
            <Target size={16} />
          </div>
          <p className="font-medium">{goal.name}</p>
        </div>
        <p className="text-xs text-gray-500">{Math.round(pct)}%</p>
      </div>
      <div className="h-2 rounded-full bg-surface-border overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-accent rounded-full"
        />
      </div>
      <p className="text-xs text-gray-400">
        {formatCurrency(currentSaved)} of {formatCurrency(goal.targetAmount)}
      </p>
    </motion.div>
  );
}
