export function formatCategory(category: string, t?: (key: string) => string): string {
  if (t) return t(`category.${category}`);
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
