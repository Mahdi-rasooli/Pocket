'use client';

import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

// Branded full-area loading state, shown while a page's first data fetch is in
// flight (client-side pages) or while Next.js is loading a route segment
// (via loading.tsx). Kept lightweight — framer-motion only, no extra assets.
export default function PageLoader({ label }: { label?: string }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 min-h-[50vh]">
      <div className="relative flex items-center justify-center">
        <motion.span
          className="absolute h-16 w-16 rounded-2xl bg-brand/25 blur-xl"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute h-14 w-14 rounded-2xl border-2 border-brand/40 border-t-brand"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative bg-gradient-to-br from-brand to-brand-dark text-white p-3 rounded-xl shadow-glow">
          <Wallet size={22} />
        </div>
      </div>
      <motion.p
        className="text-sm text-muted-foreground"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {label ?? t('common.loading')}
      </motion.p>
    </div>
  );
}
