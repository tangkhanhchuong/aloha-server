import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

import { DTO, METHOD } from "../base.dto";
export class Auth_ResetPasswordRequestDTO {
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
	public method = METHOD.POST;

	public queryDTO: undefined;
	public responseDTO: undefined;

	constructor(
		public bodyDTO: Auth_ResetPasswordRequestDTO,
	) {
		super();
	}
}