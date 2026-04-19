export interface Transaction {
  id: number;
  budgetId: number;
  amount: number;
  description: string;
  category: string;
  transactionDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionWithBudget extends Transaction {
  fiscalYear: number;
  departmentName: string;
}

export interface CreateTransactionDto {
  budgetId: number;
  amount: number;
  description: string;
  category: string;
  transactionDate: string;
}

export interface UpdateTransactionDto {
  amount?: number;
  description?: string;
  category?: string;
  transactionDate?: string;
}
