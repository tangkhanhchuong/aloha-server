import { IsEmail } from "class-validator";

import { DTO, HttpMethod } from "../base.dto";

export class Auth_ForgotPasswordRequestBodyDTO {
	@IsEmail()
	email: string;
}

export class Auth_ForgotPasswordDTO extends DTO {
	public static url = '/auth/forgot-password';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public responseDTO: undefined;

	constructor(
		public bodyDTO: Auth_ForgotPasswordRequestBodyDTO,
	) {
		super();
	}
}