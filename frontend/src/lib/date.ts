import { format } from 'date-fns';

/**
 * Today's date as a plain local `yyyy-MM-dd` string, for date-field defaults.
 * Deliberately not `new Date().toISOString().slice(0, 10)` — toISOString() converts
 * to UTC first, which rolls back to yesterday near midnight in timezones ahead of UTC
 * (e.g. Iran, UTC+3:30).
 */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
