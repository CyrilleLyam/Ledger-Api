import {
  findAllBudgets,
  findBudgetById,
  findBudgetByDepartmentAndYear,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../repositories/budgets.repository";
import type { Budget, BudgetWithDepartment, CreateBudgetDto, UpdateBudgetDto } from "../types/budget";
import type { PaginatedResult, PaginationQuery } from "../types/pagination";
import { AppError } from "../errors/app-error";

export async function getAllBudgets(query: PaginationQuery): Promise<PaginatedResult<BudgetWithDepartment>> {
  const { data, total } = await findAllBudgets(query);
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

export async function getBudgetById(id: number): Promise<BudgetWithDepartment> {
  const budget = await findBudgetById(id);
  if (!budget) throw new AppError(404, "Budget not found");
  return budget;
}

export async function createNewBudget(dto: CreateBudgetDto): Promise<Budget> {
  const duplicate = await findBudgetByDepartmentAndYear(dto.departmentId, dto.fiscalYear);
  if (duplicate) throw new AppError(409, "Budget for this department and fiscal year already exists");
  return createBudget(dto);
}

export async function updateBudgetById(id: number, dto: UpdateBudgetDto): Promise<Budget> {
  await getBudgetById(id);
  return updateBudget(id, dto);
}

export async function deleteBudgetById(id: number): Promise<void> {
  await getBudgetById(id);
  return deleteBudget(id);
}
