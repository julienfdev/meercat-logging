import {
  Inject,
  Injectable,
  Logger,
  NestMiddleware,
  Optional,
} from "@nestjs/common";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { performance } from "perf_hooks";
import { STATUS_CODE_COLOR_MAP } from "./constants/status-code-color-map.constants";
import {
  LoggingFunction,
  STATUS_CODE_LEVEL_MAP,
} from "./constants/status-code-level-map.constants";
import methodColor from "./helpers/method-color";
import redactPasswords from "./helpers/redact-passwords";

@Injectable()
export class MeercatLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger("", { timestamp: false });

  constructor(@Optional() @Inject("MEERCAT_LOGGER") logger?: Logger) {
    if (logger) this.logger = logger;
  }

  use(req: Request, res: Response, next: NextFunction) {
    const t0 = performance.now();

    res.on("finish", () => {
      redactPasswords(req.body || {});
      redactPasswords(req.query || {});

      const time = Math.round(performance.now() - t0);
      const level = STATUS_CODE_LEVEL_MAP[Math.floor(res.statusCode / 100)];
      const color = STATUS_CODE_COLOR_MAP[Math.floor(res.statusCode / 100)];
      (this.logger[level] as LoggingFunction)(
        chalk.white(
          `${color(
            `${
              req.header("x-forwarded-for") || req.header("x-real-ip") || req.ip
            } - ${res.statusCode} - ${methodColor(req.method)(req.method)} -`
          )} ${req.url.split("?")[0]} ${chalk.yellow(`+${time}ms`)}`
        ),
        "MeercatHttpLogger"
      );
      if (res.statusCode >= 400) {
        this.logger.debug?.(
          `${color(
            `${
              req.header("x-forwarded-for") || req.header("x-real-ip") || req.ip
            } - ${res.statusCode} - ${methodColor(req.method)(req.method)} - `
          )}${chalk.white(`Query : ${JSON.stringify(req.query)}`)}`,
          "MeercatHttpLogger"
        );
        if (
          req.method === "POST" ||
          req.method === "PATCH" ||
          req.method === "PUT"
        ) {
          this.logger.debug?.(
            `${color(
              `${
                req.header("x-forwarded-for") ||
                req.header("x-real-ip") ||
                req.ip
              } - ${res.statusCode} - ${methodColor(req.method)(req.method)} - `
            )}${chalk.white(`Body : ${JSON.stringify(req.body)}`)}`
          );
        }
        this.logger.debug?.(
          `${color(
            `${
              req.header("x-forwarded-for") || req.header("x-real-ip") || req.ip
            } - ${res.statusCode} - ${methodColor(req.method)(req.method)} - `
          )}${chalk.white(`User-Agent : "${req.header("user-agent")}"`)}`
        );
      }
    });
    next();
  }
}
