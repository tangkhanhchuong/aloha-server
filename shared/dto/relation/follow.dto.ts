import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const Relation_FollowURL = 'relation/follow';

export class Relation_FollowRequestDTO {
	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	userId: string;

	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	followeeId: string;
}

export class Relation_FollowResponseDTO {
	@IsString()
	elementId: string;

	@IsString()
	type: string;
}
