'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import Link from 'next/link';
import { ApiError } from '@/lib/api';

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
        className="card w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-accent/15 text-accent p-2 rounded-xl">
            <Wallet size={22} />
          </div>
          <h1 className="text-xl font-semibold">Pocket</h1>
        </div>

        <h2 className="text-lg font-medium mb-1">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="text-sm text-gray-400 mb-6">
          {mode === 'login' ? 'Log in to see your finances.' : 'Start tracking your money in minutes.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 outline-none focus:border-accent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 outline-none focus:border-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 outline-none focus:border-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent-dark transition-colors text-black font-medium rounded-lg py-2 disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          {mode === 'login' ? (
            <>Don&apos;t have an account? <Link href="/register" className="text-accent hover:underline">Register</Link></>
          ) : (
            <>Already have an account? <Link href="/login" className="text-accent hover:underline">Log in</Link></>
          )}
        </p>
      </motion.div>
    </div>
  );
}
