'use client';

import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import type { IncomeType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">Amount</Label>
        <Input type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">Source</Label>
        <Input required value={source} onChange={(e) => setSource(e.target.value)} />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as IncomeType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recurring">Recurring</SelectItem>
            <SelectItem value="one-time">One-time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">Start date</Label>
        <Input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">Note</Label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <Button type="submit" disabled={submitting}>
        <Plus size={16} /> Add
      </Button>
    </form>
  );
}
