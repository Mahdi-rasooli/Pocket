'use client';

import { Coins } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/lib/currency-context';
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@/lib/currency';

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
      <SelectTrigger className="h-8 w-auto gap-1.5 border-none bg-transparent px-2 text-muted-foreground shadow-none focus:ring-0">
        <Coins size={14} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => (
          <SelectItem key={code} value={code}>{code}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
