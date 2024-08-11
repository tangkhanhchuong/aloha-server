import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export const Relation_UnfollowURL = 'relation/unfollow';

export class Relation_UnfollowRequestDTO {
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

export class Relation_UnfollowResponseDTO {
	@IsBoolean()
	status: boolean;
}
