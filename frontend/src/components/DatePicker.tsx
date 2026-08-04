'use client';

import { CalendarIcon } from 'lucide-react';
import { format as formatGregorian } from 'date-fns';
import { enUS, fr as frLocale } from 'date-fns/locale';
import { format as formatJalali } from 'date-fns-jalali';
import { faIR } from 'date-fns-jalali/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useI18n } from '@/lib/i18n/i18n-context';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const GREGORIAN_LOCALES = { en: enUS, fr: frLocale };

export default function DatePicker({ value, onChange, required, className }: Props) {
  const { locale, dir } = useI18n();
  const selected = value ? new Date(value) : undefined;
  const isJalali = locale === 'fa';

  const label = selected
    ? isJalali
      ? formatJalali(selected, 'PPP', { locale: faIR })
      : formatGregorian(selected, 'PPP', { locale: GREGORIAN_LOCALES[locale as 'en' | 'fr'] ?? enUS })
    : '';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !selected && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {label || <span>—</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          dir={dir}
          selected={selected}
          onSelect={(date: Date | undefined) => date && onChange(date.toISOString().slice(0, 10))}
          locale={isJalali ? faIR : (GREGORIAN_LOCALES[locale as 'en' | 'fr'] ?? enUS)}
          required={required}
        />
      </PopoverContent>
    </Popover>
  );
}
