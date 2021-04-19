import typescript, { DiagnosticCategory, Diagnostic } from 'typescript';
import chalk from 'chalk';
import { Message } from './message';

const getProperties = (diagnostic: Diagnostic): Message['properties'] => {
  const file = diagnostic.file && diagnostic.file.fileName;
  if (!file) {
    return {
      code: 'TS' + diagnostic.code,
    };
  }
  const start = diagnostic.start;
  if (!start) return { file, code: 'TS' + diagnostic.code };

  const { line, character } = diagnostic.file!.getLineAndCharacterOfPosition(start);
  return {
    file,
    code: 'TS' + diagnostic.code,
    line: (line + 1) + '',
    col: character + '',
  };
};

export const toMessage = (ts: typeof typescript, diagnostic: Diagnostic): Message | undefined => {
  const properties = getProperties(diagnostic);

  return {
    command: diagnostic.category,
    properties,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
  };
};

const formatMessage = ({ command, properties, message }: Message) => {
  const output = [
    'file' in properties ? chalk.cyan(properties.file.replace(process.cwd() + '/', '')) : '',
    'line' in properties ? chalk.yellow(`:${properties.line}:${properties.col} - `) : '',
    (command === DiagnosticCategory.Error ? chalk.red('error') : chalk.yellow('warning')),
    ' ',
    'code' in properties ? chalk.dim(`${properties.code}: `) : '',
    message,
  ];
  return output.join('');
};

const nonNullable = <T>(arg: T | null | undefined): arg is T => arg !== undefined && arg !== null;

export function reportDiagnostics(ts: typeof typescript, diagnostics: Diagnostic[]) {
  diagnostics
    .filter(d => ([DiagnosticCategory.Error, DiagnosticCategory.Warning] as DiagnosticCategory[]).includes(d.category))
    .map(d => toMessage(ts, d))
    .filter(nonNullable)
    .map(formatMessage)
    .forEach(message => console.log(message));
}
