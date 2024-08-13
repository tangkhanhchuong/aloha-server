import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

import { DTO, HttpMedthod } from "../base.dto";

export class Auth_ForgotPasswordRequestBodyDTO {
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
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public responseDTO: undefined;

	constructor(
		public bodyDTO: Auth_ForgotPasswordRequestBodyDTO,
	) {
		super();
	}
}