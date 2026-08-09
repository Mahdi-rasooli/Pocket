'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import type { IncomeEntry, ExpenseEntry, RecurrenceType, ExpenseCategory } from '@/lib/types';
import { formatCategory } from '@/lib/format';
import IncomeForm from '@/components/IncomeForm';
import ExpenseForm from '@/components/ExpenseForm';
import RaiseForm from '@/components/RaiseForm';
import CsvActions from '@/components/CsvActions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useCurrency } from '@/lib/currency-context';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function formatDate(d: string) {
  return new Date(d).toISOString().slice(0, 10);
}

export default function TransactionsPage() {
  const { t } = useI18n();
  const { format, toUSD, toDisplay } = useCurrency();
  const [income, setIncome] = useState<IncomeEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [raiseTargetId, setRaiseTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadIncome() {
    setIncome(await apiFetch<IncomeEntry[]>('/api/income'));
  }
  async function loadExpenses() {
    setExpenses(await apiFetch<ExpenseEntry[]>('/api/expenses'));
  }

  useEffect(() => {
    Promise.all([loadIncome(), loadExpenses()]).finally(() => setLoading(false));
  }, []);

  async function addIncome(data: { amount: number; source: string; type: RecurrenceType; startDate: string; note: string }) {
    await apiFetch('/api/income', { method: 'POST', body: JSON.stringify({ ...data, amount: toUSD(data.amount) }) });
    await loadIncome();
  }

  async function addExpense(data: { amount: number; category: ExpenseCategory; date: string; type: RecurrenceType; note: string }) {
    await apiFetch('/api/expenses', { method: 'POST', body: JSON.stringify({ ...data, amount: toUSD(data.amount) }) });
    await loadExpenses();
  }

  async function stopExpense(id: string) {
    await apiFetch(`/api/expenses/${id}/deactivate`, { method: 'PATCH', body: JSON.stringify({}) });
    await loadExpenses();
  }

  async function deleteIncome(id: string) {
    await apiFetch(`/api/income/${id}`, { method: 'DELETE' });
    await loadIncome();
  }

  async function deleteExpense(id: string) {
    await apiFetch(`/api/expenses/${id}`, { method: 'DELETE' });
    await loadExpenses();
  }

  async function submitRaise(id: string, data: { amount: number; effectiveDate: string; note: string }) {
    await apiFetch(`/api/income/${id}/replace`, { method: 'PUT', body: JSON.stringify({ ...data, amount: toUSD(data.amount) }) });
    setRaiseTargetId(null);
    await loadIncome();
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">{t('transactions.loading')}</div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">{t('transactions.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('transactions.subtitle')}</p>
      </div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-brand/15 text-brand p-1.5 rounded-lg"><TrendingUp size={16} /></div>
                <p className="font-heading font-medium">{t('transactions.income')}</p>
              </div>
              <CsvActions exportUrl="/api/income/export" importUrl="/api/income/import" filename="pocket-income.csv" onImported={loadIncome} />
            </div>
            <IncomeForm onSubmit={addIncome} />
            <div className="mt-5 space-y-2">
              {income.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-surface-border rounded-xl">
                  {t('transactions.noIncome')}
                </p>
              )}
              {income.map((entry) => (
                <div key={entry._id} className="border-b border-surface-border last:border-0 py-2 px-2 -mx-2 rounded-lg transition-colors hover:bg-surface-card/60">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{format(entry.amount)}</span>
                        <span className="text-muted-foreground"> · {entry.source} · {entry.type === 'recurring' ? t('form.recurring') : t('form.oneTime')}</span>
                        {!entry.isActive && <span className="text-muted-foreground"> · {t('transactions.inactive')}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(entry.startDate)}{entry.endDate ? ` → ${formatDate(entry.endDate)}` : ''}
                        {entry.note && ` · ${entry.note}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {entry.type === 'recurring' && entry.isActive && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-brand"
                          onClick={() => setRaiseTargetId(raiseTargetId === entry._id ? null : entry._id)}
                        >
                          {t('transactions.logARaise')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-auto w-auto p-0 text-muted-foreground hover:text-red-400 hover:bg-transparent"
                        onClick={() => deleteIncome(entry._id)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                  {raiseTargetId === entry._id && (
                    <RaiseForm
                      currentAmount={toDisplay(entry.amount)}
                      onCancel={() => setRaiseTargetId(null)}
                      onSubmit={(data) => submitRaise(entry._id, data)}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-red-500/15 text-red-400 p-1.5 rounded-lg"><TrendingDown size={16} /></div>
                <p className="font-heading font-medium">{t('transactions.expenses')}</p>
              </div>
              <CsvActions exportUrl="/api/expenses/export" importUrl="/api/expenses/import" filename="pocket-expenses.csv" onImported={loadExpenses} />
            </div>
            <ExpenseForm onSubmit={addExpense} />
            <div className="mt-5 space-y-2">
              {expenses.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-surface-border rounded-xl">
                  {t('transactions.noExpenses')}
                </p>
              )}
              {expenses.map((entry) => (
                <div key={entry._id} className="flex items-center justify-between gap-3 border-b border-surface-border last:border-0 py-2 px-2 -mx-2 rounded-lg transition-colors hover:bg-surface-card/60">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{format(entry.amount)}</span>
                      <span className="text-muted-foreground"> · {formatCategory(entry.category, t)}</span>
                      {entry.type === 'recurring' && (
                        <span className="text-muted-foreground"> · {t('form.recurring')}</span>
                      )}
                      {!entry.isActive && <span className="text-muted-foreground"> · {t('transactions.inactive')}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.date)}{entry.endDate ? ` → ${formatDate(entry.endDate)}` : ''}
                      {entry.note && ` · ${entry.note}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {entry.type === 'recurring' && entry.isActive && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs text-brand"
                        onClick={() => stopExpense(entry._id)}
                      >
                        {t('transactions.stopRecurring')}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-auto w-auto p-0 text-muted-foreground hover:text-red-400 hover:bg-transparent"
                      onClick={() => deleteExpense(entry._id)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
