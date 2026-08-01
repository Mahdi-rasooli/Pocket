'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PiggyBank, Wallet, LogOut, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/goals', label: 'Goals', icon: PiggyBank },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-full md:w-56 md:min-h-screen border-b md:border-b-0 md:border-r border-surface-border px-4 py-5 flex md:flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-accent/15 text-accent p-2 rounded-xl">
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
                  active ? 'bg-accent/15 text-accent' : 'text-gray-400 hover:bg-surface-card hover:text-gray-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="hidden md:block px-2">
        <p className="text-xs text-gray-500 mb-2 truncate">{user?.name}</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}
