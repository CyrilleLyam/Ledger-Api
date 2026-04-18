import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  QueryParam,
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import {
  getAllBudgets,
  getBudgetById,
  createNewBudget,
  updateBudgetById,
  deleteBudgetById,
} from "../services/budgets.service";
import { CreateBudgetDto } from "../dtos/create-budget.dto";
import { UpdateBudgetDto } from "../dtos/update-budget.dto";

@JsonController("/budgets")
@OpenAPI({ tags: ["Budgets"] })
export class BudgetsController {
  @Get("/")
  @OpenAPI({ summary: "List all budgets with pagination" })
  async index(@QueryParam("page") page = 1, @QueryParam("limit") limit = 10) {
    return getAllBudgets({ page, limit });
  }

  @Get("/:id")
  @OpenAPI({ summary: "Get a budget by ID" })
  async show(@Param("id") id: number) {
    return getBudgetById(id);
  }

  @Post("/")
  @HttpCode(201)
  @OpenAPI({ summary: "Create a new budget" })
  async create(@Body({ validate: true }) body: CreateBudgetDto) {
    return createNewBudget({
      departmentId: body.department_id,
      fiscalYear: body.fiscal_year,
      amount: body.amount,
      currency: body.currency,
    });
  }

  @Put("/:id")
  @OpenAPI({ summary: "Update a budget" })
  async update(
    @Param("id") id: number,
    @Body({ validate: true }) body: UpdateBudgetDto,
  ) {
    return updateBudgetById(id, {
      amount: body.amount,
      currency: body.currency,
    });
  }

  @Delete("/:id")
  @HttpCode(204)
  @OpenAPI({ summary: "Delete a budget" })
  async remove(@Param("id") id: number) {
    await deleteBudgetById(id);
  }
}
