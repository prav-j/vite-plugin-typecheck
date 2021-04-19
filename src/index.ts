import typescript, {
  Program,
  createCompilerHost,
  CompilerHost,
  ParsedCommandLine,
} from 'typescript';
import { loadConfig } from './config';
import { reportDiagnostics } from './reporter';

interface Options {
  typescript: typeof typescript
}

export default function TypeCheckPlugin({ typescript }: Options) {
  let program: Program;
  let host: CompilerHost;
  let config: ParsedCommandLine;

  return {
    name: 'vite:react:typecheck',
    buildStart(){
      if (!program || !config) {
        config = loadConfig(typescript);
        program = typescript.createProgram(config.fileNames, config.options);
        host = createCompilerHost(config.options)
      }
    },
    handleHotUpdate(context: {file: string}) {
      if (!program || !config) {
        config = loadConfig(typescript);
        program = typescript.createProgram(config.fileNames, config.options);
        host = createCompilerHost(config.options)
      }
      if (/\.(ts|tsx)$/.test(context.file)) {
        const newProgram = typescript.createProgram([context.file], config.options, host, program)
        let emitResult = newProgram.emit();
        let diagnostics = typescript
          .getPreEmitDiagnostics(program)
          .concat(emitResult.diagnostics);
        if (diagnostics) {
          reportDiagnostics(typescript, diagnostics);
        }
      }
      return null;
    },
  };
}
