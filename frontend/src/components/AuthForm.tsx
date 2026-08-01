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

interface Props {
  mode: 'login' | 'register';
  onSubmit: (email: string, password: string, name?: string) => Promise<void>;
}

export default function AuthForm({ mode, onSubmit }: Props) {
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
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
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
              <h1 className="text-xl font-semibold">Pocket</h1>
            </div>

            <h2 className="text-lg font-medium mb-1">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {mode === 'login' ? 'Log in to see your finances.' : 'Start tracking your money in minutes.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
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
                {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              {mode === 'login' ? (
                <>Don&apos;t have an account? <Link href="/register" className="text-brand hover:underline">Register</Link></>
              ) : (
                <>Already have an account? <Link href="/login" className="text-brand hover:underline">Log in</Link></>
              )}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
