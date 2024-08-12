import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export const UserRelation_GetFollowersURL = 'user-relation/get-followers';

export class UserRelation_GetFollowersRequestDTO {
	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	userId: string;
}

export class UserRelation_GetFollowersResponseDTO {
    @IsArray()
	followers: { userId: string }[];
}
