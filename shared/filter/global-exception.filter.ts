import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { TransformedResponseDTO } from '../dto/transformed-response.dto';
import { ValidatorErrorResponse } from '../interfaces/validator-error-response';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();

		let data: TransformedResponseDTO<unknown>;
		if (status === HttpStatus.BAD_REQUEST) {
			const exceptionResponse = exception.getResponse() as ValidatorErrorResponse;
			const details = exceptionResponse && exceptionResponse.message ? exceptionResponse.message : [];
			data = TransformedResponseDTO.badRequest(exception.message, details);
		} else if (status === HttpStatus.UNAUTHORIZED) {
			data = TransformedResponseDTO.unauthorize(exception.message);
		} else if (status === HttpStatus.NOT_FOUND) {
			data = TransformedResponseDTO.notFound(exception.message);
		} else if (status === HttpStatus.CONFLICT) {
			data = TransformedResponseDTO.conflict(exception.message);
		} else if (status === HttpStatus.FORBIDDEN) {
			data = TransformedResponseDTO.forbidden(exception.message);
		} else {
			data = TransformedResponseDTO.serverError(exception);
		}

		response.status(status).json(data);
	}
}
