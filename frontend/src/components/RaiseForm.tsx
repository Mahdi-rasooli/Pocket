'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DatePicker from '@/components/DatePicker';
import AmountPreview from '@/components/AmountPreview';
import FieldHelper from '@/components/FieldHelper';
import { todayISO } from '@/lib/date';
import { useI18n } from '@/lib/i18n/i18n-context';

interface Props {
  currentAmount: number;
  onSubmit: (data: { amount: number; effectiveDate: string; note: string }) => Promise<void>;
  onCancel: () => void;
}

export default function RaiseForm({ currentAmount, onSubmit, onCancel }: Props) {
  const { t } = useI18n();
  const [amount, setAmount] = useState(String(currentAmount));
  const [effectiveDate, setEffectiveDate] = useState(todayISO());
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
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-2 bg-surface border-l-2 border-l-brand border-y border-r border-surface-border rounded-lg p-3 mt-2 overflow-hidden"
    >
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground invisible" aria-hidden>&nbsp;</Label>
        <div className="h-9 flex items-center">
          <TrendingUp size={16} className="text-brand" />
        </div>
        <FieldHelper />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('raise.newAmount')}</Label>
        <Input
          type="number" min="0" step="0.01" required value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-28"
        />
        <AmountPreview value={amount} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('raise.effectiveDate')}</Label>
        <DatePicker value={effectiveDate} onChange={setEffectiveDate} required />
        <FieldHelper />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.note')}</Label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
        <FieldHelper />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground invisible" aria-hidden>&nbsp;</Label>
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={submitting} size="sm">
            {submitting ? t('raise.saving') : t('raise.confirm')}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="text-muted-foreground">
            {t('raise.cancel')}
          </Button>
        </div>
        <FieldHelper />
      </div>
    </motion.form>
  );
}
