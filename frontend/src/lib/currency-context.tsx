'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CurrencyCode, SUPPORTED_CURRENCIES, toDisplay, toUSD as convertToUSD } from './currency';

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (usdAmount: number) => string;
  toUSD: (displayAmount: number) => number;
  toDisplay: (usdAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  useEffect(() => {
    const stored = localStorage.getItem('pocket_currency') as CurrencyCode | null;
    if (stored && SUPPORTED_CURRENCIES[stored]) setCurrencyState(stored);
  }, []);

  function setCurrency(next: CurrencyCode) {
    localStorage.setItem('pocket_currency', next);
    setCurrencyState(next);
  }

  function format(usdAmount: number): string {
    const converted = toDisplay(usdAmount, currency);
    const { locale } = SUPPORTED_CURRENCIES[currency];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(converted);
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format,
        toUSD: (v) => convertToUSD(v, currency),
        toDisplay: (v) => toDisplay(v, currency),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
