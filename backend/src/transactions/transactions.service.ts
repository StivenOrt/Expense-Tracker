import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionsDto } from './dto/list-transactions.dto';
import { TransactionSummaryDto } from './dto/transaction-summary.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionType } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionsRepository.create(createTransactionDto);
    return this.transactionsRepository.save(transaction);
  }

  async findAll(filters: ListTransactionsDto): Promise<Transaction[]> {
    const query = this.transactionsRepository.createQueryBuilder('transaction');

    if (filters.category) {
      query.andWhere('transaction.category = :category', { category: filters.category });
    }
    if (filters.startDate) {
      query.andWhere('transaction.date >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      query.andWhere('transaction.date <= :endDate', { endDate: filters.endDate });
    }

    return query
      .orderBy('transaction.date', 'DESC')
      .addOrderBy('transaction.id', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id);
    Object.assign(transaction, updateTransactionDto);
    return this.transactionsRepository.save(transaction);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transactionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
  }

  async getSummary(): Promise<TransactionSummaryDto> {
    const byCategory = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('transaction.type', 'type')
      .addSelect('SUM(transaction.amount)', 'total')
      .groupBy('transaction.category')
      .addGroupBy('transaction.type')
      .getRawMany<{ category: string; type: TransactionType; total: string }>();

    // Incomes and expenses live in the same column, so totals need a CASE
    const totals = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select(
        'SUM(CASE WHEN transaction.type = :incomeType THEN transaction.amount ELSE 0 END)',
        'income',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.type = :expenseType THEN transaction.amount ELSE 0 END)',
        'expense',
      )
      .setParameters({
        incomeType: TransactionType.INCOME,
        expenseType: TransactionType.EXPENSE,
      })
      .getRawOne<{ income: string; expense: string }>();

    const totalIncome = Number(totals?.income ?? 0);
    const totalExpense = Number(totals?.expense ?? 0);

    return {
      balance: Math.round((totalIncome - totalExpense) * 100) / 100,
      totalIncome,
      totalExpense,
      byCategory: byCategory.map((row) => ({
        category: row.category,
        type: row.type,
        total: Number(row.total),
      })),
    };
  }
}
