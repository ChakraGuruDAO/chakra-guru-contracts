import fs from "fs";
import { resolveApp } from "./paths";

export const numberParser = (value: string) => {
  if (value === "0") return 0;
  if (!value) return undefined;
  if (value.toString().toLowerCase() === "infinity") return Infinity;
  if (value.toString().toLowerCase() === "nan") return NaN;
  return Number.parseFloat(value.toString());
};

export const boolParser = (value: string) =>
  !!value && value.toString().toLowerCase() === "true";

export const fileParser = (path: string) => {
  if (!path) return null;

  const fullPath = resolveApp(path);
  if (!fullPath) return null;
  if (!fs.existsSync(fullPath)) return null;

  return fs.readFileSync(fullPath);
};

export function arrayParser(
  separator: string | RegExp
): (value: string) => string[];
export function arrayParser<T>(
  separator: string | RegExp,
  parser: (data: string) => T
): (value: string) => T[];
export function arrayParser<T>(
  separator: string | RegExp,
  parser?: (data: string) => T
): (value: string) => string[] | T[] {
  return (value: string) => {
    if (typeof value === "undefined" || value === null) return undefined;
    if (value === "[]") return [];
    if (!value.startsWith("[") || !value.endsWith("]")) return undefined;

    value = value.substr(1, value.length - 2);
    const splitted = value.split(separator).map((m) => m.trim());
    return parser ? splitted.map(parser) : splitted;
  };
}
