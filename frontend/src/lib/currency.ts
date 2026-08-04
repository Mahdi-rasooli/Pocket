export type CurrencyCode = 'USD' | 'EUR' | 'IRR' | 'JPY';

interface CurrencyMeta {
  label: string;
  locale: string;
  // Static, approximate USD conversion rate for display purposes only — not live FX data.
  rateToUSD: number;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  USD: { label: 'US Dollar', locale: 'en-US', rateToUSD: 1 },
  EUR: { label: 'Euro', locale: 'de-DE', rateToUSD: 0.92 },
  IRR: { label: 'Iranian Rial', locale: 'fa-IR', rateToUSD: 420000 },
  JPY: { label: 'Japanese Yen', locale: 'ja-JP', rateToUSD: 149 },
};

export function toDisplay(usdAmount: number, code: CurrencyCode): number {
  return usdAmount * SUPPORTED_CURRENCIES[code].rateToUSD;
}

export function toUSD(displayAmount: number, code: CurrencyCode): number {
  return displayAmount / SUPPORTED_CURRENCIES[code].rateToUSD;
}
