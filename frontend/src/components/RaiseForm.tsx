'use client';

import { useState, FormEvent } from 'react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/lib/i18n/i18n-context';

interface Props {
  currentAmount: number;
  onSubmit: (data: { amount: number; effectiveDate: string; note: string }) => Promise<void>;
  onCancel: () => void;
}

export default function RaiseForm({ currentAmount, onSubmit, onCancel }: Props) {
  const { t } = useI18n();
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
      <TrendingUp size={16} className="text-brand mb-2" />
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('raise.newAmount')}</Label>
        <Input
          type="number" min="0" step="0.01" required value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-28"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('raise.effectiveDate')}</Label>
        <Input type="date" required value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.note')}</Label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <Button type="submit" disabled={submitting} size="sm">
        {submitting ? t('raise.saving') : t('raise.confirm')}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="text-muted-foreground">
        {t('raise.cancel')}
      </Button>
    </form>
  );
}
