import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ResponseCode } from '../constants/response-code';

export class TransformedResponseDTO<T> {
	@ApiProperty()
	public data: T | undefined;

	@ApiProperty({ type: 'timestamptz' })
	public timestamp: string = new Date().toISOString();

	@ApiProperty({ type: String, default: '000200' })
	public responseCode: ResponseCode = ResponseCode.SUCCESS;

	@ApiProperty({ type: String, default: 'response message' })
	public message?: string;

	@ApiProperty({ type: String, isArray: true })
	public details?: string[];

	constructor(code: ResponseCode, msg?: string, data?: T, details?: string[]) {
		this.data = data;
		this.responseCode = code;
		this.message = msg;
		this.details = details;
	}

	public static ok<T>(data: T): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCode.SUCCESS, '', data);
	}

	public static notFound<T>(msg: string): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCode.RESOURCE_NOT_FOUND, msg);
	}

	public static badRequest<T>(msg: string, details?: string[]): TransformedResponseDTO<T | undefined> {
		return new TransformedResponseDTO(ResponseCode.BAD_REQUEST, msg, undefined, details);
	}

	public static unauthorize<T>(msg: string): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCode.UNAUTHORIZED, msg);
	}

	public static forbidden<T>(msg: string): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCode.FORBIDDEN, msg);
	}

	public static conflict<T>(msg: string): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(ResponseCode.CONFLICT, msg);
	}

	public static serverError<T>(exception: HttpException): TransformedResponseDTO<T> {
		return new TransformedResponseDTO(
			ResponseCode.INTERNAL_SERVER_ERROR,
			process.env.NODE_ENV != 'production' ? JSON.stringify(exception) : '',
		);
	}
}
