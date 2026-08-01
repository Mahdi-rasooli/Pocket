'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import CountUp from './CountUp';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: 'brand' | 'red' | 'blue';
}

const toneClasses: Record<string, string> = {
  brand: 'bg-brand/15 text-brand',
  red: 'bg-red-500/15 text-red-400',
  blue: 'bg-sky-500/15 text-sky-400',
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function StatCard({ label, value, icon: Icon, tone = 'brand' }: Props) {
  return (
    <motion.div variants={cardVariants}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className={`p-2 rounded-lg ${toneClasses[tone]}`}>
              <Icon size={18} />
            </div>
          </div>
          <p className="text-2xl font-semibold tracking-tight">
            <CountUp value={value} />
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
