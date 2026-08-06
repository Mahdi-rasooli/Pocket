'use client';

import { useCurrency } from '@/lib/currency-context';
import { useI18n } from '@/lib/i18n/i18n-context';
import { formatAmountPreview } from '@/lib/amount-preview';

// Live "≈ 40K dollars" / "≈ 40 million toman" readout shown under amount inputs.
// Height is reserved unconditionally so the row doesn't reflow (shifting the input
// up/down) as the preview text appears and disappears while typing.
export default function AmountPreview({ value }: { value: string }) {
  const { currency } = useCurrency();
  const { locale, t } = useI18n();
  const preview = formatAmountPreview(Number(value), currency, locale, t);
  return <p className="text-xs text-muted-foreground h-4">{preview}</p>;
}
