export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
}

export interface BudgetMap {
  [categoryName: string]: number;
}

export interface Currency {
  code: string;
  symbol: string;
  label: string;
}