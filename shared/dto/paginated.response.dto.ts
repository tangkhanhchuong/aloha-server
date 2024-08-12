import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { PAGINATION_DEFAULT } from '../constants/find-query';

export class PaginatedResponseDTO<T> {
	@IsArray()
	@ApiProperty({ isArray: true })
	readonly paginatedResults: T[];

	@ApiProperty({ type: Number, default: PAGINATION_DEFAULT.PAGE })
	readonly page: number;

	@ApiProperty({ type: Number, default: PAGINATION_DEFAULT.LIMIT })
	readonly limit: number;

	@ApiProperty({ type: Number, default: 0 })
	readonly pageCount: number;

	@ApiProperty({ type: Number, default: 0 })
	readonly total: number;

	constructor(data: T[], page: number, limit: number, total: number) {
		this.paginatedResults = data;
		this.pageCount = data.length;
		this.page = page;
		this.limit = limit;
		this.total = total;
	}
}