import typescript, { ParsedCommandLine } from 'typescript';
import { loadConfig } from './config';
import { reportDiagnostics } from './reporter';

export default function TypeCheckPlugin() {
  let config: ParsedCommandLine;

  return {
    name: 'vite:react:typecheck',
    async transform(_: unknown, id: string) {
      if (!config) {
        config = loadConfig();
      }
      if (/\.(ts|tsx)$/.test(id)) {
        const program = typescript.createProgram([id], config.options);
        let emitResult = program.emit();
        let diagnostics = typescript
          .getPreEmitDiagnostics(program)
          .concat(emitResult.diagnostics);
        if (diagnostics) {
          reportDiagnostics(diagnostics);
        }
      }
      return null;
    },
  };
}
