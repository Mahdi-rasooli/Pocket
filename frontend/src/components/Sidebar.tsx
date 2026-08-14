'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PiggyBank, Wallet, LogOut, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CurrencySwitcher from '@/components/CurrencySwitcher';
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
    <aside className="w-full md:w-60 md:min-h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-r border-surface-border bg-surface/80 backdrop-blur-sm px-4 py-4 md:py-5 flex flex-col md:justify-between">
      <div>
        <div className="flex items-center justify-between md:block mb-4 md:mb-8 px-2">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-brand to-brand-dark text-white p-2 rounded-xl shadow-glow">
              <Wallet size={20} />
            </div>
            <span className="font-heading font-semibold text-lg tracking-tight">Pocket</span>
          </div>
          {/* Theme + logout stay reachable on mobile, where the full settings row below is easy to miss above the fold. */}
          <div className="flex items-center gap-0.5 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-400"
              onClick={logout}
              aria-label={t('nav.logout')}
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible -mx-1 px-1 md:mx-0 md:px-0">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shrink-0 ${
                  active
                    ? 'bg-brand/15 text-brand'
                    : 'text-muted-foreground hover:bg-surface-card hover:text-foreground hover:translate-x-0.5'
                }`}
              >
                {active && (
                  <span className="hidden md:block absolute inset-y-1 -left-4 w-1 rounded-full bg-brand" />
                )}
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="px-2 space-y-3 pt-3 mt-3 md:pt-4 md:mt-0 border-t border-surface-border">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <LanguageSwitcher />
          <CurrencySwitcher />
          <ThemeToggle className="hidden md:inline-flex" />
        </div>
        <p className="hidden md:block text-xs text-muted-foreground truncate">{user?.name}</p>
        <button
          onClick={logout}
          className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
