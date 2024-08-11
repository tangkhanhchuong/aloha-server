import { Injectable } from '@nestjs/common';
import pino, { Logger } from 'pino';

export class ContextLogger {
  private logger: Logger;

  constructor(
    private loggerService: LoggerService,
    private _context: string,
  ) {
    this.logger = pino({
      timestamp: () => `,"time":${Date.now()}`,
      level: 'debug',
    });
  }

  log(
    message: string,
    context?: string,
    parentContext?: string,
    correlationId?: string,
  ): void {
    this.logger.info({ context, parentContext, correlationId }, message);
  }

  error(
    message: string,
    trace: string,
    context?: string,
    parentContext?: string,
    correlationId?: string,
  ): void {
    this.logger.error(
      { context, parentContext, correlationId },
      `${message}\n${trace}`,
    );
  }

  warn(
    message: string,
    context?: string,
    parentContext?: string,
    correlationId?: string,
  ): void {
    this.logger.warn({ context, parentContext, correlationId }, message);
  }

  debug(
    message: string,
    context?: string,
    parentContext?: string,
    correlationId?: string,
  ): void {
    this.logger.debug({ context, parentContext, correlationId }, message);
  }

  verbose(
    message: string,
    context?: string,
    parentContext?: string,
    correlationId?: string,
  ): void {
    this.logger.trace({ context, parentContext, correlationId }, message);
  }
}

@Injectable()
export class LoggerService {
  public logger: ContextLogger;

  public newContextLogger(context: string): ContextLogger {
    return new ContextLogger(this, context);
  }
}
