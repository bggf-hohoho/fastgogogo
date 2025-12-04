export type Language = 'zh-TW' | 'en';
export type Theme = 'light' | 'dark';
export type TransactionType = 'expense' | 'income';
export type SoundStyle = 'glass' | 'digital' | 'thump' | 'clean' | 'bubble' | 'air' | 'pixel' | 'chime' | 'wood' | 'spark' | 'mute';

export enum Category {
  // Expenses
  Food = 'Food',
  Clothing = 'Clothing',
  Housing = 'Housing',
  Transportation = 'Transportation',
  Entertainment = 'Entertainment',
  Shopping = 'Shopping',
  Essentials = 'Essentials',
  Others = 'Others',
  // Income
  Salary = 'Salary',
  Investment = 'Investment',
  Gift = 'Gift',
  SideHustle = 'SideHustle'
}

export interface Transaction {
  id: string;
  item: string;
  amount: number;
  timestamp: string; // ISO string
  category: Category;
  type: TransactionType;
  deletedAt?: string | null; // For Trash Bin
  isRecurring?: boolean;
  tripId?: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: 'monthly' | 'quarterly' | 'yearly';
  nextPaymentDate: string; // ISO string
  category: Category;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ExpenseSummary {
  week_total: number;
  month_total: number;
  year_total: number;
  categories: Record<string, number>;
}

export interface AISummary {
  zh: string;
  en: string;
  timestamp: number;
}