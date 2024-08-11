import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export const Auth_ConfirmRegistrationURL = 'auth/registration/confirm';

export class Auth_ConfirmRegistrationRequestDTO {
	@ApiProperty({
		type: String,
		default: '000000',
		required: true,
	})
	@IsString()
	otp: string;

	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;
}
