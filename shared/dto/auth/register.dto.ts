import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength } from "class-validator";

export const Auth_RegisterURL = 'auth/register';

export class Auth_RegisterRequestDTO {
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

	@ApiProperty({
		type: String,
		default: 'AAaa11!!',
		required: true,
	})
	@IsString()
	password: string;
}

export class Auth_RegisterResponseDTO {
	@ApiProperty({
		type: String,
		default: 'example',
		required: true,
	})
	@IsString()
	@MaxLength(25)
	id: string;
}
