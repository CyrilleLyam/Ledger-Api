export interface Budget {
  id: number;
  departmentId: number;
  fiscalYear: number;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetWithDepartment extends Budget {
  departmentName: string;
}

export interface CreateBudgetDto {
  departmentId: number;
  fiscalYear: number;
  amount: number;
  currency?: string;
}

export interface UpdateBudgetDto {
  amount?: number;
  currency?: string;
}
