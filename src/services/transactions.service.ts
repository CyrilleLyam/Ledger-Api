import {
  findAllTransactions,
  findTransactionsByBudgetId,
  findTransactionById,
  getTotalSpentByBudgetId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../repositories/transactions.repository";
import { findBudgetById } from "../repositories/budgets.repository";
import type { Transaction, TransactionWithBudget, CreateTransactionDto, UpdateTransactionDto } from "../types/transaction";
import type { PaginatedResult, PaginationQuery } from "../types/pagination";
import { AppError } from "../errors/app-error";

export async function getAllTransactions(query: PaginationQuery): Promise<PaginatedResult<TransactionWithBudget>> {
  const { data, total } = await findAllTransactions(query);
  return {
    data,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getTransactionsByBudget(budgetId: number, query: PaginationQuery): Promise<PaginatedResult<TransactionWithBudget>> {
  const budget = await findBudgetById(budgetId);
  if (!budget) throw new AppError(404, "Budget not found");

  const { data, total } = await findTransactionsByBudgetId(budgetId, query);
  return {
    data,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getTransactionById(id: number): Promise<TransactionWithBudget> {
  const transaction = await findTransactionById(id);
  if (!transaction) throw new AppError(404, "Transaction not found");
  return transaction;
}

export async function createNewTransaction(dto: CreateTransactionDto): Promise<Transaction> {
  const budget = await findBudgetById(dto.budgetId);
  if (!budget) throw new AppError(404, "Budget not found");

  const totalSpent = await getTotalSpentByBudgetId(dto.budgetId);
  if (totalSpent + dto.amount > budget.amount) {
    throw new AppError(422, `Transaction exceeds budget. Available: ${budget.currency} ${(budget.amount - totalSpent).toFixed(2)}`);
  }

  return createTransaction(dto);
}

export async function updateTransactionById(id: number, dto: UpdateTransactionDto): Promise<Transaction> {
  const transaction = await getTransactionById(id);

  if (dto.amount !== undefined) {
    const budget = await findBudgetById(transaction.budgetId);
    if (!budget) throw new AppError(404, "Budget not found");

    const totalSpent = await getTotalSpentByBudgetId(transaction.budgetId);
    const newTotal = totalSpent - transaction.amount + dto.amount;
    if (newTotal > budget.amount) {
      throw new AppError(422, `Transaction exceeds budget. Available: ${budget.currency} ${(budget.amount - totalSpent + transaction.amount).toFixed(2)}`);
    }
  }

  return updateTransaction(id, dto);
}

export async function deleteTransactionById(id: number): Promise<void> {
  await getTransactionById(id);
  return deleteTransaction(id);
}
