import { IsDateString, IsInt, IsNumber, IsPositive, IsString, MinLength } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";

export class CreateTransactionDto {
  @IsInt()
  @IsPositive()
  @JSONSchema({ description: "Budget ID", example: 1 })
  budget_id!: number;

  @IsNumber()
  @IsPositive()
  @JSONSchema({ description: "Transaction amount", example: 1500.00 })
  amount!: number;

  @IsString()
  @MinLength(1)
  @JSONSchema({ description: "Transaction description", example: "Office supplies purchase" })
  description!: string;

  @IsString()
  @MinLength(1)
  @JSONSchema({ description: "Expense category", example: "Office Supplies" })
  category!: string;

  @IsDateString()
  @JSONSchema({ description: "Date of transaction (YYYY-MM-DD)", example: "2026-04-19" })
  transaction_date!: string;
}
