import { IsEmail, IsString } from "class-validator";

import { DTO, HttpMethod } from "../base.dto";
export class Auth_ResetPasswordRequestBodyDTO {
	@IsEmail()
	email: string;

	@IsString()
	verificationCode: string;

	@IsString()
	newPassword: string;
}

export class Auth_ResetPasswordDTO extends DTO {
	public static url = '/auth/reset-password';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public responseDTO: undefined;

	constructor(
		public bodyDTO: Auth_ResetPasswordRequestBodyDTO,
	) {
		super();
	}
}