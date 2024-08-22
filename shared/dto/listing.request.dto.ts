import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Min } from 'class-validator';

export enum Orders {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const PAGINATION_DEFAULT = {
  PAGE: 1,
  LIMIT: 10,
};

export const SORT_DEFAULT = {
  SORT_BY: 'updatedTime',
  SORT_Orders: Orders.ASC,
};

export class ListingRequestQueryDTO {
	@ApiProperty({
		default: PAGINATION_DEFAULT.LIMIT,
		minimum: 1,
	})
	@Type(() => Number)
	@Min(1)
	@IsOptional()
	limit?: number = PAGINATION_DEFAULT.LIMIT;

	@ApiPropertyOptional({
		default: '',
	})
	@IsOptional()
	@IsString()
	keyword?: string;

	@ApiPropertyOptional({
		default: PAGINATION_DEFAULT.PAGE,
		minimum: 1,
	})
	@Type(() => Number)
	@Min(1)
	page?: number = PAGINATION_DEFAULT.PAGE;

	@ApiPropertyOptional({
		default: SORT_DEFAULT.SORT_BY,
	})
	sortBy?: string = SORT_DEFAULT.SORT_BY;

	@ApiProperty({
		enum: Orders,
		default: SORT_DEFAULT.SORT_Orders,
		required: true,
	})
	@IsEnum(Orders)
	sortOrders?: Orders = SORT_DEFAULT.SORT_Orders;
}
