export const snakeToCamel = (str: string) =>
  str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

export const camelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

export const convertKeysToCamel = (obj: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [snakeToCamel(k), v]));

export const convertKeysToSnake = (obj: object): Record<string, unknown> =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [camelToSnake(k), v]));

export function deepConvertKeysToSnake(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(deepConvertKeysToSnake);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [camelToSnake(k), deepConvertKeysToSnake(v)]),
    );
  }
  return value;
}
