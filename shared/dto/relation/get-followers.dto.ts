import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export const Relation_GetFollowersURL = 'relation/get-followers';

export class Relation_GetFollowersRequestDTO {
	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	userId: string;
}

export class Relation_GetFollowersResponseDTO {
    @IsArray()
	followers: { userId: string }[];
}
