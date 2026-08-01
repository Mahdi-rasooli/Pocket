'use client';

import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import type { IncomeType } from '@/lib/types';

interface Props {
  onSubmit: (data: { amount: number; source: string; type: IncomeType; startDate: string; note: string }) => Promise<void>;
}

export default function IncomeForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [type, setType] = useState<IncomeType>('recurring');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ amount: Number(amount), source, type, startDate, note });
      setAmount('');
      setSource('');
      setNote('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end">
      <div className="col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Amount</label>
        <input
          type="number" min="0" step="0.01" required value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div className="col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Source</label>
        <input
          required value={source} onChange={(e) => setSource(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div className="col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Type</label>
        <select
          value={type} onChange={(e) => setType(e.target.value as IncomeType)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="recurring">Recurring</option>
          <option value="one-time">One-time</option>
        </select>
      </div>
      <div className="col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Start date</label>
        <input
          type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div className="col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Note</label>
        <input
          value={note} onChange={(e) => setNote(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <button
        type="submit" disabled={submitting}
        className="flex items-center justify-center gap-1 bg-brand hover:bg-brand-dark transition-colors text-black font-medium rounded-lg py-2 text-sm disabled:opacity-60"
      >
        <Plus size={16} /> Add
      </button>
    </form>
  );
}
