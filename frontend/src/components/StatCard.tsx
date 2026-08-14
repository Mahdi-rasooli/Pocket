'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import CountUp from './CountUp';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

const toneHoverClasses: Record<string, string> = {
  brand: 'hover:border-brand/30',
  red: 'hover:border-red-500/30',
  blue: 'hover:border-sky-500/30',
};

const toneBarClasses: Record<string, string> = {
  brand: 'from-brand-light to-brand',
  red: 'from-red-400 to-red-500',
  blue: 'from-sky-400 to-sky-500',
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function StatCard({ label, value, icon: Icon, tone = 'brand' }: Props) {
  return (
    <motion.div variants={cardVariants} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <Card className={cn('relative overflow-hidden hover:shadow-xl hover:shadow-black/10', toneHoverClasses[tone])}>
        <span className={cn('absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r', toneBarClasses[tone])} />
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <div className={`p-2 rounded-lg ${toneClasses[tone]}`}>
              <Icon size={18} />
            </div>
          </div>
          <p className="font-heading text-2xl md:text-3xl font-semibold tracking-tight">
            <CountUp value={value} />
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
