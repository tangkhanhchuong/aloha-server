import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ResponseCodes } from 'shared/code/response';

export class TransformedResponseDTO<T> {
	@ApiProperty()
	public data: T | undefined;

	@ApiProperty({ type: 'timestamptz' })
	public timestamp: string = new Date().toISOString();

	@ApiProperty({ type: String, default: '000200' })
	public responseCode: ResponseCodes = ResponseCodes.SUCCESS;

	@ApiProperty({ type: String, default: 'response message' })
	public message?: string;

	@ApiProperty({ type: String, isArray: true })
	public details?: string[];

	constructor(code: ResponseCodes, msg?: string, data?: T, details?: string[]) {
		this.data = data;
		this.responseCode = code;
		this.message = msg;
		this.details = details;
	}

	public static ok<T>(data: T): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCodes.SUCCESS, '', data);
	}

	public static notFound<T>(msg: string): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCodes.RESOURCE_NOT_FOUND, msg);
	}

	public static badRequest<T>(msg: string, details?: string[]): TransformedResponseDTO<T | undefined> {
		return new TransformedResponseDTO(ResponseCodes.BAD_REQUEST, msg, undefined, details);
	}

	public static unauthorize<T>(msg: string): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCodes.UNAUTHORIZED, msg);
	}

	public static forbidden<T>(msg: string): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCodes.FORBIDDEN, msg);
	}

	public static conflict<T>(msg: string): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCodes.CONFLICT, msg);
	}

	public static serverError<T>(exception: HttpException): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(
			ResponseCodes.INTERNAL_SERVER_ERROR,
			process.env.NODE_ENV != 'production' ? JSON.stringify(exception) : '',
		);
	}
}
