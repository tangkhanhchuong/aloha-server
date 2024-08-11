import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError, map, of } from 'rxjs';

import * as en from './en.json';
import * as vi from './vi.json';

export class LanguageService {
  public getTranslation = (code: string, lang: string): string => {
    if (lang == 'vi') {
      return vi[code];
    }
    return en[code];
  };
}

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  constructor(private readonly languageService: LanguageService) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Promise<Observable<unknown>> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const headers = request.headers;
      const language = headers['lang'];
      const res: Response = context.switchToHttp().getResponse();
      return next.handle().pipe(
        map((val: object) => {
          return val;
        }),
        catchError((err: HttpException) => {
          const message = err.message;
          const translation = this.languageService.getTranslation(
            message,
            language,
          );
          res.status(err.getStatus());
          return of({
            code: err.getStatus(),
            message: translation ?? message,
          });
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
