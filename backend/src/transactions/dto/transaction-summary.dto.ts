import { TransactionType } from '../transaction.entity';

export interface CategoryTotalDto {
  category: string;
  type: TransactionType;
  total: number;
}

export interface TransactionSummaryDto {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  byCategory: CategoryTotalDto[];
}
