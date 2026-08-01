'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import en from './en.json';
import fa from './fa.json';
import fr from './fr.json';

export type Locale = 'en' | 'fa' | 'fr';

const DICTIONARIES: Record<Locale, Record<string, string>> = { en, fa, fr };

export const RTL_LOCALES: Locale[] = ['fa'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fa: 'فارسی',
  fr: 'Français',
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('pocket_locale') as Locale | null;
    if (stored && DICTIONARIES[stored]) setLocaleState(stored);
  }, []);

  function setLocale(next: Locale) {
    localStorage.setItem('pocket_locale', next);
    setLocaleState(next);
  }

  function t(key: string): string {
    return DICTIONARIES[locale][key] ?? DICTIONARIES.en[key] ?? key;
  }

  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
