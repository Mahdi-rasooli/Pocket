'use client';

import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DatePicker from '@/components/DatePicker';
import { useI18n } from '@/lib/i18n/i18n-context';

interface Props {
  onSubmit: (data: { name: string; targetAmount: number; targetDate: string | null }) => Promise<void>;
}

export default function GoalForm({ onSubmit }: Props) {
  const { t } = useI18n();
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
      <div className="col-span-2 sm:col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('goals.goalName')}</Label>
        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t('goals.goalNamePlaceholder')} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('goals.targetAmount')}</Label>
        <Input
          type="number" min="0" step="0.01" required value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('goals.targetDateOptional')}</Label>
        <DatePicker value={targetDate} onChange={setTargetDate} />
      </div>
      <Button type="submit" disabled={submitting}>
        <Plus size={16} /> {t('goals.createGoal')}
      </Button>
    </form>
  );
}
