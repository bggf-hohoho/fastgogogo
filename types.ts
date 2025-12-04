export type Language = 'zh-TW' | 'en';
export type Theme = 'light' | 'dark';
export type TransactionType = 'expense' | 'income';
export type SoundStyle = 'glass' | 'digital' | 'thump' | 'clean' | 'bubble' | 'air' | 'pixel' | 'chime' | 'wood' | 'spark' | 'mute';

export const Category = {
  Food: 'Food',
  Clothing: 'Clothing',
  Housing: 'Housing',
  Transportation: 'Transportation',
  Entertainment: 'Entertainment',
  Shopping: 'Shopping',
  Essentials: 'Essentials',
  Others: 'Others',
  Salary: 'Salary',
  Investment: 'Investment',
  Gift: 'Gift',
  SideHustle: 'SideHustle'
};

// Expose to window for other scripts
(window as any).Category = Category;

export interface Transaction {
  id: string;
  item: string;
  amount: number;
  timestamp: string; 
  category: string;
  type: TransactionType;
  deletedAt?: string | null; 
  isRecurring?: boolean;
  tripId?: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: 'monthly' | 'quarterly' | 'yearly';
  nextPaymentDate: string; 
  category: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AISummary {
  zh: string;
  en: string;
  timestamp: number;
}