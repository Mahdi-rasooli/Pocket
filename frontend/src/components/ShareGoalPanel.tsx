'use client';

import { useState, FormEvent } from 'react';
import { Users, X } from 'lucide-react';
import type { Goal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useAuth } from '@/lib/auth-context';

interface Props {
  goal: Goal;
  onInvite: (email: string) => Promise<void>;
  onRemove: (collaboratorId: string) => Promise<void>;
}

// Collaborators see the goal and their own progress toward it (each computed from
// their own income/expense data) — not a pooled balance. Only the owner can
// invite/remove.
export default function ShareGoalPanel({ goal, onInvite, onRemove }: Props) {
  const { t } = useI18n();
  const { user } = useAuth();
  // goal.userId/collaborators are populated server-side, but can briefly be
  // absent from a stale client cache (e.g. right after creating a goal) — guard
  // against that instead of crashing.
  const isOwner = !!user && !!goal.userId && user.id === goal.userId._id;
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onInvite(email);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.genericError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <Users size={13} className="text-brand shrink-0" />
      {!isOwner && goal.userId && <span>{t('goals.sharedBy').replace('{name}', goal.userId.name)}</span>}
      {goal.collaborators?.filter(Boolean).map((c) => (
        <span
          key={c._id}
          className="inline-flex items-center gap-1.5 bg-surface border border-surface-border rounded-full pl-2.5 pr-1.5 py-1"
        >
          {c.name}
          {isOwner && (
            <button
              type="button"
              onClick={() => onRemove(c._id)}
              className="rounded-full p-0.5 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label={t('goals.removeCollaborator')}
            >
              <X size={11} />
            </button>
          )}
        </span>
      ))}
      {isOwner && (
        <form onSubmit={handleInvite} className="flex items-center gap-1.5">
          <Input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={t('goals.inviteEmailPlaceholder')}
            className="h-7 w-44 text-xs rounded-full px-3"
          />
          <Button type="submit" size="sm" variant="ghost" className="h-7 px-2.5 text-xs rounded-full text-brand hover:bg-brand/10 hover:text-brand" disabled={submitting || !email}>
            {t('goals.invite')}
          </Button>
        </form>
      )}
      {error && <span className="text-red-400">{error}</span>}
    </div>
  );
}
