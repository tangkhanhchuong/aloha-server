import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export const Auth_LoginURL = 'auth/login';

export class Auth_LoginRequestDTO {
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


export class AuthLoginResponseDTO {
	@ApiProperty({
		default: '',
	})
	accessToken: string;

	@ApiProperty({
		default: '',
	})
	@IsEmail()
	refreshToken: string;
}
