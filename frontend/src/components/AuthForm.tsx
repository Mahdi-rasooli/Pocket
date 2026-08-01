'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import Link from 'next/link';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18n-context';

interface Props {
  mode: 'login' | 'register';
  onSubmit: (email: string, password: string, name?: string) => Promise<void>;
}

export default function AuthForm({ mode, onSubmit }: Props) {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(email, password, mode === 'register' ? name : undefined);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('auth.genericError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-brand/15 text-brand p-2 rounded-xl">
                <Wallet size={22} />
              </div>
              <h1 className="text-xl font-semibold">{t('auth.appName')}</h1>
            </div>

            <h2 className="text-lg font-medium mb-1">{mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {mode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? t('auth.pleaseWait') : mode === 'login' ? t('auth.login') : t('auth.register')}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              {mode === 'login' ? (
                <>{t('auth.noAccount')} <Link href="/register" className="text-brand hover:underline">{t('auth.register')}</Link></>
              ) : (
                <>{t('auth.haveAccount')} <Link href="/login" className="text-brand hover:underline">{t('auth.login')}</Link></>
              )}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
