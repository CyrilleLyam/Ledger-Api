import db from "../db";
import type { Budget, BudgetWithDepartment, CreateBudgetDto, UpdateBudgetDto } from "../types/budget";
import type { PaginationQuery } from "../types/pagination";

export async function findAllBudgets({ page, limit }: PaginationQuery): Promise<{ data: BudgetWithDepartment[]; total: number }> {
  const offset = (page - 1) * limit;

  const [data, [{ count }]] = await Promise.all([
    db("budgets")
      .join("departments", "budgets.department_id", "departments.id")
      .select("budgets.*", "departments.name as departmentName")
      .orderBy("budgets.fiscalYear", "desc")
      .limit(limit)
      .offset(offset) as Promise<BudgetWithDepartment[]>,
    db("budgets").count("id as count"),
  ]);

  return { data, total: Number(count) };
}

export async function findBudgetById(id: number): Promise<BudgetWithDepartment | undefined> {
  return db("budgets")
    .join("departments", "budgets.department_id", "departments.id")
    .select("budgets.*", "departments.name as departmentName")
    .where("budgets.id", id)
    .first() as Promise<BudgetWithDepartment | undefined>;
}

export async function findBudgetByDepartmentAndYear(
  departmentId: number,
  fiscalYear: number,
): Promise<Budget | undefined> {
  return db("budgets")
    .where({ departmentId, fiscalYear })
    .first() as Promise<Budget | undefined>;
}

export async function createBudget(dto: CreateBudgetDto): Promise<Budget> {
  const [row] = await db("budgets")
    .insert({
      departmentId: dto.departmentId,
      fiscalYear: dto.fiscalYear,
      amount: dto.amount,
      currency: dto.currency ?? "USD",
    })
    .returning("*");
  return row as Budget;
}

export async function updateBudget(id: number, dto: UpdateBudgetDto): Promise<Budget> {
  const [row] = await db("budgets").where("id", id).update(dto).returning("*");
  return row as Budget;
}

export async function deleteBudget(id: number): Promise<void> {
  await db("budgets").where("id", id).delete();
}
