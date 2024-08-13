import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

import { DTO, HttpMedthod } from "../base.dto";

export class Auth_ConfirmRegistrationRequestBodyDTO {
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

export class Auth_ConfirmRegistrationDTO extends DTO {
	public static url = '/auth/confirm-registration';
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public responseDTO: undefined;

	constructor(
		public bodyDTO: Auth_ConfirmRegistrationRequestBodyDTO,
	) {
		super();
	}
}