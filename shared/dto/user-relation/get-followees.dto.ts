import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export const UserRelation_GetFolloweesURL = 'user-relation/get-followees';

export class UserRelation_GetFolloweesRequestDTO {
	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	userId: string;
}

export class UserRelation_GetFolloweesResponseDTO {
    @IsArray()
	followees: { userId: string }[];
}
