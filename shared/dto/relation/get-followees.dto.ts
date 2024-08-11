import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export const Relation_GetFolloweesURL = 'relation/get-followees';

export class Relation_GetFolloweesRequestDTO {
	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	userId: string;
}

export class Relation_GetFolloweesResponseDTO {
    @IsArray()
	followees: { userId: string }[];
}
