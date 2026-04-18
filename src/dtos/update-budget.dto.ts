import { IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";

export class UpdateBudgetDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @JSONSchema({ description: "Allocated budget amount", example: 75000 })
  amount?: number;

  @IsString()
  @Length(3, 3)
  @IsOptional()
  @JSONSchema({ description: "ISO 4217 currency code", example: "USD" })
  currency?: string;
}
