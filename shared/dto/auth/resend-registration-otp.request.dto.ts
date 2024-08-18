import { IsEmail } from "class-validator";

import { DTO, HttpMethod } from "../base.dto";

export class Auth_ResendRegistrationOTPRequestBodyDTO {
	@IsEmail()
	email: string;
}

export class Auth_ResendRegistrationOtpDTO extends DTO {
	public static url = '/auth/resend-registration-otp';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public responseDTO: undefined;

	constructor(
		public bodyDTO: Auth_ResendRegistrationOTPRequestBodyDTO,
	) {
		super();
	}
}