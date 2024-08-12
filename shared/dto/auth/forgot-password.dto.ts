import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

import { DTO, METHOD } from "../base.dto";

export class Auth_ForgotPasswordRequestDTO {
	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;
}

export class Auth_ForgotPasswordDTO extends DTO {
	public static url = '/auth/forgot-password';
	public method = METHOD.POST;

	public queryDTO: undefined;
	public responseDTO: undefined;

	constructor(
		public bodyDTO: Auth_ForgotPasswordRequestDTO,
	) {
		super();
	}
}