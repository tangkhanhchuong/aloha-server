import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDTO {
	@ApiProperty({
		type: Number,
		default: 1,
	})
	_id: number;

	@ApiProperty({
		type: 'timestamptz',
		default: new Date(),
	})
	createdAt: Date;

	@ApiProperty({
		type: 'timestamptz',
		default: new Date(),
	})
	updatedAt: Date;

	@ApiProperty({
		type: 'timestamptz',
		default: new Date(),
	})
	deletedAt: Date;

	@ApiProperty({
		type: String,
		default: 1,
	})
	createdBy: string;

	@ApiProperty({
		type: String,
		default: 1,
	})
	updatedBy: string;

	@ApiProperty({
		type: String,
		default: 1,
	})
	deletedBy: string;
}
