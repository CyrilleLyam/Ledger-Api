import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";

export class UpdateTransactionDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @JSONSchema({ description: "Transaction amount", example: 2000.00 })
  amount?: number;

  @IsString()
  @MinLength(1)
  @IsOptional()
  @JSONSchema({ description: "Transaction description", example: "Updated office supplies" })
  description?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  @JSONSchema({ description: "Expense category", example: "Equipment" })
  category?: string;

  @IsDateString()
  @IsOptional()
  @JSONSchema({ description: "Date of transaction (YYYY-MM-DD)", example: "2026-04-20" })
  transaction_date?: string;
}
