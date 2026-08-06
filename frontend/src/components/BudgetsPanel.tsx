'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Wallet2, X, Plus } from 'lucide-react';
import type { Budget, CategoryBreakdownItem, ExpenseCategory } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCategory } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useCurrency } from '@/lib/currency-context';

const ALL_CATEGORIES: ExpenseCategory[] = [
  'housing', 'food', 'dining', 'transport', 'entertainment', 'shopping', 'health', 'utilities', 'other',
];

const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

interface Props {
  budgets: Budget[];
  spend: CategoryBreakdownItem[];
  onSave: (category: ExpenseCategory, monthlyLimit: number) => Promise<void>;
  onRemove: (category: ExpenseCategory) => Promise<void>;
}

export default function BudgetsPanel({ budgets, spend, onSave, onRemove }: Props) {
  const { t } = useI18n();
  const { format, toUSD } = useCurrency();
  const spendByCategory = new Map(spend.map((s) => [s.category, s.total]));
  const budgetedCategories = new Set(budgets.map((b) => b.category));
  const availableCategories = ALL_CATEGORIES.filter((c) => !budgetedCategories.has(c));

  const [newCategory, setNewCategory] = useState<ExpenseCategory | ''>('');
  const [newLimit, setNewLimit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!newCategory || !newLimit) return;
    setSubmitting(true);
    try {
      await onSave(newCategory, toUSD(Number(newLimit)));
      setNewCategory('');
      setNewLimit('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div variants={cardVariants}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-brand/15 text-brand p-1.5 rounded-lg"><Wallet2 size={16} /></div>
            <p className="font-medium">{t('budgets.title')}</p>
          </div>

          {budgets.length === 0 && (
            <p className="text-sm text-muted-foreground mb-4">{t('budgets.noBudgets')}</p>
          )}

          <div className="space-y-4 mb-4">
            {budgets.map((budget) => {
              const spent = spendByCategory.get(budget.category) || 0;
              const pct = budget.monthlyLimit > 0 ? Math.min((spent / budget.monthlyLimit) * 100, 100) : 0;
              const over = spent > budget.monthlyLimit;
              const barColor = over ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-brand';

              return (
                <div key={budget.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm">{formatCategory(budget.category, t)}</p>
                    <div className="flex items-center gap-2">
                      <p className={cn('text-xs', over ? 'text-red-400' : 'text-muted-foreground')}>
                        {format(spent)} / {format(budget.monthlyLimit)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-auto w-auto p-0 text-muted-foreground hover:text-red-400 hover:bg-transparent"
                        onClick={() => onRemove(budget.category)}
                      >
                        <X size={13} />
                      </Button>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-surface-border overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', barColor)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {availableCategories.length > 0 && (
            <form onSubmit={handleAdd} className="flex items-end gap-2 pt-2 border-t border-surface-border">
              <div className="flex-1 space-y-1.5">
                <Select value={newCategory} onValueChange={(v) => setNewCategory(v as ExpenseCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('budgets.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((c) => <SelectItem key={c} value={c}>{formatCategory(c, t)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-28 space-y-1.5">
                <Input
                  type="number" min="0" step="0.01" placeholder={t('budgets.limit')}
                  value={newLimit} onChange={(e) => setNewLimit(e.target.value)}
                />
              </div>
              <Button type="submit" size="icon" disabled={submitting || !newCategory || !newLimit}>
                <Plus size={16} />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
