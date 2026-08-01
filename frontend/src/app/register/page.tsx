'use client';

import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const { register } = useAuth();
  return (
    <AuthForm
      mode="register"
      onSubmit={(email, password, name) => register(email, password, name || '')}
    />
  );
}
