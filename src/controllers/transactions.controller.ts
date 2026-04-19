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
  getAllTransactions,
  getTransactionsByBudget,
  getTransactionById,
  createNewTransaction,
  updateTransactionById,
  deleteTransactionById,
} from "../services/transactions.service";
import { CreateTransactionDto } from "../dtos/create-transaction.dto";
import { UpdateTransactionDto } from "../dtos/update-transaction.dto";

@JsonController("/transactions")
@OpenAPI({ tags: ["Transactions"] })
export class TransactionsController {
  @Get("/")
  @OpenAPI({ summary: "List all transactions with pagination" })
  async index(@QueryParam("page") page = 1, @QueryParam("limit") limit = 10) {
    return getAllTransactions({ page, limit });
  }

  @Get("/budget/:budgetId")
  @OpenAPI({ summary: "List transactions by budget ID" })
  async byBudget(
    @Param("budgetId") budgetId: number,
    @QueryParam("page") page = 1,
    @QueryParam("limit") limit = 10,
  ) {
    return getTransactionsByBudget(budgetId, { page, limit });
  }

  @Get("/:id")
  @OpenAPI({ summary: "Get a transaction by ID" })
  async show(@Param("id") id: number) {
    return getTransactionById(id);
  }

  @Post("/")
  @HttpCode(201)
  @OpenAPI({ summary: "Create a new transaction" })
  async create(@Body({ validate: true }) body: CreateTransactionDto) {
    return createNewTransaction({
      budgetId: body.budget_id,
      amount: body.amount,
      description: body.description,
      category: body.category,
      transactionDate: body.transaction_date,
    });
  }

  @Put("/:id")
  @OpenAPI({ summary: "Update a transaction" })
  async update(
    @Param("id") id: number,
    @Body({ validate: true }) body: UpdateTransactionDto,
  ) {
    return updateTransactionById(id, {
      amount: body.amount,
      description: body.description,
      category: body.category,
      transactionDate: body.transaction_date,
    });
  }

  @Delete("/:id")
  @HttpCode(204)
  @OpenAPI({ summary: "Delete a transaction" })
  async remove(@Param("id") id: number) {
    await deleteTransactionById(id);
  }
}
