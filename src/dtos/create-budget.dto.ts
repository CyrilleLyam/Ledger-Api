import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Length, Min } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";

export class CreateBudgetDto {
  @IsInt()
  @IsPositive()
  @JSONSchema({ description: "Department ID", example: 1 })
  department_id!: number;

  @IsInt()
  @Min(2000)
  @JSONSchema({ description: "Fiscal year", example: 2026 })
  fiscal_year!: number;

  @IsNumber()
  @IsPositive()
  @JSONSchema({ description: "Allocated budget amount", example: 50000 })
  amount!: number;

  @IsString()
  @Length(3, 3)
  @IsOptional()
  @JSONSchema({ description: "ISO 4217 currency code", example: "USD" })
  currency?: string;
}
