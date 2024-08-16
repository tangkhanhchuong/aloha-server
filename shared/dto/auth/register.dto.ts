import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength } from "class-validator";

import { DTO, HttpMethod } from "../base.dto";

export class Auth_RegisterRequestBodyDTO {
	@ApiProperty({
		type: String,
		default: 'example',
		required: true,
	})
	@IsString()
	@MaxLength(25)
	username: string;

	@ApiProperty({
		type: String,
		default: 'example@gmail.com',
		required: true,
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		type: String,
		default: 'AAaa11!!',
		required: true,
	})
	@IsString()
	password: string;
}

export class Auth_RegisterResponseDTO {
	@ApiProperty({
		type: String,
		default: 'example',
		required: true,
	})
	@IsString()
	@MaxLength(25)
	id: string;
}

export class Auth_RegisterDTO extends DTO {
	public static url = '/auth/register';
	public method = HttpMethod.POST;

	public paramDTO: undefined;
	public queryDTO: undefined;

	constructor(
		public bodyDTO: Auth_RegisterRequestBodyDTO,
		public responseDTO: Auth_RegisterResponseDTO
	) {
		super();
	}
}