'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import type { IncomeEntry, ExpenseEntry, IncomeType, ExpenseCategory } from '@/lib/types';
import { formatCurrency, formatCategory } from '@/lib/format';
import IncomeForm from '@/components/IncomeForm';
import ExpenseForm from '@/components/ExpenseForm';
import RaiseForm from '@/components/RaiseForm';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function formatDate(d: string) {
  return new Date(d).toISOString().slice(0, 10);
}

export default function TransactionsPage() {
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

  async function addIncome(data: { amount: number; source: string; type: IncomeType; startDate: string; note: string }) {
    await apiFetch('/api/income', { method: 'POST', body: JSON.stringify(data) });
    await loadIncome();
  }

  async function addExpense(data: { amount: number; category: ExpenseCategory; date: string; note: string }) {
    await apiFetch('/api/expenses', { method: 'POST', body: JSON.stringify(data) });
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
    await apiFetch(`/api/income/${id}/replace`, { method: 'PUT', body: JSON.stringify(data) });
    setRaiseTargetId(null);
    await loadIncome();
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading transactions…</div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-sm text-gray-400">Log income and expenses. Raises are recorded as new entries, preserving history.</p>
      </div>

      <motion.div variants={cardVariants} className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-accent/15 text-accent p-1.5 rounded-lg"><TrendingUp size={16} /></div>
          <p className="font-medium">Income</p>
        </div>
        <IncomeForm onSubmit={addIncome} />
        <div className="mt-5 space-y-2">
          {income.length === 0 && <p className="text-sm text-gray-500">No income logged yet.</p>}
          {income.map((entry) => (
            <div key={entry._id} className="border-b border-surface-border last:border-0 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{formatCurrency(entry.amount)}</span>
                    <span className="text-gray-400"> · {entry.source} · {entry.type}</span>
                    {!entry.isActive && <span className="text-gray-500"> · inactive</span>}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(entry.startDate)}{entry.endDate ? ` → ${formatDate(entry.endDate)}` : ''}
                    {entry.note && ` · ${entry.note}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {entry.type === 'recurring' && entry.isActive && (
                    <button
                      onClick={() => setRaiseTargetId(raiseTargetId === entry._id ? null : entry._id)}
                      className="text-xs text-accent hover:underline"
                    >
                      Log a raise
                    </button>
                  )}
                  <button onClick={() => deleteIncome(entry._id)} className="text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {raiseTargetId === entry._id && (
                <RaiseForm
                  currentAmount={entry.amount}
                  onCancel={() => setRaiseTargetId(null)}
                  onSubmit={(data) => submitRaise(entry._id, data)}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={cardVariants} className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-red-500/15 text-red-400 p-1.5 rounded-lg"><TrendingDown size={16} /></div>
          <p className="font-medium">Expenses</p>
        </div>
        <ExpenseForm onSubmit={addExpense} />
        <div className="mt-5 space-y-2">
          {expenses.length === 0 && <p className="text-sm text-gray-500">No expenses logged yet.</p>}
          {expenses.map((entry) => (
            <div key={entry._id} className="flex items-center justify-between gap-3 border-b border-surface-border last:border-0 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{formatCurrency(entry.amount)}</span>
                  <span className="text-gray-400"> · {formatCategory(entry.category)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(entry.date)}{entry.note && ` · ${entry.note}`}
                </p>
              </div>
              <button onClick={() => deleteExpense(entry._id)} className="text-gray-500 hover:text-red-400 transition-colors shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
