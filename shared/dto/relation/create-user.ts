import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const Relation_CreateUserURL = 'relation/create-user';

export class Relation_CreateUserRequestDTO {
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
	username: string;

	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	avatar: string;
}

export class Relation_CreateUserResponseDTO {
	@IsString()
	elementId: string;
}
