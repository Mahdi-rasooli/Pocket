'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CategoryBreakdownItem } from '@/lib/types';
import { CATEGORY_COLORS, formatCategory, formatCurrency } from '@/lib/format';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function CategoryDonut({ data }: { data: CategoryBreakdownItem[] }) {
  const hasData = data.length > 0;

  return (
    <motion.div variants={cardVariants} className="card">
      <p className="text-sm text-gray-400 mb-4">Spending by category</p>
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
              contentStyle={{ background: '#161a21', border: '1px solid #232833', borderRadius: 8, fontSize: 13 }}
            />
            <Legend
              formatter={(value: string) => <span className="text-gray-400 text-xs">{formatCategory(value)}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[260px] flex items-center justify-center text-sm text-gray-500">
          No expenses logged this month yet
        </div>
      )}
    </motion.div>
  );
}
