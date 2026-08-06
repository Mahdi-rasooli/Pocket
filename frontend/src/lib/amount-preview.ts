import type { CurrencyCode } from './currency';
import type { Locale } from './i18n/i18n-context';

const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-US',
  fa: 'fa-IR',
  fr: 'fr-FR',
};

// Iranians count everyday money in toman, not rial (1 toman = 10 rial), even though
// "Iranian Rial" is the currency selector's unit. So when Rial is the active display
// currency, the live preview converts down to toman before formatting.
const RIAL_TO_TOMAN = 10;

/**
 * Turns a raw amount-field value into a short, human sentence like "≈ 40K dollars"
 * or "≈ ۴۰ میلیون تومان" — shown live under amount inputs as the user types.
 * `value` is already in the currently selected display currency (the same value the
 * form will hand to `useCurrency().toUSD` before submitting).
 */
export function formatAmountPreview(
  value: number,
  currency: CurrencyCode,
  locale: Locale,
  t: (key: string) => string,
): string | null {
  if (!Number.isFinite(value) || value === 0) return null;

  const isRial = currency === 'IRR';
  const magnitude = isRial ? value / RIAL_TO_TOMAN : value;
  const unit = t(isRial ? 'amount.unit.toman' : `amount.unit.${currency}`);

  const compact = new Intl.NumberFormat(INTL_LOCALES[locale], {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(magnitude);

  return `≈ ${compact} ${unit}`;
}
