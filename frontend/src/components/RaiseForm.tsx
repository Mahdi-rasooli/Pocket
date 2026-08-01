'use client';

import { useState, FormEvent } from 'react';
import { TrendingUp } from 'lucide-react';

interface Props {
  currentAmount: number;
  onSubmit: (data: { amount: number; effectiveDate: string; note: string }) => Promise<void>;
  onCancel: () => void;
}

export default function RaiseForm({ currentAmount, onSubmit, onCancel }: Props) {
  const [amount, setAmount] = useState(String(currentAmount));
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ amount: Number(amount), effectiveDate, note });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2 bg-surface border border-surface-border rounded-lg p-3 mt-2">
      <TrendingUp size={16} className="text-accent mb-2" />
      <div>
        <label className="block text-xs text-gray-400 mb-1">New amount</label>
        <input
          type="number" min="0" step="0.01" required value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-28 bg-surface-card border border-surface-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Effective date</label>
        <input
          type="date" required value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)}
          className="bg-surface-card border border-surface-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Note</label>
        <input
          value={note} onChange={(e) => setNote(e.target.value)}
          className="bg-surface-card border border-surface-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <button type="submit" disabled={submitting} className="bg-accent hover:bg-accent-dark transition-colors text-black font-medium rounded-lg px-3 py-1.5 text-sm disabled:opacity-60">
        {submitting ? 'Saving…' : 'Confirm raise'}
      </button>
      <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-200 text-sm px-2 py-1.5">
        Cancel
      </button>
    </form>
  );
}
