import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

import { DTO, HttpMedthod } from "../base.dto";
export class Auth_ResetPasswordRequestBodyDTO {
	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		type: String,
		default: '123456',
		required: true,
	})
	@IsString()
	verificationCode: string;

	@ApiProperty({
		type: String,
		default: 'AAaa11!!',
		required: true,
	})
	@IsString()
	newPassword: string;
}

export class Auth_ResetPasswordDTO extends DTO {
	public static url = '/auth/reset-password';
	public HttpMedthod = HttpMedthod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;
	public responseDTO: undefined;

	constructor(
		public bodyDTO: Auth_ResetPasswordRequestBodyDTO,
	) {
		super();
	}
}