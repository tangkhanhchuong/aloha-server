import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable, catchError, map, of } from 'rxjs';
import * as crypto from 'crypto';

export const NON_ENCRYPTION_KEY = Symbol('NON_ENCRYPTION');
export const NonEncryption = SetMetadata(NON_ENCRYPTION_KEY, true);

export const ENCRYPT_KEY = 'bf3c199c2470cb477d907b1e0917c17b';
export const ENCRYPT_IV = '5183666c72eec9e4';
export const ENCRYPT_ALGORITHM = 'aes-256-cbc';

export class CryptoService {
  public encrypt(data: object): string {
    const parsed = JSON.stringify(data);
    const cipher = crypto.createCipheriv(
      ENCRYPT_ALGORITHM,
      Buffer.from(ENCRYPT_KEY),
      Buffer.from(ENCRYPT_IV),
    );
    let encrypted = cipher.update(parsed, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  public decrypt(data: string): object {
    const decipher = crypto.createDecipheriv(
      ENCRYPT_ALGORITHM,
      Buffer.from(ENCRYPT_KEY),
      Buffer.from(ENCRYPT_IV),
    );
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}

@Injectable()
export class CryptoInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly cryptoService: CryptoService,
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Promise<Observable<unknown>> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const res: Response = context.switchToHttp().getResponse();
      const nonEncryption: string = this.reflector.get<string>(
        NON_ENCRYPTION_KEY,
        context.getHandler(),
      );
      if (!nonEncryption) {
        console.log('Non encryption');
        const { body } = request as { body: string };
        const decoded = this.cryptoService.decrypt(body);
        request.body = decoded;
      }
      return next.handle().pipe(
        map((val: object) => {
          if (nonEncryption) {
            return val;
          }
          const encoded = this.cryptoService.encrypt(val);
          return encoded;
        }),
        catchError((err: HttpException) => {
          console.log(err);
          res.status(err.getStatus());
          return of(this.cryptoService.encrypt(err));
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
