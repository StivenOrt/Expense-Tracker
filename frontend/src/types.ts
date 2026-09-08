export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionPayload {
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export interface ListFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface CategoryTotal {
  category: string;
  type: TransactionType;
  total: number;
}

export interface Summary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  byCategory: CategoryTotal[];
}
