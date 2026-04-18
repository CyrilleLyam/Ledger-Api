import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { getMetadataStorage } from "class-validator";
import { camelToSnake } from "./utils/case";
import { BudgetsController } from "./controllers/budgets.controller";

function convertSchemaPropsToSnake(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(convertSchemaPropsToSnake);

  if (obj && typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(record)) {
      if (key === "properties" && value && typeof value === "object") {
        const props = value as Record<string, unknown>;
        result[key] = Object.fromEntries(
          Object.entries(props).map(([prop, schema]) => [camelToSnake(prop), convertSchemaPropsToSnake(schema)]),
        );
      } else if (key === "required" && Array.isArray(value)) {
        result[key] = value.map((v) => (typeof v === "string" ? camelToSnake(v) : v));
      } else {
        result[key] = convertSchemaPropsToSnake(value);
      }
    }

    return result;
  }

  return obj;
}

export function buildSwaggerSpec(): object {
  const schemas = validationMetadatasToSchemas({
    classValidatorMetadataStorage: getMetadataStorage(),
    refPointerPrefix: "#/components/schemas/",
  });

  const spec = routingControllersToSpec(
    getMetadataArgsStorage(),
    { controllers: [BudgetsController] },
    {
      info: { title: "Ledger API", version: "1.0.0" },
      components: { schemas },
    },
  );

  return convertSchemaPropsToSnake(spec) as object;
}
