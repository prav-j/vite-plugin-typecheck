import { DiagnosticCategory } from 'typescript';

interface BaseProperties {
  code: string;
}

interface FileProperties extends BaseProperties{
  file: string;
}

interface EnrichedProperties extends FileProperties {
  line: string;
  col: string;
}

export type Message = {
  command: DiagnosticCategory;
  properties: BaseProperties | FileProperties | EnrichedProperties;
  message: string
}
