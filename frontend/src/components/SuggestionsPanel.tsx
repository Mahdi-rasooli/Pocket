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
            <p className="text-sm text-muted-foreground">{t('suggestions.title')}</p>
          </div>
          {suggestions.length > 0 ? (
            <ul className="space-y-3">
              {suggestions.map((s, i) => (
                <li key={i} className="text-sm leading-relaxed flex gap-2">
                  <span className="text-brand">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t('suggestions.empty')}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
