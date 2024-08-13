import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserRelation_IntializeUserRelationRequestBodyDTO {
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
	name: string;
}

export class UserRelation_IntializeUserRelationResponseDTO {
	@IsString()
	userId: string;
}