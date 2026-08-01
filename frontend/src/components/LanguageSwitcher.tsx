'use client';

import { Languages } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n, LOCALE_LABELS, type Locale } from '@/lib/i18n/i18n-context';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
      <SelectTrigger className="h-8 w-auto gap-1.5 border-none bg-transparent px-2 text-muted-foreground shadow-none focus:ring-0">
        <Languages size={14} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
          <SelectItem key={l} value={l}>{LOCALE_LABELS[l]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
