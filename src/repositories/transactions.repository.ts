import db from "../db";
import type { Transaction, TransactionWithBudget, CreateTransactionDto, UpdateTransactionDto } from "../types/transaction";
import type { PaginationQuery } from "../types/pagination";

export async function findAllTransactions({ page, limit }: PaginationQuery): Promise<{ data: TransactionWithBudget[]; total: number }> {
  const offset = (page - 1) * limit;

  const [data, [{ count }]] = await Promise.all([
    db("transactions")
      .join("budgets", "transactions.budget_id", "budgets.id")
      .join("departments", "budgets.department_id", "departments.id")
      .select(
        "transactions.*",
        "budgets.fiscal_year as fiscalYear",
        "departments.name as departmentName",
      )
      .orderBy("transactions.transaction_date", "desc")
      .limit(limit)
      .offset(offset) as Promise<TransactionWithBudget[]>,
    db("transactions").count("id as count"),
  ]);

  return { data, total: Number(count) };
}

export async function findTransactionsByBudgetId(budgetId: number, { page, limit }: PaginationQuery): Promise<{ data: TransactionWithBudget[]; total: number }> {
  const offset = (page - 1) * limit;

  const [data, [{ count }]] = await Promise.all([
    db("transactions")
      .join("budgets", "transactions.budget_id", "budgets.id")
      .join("departments", "budgets.department_id", "departments.id")
      .select(
        "transactions.*",
        "budgets.fiscal_year as fiscalYear",
        "departments.name as departmentName",
      )
      .where("transactions.budget_id", budgetId)
      .orderBy("transactions.transaction_date", "desc")
      .limit(limit)
      .offset(offset) as Promise<TransactionWithBudget[]>,
    db("transactions").where("budget_id", budgetId).count("id as count"),
  ]);

  return { data, total: Number(count) };
}

export async function findTransactionById(id: number): Promise<TransactionWithBudget | undefined> {
  return db("transactions")
    .join("budgets", "transactions.budget_id", "budgets.id")
    .join("departments", "budgets.department_id", "departments.id")
    .select(
      "transactions.*",
      "budgets.fiscal_year as fiscalYear",
      "departments.name as departmentName",
    )
    .where("transactions.id", id)
    .first() as Promise<TransactionWithBudget | undefined>;
}

export async function getTotalSpentByBudgetId(budgetId: number): Promise<number> {
  const [{ total }] = await db("transactions")
    .where("budget_id", budgetId)
    .sum("amount as total");
  return Number(total) || 0;
}

export async function createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
  const [row] = await db("transactions")
    .insert({
      budgetId: dto.budgetId,
      amount: dto.amount,
      description: dto.description,
      category: dto.category,
      transactionDate: dto.transactionDate,
    })
    .returning("*");
  return row as Transaction;
}

export async function updateTransaction(id: number, dto: UpdateTransactionDto): Promise<Transaction> {
  const updates: Record<string, unknown> = {};
  if (dto.amount !== undefined) updates.amount = dto.amount;
  if (dto.description !== undefined) updates.description = dto.description;
  if (dto.category !== undefined) updates.category = dto.category;
  if (dto.transactionDate !== undefined) updates.transactionDate = dto.transactionDate;

  const [row] = await db("transactions").where("id", id).update(updates).returning("*");
  return row as Transaction;
}

export async function deleteTransaction(id: number): Promise<void> {
  await db("transactions").where("id", id).delete();
}
