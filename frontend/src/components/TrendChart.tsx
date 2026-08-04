'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { MonthlySummary } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useCurrency } from '@/lib/currency-context';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function TrendChart({ data }: { data: MonthlySummary[] }) {
  const { t } = useI18n();
  const { format } = useCurrency();

  const chartConfig: ChartConfig = {
    income: { label: t('transactions.income'), color: 'hsl(var(--chart-1))' },
    expenses: { label: t('transactions.expenses'), color: 'hsl(var(--chart-2))' },
  };

  const chartData = data.map((m) => ({
    name: MONTHS[m.month - 1],
    income: m.totalIncome,
    expenses: m.totalExpenses,
  }));

  return (
    <motion.div variants={cardVariants}>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">{t('dashboard.trendTitle')}</p>
          <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => format(Number(value))} />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
