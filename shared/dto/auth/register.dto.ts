import { IsEmail, IsString, MaxLength } from "class-validator";

import { DTO, HttpMethod } from "../base.dto";

export class Auth_RegisterRequestBodyDTO {
	@IsString()
	@MaxLength(25)
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;
}

export class Auth_RegisterResponseDTO {
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