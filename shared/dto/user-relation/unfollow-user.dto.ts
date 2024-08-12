import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export const UserRelation_UnfollowUserURL = 'user-relation/unfollow';

export class UserRelation_UnfollowUserRequestDTO {
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

export class UserRelation_UnfollowUserResponseDTO {
	@IsBoolean()
	status: boolean;
}
