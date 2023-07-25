import {
  Inject,
  Injectable,
  Logger,
  NestMiddleware,
  Optional,
} from "@nestjs/common";
import * as chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { performance } from "perf_hooks";
import { STATUS_CODE_COLOR_MAP } from "./constants/status-code-color-map.constants";
import {
  LoggingFunction,
  STATUS_CODE_LEVEL_MAP,
} from "./constants/status-code-level-map.constants";
import methodColor from "./helpers/method-color";
import redactPasswords from "./helpers/redact-passwords";

export const MEERCAT_LOGGER = "MEERCAT_LOGGER";
export const MEERCAT_OPTIONS = "MEERCAT_OPTIONS";

export type MeercatOptions = {
  name?: string;
  logErrorDetails?: boolean;
  blacklisted?: string[];
};

@Injectable()
export class MeercatLoggingMiddleware implements NestMiddleware {
  private readonly logger: Logger;
  private readonly logErrorDetails: boolean = false;
  private readonly blacklist: string[];

  constructor(
    @Optional() @Inject(MEERCAT_LOGGER) logger?: Logger,
    @Optional() @Inject(MEERCAT_OPTIONS) options?: MeercatOptions
  ) {
    if (logger) this.logger = logger;
    else {
      this.logger = new Logger(options?.name || this.constructor.name, {
        timestamp: false,
      });
    }
    this.logErrorDetails =
      options?.logErrorDetails !== undefined ? options.logErrorDetails : true;
    this.blacklist = options?.blacklisted || [];
  }

  use(req: Request, res: Response, next: NextFunction) {
    const t0 = performance.now();
    const blacklisted = this.blacklist.some((blacklist) =>
      req.originalUrl.includes(blacklist)
    );

    if (!blacklisted) {
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
                req.header("x-forwarded-for") ||
                req.header("x-real-ip") ||
                req.ip
              } - ${res.statusCode} - ${methodColor(req.method)(req.method)} -`
            )} ${req.url.split("?")[0]} ${chalk.yellow(`+${time}ms`)}`
          )
        );
        if (res.statusCode >= 400 && this.logErrorDetails) {
          this.logger.debug?.(
            `${color(
              `${
                req.header("x-forwarded-for") ||
                req.header("x-real-ip") ||
                req.ip
              } - ${res.statusCode} - ${methodColor(req.method)(req.method)} - `
            )}${chalk.white(`Query : ${JSON.stringify(req.query)}`)}`
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
                } - ${res.statusCode} - ${methodColor(req.method)(
                  req.method
                )} - `
              )}${chalk.white(`Body : ${JSON.stringify(req.body)}`)}`
            );
          }
          this.logger.debug?.(
            `${color(
              `${
                req.header("x-forwarded-for") ||
                req.header("x-real-ip") ||
                req.ip
              } - ${res.statusCode} - ${methodColor(req.method)(req.method)} - `
            )}${chalk.white(`User-Agent : "${req.header("user-agent")}"`)}`
          );
        }
      });
    }
    next();
  }
}
