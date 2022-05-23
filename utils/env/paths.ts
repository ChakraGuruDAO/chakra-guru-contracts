import path from "path";
import fs from "fs";

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

const moduleFileExtensions = ["mjs", "js", "ts", "tsx", "json", "jsx", "sol"];

// Resolve file paths in the same order as webpack
export const resolveModule = (
  resolveFn: (relative: string) => string,
  filePath: string
) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );
  if (extension) return resolveFn(`${filePath}.${extension}`);
  return resolveFn(`${filePath}.js`);
};

export default {
  appDirectory,
  appPackageJson: resolveApp("package.json"),
  appNodeModules: resolveApp("node_modules"),
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  appContracts: resolveApp("contracts"),
  appArtifacts: resolveApp("artifacts"),

  moduleFileExtensions,
};
