'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { CategoryBreakdownItem } from '@/lib/types';
import { CATEGORY_COLORS, formatCategory } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useCurrency } from '@/lib/currency-context';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function CategoryDonut({ data }: { data: CategoryBreakdownItem[] }) {
  const { t } = useI18n();
  const { format } = useCurrency();
  const hasData = data.length > 0;

  const chartConfig: ChartConfig = data.reduce((acc, entry) => {
    acc[entry.category] = {
      label: formatCategory(entry.category, t),
      color: CATEGORY_COLORS[entry.category] || '#64748b',
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <motion.div variants={cardVariants}>
      <Card>
        <CardContent className="pt-6">
          <p className="font-heading text-sm font-medium text-muted-foreground mb-4">{t('dashboard.categoryTitle')}</p>
          {hasData ? (
            <ChartContainer config={chartConfig} className="mx-auto aspect-auto h-[260px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => format(Number(value))} nameKey="category" />} />
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  cornerRadius={4}
                >
                  {data.map((entry) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || '#64748b'} stroke="none" />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="category" />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[260px] flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <PieChartIcon size={28} className="opacity-40" />
              {t('dashboard.noExpenses')}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
