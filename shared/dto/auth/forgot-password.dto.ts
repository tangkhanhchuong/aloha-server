import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export const Auth_ForgotPasswordURL = 'auth/forgot-password/send';

export class Auth_ForgotPasswordRequestDTO {
	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;
}
