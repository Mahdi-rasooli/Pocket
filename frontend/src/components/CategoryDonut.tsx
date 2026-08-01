'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CategoryBreakdownItem } from '@/lib/types';
import { CATEGORY_COLORS, formatCategory, formatCurrency } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function CategoryDonut({ data }: { data: CategoryBreakdownItem[] }) {
  const hasData = data.length > 0;

  return (
    <motion.div variants={cardVariants}>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">Spending by category</p>
          {hasData ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.map((entry) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [formatCurrency(value), formatCategory(name)]}
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Legend
                  formatter={(value: string) => <span className="text-muted-foreground text-xs">{formatCategory(value)}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
              No expenses logged this month yet
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
