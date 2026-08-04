'use client';

import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import type { ExpenseCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from '@/components/DatePicker';
import { useI18n } from '@/lib/i18n/i18n-context';

const CATEGORIES: ExpenseCategory[] = [
  'housing', 'food', 'dining', 'transport', 'entertainment', 'shopping', 'health', 'utilities', 'other',
];

interface Props {
  onSubmit: (data: { amount: number; category: ExpenseCategory; date: string; note: string }) => Promise<void>;
}

export default function ExpenseForm({ onSubmit }: Props) {
  const { t } = useI18n();
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
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.amount')}</Label>
        <Input type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.category')}</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{t(`category.${c}`)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.date')}</Label>
        <DatePicker value={date} onChange={setDate} required />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.note')}</Label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <Button type="submit" disabled={submitting}>
        <Plus size={16} /> {t('form.add')}
      </Button>
    </form>
  );
}
