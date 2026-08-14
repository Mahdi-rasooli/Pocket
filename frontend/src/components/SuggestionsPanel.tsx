'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18n-context';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function SuggestionsPanel({ suggestions }: { suggestions: string[] }) {
  const { t } = useI18n();
  return (
    <motion.div variants={cardVariants}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-brand/15 text-brand p-1.5 rounded-lg">
              <Sparkles size={16} />
            </div>
            <p className="font-heading text-sm font-medium text-muted-foreground">{t('suggestions.title')}</p>
          </div>
          {suggestions.length > 0 ? (
            <motion.ul
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {suggestions.map((s, i) => (
                <motion.li
                  key={i}
                  variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                  className="text-sm leading-relaxed flex gap-2.5 rounded-lg bg-surface/60 border border-surface-border px-3 py-2.5"
                >
                  <Sparkles size={14} className="text-brand shrink-0 mt-0.5" />
                  <span>{s}</span>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-surface-border rounded-xl">
              {t('suggestions.empty')}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
