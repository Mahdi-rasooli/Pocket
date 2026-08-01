'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function LocaleHtmlSync() {
  const { locale, dir } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
