'use client';

import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import type { IncomeType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from '@/components/DatePicker';
import AmountPreview from '@/components/AmountPreview';
import FieldHelper from '@/components/FieldHelper';
import { todayISO } from '@/lib/date';
import { useI18n } from '@/lib/i18n/i18n-context';

interface Props {
  onSubmit: (data: { amount: number; source: string; type: IncomeType; startDate: string; note: string }) => Promise<void>;
}

export default function IncomeForm({ onSubmit }: Props) {
  const { t } = useI18n();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [type, setType] = useState<IncomeType>('recurring');
  const [startDate, setStartDate] = useState(todayISO());
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
        <Label className="text-xs text-muted-foreground">{t('form.amount')}</Label>
        <Input type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
        <AmountPreview value={amount} />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.source')}</Label>
        <Input required value={source} onChange={(e) => setSource(e.target.value)} />
        <FieldHelper />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.type')}</Label>
        <Select value={type} onValueChange={(v) => setType(v as IncomeType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recurring">{t('form.recurring')}</SelectItem>
            <SelectItem value="one-time">{t('form.oneTime')}</SelectItem>
          </SelectContent>
        </Select>
        <FieldHelper />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.startDate')}</Label>
        <DatePicker value={startDate} onChange={setStartDate} required />
        <FieldHelper />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('form.note')}</Label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
        <FieldHelper />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs text-muted-foreground invisible" aria-hidden>&nbsp;</Label>
        <Button type="submit" disabled={submitting}>
          <Plus size={16} /> {t('form.add')}
        </Button>
        <FieldHelper />
      </div>
    </form>
  );
}
