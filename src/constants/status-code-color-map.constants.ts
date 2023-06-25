import * as chalk from "chalk";

export type LoggingFunction = (message: string) => void;

export const STATUS_CODE_COLOR_MAP = [
  chalk.white,
  chalk.white,
  chalk.green,
  chalk.blueBright,
  chalk.yellow,
  chalk.red,
];
