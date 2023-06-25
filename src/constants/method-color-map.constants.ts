import * as chalk from "chalk";

export const METHOD_COLOR_MAP = [
  { method: "GET", color: chalk.blue },
  { method: "POST", color: chalk.green },
  { method: "PATCH", color: chalk.yellow },
  { method: "DELETE", color: chalk.red },
];

export const METHOD_COLOR_DEFAULT = chalk.white;
