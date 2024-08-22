import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { PAGINATION_DEFAULT } from './listing.request.dto';

export class PaginatedResponseDTO<T> {
	@IsArray()
	@ApiProperty({ isArray: true })
	readonly items: T[];

	@ApiProperty({ type: Number, default: PAGINATION_DEFAULT.PAGE })
	readonly page: number;

	@ApiProperty({ type: Number, default: PAGINATION_DEFAULT.LIMIT })
	readonly limit: number;

	@ApiProperty({ type: Number, default: 0 })
	readonly pageCount: number;

	@ApiProperty({ type: Number, default: 0 })
	readonly total: number;

	constructor(data: T[], page: number, limit: number, total: number) {
		this.items = data;
		this.pageCount = data.length;
		this.page = page;
		this.limit = limit;
		this.total = total;
	}
}
