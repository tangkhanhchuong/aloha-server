import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

import { ContextLogger } from '../logger/logger.service';

export const AUDIT_KEY = Symbol('AUDIT');
export const Audit = SetMetadata(AUDIT_KEY, true);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextLogger: ContextLogger,
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Promise<Observable<unknown>> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const isAudited: string = this.reflector.get<string>(
        AUDIT_KEY,
        context.getHandler(),
      );
      if (isAudited) {
        this.contextLogger.debug(
          `RequestBody::${JSON.stringify(request.body)}`,
        );
      }
      return next.handle().pipe(
        map((response: object) => {
          if (isAudited) {
            this.contextLogger.debug(`Response::${JSON.stringify(response)}`);
          }
          return response;
        }),
      );
    } catch (e: unknown) {
      const { message } = e as {
        message: string;
        trace: string;
      };
      throw new BadRequestException(message);
    }
  }
}
