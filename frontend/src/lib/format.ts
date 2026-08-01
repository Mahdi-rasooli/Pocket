export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export const CATEGORY_COLORS: Record<string, string> = {
  housing: '#10b981',
  food: '#34d399',
  dining: '#f59e0b',
  transport: '#38bdf8',
  entertainment: '#a78bfa',
  shopping: '#f472b6',
  health: '#22d3ee',
  utilities: '#94a3b8',
  other: '#64748b',
};
