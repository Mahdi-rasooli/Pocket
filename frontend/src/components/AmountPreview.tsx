'use client';

import { useCurrency } from '@/lib/currency-context';
import { useI18n } from '@/lib/i18n/i18n-context';
import { formatAmountPreview } from '@/lib/amount-preview';

// Live "≈ 40K dollars" / "≈ 40 million toman" readout shown under amount inputs.
export default function AmountPreview({ value }: { value: string }) {
  const { currency } = useCurrency();
  const { locale, t } = useI18n();
  const preview = formatAmountPreview(Number(value), currency, locale, t);
  if (!preview) return null;
  return <p className="text-xs text-muted-foreground">{preview}</p>;
}
