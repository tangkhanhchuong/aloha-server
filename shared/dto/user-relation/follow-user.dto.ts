import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const UserRelation_FollowUserURL = 'user-relation/follow-user';

export class UserRelation_FollowUserRequestDTO {
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

export class UserRelation_FollowUserResponseDTO {
	@IsString()
	elementId: string;

	@IsString()
	type: string;
}
