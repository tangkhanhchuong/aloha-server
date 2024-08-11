import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	InternalServerErrorException,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

import { TransformedResponseDTO } from '../dto/transformed-response.dto';

@Injectable()
export class ResponseTransformer<T> implements NestInterceptor<T, TransformedResponseDTO<T>> {
	intercept(
		context: ExecutionContext,
		next: CallHandler<T>,
	): Observable<TransformedResponseDTO<T>> | Promise<Observable<TransformedResponseDTO<T>>> {
		return next.handle().pipe(
			map((data) => {
				return TransformedResponseDTO.ok(data);
			}),
			catchError((err) =>
				throwError(() => {
					if (err instanceof HttpException) {
						throw err;
					}

					return new InternalServerErrorException({
						cause: err,
					});
				}),
			),
		);
	}
}
