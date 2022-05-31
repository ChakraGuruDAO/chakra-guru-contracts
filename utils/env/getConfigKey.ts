import fs from "fs";
import { expand } from "dotenv-expand";
import { config } from "dotenv";
import paths from "./paths";

export function getConfigKey<Config extends Record<string, any>>() {
  const dotenvFiles = <string[]>[`${paths.dotenv}.local`, paths.dotenv].filter(Boolean);

  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      expand(
        config({
          path: dotenvFile,
        })
      );
    }
  });

  return <T = string>(key: keyof Config & string, parser?: (data: string) => T) => {
    return getConfig(key, parser);
  };
}

function getConfig<Config extends Record<string, any>, T>(key: keyof Config & string): string;
function getConfig<Config extends Record<string, any>, T>(key: keyof Config & string, parser?: (data: string) => T): T;
function getConfig<Config extends Record<string, any>, T>(key: keyof Config & string, parser?: (data: string) => T) {
  const rawValue = process.env[key];
  if (typeof rawValue === "undefined" || rawValue === null) return null;
  return parser ? parser(rawValue) : rawValue;
}
