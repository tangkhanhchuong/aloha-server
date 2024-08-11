import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export const Auth_ResendRegistrationOTPURL = 'auth/registration/resend-otp';

export class Auth_ResendRegistrationOTPRequestDTO {
	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;
}
