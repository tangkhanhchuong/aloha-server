import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export const Auth_AutoLoginURL = 'auth/auto-login';

export class Auth_AutoAuthLoginRequestDTO {
	@ApiProperty({
		type: String,
		default: '',
		required: true,
	})
	@IsString()
	refreshToken: string;
}


export class Auth_AutoLoginResponseDTO {
	@ApiProperty({
		default: '',
	})
	accessToken: string;
}
