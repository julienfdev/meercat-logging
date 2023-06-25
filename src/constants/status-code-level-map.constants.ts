import { Logger } from '@nestjs/common';

export type LoggingFunction = (message: string, context?: string) => void;

export const STATUS_CODE_LEVEL_MAP: (keyof Logger)[] = [
  'log',
  'log',
  'log',
  'log',
  'warn',
  'error',
];
