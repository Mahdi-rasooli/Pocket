'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import CountUp from './CountUp';

interface Props {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: 'accent' | 'red' | 'blue';
}

const toneClasses: Record<string, string> = {
  accent: 'bg-accent/15 text-accent',
  red: 'bg-red-500/15 text-red-400',
  blue: 'bg-sky-500/15 text-sky-400',
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function StatCard({ label, value, icon: Icon, tone = 'accent' }: Props) {
  return (
    <motion.div variants={cardVariants} className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">{label}</p>
        <div className={`p-2 rounded-lg ${toneClasses[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight">
        <CountUp value={value} />
      </p>
    </motion.div>
  );
}
