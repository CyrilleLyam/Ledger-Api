import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("budgets", (table) => {
    table.increments("id").primary();
    table
      .integer("department_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("departments")
      .onDelete("RESTRICT");
    table.integer("fiscal_year").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.string("currency", 3).notNullable().defaultTo("USD");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("budgets");
}
