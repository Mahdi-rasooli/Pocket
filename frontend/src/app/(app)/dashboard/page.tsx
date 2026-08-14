'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import type {
  Goal, GoalProjections, MonthlySummary, CategoryBreakdownItem, Budget, ExpenseCategory,
} from '@/lib/types';
import StatCard from '@/components/StatCard';
import PageLoader from '@/components/PageLoader';
import TrendChart from '@/components/TrendChart';
import CategoryDonut from '@/components/CategoryDonut';
import GoalProgressCard from '@/components/GoalProgressCard';
import SuggestionsPanel from '@/components/SuggestionsPanel';
import BudgetsPanel from '@/components/BudgetsPanel';
import { useI18n } from '@/lib/i18n/i18n-context';

interface DailySummary {
  date: string;
  totalIncome: number;
  totalExpenses: number;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function DashboardPage() {
  const { t } = useI18n();
  const [daily, setDaily] = useState<DailySummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlySummary | null>(null);
  const [trend, setTrend] = useState<MonthlySummary[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdownItem[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projections, setProjections] = useState<GoalProjections | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [dailyRes, monthlyRes, trendRes, categoriesRes, budgetsRes, goalsRes] = await Promise.all([
        apiFetch<DailySummary>('/api/stats/daily'),
        apiFetch<MonthlySummary>('/api/stats/monthly'),
        apiFetch<MonthlySummary[]>('/api/stats/trend?months=6'),
        apiFetch<CategoryBreakdownItem[]>('/api/stats/categories'),
        apiFetch<Budget[]>('/api/budgets'),
        apiFetch<Goal[]>('/api/goals'),
      ]);
      setDaily(dailyRes);
      setMonthly(monthlyRes);
      setTrend(trendRes);
      setCategories(categoriesRes);
      setBudgets(budgetsRes);
      setGoals(goalsRes);

      if (goalsRes.length > 0) {
        const proj = await apiFetch<GoalProjections>(`/api/goals/${goalsRes[0]._id}/projections`);
        setProjections(proj);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function saveBudget(category: ExpenseCategory, monthlyLimit: number) {
    const budget = await apiFetch<Budget>('/api/budgets', { method: 'POST', body: JSON.stringify({ category, monthlyLimit }) });
    setBudgets((prev) => [...prev.filter((b) => b.category !== category), budget]);
  }

  async function removeBudget(category: ExpenseCategory) {
    await apiFetch(`/api/budgets/${category}`, { method: 'DELETE' });
    setBudgets((prev) => prev.filter((b) => b.category !== category));
  }

  if (loading) {
    return <PageLoader label={t('dashboard.loading')} />;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">{t('dashboard.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label={t('dashboard.earnedToday')} value={daily?.totalIncome ?? 0} icon={TrendingUp} tone="brand" />
        <StatCard label={t('dashboard.spentToday')} value={daily?.totalExpenses ?? 0} icon={TrendingDown} tone="red" />
        <StatCard label={t('dashboard.netThisMonth')} value={monthly?.netSavings ?? 0} icon={Wallet} tone="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart data={trend} />
        <CategoryDonut data={categories} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BudgetsPanel budgets={budgets} spend={categories} onSave={saveBudget} onRemove={removeBudget} />
      </div>

      {goals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            {goals.map((g) => (
              <GoalProgressCard key={g._id} goal={g} currentSaved={projections?.goal._id === g._id ? projections.currentSaved : 0} />
            ))}
          </div>
          {projections && <SuggestionsPanel suggestions={projections.suggestions} />}
        </div>
      )}
    </motion.div>
  );
}
