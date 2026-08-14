'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className={cn('text-muted-foreground', className)} disabled><Sun size={16} /></Button>;
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('text-muted-foreground hover:text-foreground', className)}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
