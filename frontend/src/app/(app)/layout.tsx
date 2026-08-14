'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import PageLoader from '@/components/PageLoader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Show the branded loader instead of a blank screen while the auth check
  // resolves and right after register/login while redirecting to /dashboard.
  if (loading || !user) return <PageLoader />;

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-[1400px] mx-auto w-full">{children}</main>
    </div>
  );
}
