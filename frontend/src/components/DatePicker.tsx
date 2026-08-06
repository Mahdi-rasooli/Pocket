'use client';

import { CalendarIcon } from 'lucide-react';
import { format as formatGregorian } from 'date-fns';
import { enUS, fr as frLocale } from 'date-fns/locale';
import {
  format as formatJalali,
  getYear as getYearJalali,
  getMonth as getMonthJalali,
  setYear as setYearJalali,
  setMonth as setMonthJalali,
  addMonths as addMonthsJalali,
  addYears as addYearsJalali,
  startOfMonth as startOfMonthJalali,
  endOfMonth as endOfMonthJalali,
  startOfYear as startOfYearJalali,
  endOfYear as endOfYearJalali,
  isSameMonth as isSameMonthJalali,
  isSameYear as isSameYearJalali,
  newDate as newDateJalali,
} from 'date-fns-jalali';
import { faIR } from 'date-fns-jalali/locale';
import { DateLib } from 'react-day-picker';
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

// react-day-picker's grid is Gregorian by default — passing it a Jalali `locale` only
// swaps month/weekday *names*, it doesn't change which days belong to which month. That
// mismatch is what made picking a date in (visually) Aban store a date that later
// formatted as Mordad: the label was Jalali, but the underlying grid math was still
// Gregorian. A custom DateLib swaps the actual calendar arithmetic to Jalali so the grid
// and the label agree. See https://daypicker.dev/docs/translation#custom-calendar-systems
const jalaliDateLib = new DateLib(
  { locale: faIR },
  {
    getYear: getYearJalali,
    getMonth: getMonthJalali,
    setYear: setYearJalali,
    setMonth: setMonthJalali,
    addMonths: addMonthsJalali,
    addYears: addYearsJalali,
    startOfMonth: startOfMonthJalali,
    endOfMonth: endOfMonthJalali,
    startOfYear: startOfYearJalali,
    endOfYear: endOfYearJalali,
    isSameMonth: isSameMonthJalali,
    isSameYear: isSameYearJalali,
    newDate: newDateJalali,
    format: formatJalali,
  },
);

export default function DatePicker({ value, onChange, required, className }: Props) {
  const { locale, dir } = useI18n();
  // Parsed at local midnight, not UTC — `new Date('yyyy-MM-dd')` parses as UTC
  // midnight, which rolls back a day in timezones ahead of UTC (e.g. Iran, UTC+3:30).
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;
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
          onSelect={(date: Date | undefined) => date && onChange(formatGregorian(date, 'yyyy-MM-dd'))}
          locale={isJalali ? faIR : (GREGORIAN_LOCALES[locale as 'en' | 'fr'] ?? enUS)}
          dateLib={isJalali ? jalaliDateLib : undefined}
          required={required}
        />
      </PopoverContent>
    </Popover>
  );
}
