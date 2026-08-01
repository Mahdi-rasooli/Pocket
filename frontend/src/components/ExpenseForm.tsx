'use client';

import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import type { ExpenseCategory } from '@/lib/types';

const CATEGORIES: ExpenseCategory[] = [
  'housing', 'food', 'dining', 'transport', 'entertainment', 'shopping', 'health', 'utilities', 'other',
];

interface Props {
  onSubmit: (data: { amount: number; category: ExpenseCategory; date: string; note: string }) => Promise<void>;
}

export default function ExpenseForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ amount: Number(amount), category, date, note });
      setAmount('');
      setNote('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
      <div className="col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Amount</label>
        <input
          type="number" min="0" step="0.01" required value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div className="col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Category</label>
        <select
          value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Date</label>
        <input
          type="date" required value={date} onChange={(e) => setDate(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div className="col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Note</label>
        <input
          value={note} onChange={(e) => setNote(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit" disabled={submitting}
        className="flex items-center justify-center gap-1 bg-accent hover:bg-accent-dark transition-colors text-black font-medium rounded-lg py-2 text-sm disabled:opacity-60"
      >
        <Plus size={16} /> Add
      </button>
    </form>
  );
}
