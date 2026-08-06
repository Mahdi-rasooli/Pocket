export interface User {
  id: string;
  email: string;
  name: string;
}

export type RecurrenceType = 'recurring' | 'one-time';
export type IncomeType = RecurrenceType;

export interface IncomeEntry {
  _id: string;
  amount: number;
  source: string;
  type: IncomeType;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  note: string;
}

export type ExpenseCategory =
  | 'housing' | 'food' | 'dining' | 'transport' | 'entertainment'
  | 'shopping' | 'health' | 'utilities' | 'other';

export interface ExpenseEntry {
  _id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  type: RecurrenceType;
  endDate: string | null;
  isActive: boolean;
  note: string;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

export interface CategoryBreakdownItem {
  category: string;
  total: number;
}

export interface Budget {
  _id: string;
  category: ExpenseCategory;
  monthlyLimit: number;
}

export interface GoalCollaborator {
  _id: string;
  name: string;
  email: string;
}

export interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  targetDate: string | null;
  userId: GoalCollaborator;
  collaborators: GoalCollaborator[];
}

export interface ProjectionPoint {
  monthlySavingsRate: number;
  monthsRemaining: number | null;
  etaDate: string | null;
}

export interface GoalProjections {
  goal: Goal;
  currentSaved: number;
  averageRate: ProjectionPoint & { label: string };
  weightedTrend: ProjectionPoint & { label: string };
  bestWorstCase: {
    label: string;
    monthlySavingsStdDev: number;
    optimistic: ProjectionPoint;
    pessimistic: ProjectionPoint;
  };
  categoryCuts: Array<{
    category: string;
    avgMonthlySpend: number;
    cutPercent: number;
    monthlySavingsIncrease: number;
    newMonthsRemaining: number;
    monthsSaved: number | null;
  }>;
  suggestions: string[];
}
