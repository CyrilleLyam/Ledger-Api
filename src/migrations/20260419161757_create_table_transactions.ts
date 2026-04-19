import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table
      .integer("budget_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("budgets")
      .onDelete("RESTRICT");
    table.decimal("amount", 15, 2).notNullable();
    table.string("description").notNullable();
    table.string("category").notNullable();
    table.date("transaction_date").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
}
