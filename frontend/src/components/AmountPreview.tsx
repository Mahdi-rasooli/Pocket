'use client';

import { useCurrency } from '@/lib/currency-context';
import { useI18n } from '@/lib/i18n/i18n-context';
import { formatAmountPreview } from '@/lib/amount-preview';
import FieldHelper from '@/components/FieldHelper';

// Live "≈ 40K dollars" / "≈ 40 million toman" readout shown under amount inputs,
// in the same reserved slot every other field in the form leaves empty — see
// FieldHelper for why that matters.
export default function AmountPreview({ value }: { value: string }) {
  const { currency } = useCurrency();
  const { locale, t } = useI18n();
  const preview = formatAmountPreview(Number(value), currency, locale, t);
  return <FieldHelper>{preview}</FieldHelper>;
}
