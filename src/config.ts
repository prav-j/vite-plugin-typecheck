import * as path from 'path';
import * as fs from 'fs';
import typescript from 'typescript';

export function loadConfig(ts: typeof typescript) {
  const currentDir = process.cwd();
  const configPath = path.resolve(currentDir, 'tsconfig.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`could not find tsconfig.json at: ${currentDir}`);
  }

  const content = fs.readFileSync(configPath).toString();
  const config = ts.parseJsonConfigFileContent(
    JSON.parse(content),
    ts.sys,
    path.dirname(configPath),
  );
  Object.assign(config.options, {
    noEmit: true,
    incremental: false,
  });
  return config;
}