'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PiggyBank, Wallet, LogOut, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useI18n();

  const links = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/transactions', label: t('nav.transactions'), icon: ArrowLeftRight },
    { href: '/goals', label: t('nav.goals'), icon: PiggyBank },
  ];

  return (
    <aside className="w-full md:w-56 md:min-h-screen border-b md:border-b-0 md:border-r border-surface-border px-4 py-5 flex md:flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-brand/15 text-brand p-2 rounded-xl">
            <Wallet size={20} />
          </div>
          <span className="font-semibold text-lg">Pocket</span>
        </div>
        <nav className="flex md:flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? 'bg-brand/15 text-brand' : 'text-muted-foreground hover:bg-surface-card hover:text-foreground'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="hidden md:block px-2 space-y-3">
        <div className="flex items-center justify-between">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <p className="text-xs text-muted-foreground truncate">{user?.name}</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
