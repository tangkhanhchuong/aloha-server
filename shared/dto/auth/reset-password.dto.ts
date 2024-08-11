import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export const Auth_ResetPasswordURL = 'auth/forgot-password/reset';

export class Auth_ResetPasswordRequestDTO {
	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		type: String,
		default: '123456',
		required: true,
	})
	@IsString()
	verificationCode: string;

	@ApiProperty({
		type: String,
		default: 'AAaa11!!',
		required: true,
	})
	@IsString()
	newPassword: string;
}
