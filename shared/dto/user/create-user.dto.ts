import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export const User_CreateUserURL = 'user/create-user';

export class User_CreateUserRequestDTO {
	@ApiProperty({
		type: String,
		default: 'example',
		required: true,
	})
	@IsString()
	@MaxLength(25)
	username: string;

	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;
}

export class User_CreateUserResponseDTO {
	@IsString()
	id: string;
}
