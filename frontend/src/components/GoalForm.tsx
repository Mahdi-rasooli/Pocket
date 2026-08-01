'use client';

import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onSubmit: (data: { name: string; targetAmount: number; targetDate: string | null }) => Promise<void>;
}

export default function GoalForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ name, targetAmount: Number(targetAmount), targetDate: targetDate || null });
      setName('');
      setTargetAmount('');
      setTargetDate('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Goal name</label>
        <input
          required value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Buy a car"
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Target amount</label>
        <input
          type="number" min="0" step="0.01" required value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Target date (optional)</label>
        <input
          type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <button
        type="submit" disabled={submitting}
        className="flex items-center justify-center gap-1 bg-brand hover:bg-brand-dark transition-colors text-black font-medium rounded-lg py-2 text-sm disabled:opacity-60"
      >
        <Plus size={16} /> Create goal
      </button>
    </form>
  );
}
