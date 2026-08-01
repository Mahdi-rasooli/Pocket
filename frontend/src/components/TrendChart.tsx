'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { MonthlySummary } from '@/lib/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function TrendChart({ data }: { data: MonthlySummary[] }) {
  const chartData = data.map((m) => ({
    name: MONTHS[m.month - 1],
    Income: m.totalIncome,
    Expenses: m.totalExpenses,
  }));

  return (
    <motion.div variants={cardVariants} className="card">
      <p className="text-sm text-gray-400 mb-4">Income vs. expenses</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232833" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{ background: '#161a21', border: '1px solid #232833', borderRadius: 8, fontSize: 13 }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Expenses" stroke="#f87171" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
